// Prototipo REVERSE-inspirado: verificación objetiva + re-muestreo focalizado.
//
// REVERSE (Wu et al., NeurIPS 2025) hace "retrospective resampling" a nivel
// decoder: el VLM emite tokens de confianza y el sistema rebobina el KV-cache
// cuando marca baja confianza. Eso requiere fine-tuning con 1.3M muestras +
// acceso al decoder — imposible con APIs de terceros (Fireworks/Pollinations/
// Gemini son cajas negras).
//
// Portamos el PRINCIPIO a nivel aplicación con un giro que lo hace más
// robusto que el original: en vez de depender de la confianza AUTO-REPORTADA
// del modelo (que falla cuando "no ve bien" y jura con confianza), usamos
// mediciones OBJETIVAS del código como verificador — measureImage ya nos da
// paleta, contraste, saturación reales de los píxeles.
//
// Flujo:
//   1. Extracción normal (analyzeImageStyle) → sections + elements + metrics.
//   2. verifyAgainstMeasurements(sections, elements, metrics) → array de
//      objections {sectionName, issue, hint} — puro, sin LLM.
//   3. resampleLowConfidence(...) → una llamada mini por sección objectada,
//      con la imagen delante y pregunta binaria estrecha. Reemplaza el campo.
//
// Costo: N campos dudosos (típicamente 1-2), no 10 secciones enteras como
// critiqueStyleDNA. Verificador objetivo, inmune a sobreconfianza del VLM.

import { callLLM, pickDirectModel } from './llm.js'

// ── Verificador objetivo: chequeos puros sobre las mediciones ──

// Familias de matiz que buscamos si aparecen en la prosa del prompt. El rango
// de hue está en grados (0-360, rueda estándar HSL/HSV). Un hex "cuenta" para
// una familia si (a) tiene saturación mínima real (evita grises que en RGB
// puro dan hue ruidoso) y (b) su hue cae en el rango.
const HUE_FAMILIES = [
  { words: ['red', 'crimson', 'scarlet', 'ruby'], range: [[345, 360], [0, 15]] },
  { words: ['orange', 'amber', 'coral'], range: [[15, 45]] },
  { words: ['yellow', 'gold', 'ochre'], range: [[45, 70]] },
  { words: ['green', 'olive', 'sage', 'lime', 'emerald'], range: [[70, 165]] },
  { words: ['cyan', 'teal', 'turquoise'], range: [[165, 195]] },
  { words: ['blue', 'azure', 'cobalt', 'navy'], range: [[195, 255]] },
  { words: ['purple', 'violet', 'lilac', 'lavender', 'mauve'], range: [[255, 315]] },
  { words: ['pink', 'magenta', 'rose', 'fuchsia'], range: [[315, 345]] },
]

const hexToRgb = (hex) => {
  const s = hex.replace('#', '')
  return [parseInt(s.slice(0, 2), 16), parseInt(s.slice(2, 4), 16), parseInt(s.slice(4, 6), 16)]
}

const hueOfHex = (hex) => {
  const [r, g, b] = hexToRgb(hex).map((v) => v / 255)
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn
  if (d < 0.05) return null // casi acromático — hue ruidoso, ignorar
  let h
  if (mx === r) h = ((g - b) / d) % 6
  else if (mx === g) h = (b - r) / d + 2
  else h = (r - g) / d + 4
  h *= 60
  return h < 0 ? h + 360 : h
}

const hueInRange = (h, ranges) => ranges.some(([lo, hi]) => h >= lo && h <= hi)

const hexesInFamily = (hexes, family) => {
  const hues = hexes.map(hueOfHex).filter((h) => h !== null)
  return hues.filter((h) => hueInRange(h, family.range)).length
}

// Un prompt puede decir "muted green" (matiz explícito) O usar familias
// oblicuas ("periwinkle" implica azul-violeta). Buscamos con word-boundary
// para no confundir "green" con "greenhouse" ni "rose" con "prose".
const familiesMentioned = (text) => {
  const t = text.toLowerCase()
  return HUE_FAMILIES.filter((fam) =>
    fam.words.some((w) => new RegExp(`\\b${w}\\b`, 'i').test(t))
  )
}

