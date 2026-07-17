// Carga un File de imagen y devuelve DOS versiones:
//   - display/análisis (max 1024, JPEG 0.9): para el visor y las mediciones
//     por código (paleta, contraste). Se reduce del original para no reventar
//     memoria con fotos gigantes.
//   - llmBase64 (max 512, JPEG 0.75): para las APIs de visión. Es lo que se
//     manda al LLM en los prompts del DNA Lab. 512px alcanza para leer
//     estilo/colores/luz/composición y AHORRA ~5x en tokens de imagen —
//     con moodboards de 3 refs, la diferencia es enorme (~15K tokens/req).
//     Verificado que Kimi/Qwen/Gemini identifican bien colores dominantes
//     con esa resolución.
const drawScaled = (img, maxDim, quality) => {
  const scale = Math.min(1, maxDim / Math.max(img.width, img.height))
  const w = Math.round(img.width * scale)
  const h = Math.round(img.height * scale)
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  canvas.getContext('2d').drawImage(img, 0, 0, w, h)
  return canvas.toDataURL('image/jpeg', quality)
}

export function fileToImage(file, maxDim = 1024) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) return reject(new Error('NOT_IMAGE'))
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const dataUrl = drawScaled(img, maxDim, 0.9)
      const llmDataUrl = drawScaled(img, 512, 0.75)
      URL.revokeObjectURL(url)
      resolve({
        dataUrl,
        base64: dataUrl.split(',')[1],
        mediaType: 'image/jpeg',
        // Versión chica pensada para el LLM (default en imgPayload del DNA Lab)
        llmBase64: llmDataUrl.split(',')[1],
      })
    }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('BAD_IMAGE')) }
    img.src = url
  })
}
