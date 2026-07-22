// Mediciones objetivas de la imagen calculadas por código (no por la IA):
// paleta dominante, luminancia/contraste, saturación, aspect ratio, y
// metadata embebida (EXIF de cámara / prompt original de generadores IA).
import exifr from 'exifr'

const dist2 = (a, b) => {
  const dr = a[0] - b[0]
  const dg = a[1] - b[1]
  const db = a[2] - b[2]
  return dr * dr + dg * dg + db * db
}

// ── Paleta dominante por k-means sobre una muestra de píxeles ──
function kmeansCore(pixels, k, iterations = 8) {
  // Inicialización farthest-point: cada centroide arranca en el color más
  // lejano a los ya elegidos → diversidad garantizada. (La init por índice
  // desperdiciaba clusters en duplicados del color de las primeras filas.)
  const centroids = [pixels[Math.floor(pixels.length / 2)].slice()]
  const stride = Math.max(1, Math.floor(pixels.length / 3000))
  while (centroids.length < k) {
    let bestP = null
    let bestD = -1
    for (let i = 0; i < pixels.length; i += stride) {
      let dmin = Infinity
      for (const c of centroids) {
        const d = dist2(pixels[i], c)
        if (d < dmin) dmin = d
      }
      if (dmin > bestD) { bestD = dmin; bestP = pixels[i] }
    }
    if (!bestP) break
    centroids.push(bestP.slice())
  }
  const assignments = new Array(pixels.length).fill(0)
  for (let iter = 0; iter < iterations; iter++) {
    for (let p = 0; p < pixels.length; p++) {
      let best = 0
      let bestD = Infinity
      for (let c = 0; c < k; c++) {
        const dr = pixels[p][0] - centroids[c][0]
        const dg = pixels[p][1] - centroids[c][1]
        const db = pixels[p][2] - centroids[c][2]
        const d = dr * dr + dg * dg + db * db
        if (d < bestD) { bestD = d; best = c }
      }
      assignments[p] = best
    }
    const sums = Array.from({ length: k }, () => [0, 0, 0, 0])
    for (let p = 0; p < pixels.length; p++) {
      const a = sums[assignments[p]]
      a[0] += pixels[p][0]; a[1] += pixels[p][1]; a[2] += pixels[p][2]; a[3]++
    }
    for (let c = 0; c < k; c++) {
      if (sums[c][3] > 0) {
        centroids[c] = [sums[c][0] / sums[c][3], sums[c][1] / sums[c][3], sums[c][2] / sums[c][3]]
      }
    }
  }
  const counts = new Array(k).fill(0)
  for (const a of assignments) counts[a]++
  return { centroids, counts }
}

const toHex = (c) =>
  '#' + c.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('')

function kmeansPalette(pixels, k = 12, iterations = 8) {
  const { centroids, counts } = kmeansCore(pixels, k, iterations)
  // Fusiona clusters casi idénticos (dist < 22) sumando sus áreas.
  const entries = centroids
    .map((c, i) => ({ c, count: counts[i] }))
    .filter((e) => e.count > 0)
    .sort((a, b) => b.count - a.count)
  const merged = []
  for (const e of entries) {
    const near = merged.find((m) => dist2(m.c, e.c) < 22 * 22)
    if (near) near.count += e.count
    else merged.push({ c: e.c.slice(), count: e.count })
  }
  // Clasificación por área: los clusters grandes son la paleta dominante;
  // los chicos (<1.5%) son ACENTOS — reales pero de poca superficie (una
  // capucha rosa, una bufanda roja). Redondearlos a 0% era perderlos.
  const withPct = merged.map((m) => ({
    c: m.c,
    hex: toHex(m.c),
    pct: Math.round((m.count / pixels.length) * 1000) / 10,
  }))
  const palette = withPct
    .filter((e) => e.pct >= 1.5)
    .sort((a, b) => b.pct - a.pct)
    .map(({ hex, pct }) => ({ hex, pct: Math.round(pct) }))
  const smallClusters = withPct.filter((e) => e.pct >= 0.15 && e.pct < 1.5)
  return { palette, centroids: merged.map((m) => m.c), smallClusters }
}

