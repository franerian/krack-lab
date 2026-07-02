// Carga un File de imagen, lo reescala (máx. maxDim px) y devuelve base64
// listo para las APIs de visión (Anthropic exige <5MB; local va más rápido).

export function fileToImage(file, maxDim = 1024) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) return reject(new Error('NOT_IMAGE'))
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height))
      const w = Math.round(img.width * scale)
      const h = Math.round(img.height * scale)
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      canvas.getContext('2d').drawImage(img, 0, 0, w, h)
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
      URL.revokeObjectURL(url)
      resolve({
        dataUrl,
        base64: dataUrl.split(',')[1],
        mediaType: 'image/jpeg',
      })
    }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('BAD_IMAGE')) }
    img.src = url
  })
}
