// Compiladores de salida por modelo destino, factorizados según la
// documentación oficial de prompting de cada modelo (verificada 07/2026):
// - Midjourney V7: docs.midjourney.com (Parameter List, Raw Mode) — lenguaje
//   natural, los primeros tokens pesan más, parámetros al final (--ar, --no).
// - Sora 2: OpenAI Cookbook "Sora 2 Prompting Guide" — brief de cinematógrafo
//   en prosa: qué se ve primero, cámara/lente, luz, paleta, sonido diegético.
// - Veo 3.x: deepmind.google/models/veo/prompt-guide — Subject + Context +
//   Action + Style + Camera + Composition + Ambiance + Audio; 100-150 palabras.
// - Kling: kling.ai quickstart — fórmula oficial Subject + Movement + Scene +
//   (Camera Language + Lighting + Atmosphere); negative prompt en campo aparte.
// - Runway Gen-4: help.runwayml.com — SOLO frases positivas (los negativos
//   producen el efecto contrario), cámara explícita, simpleza física.
// - Flux / Nano Banana: cloud.google.com prompting guide — narrativa
//   descriptiva como brief a un artista humano; sin negative prompts.
// - SDXL: convención establecida A1111/ComfyUI — tags por coma, lo importante
//   primero, negative prompt en su campo.

import { buildIdeogramCaption } from '../lib/ideogram.js'

const get = (sections, name) => {
  const s = sections.find((x) => x.name === name)
  return s ? s.text.trim() : ''
}

const sentence = (t) => (t ? (t.endsWith('.') ? t : t + '.') : '')