// Acentos salientes: el k-means por área absorbe los colores chicos y vivos
// (una capucha rosa al 2% desaparece dentro del promedio del cluster grande),
// y esos acentos suelen ser el alma de la imagen. Se detectan como OUTLIERS
// cromáticos — píxeles lejos de TODOS los clusters dominantes — y se
// re-clusterizan aparte.
function detectAccents(pixels, centroids) {
  const n = pixels.length
  const outliers = []
  for (const p of pixels) {
    let best = Infinity
    for (const c of centroids) {
      const dr = p[0] - c[0]
      const dg = p[1] - c[1]
      const db = p[2] - c[2]
      const d = dr * dr + dg * dg + db * db
      if (d < best) best = d
    }
    if (best > 60 * 60) outliers.push(p)
  }
  if (outliers.length < Math.max(8, n * 0.002)) return []
  // k=4 fusionaba matices distintos entre sí (verificado: 4 halos de color
  // separados —rojo/verde/violeta/amarillo— colapsaban a 2-3 acentos porque
  // el propio re-clustering de outliers no tenía margen para separarlos).
  // k=7 les da lugar antes de que el filtro por pct/distancia recorte.
  const k = Math.min(7, outliers.length)
  const { centroids: ac, counts } = kmeansCore(outliers, k, 8)
  return ac
    .map((c, i) => ({ c, hex: toHex(c), pct: Math.round((counts[i] / n) * 1000) / 10 }))
    .filter((a) => a.pct >= 0.2)
    // descarta los que igual quedaron cerca de un color dominante
    .filter((a) =>
      centroids.every((c) => {
        const dr = a.c[0] - c[0]
        const dg = a.c[1] - c[1]
        const db = a.c[2] - c[2]
        return dr * dr + dg * dg + db * db > 45 * 45
      })
    )
    .sort((x, y) => y.pct - x.pct)
}

const gcd = (a, b) => (b ? gcd(b, a % b) : a)

// Paleta local de una región de la imagen (box en fracciones 0-1). Croppea
// a un canvas chico y corre el mismo k-means: alimenta la color_palette por
// elemento del schema Ideogram (fase espacial del DNA Lab / Layout Builder).
export function paletteForRegion(dataUrl, box, top = 4) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const sx = Math.max(0, Math.round(box.x * img.naturalWidth))
      const sy = Math.max(0, Math.round(box.y * img.naturalHeight))
      const sw = Math.max(1, Math.round(box.w * img.naturalWidth))
      const sh = Math.max(1, Math.round(box.h * img.naturalHeight))
      const SIZE = 64
      const canvas = document.createElement('canvas')
      canvas.width = SIZE
      canvas.height = SIZE
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      ctx.imageSmoothingEnabled = false
      try {
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, SIZE, SIZE)
        const { data } = ctx.getImageData(0, 0, SIZE, SIZE)
        const pixels = []
        for (let i = 0; i < data.length; i += 4) pixels.push([data[i], data[i + 1], data[i + 2]])
        const { palette } = kmeansPalette(pixels, 6)
        resolve(palette.slice(0, top).map((c) => c.hex.toUpperCase()))
      } catch {
        resolve([])
      }
    }
    img.onerror = () => resolve([])
    img.src = dataUrl
  })
}

