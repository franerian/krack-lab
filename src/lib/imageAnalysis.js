// Mediciones objetivas de la imagen calculadas por código (no por la IA):
// paleta dominante, luminancia/contraste, saturación, aspect ratio, y
// metadata embebida (EXIF de cámara / prompt original de generadores IA).
import exifr from 'exifr'

// ── Paleta dominante por k-means sobre una muestra de píxeles ──
function kmeansPalette(pixels, k = 6, iterations = 8) {
  // Inicializa centroides con muestras espaciadas.
  let centroids = []
  for (let i = 0; i < k; i++) {
    centroids.push([...pixels[Math.floor((i / k) * pixels.length)]])
  }
  let assignments = new Array(pixels.length).fill(0)
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
  return centroids
    .map((c, i) => ({
      hex: '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join(''),
      pct: Math.round((counts[i] / pixels.length) * 100),
    }))
    .filter((c) => c.pct > 0)
    .sort((a, b) => b.pct - a.pct)
}

const gcd = (a, b) => (b ? gcd(b, a % b) : a)

// Mide paleta, luminancia, contraste, saturación y AR desde un dataURL.
export function measureImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const SIZE = 96
      const canvas = document.createElement('canvas')
      canvas.width = SIZE
      canvas.height = SIZE
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
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

      resolve({
        palette: kmeansPalette(pixels),
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
