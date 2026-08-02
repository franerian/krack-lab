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

// Sanitizador para Midjourney V8.2 — bugs de compatibilidad del parser:
// (1) V8.2 rechaza "Multiple --no parameters aren't supported". Los em-dashes
//     (—) y en-dashes (–) que meten los LLMs al pulir se interpretan como --
//     por el parser de MJ, generando pseudo-parámetros y disparando el error.
// (2) MJ lee cada palabra del --no INDEPENDIENTEMENTE ("no modern clothing"
//     = "no modern" + "no clothing"), así que palabras "no"/"No"/"avoid"/
//     "Avoid" DENTRO de la lista son ruido peor que inútil.
// (3) MJ interpreta CUALQUIER token que empiece con "-" (guion + número o
//     letra) como intento de parámetro. Un "-15%" en medio del prompt lee
//     "-15%" como flag desconocido y arrastra las palabras siguientes como
//     "Unrecognized parameter(s): -15%, to, center, ..." hasta romperse.
// (4) Los LLMs meten hex codes (#fce94e), estructuras key:value ("top:"),
//     punto y coma y porcentajes con signo que MJ no puede parsear.
// Este sanitizador aplica al output final tanto del compile mecánico como
// del pulido con IA (polishForTarget).
export function sanitizeMidjourney(text) {
  if (!text) return text
  // 1. Reemplazo em/en-dash por coma+espacio en TODO el prompt.
  let out = text.replace(/[—–]/g, ', ')
  // 2. Separo body (texto libre) de flags (parámetros MJ válidos). Las
  //    sanitaciones agresivas de abajo aplican SOLO al body — no quiero
  //    tocar hex del --sref o números del --iw.
  const flagRe = /\s(--(?:ar|no|s|hd|sd|raw|exp|p|sref|sw|iw|oref|ow|v|c|weird|q|stylize|chaos|niji)\b)/i
  const flagMatch = flagRe.exec(out)
  let body = flagMatch ? out.slice(0, flagMatch.index) : out
  const flagsPart = flagMatch ? out.slice(flagMatch.index) : ''
  // 3. Limpieza del body: quitar los patrones que MJ interpreta mal como
  //    flag o valor. Cada .replace ataca UN patrón concreto verificado.
  body = body
    .replace(/#[0-9a-fA-F]{3,8}\b/g, '')      // hex codes → fuera (MJ prefiere nombres)
    .replace(/(?<!\w)[+\-]\d+(?:\.\d+)?%/g, '') // ±N% con signo → fuera (el "-" dispara flag)
    .replace(/(\w)\s*:\s+/g, '$1 ')           // "key: value" → "key value"
    .replace(/;/g, ',')                        // punto y coma → coma
    .replace(/\s*\(\s*[,\s]*\)/g, '')          // paréntesis vacíos que quedaron
    .replace(/,\s*,+/g, ',')                   // comas consecutivas
    .replace(/\s+,/g, ',')
    .replace(/\s{2,}/g, ' ')
    .trim()
  out = body + (flagsPart ? ' ' + flagsPart.trim() : '')
  // 4. Colapso múltiples --no en uno (V8.2). Capturo cada bloque --no hasta
  //    el próximo --flag o el fin del prompt, y los uno con coma.
  const noRe = /--no\s+([\s\S]+?)(?=\s+--[a-z]|\s*$)/gi
  const noBlocks = [...out.matchAll(noRe)].map((m) => m[1].trim()).filter(Boolean)
  if (noBlocks.length) {
    out = out.replace(noRe, '').replace(/\s{2,}/g, ' ').trim()
    // 5. Limpio cada item del --no: prefijos negados, guiones sueltos,
    //    dedupe case-insensitive, longitud mínima. También quito paréntesis
    //    con hex adentro (residuo del pulido).
    const seen = new Set()
    const items = []
    for (const block of noBlocks) {
      for (let piece of block.split(',')) {
        piece = piece.trim()
          .replace(/^(?:no|not|avoid|absolutely|any)\s+/i, '')
          .replace(/^[-–—]+\s*/, '')
          .replace(/[.:;]+$/, '')
          .replace(/#[0-9a-fA-F]{3,8}\b/g, '')
          .replace(/\s+/g, ' ')
          .trim()
        if (piece.length < 2) continue
        const key = piece.toLowerCase()
        if (seen.has(key)) continue
        seen.add(key)
        items.push(piece)
      }
    }
    if (items.length) out = `${out} --no ${items.join(', ')}`
  }
  return out.replace(/\s{2,}/g, ' ').trim()
}

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
    notes: `Midjourney V8.1 (default desde junio 2026) / V8.2 (dropdown Model o --preview; NO existe --v 8.2).

Largo del prompt: la doc oficial no publica un número. Dice: cortos y simples dan mejores resultados, evitar listas largas, menos detalle da más variedad. Existe un Prompt Shortener que recorta automáticamente al superar el límite (umbral no publicado, estimado 1024-1300 chars según fuentes de terceros — contradictorias). Objetivo de trabajo: <900 chars. Óptimo 300-700.

Estructura: frases descriptivas en lenguaje natural, no sopa de keywords (V8.x castiga stacking "8k, masterpiece, detailed").
Orden por prioridad, lo más importante primero (el peso decae al final):
1) sujeto principal + rasgos visibles clave
2) detalles adjuntos al sujeto
3) acción o primer plano
4) entorno o fondo
5) estilo, medio, iluminación, color, mood
6) cámara y lente
7) parámetros al final
Reglas: describir lo que se quiere (nunca lo que no se quiere — para excluir usar --no). Números concretos, no plurales vagos ("three cats", no "cats"). No poner en texto lo que resuelve un parámetro (formato = --ar, no "2.39:1" en el texto). Nada de lenguaje de movimiento en imagen fija. Eliminar sinónimos redundantes del mismo eje (no repetir "cool hues / cool tones / cool palette").

Parámetros disponibles:
- --ar (usar valores del slider oficial: 4:5, 3:2, 16:9, 21:9; evitar decimales tipo 2.39:1)
- --raw (o toggle Raw: menos intervención estética del default)
- --hd (salida 2048px sin upscaler aparte) / --sd (variante más económica)
- --s N (stylize)
- --exp (experimental; compite con las referencias)
- --no (exclusión). ⚠ V8.2 rechaza MÚLTIPLES --no en el mismo prompt ("Multiple --no parameters aren't supported for --version 8.2"). Usar UN SOLO --no con lista separada por comas. Cada palabra del --no se lee INDEPENDIENTEMENTE — "no modern clothing" = "no modern" + "no clothing"; por eso los items deben ser conceptos limpios sin las palabras "no"/"No"/"avoid"/"Avoid" adentro. Nunca usar em-dash (—) ni en-dash (–) en el prompt: el parser los interpreta como -- y dispara falsos parámetros. Usar guión simple (-) o coma.
- --p m<ID> (perfil/moodboard; ID copiado desde la página; compatible V6/V7/V8.1; NO compatible con --sv ni --sw; se pueden encadenar varios)
- --sref <código|URL> (referencia de estilo; encadenables)
- --iw N (peso de imagen de referencia; requiere image prompt adjunta — sin imagen se descarta)
- --oref <img> --ow N (Omni Reference; 1-1000, default 100; 25-50 para cambiar de estilo, 400 para fijar cara/ropa. Doc oficial declara compatibilidad con V7 y agregar un oref corre el prompt en V7 — no hay confirmación oficial de soporte en V8.1; guías de terceros lo listan como V7-only)

NO compatibles con V8.1 según la tabla de versiones: upscalers, --q 2 y --q 4, turbo, multi-prompts.

Moderación: evitar verbos de transformación o daño aplicados a cuerpos humanos ("his body rebuilt as", "body fused with machinery", "limbs replaced") — disparan el filtro por body horror/mutilación. Solución: mover el sujeto en vez de suavizar adjetivos — describir una figura que YA es mecánica y viste ropa humana, en lugar de un humano al que se le reconstruye el cuerpo. Para conservar una persona real usar image prompt o oref y dejar el texto solo para estilo, sin verbos sobre el cuerpo.`,
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
      return sanitizeMidjourney([body, params.join(' ')].filter(Boolean).join(' '))
    },
    postProcess: sanitizeMidjourney,
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