// Mide paleta, luminancia, contraste, saturación y AR desde un dataURL.
export function measureImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      // SIZE chico + downscale >10:1 con suavizado (default) hace que el
      // navegador PROMEDIE/difumine cada parche de color chico y saturado
      // (rojo, verde, amarillo) con el gris/ruido que lo rodea antes de que
      // el k-means vea un solo píxel — los acentos vívidos desaparecían en
      // el muestreo, no en la lectura del LLM. Point-sampling (sin suavizado)
      // preserva el color real de cada píxel elegido.
      const SIZE = 96
      const canvas = document.createElement('canvas')
      canvas.width = SIZE
      canvas.height = SIZE
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      ctx.imageSmoothingEnabled = false
      ctx.drawImage(img, 0, 0, SIZE, SIZE)
      const { data } = ctx.getImageData(0, 0, SIZE, SIZE)

      const pixels = []
      let lumSum = 0, lumSqSum = 0, satSum = 0
      const n = SIZE * SIZE
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2]
        pixels.push([r, g, b])
        const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
        lumSum += lum
        lumSqSum += lum * lum
        const mx = Math.max(r, g, b), mn = Math.min(r, g, b)
        satSum += mx === 0 ? 0 : (mx - mn) / mx
      }
      const lumMean = lumSum / n
      const lumStd = Math.sqrt(Math.max(0, lumSqSum / n - lumMean * lumMean))
      const satMean = satSum / n

      // Escalas calibradas 1-10 (idea 5): derivadas de mediciones, no del ojo.
      const contrast10 = Math.max(1, Math.min(10, Math.round(lumStd / 8)))
      const saturation10 = Math.max(1, Math.min(10, Math.round(satMean * 12)))
      const brightness10 = Math.max(1, Math.min(10, Math.round((lumMean / 255) * 10)))
      const key = lumMean > 165 ? 'high-key' : lumMean < 90 ? 'low-key' : 'balanced'

      const w = img.naturalWidth, h = img.naturalHeight
      const g2 = gcd(w, h)
      let arW = w / g2, arH = h / g2
      // Reduce ARs raros al estándar más cercano para legibilidad.
      const ratio = w / h
      const standards = [['16:9', 16 / 9], ['9:16', 9 / 16], ['1:1', 1], ['4:3', 4 / 3], ['3:4', 3 / 4], ['3:2', 3 / 2], ['2:3', 2 / 3], ['21:9', 21 / 9], ['2.39:1', 2.39]]
      let nearest = standards[0]
      for (const s of standards) if (Math.abs(s[1] - ratio) < Math.abs(nearest[1] - ratio)) nearest = s

      const { palette, centroids, smallClusters } = kmeansPalette(pixels)
      // Acentos = clusters chicos del k-means + outliers cromáticos que no
      // consiguieron cluster, deduplicados entre sí. Tope subido a 6 y dedupe
      // más estricto (24 en vez de 30) — con 4 tope, matices distintos mismo
      // apenas se filtraba uno perdían su lugar contra el más grande en área.
      const accents = []
      for (const a of [...smallClusters, ...detectAccents(pixels, centroids)].sort((x, y) => y.pct - x.pct)) {
        if (accents.every((b) => dist2(a.c, b.c) > 24 * 24)) accents.push(a)
        if (accents.length >= 6) break
      }
      resolve({
        palette,
        accents: accents.map(({ hex, pct }) => ({ hex, pct })),
        lumMean: Math.round(lumMean),
        contrast10,
        saturation10,
        brightness10,
        key,
        width: w,
        height: h,
        aspect: arW <= 50 && arH <= 50 ? `${arW}:${arH}` : nearest[0],
        aspectNearest: nearest[0],
      })
    }
    img.onerror = () => reject(new Error('BAD_IMAGE'))
    img.src = dataUrl
  })
}

// ── Metadata embebida: prompt de generadores IA (PNG) y EXIF (JPEG) ──

// Parser mínimo de chunks tEXt/iTXt de PNG (A1111 guarda "parameters",
// ComfyUI guarda "prompt"/"workflow", otros usan "Description"/"Comment").
function parsePngText(buffer) {
  const view = new DataView(buffer)
  const bytes = new Uint8Array(buffer)
  // Firma PNG
  if (view.getUint32(0) !== 0x89504e47) return null
  const out = {}
  let off = 8
  const latin1 = (start, end) => {
    let s = ''
    for (let i = start; i < end; i++) s += String.fromCharCode(bytes[i])
    return s
  }
  while (off + 8 <= buffer.byteLength) {
    const len = view.getUint32(off)
    const type = latin1(off + 4, off + 8)
    const dataStart = off + 8
    if (type === 'tEXt') {
      const nul = bytes.indexOf(0, dataStart)
      if (nul > dataStart && nul < dataStart + len) {
        out[latin1(dataStart, nul)] = latin1(nul + 1, dataStart + len)
      }
    } else if (type === 'iTXt') {
      const nul = bytes.indexOf(0, dataStart)
      if (nul > dataStart && nul < dataStart + len) {
        const key = latin1(dataStart, nul)
        const compFlag = bytes[nul + 1]
        if (compFlag === 0) {
          // salta compMethod + langTag\0 + translatedKw\0
          let p = nul + 3
          p = bytes.indexOf(0, p) + 1
          p = bytes.indexOf(0, p) + 1
          out[key] = new TextDecoder().decode(bytes.slice(p, dataStart + len))
        }
      }
    } else if (type === 'IEND') break
    off = dataStart + len + 4
  }
  return Object.keys(out).length ? out : null
}

