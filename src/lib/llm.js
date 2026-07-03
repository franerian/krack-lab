// Transporte LLM: clientes Anthropic/Ollama para el navegador, despacho por
// proveedor, timeouts y cancelación. El prompt-engineering vive en
// anthropic.js (acciones) — acá solo viaja texto.

const API_URL = 'https://api.anthropic.com/v1/messages'
export const OLLAMA_DEFAULT_URL = 'http://localhost:11434'

export const MODELS = [
  { id: 'claude-sonnet-5', label: 'Claude Sonnet 5 (recomendado)' },
  { id: 'claude-haiku-4-5-20251001', label: 'Claude Haiku 4.5 (rápido y barato)' },
  { id: 'claude-opus-4-8', label: 'Claude Opus 4.8 (máxima calidad)' },
]

// ── Cancelación y timeouts ──
// Registro de llamadas en vuelo: "Cancelar" en la UI aborta todas.
const active = new Set()

export function cancelActive() {
  for (const ctrl of active) ctrl.abort('user-cancel')
  active.clear()
}

export function hasActive() {
  return active.size > 0
}

async function withAbort(timeoutMs, run) {
  const ctrl = new AbortController()
  active.add(ctrl)
  const timer = setTimeout(() => ctrl.abort('timeout'), timeoutMs)
  try {
    return await run(ctrl.signal)
  } catch (e) {
    if (ctrl.signal.aborted) {
      throw new Error(
        ctrl.signal.reason === 'timeout'
          ? 'TIMEOUT — el modelo no respondió a tiempo'
          : 'Cancelado'
      )
    }
    throw e
  } finally {
    clearTimeout(timer)
    active.delete(ctrl)
  }
}

// Algunos modelos (gemma, qwen, deepseek…) razonan antes de responder.
// Si el razonamiento viene inline, se descarta; si se comió todo el
// presupuesto y no hay respuesta, error claro en vez de PARSE_ERROR.
const stripThink = (t) => t.replace(/<think>[\s\S]*?<\/think>/gi, '').trim()

export async function callClaude({ apiKey, model, system, user, maxTokens = 2000, image, images }) {
  if (!apiKey) throw new Error('NO_API_KEY')
  const imgs = images || (image ? [image] : null)
  const content = imgs
    ? [
        ...imgs.map((im) => ({
          type: 'image',
          source: { type: 'base64', media_type: im.mediaType, data: im.base64 },
        })),
        { type: 'text', text: user },
      ]
    : user
  return withAbort(180_000, async (signal) => {
    const res = await fetch(API_URL, {
      method: 'POST',
      signal,
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: model || 'claude-sonnet-5',
        max_tokens: maxTokens,
        system,
        messages: [{ role: 'user', content }],
      }),
    })
    if (!res.ok) {
      const body = await res.text().catch(() => '')
      throw new Error(`API ${res.status}: ${body.slice(0, 300)}`)
    }
    const data = await res.json()
    return data.content?.map((b) => b.text || '').join('') || ''
  })
}

export async function callOllama({ url, model, system, user, maxTokens = 2000, image, images }) {
  if (!model) throw new Error('NO_OLLAMA_MODEL')
  const base = (url || OLLAMA_DEFAULT_URL).replace(/\/$/, '')
  const userMsg = { role: 'user', content: user }
  const imgs = images || (image ? [image] : null)
  if (imgs) userMsg.images = imgs.map((im) => im.base64)
  // Local y sin streaming: los modelos grandes con imágenes tardan minutos.
  return withAbort(600_000, async (signal) => {
    const res = await fetch(`${base}/api/chat`, {
      method: 'POST',
      signal,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        model,
        stream: false,
        messages: [
          { role: 'system', content: system },
          userMsg,
        ],
        // Margen extra sobre maxTokens: los modelos razonadores (gemma,
        // qwen…) gastan presupuesto pensando antes de responder y truncaban
        // la salida a mitad de frase. num_predict es tope, no objetivo.
        options: { num_predict: maxTokens + 2048, temperature: 0.7 },
      }),
    })
    if (!res.ok) {
      const body = await res.text().catch(() => '')
      throw new Error(`Ollama ${res.status}: ${body.slice(0, 300)}`)
    }
    const data = await res.json()
    const content = stripThink(data.message?.content || '')
    if (!content && data.message?.thinking) {
      throw new Error('El modelo agotó la respuesta razonando — probá de nuevo o usá un modelo sin razonamiento')
    }
    return content
  })
}

export async function listOllamaModels(url) {
  const base = (url || OLLAMA_DEFAULT_URL).replace(/\/$/, '')
  const res = await fetch(`${base}/api/tags`)
  if (!res.ok) throw new Error(`Ollama ${res.status}`)
  const data = await res.json()
  return (data.models || []).map((m) => m.name)
}

// Despachador según el proveedor elegido en Ajustes.
export function callLLM(settings, { system, user, maxTokens, image, images }) {
  if (settings.provider === 'ollama') {
    return callOllama({
      url: settings.ollamaUrl, model: settings.ollamaModel, system, user, maxTokens, image, images,
    })
  }
  return callClaude({
    apiKey: settings.apiKey, model: settings.model, system, user, maxTokens, image, images,
  })
}

// ¿Está el proveedor listo para usarse?
export function isReady(settings) {
  if (settings.provider === 'ollama') return !!settings.ollamaModel
  return !!settings.apiKey
}

export function providerHint(settings) {
  return settings.provider === 'ollama'
    ? 'Elegí un modelo de Ollama en Ajustes'
    : 'Configurá tu API key (o elegí Ollama local) en Ajustes'
}
