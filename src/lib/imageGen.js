// Generación de imágenes: registro de proveedores para probar prompts sin
// salir de KRACK. Diseñado para enchufar proveedores nuevos (fal.ai, etc.)
// implementando solo `generate()` — la UI los lista sola.
import { withAbort, DEMO_GEMINI_KEY } from './llm.js'
import { textToSections } from './anthropic.js'

// Pollinations exige Turnstile para fetch() de navegador → se pasa por el
// proxy serverless propio (/api/genimg). En dev local no hay funciones de
// Vercel, así que se usa el proxy de producción.
const PROXY_BASE =
  typeof location !== 'undefined' && /^(localhost|127\.0\.0\.1)$/.test(location.hostname)
    ? 'https://krack-lab.vercel.app'
    : ''

// AR → dimensiones concretas (los proveedores no parsean "16:9").
const AR_SIZES = {
  '16:9': [1280, 720], '9:16': [720, 1280], '1:1': [1024, 1024],
  '4:3': [1152, 864], '3:4': [864, 1152], '3:2': [1216, 810],
  '2:3': [810, 1216], '21:9': [1344, 576], '2.39:1': [1344, 560],
}
const sizeFor = (ar) => AR_SIZES[ar] || AR_SIZES['16:9']

const blobToDataUrl = (blob) =>
  new Promise((resolve, reject) => {
    const fr = new FileReader()
    fr.onload = () => resolve(fr.result)
    fr.onerror = reject
    fr.readAsDataURL(blob)
  })

// Los prompts compilados pueden traer encabezados "# Sección" (formato
// estructurado), parámetros de plataforma (--ar, --no) o un bloque
// "Negative prompt:" — nada de eso lo entiende un generador: se limpia.
export const cleanForGeneration = (prompt) => {
  let p = prompt
  if (/^#\s+\w/m.test(p)) {
    const secs = textToSections(p)
    if (secs.length) {
      p = secs.filter((s) => s.name !== 'Negative').map((s) => s.text.trim()).join(' ')
    }
  }
  return p
    .replace(/\s--(ar|no|style|raw)\b[^-]*/g, ' ')
    .replace(/\n+Negative prompt:[\s\S]*$/i, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

export const IMAGE_PROVIDERS = [
  {
    id: 'pollinations',
    label: 'Pollinations · Flux (gratis, sin key)',
    async generate({ prompt, aspectRatio }) {
      const [w, h] = sizeFor(aspectRatio)
      const seed = Math.floor(Math.random() * 1e9)
      const url = `${PROXY_BASE}/api/genimg?prompt=${encodeURIComponent(prompt)}&width=${w}&height=${h}&seed=${seed}`
      return withAbort(180_000, async (signal) => {
        const res = await fetch(url, { signal })
        if (!res.ok) throw new Error(`Pollinations ${res.status}`)
        const blob = await res.blob()
        if (!blob.type.startsWith('image/')) throw new Error('Pollinations no devolvió una imagen')
        const dataUrl = await blobToDataUrl(blob)
        return { dataUrl, base64: dataUrl.split(',')[1], mediaType: blob.type }
      })
    },
  },
  {
    id: 'nanobanana',
    label: 'Nano Banana · Gemini (requiere key con billing)',
    async generate({ prompt, aspectRatio, settings }) {
      const key = settings?.geminiKey || DEMO_GEMINI_KEY
      return withAbort(180_000, async (signal) => {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${encodeURIComponent(key)}`,
          {
            method: 'POST',
            signal,
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { imageConfig: { aspectRatio } },
            }),
          }
        )
        if (res.status === 429) {
          throw new Error('El free tier de Gemini NO incluye imágenes por API — usá Pollinations (gratis) o pegá una key con billing en Ajustes')
        }
        if (!res.ok) {
          const body = await res.text().catch(() => '')
          throw new Error(`Nano Banana ${res.status}: ${body.slice(0, 200)}`)
        }
        const data = await res.json()
        const part = data.candidates?.[0]?.content?.parts?.find((p) => p.inlineData)
        if (!part) throw new Error('Nano Banana no devolvió imagen')
        const { mimeType, data: b64 } = part.inlineData
        return { dataUrl: `data:${mimeType};base64,${b64}`, base64: b64, mediaType: mimeType }
      })
    },
  },
  // fal.ai (futuro): mismo contrato. Ejemplo de adapter:
  // {
  //   id: 'fal', label: 'fal.ai · Flux (requiere key)',
  //   async generate({ prompt, aspectRatio, settings }) {
  //     const [w, h] = sizeFor(aspectRatio)
  //     const res = await fetch('https://fal.run/fal-ai/flux/schnell', {
  //       method: 'POST',
  //       headers: { authorization: `Key ${settings.falKey}`, 'content-type': 'application/json' },
  //       body: JSON.stringify({ prompt, image_size: { width: w, height: h } }),
  //     })
  //     const data = await res.json() // data.images[0].url → fetch → dataUrl
  //   },
  // },
]

export async function generateImage({ provider, prompt, aspectRatio = '16:9', settings }) {
  const p = IMAGE_PROVIDERS.find((x) => x.id === provider) || IMAGE_PROVIDERS[0]
  const clean = cleanForGeneration(prompt)
  if (!clean) throw new Error('El prompt está vacío')
  return p.generate({ prompt: clean, aspectRatio, settings })
}