// Los generadores de imagen/video NO leen códigos hex: en el ADN son
// calibración interna ("dusty slate blue-green (#494c50)"), pero en el
// prompt compilado solo aportan ruido — se quitan dejando los nombres.
const stripHexes = (text) => {
  let t = text.replace(/#[0-9a-fA-F]{6}/g, '')
  // Paréntesis que quedaron con solo restos (%, comas, espacios) — dos
  // pasadas para cubrir anidados como "(#3b3136 (13%))".
  for (let i = 0; i < 2; i++) t = t.replace(/\(\s*[\d%\s·,;]*\)/g, '')
  t = t
    .replace(/\s*,\s*,/g, ',')
    .replace(/,\s*\./g, '.')
    .replace(/:\s*([,.])/g, '$1')
    .replace(/\s+([,.;])/g, '$1')
    .replace(/\s{2,}/g, ' ')
  // Descarta oraciones que quedaron huecas al quitar los hex
  // ("Key dominant hex values include:." → fuera).
  return t
    .split(/(?<=\.)\s+/)
    .filter((s) => !/\b(includ\w+|values?|governed by|adheres? to|such as|hex\w*)\s*[:,]?\s*\.?$/i.test(s.trim()))
    .join(' ')
    .trim()
}

// Párrafo narrativo en un orden dado.
const prose = (sections, order) =>
  order.map((n) => sentence(stripHexes(get(sections, n)))).filter(Boolean).join(' ')

// Oraciones → lista de tags por coma (para SDXL / --no).
const toTags = (text) =>
  stripHexes(text)
    .replace(/\.\s+/g, ', ')
    .replace(/\.$/, '')
    .replace(/\s*,\s*/g, ', ')
    .trim()

// El pulido del LLM deja el # Negative con ruido típico: "avoid:" inicial,
// "No " en mayúscula pegado tras una lista minúscula, sub-cláusulas atadas
// con "and", separadores mezclados (comas + punto y coma), duplicados
// case-insensitive. Midjourney los tolera pero son tokens gastados.
const negativeList = (sections) => {
  const raw = get(sections, 'Negative')
    .replace(/^avoid:\s*/i, '')
    .replace(/;/g, ',')
  const seen = new Set()
  const items = []
  for (let piece of raw.split(',')) {
    piece = piece.trim()
      .replace(/^(?:and\s+)?(?:absolutely\s+)?(?:any\s+)?no\s+/i, '')
      .replace(/\.$/, '')
      .replace(/\s+/g, ' ')
      .trim()
    if (piece.length < 2) continue
    const key = piece.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    items.push(piece)
  }
  return toTags(items.join(', '))
}

export const TARGETS = [
  {
    id: 'structured',
    label: 'Estructurado (# secciones)',
    notes: 'Formato universal con encabezados. Ideal para Krea, para usar un LLM como intermediario, o para guardar y versionar tus prompts.',
    usesAr: false,
    compile: (sections) =>
      sections
        .filter((s) => s.text.trim())
        .map((s) => `# ${s.name}\n${s.text.trim()}`)
        .join('\n\n'),
  },
  {
    id: 'midjourney',
    label: 'Midjourney',
    notes: 'Según docs de V7: lenguaje natural conciso (no listas de keywords), lo esencial primero porque los primeros tokens pesan más, y parámetros al final separados por espacio: --ar y --no (el Negative se convierte). Tip: agregá --raw a mano si querés menos "opinión" del modelo.',
    usesAr: true,
    compile: (sections, { ar } = {}) => {
      // V7 pesa los primeros tokens: sujeto y MEDIO al frente (el estilo al
      // final llega tarde — evidencia del caso low-poly, iteración 07/2026).
      const order = ['Subject', 'Style', 'Action', 'Environment', 'Composition', 'Camera', 'Lighting', 'Color', 'Mood']
      const body = prose(sections, order).replace(/\.$/, '')
      const params = []
      if (ar) params.push(`--ar ${ar.replace(/\s/g, '')}`)
      const neg = negativeList(sections)
      if (neg) params.push(`--no ${neg}`)
      return [body, params.join(' ')].filter(Boolean).join(' ')
    },
  },
  {
    id: 'sora',
    label: 'Sora 2',
    notes: 'Según la guía oficial de OpenAI: un brief de cinematógrafo en prosa — qué nota primero el espectador, plataforma de cámara y lente, dirección de la luz, paleta, texturas y sonido diegético. Sin negativos: lo indeseado se reformula en positivo.',
    usesAr: false,
    compile: (sections) => {
      const body = prose(sections, ['Subject', 'Action', 'Environment', 'Camera', 'Lighting', 'Color', 'Style', 'Details', 'Mood'])
      const audio = get(sections, 'Audio')
      return [body, audio && `Sound: ${sentence(audio)}`].filter(Boolean).join(' ')
    },
  },
  {
    id: 'veo',
    label: 'Veo 3',
    notes: 'Según la guía oficial de Google DeepMind: Subject + Context + Action + Style + Camera motion + Composition + Ambiance (+ Audio; diálogos entre comillas). Ideal 100-150 palabras. El Negative va al campo negative_prompt de la API (se copia debajo, sin "no/don\'t").',
    usesAr: false,
    compile: (sections) => {
      const body = prose(sections, ['Subject', 'Environment', 'Action', 'Style', 'Camera', 'Composition', 'Lighting', 'Color', 'Mood'])
      const audio = get(sections, 'Audio')
      const neg = negativeList(sections)
      return [
        [body, audio && `Audio: ${sentence(audio)}`].filter(Boolean).join(' '),
        neg && `Negative prompt:\n${neg}`,
      ].filter(Boolean).join('\n\n')
    },
  },
  {
    id: 'kling',
    label: 'Kling',
    notes: 'Fórmula oficial de Kling: Sujeto + Movimiento del sujeto + Escena + (Lenguaje de cámara + Iluminación + Atmósfera). Mejor 60-100 palabras que el máximo. El Negative va en su campo aparte (se copia debajo).',
    usesAr: false,
    compile: (sections) => {
      const body = prose(sections, ['Subject', 'Action', 'Environment'])
      const tech = prose(sections, ['Camera', 'Lighting', 'Mood'])
      const neg = negativeList(sections)
      return [
        [body, tech].filter(Boolean).join(' '),
        neg && `Negative prompt:\n${neg}`,
      ].filter(Boolean).join('\n\n')
    },
  },
  {
    id: 'runway',
    label: 'Runway Gen-4 / Luma',
    notes: 'Según la guía oficial de Runway: SOLO frases positivas (los negativos no están soportados y pueden producir lo contrario), movimiento de cámara explícito primero, descripciones físicas simples — sin lenguaje conceptual. La sección Negative se omite a propósito.',
    usesAr: false,
    compile: (sections) => {
      const cam = get(sections, 'Camera')
      const body = prose(sections, ['Subject', 'Action', 'Environment', 'Lighting'])
      const style = prose(sections, ['Style', 'Color'])
      return [cam && sentence(cam), body, style].filter(Boolean).join(' ')
    },
  },
  {
    id: 'sdxl',
    label: 'Stable Diffusion / SDXL',
    notes: 'Convención A1111/ComfyUI: keywords separadas por coma con lo importante primero (los primeros ~75 tokens pesan más). El negative prompt va en su campo aparte — se copia debajo.',
    usesAr: false,
    compile: (sections) => {
      const order = ['Subject', 'Style', 'Action', 'Environment', 'Composition', 'Camera', 'Lighting', 'Color', 'Details', 'Mood']
      const body = order.map((n) => toTags(get(sections, n))).filter(Boolean).join(', ')
      const neg = negativeList(sections)
      return neg ? `${body}\n\nNegative prompt:\n${neg}` : body
    },
  },
  {
    id: 'flux',
    label: 'Flux / Nano Banana',
    notes: 'Según la guía oficial de Google (Nano Banana) y las de BFL: narrativa descriptiva fluida con el MEDIO al frente (plantilla oficial: "A [style] of [subject]"), sin listas de keywords y SIN negative prompts — lo indeseado se describe en positivo ("sharp focus" en vez de "no blur"). El Negative se omite.',
    usesAr: false,
    compile: (sections) =>
      prose(sections, ['Style', 'Subject', 'Details', 'Action', 'Environment', 'Composition', 'Camera', 'Lighting', 'Color', 'Mood']),
  },
  {
    id: 'ideogram',
    label: 'Ideogram 4 (JSON)',
    notes: 'Caption JSON estructurado de Ideogram 4 (docs.ideogram.ai, Prompt Builder): high_level_description + style_description (con color_palette en hex — acá los hex SÍ se usan) + compositional_deconstruction con background y elementos. Compatible con la app de Ideogram, Forge (forge-neo-ideogram4) y los nodes de ComfyUI. Para ubicar elementos con cajas (bbox), usá el Layout Builder.',
    usesAr: false,
    compile: (sections) => JSON.stringify(buildIdeogramCaption({ sections }), null, 1),
  },
  {
    id: 'plain',
    label: 'Plano (una línea)',
    notes: 'Todo el contenido sin encabezados ni Negative, en una sola línea. Para pegar donde sea.',
    usesAr: false,
    compile: (sections) =>
      sections
        .filter((s) => s.text.trim() && s.name !== 'Negative')
        .map((s) => stripHexes(s.text.trim()))
        .join(' '),
  },
]

export const EXPORT_ASPECT_RATIOS = ['16:9', '9:16', '1:1', '4:3', '3:4', '3:2', '2:3', '21:9']
