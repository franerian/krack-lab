// Score de similitud visual CLIP corriendo en el navegador (Transformers.js).
// Es el "medidor de la fotocopiadora": un número objetivo de convergencia
// entre la imagen original y la generación. Import dinámico + caché.

const MODEL_ID = 'Xenova/clip-vit-base-patch32'
let _extractor = null

async function getExtractor(onProgress) {
  if (_extractor) return _extractor
  const { pipeline } = await import('@huggingface/transformers')
  if (navigator.gpu) {
    try {
      _extractor = await pipeline('image-feature-extraction', MODEL_ID, {
        device: 'webgpu', progress_callback: onProgress,
      })
      return _extractor
    } catch { /* cae a WASM */ }
  }
  // CPU/WASM: dtype por defecto (compatible), funciona en cualquier navegador.
  _extractor = await pipeline('image-feature-extraction', MODEL_ID, {
    progress_callback: onProgress,
  })
  return _extractor
}

// Similitud coseno entre los embeddings CLIP de dos imágenes → 0-100.
export async function clipSimilarity(dataUrlA, dataUrlB, onProgress) {
  const extractor = await getExtractor(onProgress)
  const [ea, eb] = await Promise.all([extractor(dataUrlA), extractor(dataUrlB)])
  const a = Array.from(ea.data)
  const b = Array.from(eb.data)
  let dot = 0, na = 0, nb = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    na += a[i] * a[i]
    nb += b[i] * b[i]
  }
  const cos = dot / (Math.sqrt(na) * Math.sqrt(nb))
  return Math.round(cos * 100)
}