export async function extractFileMetadata(file) {
  try {
    if (file.type === 'image/png') {
      const text = parsePngText(await file.arrayBuffer())
      if (!text) return null
      const promptKeys = ['parameters', 'prompt', 'workflow', 'Description', 'Comment', 'sd-metadata']
      const found = promptKeys.filter((k) => text[k])
      if (!found.length) return null
      return {
        kind: 'ai-prompt',
        source: found.includes('parameters') ? 'A1111/Forge' : found.includes('workflow') || found.includes('prompt') ? 'ComfyUI' : 'PNG metadata',
        // Limita el tamaño (los workflows de Comfy pueden ser enormes)
        text: found.map((k) => `${k}: ${text[k].slice(0, 2000)}`).join('\n\n'),
      }
    }
    const exif = await exifr.parse(file, {
      pick: ['Make', 'Model', 'LensModel', 'FocalLength', 'FNumber', 'ExposureTime', 'ISO', 'Software'],
    })
    if (!exif || (!exif.Make && !exif.Model && !exif.LensModel)) return null
    const parts = [
      [exif.Make, exif.Model].filter(Boolean).join(' '),
      exif.LensModel,
      exif.FocalLength && `${exif.FocalLength}mm`,
      exif.FNumber && `f/${exif.FNumber}`,
      exif.ExposureTime && `${exif.ExposureTime < 1 ? `1/${Math.round(1 / exif.ExposureTime)}` : exif.ExposureTime}s`,
      exif.ISO && `ISO ${exif.ISO}`,
    ].filter(Boolean)
    return parts.length ? { kind: 'exif', source: 'EXIF', text: parts.join(' · ') } : null
  } catch {
    return null
  }
}

// Bloque de texto con las mediciones, para inyectar al prompt del extractor.
export function measurementsToText(m, meta) {
  if (!m) return ''
  const lines = [
    'MEASURED GROUND TRUTH (computed programmatically from the actual pixels — these are FACTS, your description must obey them):',
    `- Dominant palette (hex, % of frame): ${m.palette.map((c) => `${c.hex} (${c.pct}%)`).join(', ')}`,
    ...(m.accents?.length
      ? [`- Salient ACCENT colors (tiny area but visually DEFINING — each one MUST appear named in # Color): ${m.accents.map((c) => `${c.hex} (${c.pct}%)`).join(', ')}`]
      : []),
    `- Brightness: mean luminance ${m.lumMean}/255 → ${m.key} (brightness ${m.brightness10}/10)`,
    `- Contrast: ${m.contrast10}/10 (measured tonal std deviation)`,
    `- Saturation: ${m.saturation10}/10${m.saturation10 <= 3 ? ' (muted/desaturated)' : m.saturation10 >= 7 ? ' (vivid)' : ''}`,
    `- Aspect ratio: ${m.aspect}${m.aspect !== m.aspectNearest ? ` (≈ ${m.aspectNearest})` : ''} — ${m.width}×${m.height}px`,
  ]
  if (meta?.kind === 'exif') {
    lines.push(`- CAMERA EXIF (factual — use as the basis of # Camera): ${meta.text}`)
  }
  if (meta?.kind === 'ai-prompt') {
    lines.push(`- EMBEDDED AI GENERATION DATA found in the file (${meta.source}) — the original prompt/parameters. This is the highest-fidelity source; reconcile your analysis with it:\n${meta.text}`)
  }
  return lines.join('\n')
}

// ── Agregación de mediciones de varias imágenes de referencia (moodboard) ──
const hexToRgb = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]