// Chequeo 1 — # Color: cada familia de matiz que el prompt nombra debe tener
// AL MENOS un hex medido dentro de su rango. Falla si el prompt inventa un
// color que no está en la imagen (bug real: prompt "green" con paleta toda
// gris/lavanda).
export function objectionsForColor(section, metrics) {
  if (!section || !metrics) return []
  const allHexes = [
    ...(metrics.palette || []).map((c) => c.hex),
    ...(metrics.accents || []).map((c) => c.hex),
  ]
  const mentioned = familiesMentioned(section.text || section)
  const objections = []
  for (const fam of mentioned) {
    if (hexesInFamily(allHexes, fam) === 0) {
      objections.push({
        section: 'Color',
        issue: `# Color names "${fam.words[0]}" but no measured hex is in that hue range`,
        hint: `The measured palette is ${allHexes.slice(0, 6).join(', ')}. Remove the ${fam.words[0]} claim OR replace with a color family that actually matches one of these hexes.`,
      })
    }
  }
  return objections
}

// Chequeo 2 — # Style: si menciona "heavy grain / dense noise / coarse
// texture" pero la saturación medida es muy baja (≤2) Y el contraste no es
// alto (≤6) la imagen es probablemente suave/pintada, no granulada. Proxy
// imperfecto (saturación NO mide grano directo) pero atrapa el caso real:
// prompt "heavy uniform grain" sobre una foto limpia de un pajarito.
// Permitimos hasta 3 palabras intercaladas — el bug real dice "heavy uniform
// fine grain overlay", con "uniform fine" entre el cuantificador y el sustantivo.
const HEAVY_GRAIN_WORDS = /\b(heavy|dense|coarse|thick|strong)\s+(?:\w+\s+){0,3}(grain|noise|texture)\b/i
export function objectionsForGrain(styleSection, metrics) {
  if (!styleSection || !metrics) return []
  const text = styleSection.text || styleSection
  if (!HEAVY_GRAIN_WORDS.test(text)) return []
  if (metrics.saturation10 <= 2 && metrics.contrast10 <= 6) {
    return [{
      section: 'Style',
      issue: `# Style claims "heavy grain" but the image measures very low saturation (${metrics.saturation10}/10) and moderate contrast (${metrics.contrast10}/10) — profile of a soft/painted image, not a grainy one`,
      hint: 'Look again at the actual pixel texture. If grain is barely visible, downgrade to "light/subtle grain" or omit. Only keep "heavy" if you see coarse noise competing with the forms.',
    }]
  }
  return []
}

// Chequeo 3 — Elements: si un bbox extraído tiene paleta local casi idéntica
// al color dominante del fondo (medida via paletteForRegion), probablemente
// es "atmósfera" (halo, gradiente) confundida con "objeto discreto".
// Requiere image + paletteForRegion, así que es async y opcional.
export async function objectionsForElements(elements, metrics, image, paletteForRegionFn) {
  if (!elements?.length || !metrics || !image || !paletteForRegionFn) return []
  const dominantHex = metrics.palette?.[0]?.hex
  if (!dominantHex) return []
  const dominantRgb = hexToRgb(dominantHex)
  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])
  const objections = []
  for (const el of elements) {
    // Elements viene con bbox [ymin,xmin,ymax,xmax] en 0-1000 (grilla Ideogram)
    const [ymin, xmin, ymax, xmax] = el.bbox
    const box = { x: xmin / 1000, y: ymin / 1000, w: (xmax - xmin) / 1000, h: (ymax - ymin) / 1000 }
    const localPalette = await paletteForRegionFn(image.dataUrl || image, box, 3)
    if (!localPalette.length) continue
    const localRgb = hexToRgb(localPalette[0])
    if (dist(dominantRgb, localRgb) < 25) {
      objections.push({
        section: 'Elements',
        target: el.desc,
        issue: `Element "${el.desc}" bbox has a local palette (${localPalette[0]}) nearly identical to the dominant background (${dominantHex}) — likely atmosphere/gradient, not a discrete object`,
        hint: 'If this region is really a distinct object, describe what makes it distinct from the background. Otherwise, this element should not exist.',
      })
    }
  }
  return objections
}

