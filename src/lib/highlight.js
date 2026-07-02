// Convierte texto plano en HTML con spans de categoría para el overlay
// del editor. Se aplica por segmentos para no anidar spans.
import { CATEGORY_REGEXES } from '../data/keywords.js'

const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export function highlightHtml(text) {
  if (!text) return ''
  // Recolecta matches de todas las categorías y resuelve solapes
  // (gana el match más largo; a igualdad, el que empieza antes).
  const matches = []
  for (const { key, regex } of CATEGORY_REGEXES) {
    regex.lastIndex = 0
    let m
    while ((m = regex.exec(text)) !== null) {
      matches.push({ start: m.index, end: m.index + m[0].length, key })
      if (m.index === regex.lastIndex) regex.lastIndex++
    }
  }
  matches.sort((a, b) => a.start - b.start || b.end - a.end)
  const kept = []
  let lastEnd = 0
  for (const m of matches) {
    if (m.start >= lastEnd) {
      kept.push(m)
      lastEnd = m.end
    }
  }
  let html = ''
  let pos = 0
  for (const m of kept) {
    html += escapeHtml(text.slice(pos, m.start))
    html += `<span class="hl-${m.key}">${escapeHtml(text.slice(m.start, m.end))}</span>`
    pos = m.end
  }
  html += escapeHtml(text.slice(pos))
  return html
}

// Como highlightHtml, pero envuelve la primera aparición de `markStr`
// en <mark> (para iluminar en el editor el texto de un preset aplicado).
export function highlightWithMark(text, markStr) {
  if (!markStr) return highlightHtml(text)
  const idx = text.indexOf(markStr)
  if (idx === -1) return highlightHtml(text)
  return (
    highlightHtml(text.slice(0, idx)) +
    `<mark class="preset-mark">${highlightHtml(markStr)}</mark>` +
    highlightHtml(text.slice(idx + markStr.length))
  )
}