// Fusiona colores cercanos de varias imágenes: promedia el % sobre el total
// de imágenes (un color presente en 1 de 3 pesa 1/3), agrupa por distancia.
function poolColors(colors, imageCount) {
  const groups = []
  for (const c of colors) {
    const rgb = hexToRgb(c.hex)
    const near = groups.find((g) => dist2(g.rgb, rgb) < 30 * 30)
    if (near) { near.sum += c.pct; near.n++ }
    else groups.push({ rgb, hex: c.hex, sum: c.pct, n: 1 })
  }
  return groups
    .map((g) => ({ hex: g.hex, pct: Math.round(g.sum / imageCount) }))
    .filter((c) => c.pct > 0)
    .sort((a, b) => b.pct - a.pct)
}

// Objeto de métricas agregadas (para el panel de UI y el texto del prompt).
export function aggregateMetrics(list) {
  const n = list.length
  if (!n) return null
  if (n === 1) return list[0]
  const avg = (k) => Math.round(list.reduce((s, m) => s + (m[k] || 0), 0) / n)
  const brightness10 = avg('brightness10')
  const aspects = [...new Set(list.map((m) => m.aspect))]
  return {
    count: n,
    palette: poolColors(list.flatMap((m) => m.palette || []), n).slice(0, 6),
    accents: poolColors(list.flatMap((m) => m.accents || []), n).slice(0, 4),
    contrast10: avg('contrast10'),
    saturation10: avg('saturation10'),
    brightness10,
    key: brightness10 >= 7 ? 'high-key' : brightness10 <= 3 ? 'low-key' : 'balanced',
    aspect: aspects.length === 1 ? aspects[0] : 'mixto',
    ranges: {
      contrast: [Math.min(...list.map((m) => m.contrast10)), Math.max(...list.map((m) => m.contrast10))],
      saturation: [Math.min(...list.map((m) => m.saturation10)), Math.max(...list.map((m) => m.saturation10))],
      brightness: [Math.min(...list.map((m) => m.brightness10)), Math.max(...list.map((m) => m.brightness10))],
    },
  }
}

const range = (r) => (r[0] === r[1] ? `${r[0]}` : `${r[0]}–${r[1]}`)

// Texto de mediciones para N imágenes que comparten un estilo.
export function multiMeasurementsToText(items) {
  const metricsList = items.map((it) => it.metrics).filter(Boolean)
  if (metricsList.length < 2) {
    return measurementsToText(items[0]?.metrics, items[0]?.meta)
  }
  const agg = aggregateMetrics(metricsList)
  const lines = [
    `MEASURED GROUND TRUTH — ${items.length} REFERENCE IMAGES SHARING ONE STYLE (computed from pixels; these are FACTS. Describe only what is CONSISTENT across the set):`,
    `- Combined dominant palette (avg % across the set): ${agg.palette.map((c) => `${c.hex} (${c.pct}%)`).join(', ')}`,
    ...(agg.accents.length
      ? [`- Combined ACCENT colors (small area but DEFINING — each MUST be named in # Color): ${agg.accents.map((c) => c.hex).join(', ')}`]
      : []),
    `- Brightness: avg ${agg.brightness10}/10 (range ${range(agg.ranges.brightness)}) → ${agg.key}`,
    `- Contrast: avg ${agg.contrast10}/10 (range ${range(agg.ranges.contrast)})`,
    `- Saturation: avg ${agg.saturation10}/10 (range ${range(agg.ranges.saturation)})`,
    '- Per-image dominant palettes (for reference):',
    ...metricsList.map((m, i) => `  · Image ${i + 1}: ${m.palette.slice(0, 5).map((c) => c.hex).join(' ')}`),
  ]
  // Metadata embebida por imagen (EXIF / prompt original) si la hay.
  items.forEach((it, i) => {
    if (it.meta?.kind === 'exif') lines.push(`- Image ${i + 1} CAMERA EXIF: ${it.meta.text}`)
    if (it.meta?.kind === 'ai-prompt') lines.push(`- Image ${i + 1} EMBEDDED PROMPT (${it.meta.source}): ${it.meta.text.slice(0, 500)}`)
  })
  return lines.join('\n')
}