// Compone los 3 chequeos en un pass único.
export async function verifyAgainstMeasurements({ sections, elements, metrics, image, paletteForRegionFn }) {
  if (!metrics) return []
  const bySection = Object.fromEntries(sections.map((s) => [s.name, s]))
  const objections = [
    ...objectionsForColor(bySection.Color, metrics),
    ...objectionsForGrain(bySection.Style, metrics),
    ...(await objectionsForElements(elements, metrics, image, paletteForRegionFn)),
  ]
  return objections
}

// ── Re-muestreo focalizado: una llamada mini por sección con objection ──

const RESAMPLE_SYSTEM = `You are a visual verifier. You receive ONE reference image and a SINGLE targeted question about a section of a prompt that failed an objective check. Look at the image again with fresh eyes and answer in the exact structure requested — no preamble, no commentary. Your reply must be short and anchored to what you actually see in the pixels.`

// Reemplaza el texto de UNA sección tras re-mirar la imagen. La pregunta se
// arma con la objection concreta y el hint sobre qué corregir. Devuelve el
// texto nuevo o null si el modelo no supo mejorar (mantener el original).
async function resampleSection({ settings, image, section, objection, keepAnchor }) {
  const user = `SECTION TO RE-VERIFY: # ${objection.section}

Current text: "${section.text}"

OBJECTIVE OBJECTION: ${objection.issue}

HOW TO FIX: ${objection.hint}

Look at the image again ONLY for this specific issue. Reply with:
CORRECTED: <the corrected # ${objection.section} text, 1-2 sentences max, English, anchored to what you actually see>

If the objection is wrong and the original was right, reply exactly:
KEEP_ORIGINAL

${keepAnchor ? `\n(Keep the overall structure of the original — you are correcting a specific issue, not rewriting from scratch.)` : ''}`
  const raw = await callLLM(settings, {
    system: RESAMPLE_SYSTEM,
    user,
    images: image ? [image] : [],
    maxTokens: 400,
  })
  const t = raw.trim()
  if (/^KEEP_ORIGINAL\b/i.test(t)) return null
  const m = t.match(/CORRECTED:\s*([\s\S]+?)(?:\n\s*$|$)/i)
  return (m ? m[1] : t).trim() || null
}

// Aplica el re-muestreo a las secciones que tienen objection y devuelve un
// nuevo array de sections con los textos actualizados. Los Elements se
// tratan aparte (potencialmente se descartan, no se reescriben).
export async function resampleLowConfidence({ rawSettings, image, sections, elements, objections }) {
  if (!objections.length) return { sections, elements, resampled: [] }
  const settings = pickDirectModel(rawSettings, { needsVision: true }).settings
  const bySection = Object.fromEntries(sections.map((s) => [s.name, s]))
  const resampled = []

  // Agrupamos objections por sección — una sola llamada aunque tenga varias.
  const bySectionName = objections.reduce((acc, o) => {
    if (o.section === 'Elements') return acc // se maneja aparte
    ;(acc[o.section] = acc[o.section] || []).push(o)
    return acc
  }, {})

  for (const [name, objs] of Object.entries(bySectionName)) {
    const section = bySection[name]
    if (!section) continue
    const merged = objs.length === 1 ? objs[0] : {
      section: name,
      issue: objs.map((o) => o.issue).join(' AND '),
      hint: objs.map((o) => o.hint).join(' '),
    }
    const newText = await resampleSection({ settings, image, section, objection: merged, keepAnchor: true })
    if (newText) {
      section.text = newText
      resampled.push({ section: name, before: bySection[name]._before || bySection[name].text, after: newText, issue: merged.issue })
    }
  }

  // Elements dudosos: se descartan directamente (más seguro que re-preguntar
  // — si la paleta local ES la del fondo, no hay "objeto" que redescribir).
  const badTargets = new Set(objections.filter((o) => o.section === 'Elements').map((o) => o.target))
  const cleanElements = elements ? elements.filter((e) => !badTargets.has(e.desc)) : elements
  for (const target of badTargets) {
    resampled.push({ section: 'Elements', dropped: target, issue: `bbox indistinguishable from background` })
  }

  return { sections: [...sections], elements: cleanElements, resampled }
}
