// Schema JSON de Ideogram 4 ("caption"), portado del node de ComfyUI
// (node-special / KJNodes ideogram4): el verifier de Ideogram exige las
// claves EN ORDEN y todas presentes dentro de style_description una vez que
// se declara estilo; los bbox van en grilla normalizada 0-1000 como
// [ymin, xmin, ymax, xmax]; elementos sin ubicar omiten bbox.
//
// caption = {
//   high_level_description,
//   style_description: { aesthetics, lighting, medium, art_style, color_palette },
//   compositional_deconstruction: { background, elements: [
//     { type: 'obj'|'text', bbox?, text?, desc, color_palette? }
//   ]}
// }
//
// Este módulo es la única fuente de verdad del schema: lo usan el target de
// exportación, la extracción espacial del DNA Lab y el Layout Builder.

const getSection = (sections, name) => {
  const s = sections.find((x) => x.name === name)
  return s ? s.text.trim() : ''
}

export const extractHexes = (text, cap = 8) =>
  [...new Set((text.match(/#[0-9a-fA-F]{6}/g) || []).map((h) => h.toUpperCase()))].slice(0, cap)

const firstSentence = (t) => {
  const m = t.match(/^[^.]*\./)
  return m ? m[0].trim() : t
}

const restAfterFirstSentence = (t) => {
  const m = t.match(/^[^.]*\.\s*([\s\S]*)$/)
  return m ? m[1].trim() : ''
}

// {x,y,w,h} en fracciones 0-1 → [ymin,xmin,ymax,xmax] en grilla 0-1000.
export const boxToBbox = ({ x, y, w, h }) => {
  const x0 = w < 0 ? x + w : x
  const y0 = h < 0 ? y + h : y
  const ww = Math.abs(w)
  const hh = Math.abs(h)
  const c = (v) => Math.max(0, Math.min(1000, Math.round(v * 1000)))
  return [c(y0), c(x0), c(y0 + hh), c(x0 + ww)]
}

export const bboxToBox = ([y1, x1, y2, x2]) => ({
  x: x1 / 1000, y: y1 / 1000, w: (x2 - x1) / 1000, h: (y2 - y1) / 1000,
})

// Compila las secciones del editor (+ elementos espaciales opcionales) al
// caption de Ideogram. `elements`: [{ box:{x,y,w,h} 0-1 | bbox:[..], type,
// desc, text, palette }] — box/bbox opcionales (sin ubicar = sin bbox).
export function buildIdeogramCaption({ sections = [], elements = null, background = '', highLevel = '' }) {
  const S = (n) => getSection(sections, n)
  const style = S('Style')
  const caption = {}

  const hld = highLevel
    || [S('Subject'), S('Action')].filter(Boolean).join(' ')
    || firstSentence(style)
  if (hld) caption.high_level_description = hld

  if (style || S('Lighting') || S('Color') || S('Mood')) {
    // El verifier exige todas las claves presentes (aunque vacías) y en
    // este orden para art_style. Los hex del # Color se convierten en la
    // color_palette (acá SÍ se usan — al revés que en los targets prosa).
    caption.style_description = {
      aesthetics: [S('Mood'), S('Composition')].filter(Boolean).join(' '),
      lighting: S('Lighting'),
      medium: firstSentence(style),
      art_style: restAfterFirstSentence(style) || firstSentence(style),
      ...(extractHexes(S('Color')).length ? { color_palette: extractHexes(S('Color')) } : {}),
    }
  }

  const elems = []
  if (elements?.length) {
    for (const el of elements) {
      if (el.hide) continue
      const type = el.type === 'text' ? 'text' : 'obj'
      const e = { type } // el orden de claves importa para el verifier
      const bbox = el.bbox || (el.box ? boxToBbox(el.box) : null)
      if (bbox) e.bbox = bbox
      if (type === 'text') e.text = el.text || ''
      e.desc = el.desc || ''
      const palette = (el.palette || []).slice(0, 5)
      if (palette.length) e.color_palette = palette
      elems.push(e)
    }
  } else if (S('Subject')) {
    // Sin layout: el sujeto viaja como elemento sin ubicar (bbox omitido).
    elems.push({ type: 'obj', desc: [S('Subject'), S('Action')].filter(Boolean).join(' ') })
  }

  caption.compositional_deconstruction = {
    background: background || S('Environment') || S('Composition'),
    elements: elems,
  }
  return caption
}

// Parsea un caption de Ideogram (pegado desde node-special / Forge / la app
// de Ideogram) al modelo interno del Layout Builder.
export function parseIdeogramCaption(json) {
  const cap = typeof json === 'string' ? JSON.parse(json) : json
  if (!cap || typeof cap !== 'object') throw new Error('JSON inválido')
  const cd = cap.compositional_deconstruction || {}
  const sd = cap.style_description || {}
  return {
    highLevel: cap.high_level_description || '',
    background: cd.background || '',
    style: sd,
    elements: (cd.elements || []).map((e) => ({
      type: e.type === 'text' ? 'text' : 'obj',
      desc: e.desc || '',
      text: e.text || '',
      palette: e.color_palette || [],
      box: Array.isArray(e.bbox) && e.bbox.length === 4 ? bboxToBox(e.bbox) : null,
    })),
  }
}

// Caption → secciones del editor (para "Aplicar al prompt" desde el builder).
export function captionToSections(cap) {
  const parsed = cap.elements ? cap : parseIdeogramCaption(cap)
  const out = {}
  const descs = parsed.elements.filter((e) => e.type === 'obj' && e.desc).map((e) => e.desc)
  if (descs.length) out.Subject = descs.join('. ')
  const texts = parsed.elements.filter((e) => e.type === 'text' && (e.text || e.desc))
  if (texts.length) out.Details = texts.map((e) => `text "${e.text}" — ${e.desc}`).join('. ')
  if (parsed.background) out.Environment = parsed.background
  const sd = parsed.style
  if (sd.medium || sd.art_style) out.Style = [sd.medium, sd.art_style].filter(Boolean).join(' ')
  if (sd.lighting) out.Lighting = sd.lighting
  if (sd.aesthetics) out.Mood = sd.aesthetics
  if (sd.color_palette?.length) out.Color = `palette: ${sd.color_palette.join(', ')}`
  return out
}
