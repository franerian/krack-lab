// Proxy de generación de imágenes (Vercel serverless).
// Pollinations bloquea fetch() de navegador (Turnstile), pero server-side
// funciona — y este mismo endpoint es donde luego se enchufan proveedores
// con key privada (fal.ai, etc.) sin exponerla al cliente.
export default async function handler(req, res) {
  res.setHeader('access-control-allow-origin', '*')
  const { prompt = '', width = '1280', height = '720', seed = '' } = req.query
  if (!prompt.trim()) return res.status(400).json({ error: 'prompt requerido' })

  const w = Math.min(2048, parseInt(width, 10) || 1280)
  const h = Math.min(2048, parseInt(height, 10) || 720)
  const url =
    `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt.slice(0, 4000))}` +
    `?width=${w}&height=${h}&nologo=true${seed ? `&seed=${encodeURIComponent(seed)}` : ''}`

  try {
    const r = await fetch(url)
    if (!r.ok) {
      const body = await r.text().catch(() => '')
      return res.status(r.status).json({ error: `Pollinations ${r.status}: ${body.slice(0, 150)}` })
    }
    const buf = Buffer.from(await r.arrayBuffer())
    res.setHeader('content-type', r.headers.get('content-type') || 'image/jpeg')
    res.setHeader('cache-control', 'no-store')
    return res.status(200).send(buf)
  } catch (e) {
    return res.status(502).json({ error: 'proxy: ' + e.message })
  }
}
