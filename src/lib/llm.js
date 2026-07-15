// Transporte LLM: clientes Gemini/Pollinations/Ollama para el navegador,
// despacho por proveedor, timeouts y cancelación. El prompt-engineering vive
// en anthropic.js (acciones) — acá solo viaja texto.

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models'
const POLLINATIONS_TEXT_URL = 'https://text.pollinations.ai/openai'
const POLLINATIONS_MODELS_URL = 'https://text.pollinations.ai/models'
export const OLLAMA_DEFAULT_URL = 'http://localhost:11434'

export const GEMINI_MODELS = [
  { id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash (visión, recomendado)' },
  { id: 'gemini-2.5-flash-lite', label: 'Gemini 2.5 Flash Lite (más cupo diario)' },
]

// Key demo del free tier de Google (sin tarjeta asociada: el peor caso es
// agotar el cupo diario, nunca un costo). Solución temporal para compartir
// la app en modo demo; cualquiera puede usar su propia key de AI Studio.
export const DEMO_GEMINI_KEY = 'AQ.Ab8RN6Koghnv2v_DHaePLntghIwyT8owr0Jx2BA1JE85wUHYAA'

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

export async function withAbort(timeoutMs, run, netHint) {
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
    // "Failed to fetch" / TypeError = fallo de red antes de tocar el servidor
    // (proveedor caído, sin conexión, o CORS). El mensaje crudo no ayuda.
    if (e instanceof TypeError || /failed to fetch|networkerror|load failed/i.test(e.message || '')) {
      throw new Error(netHint || 'No se pudo conectar con el proveedor de IA (red, CORS o servicio caído). Revisá tu conexión y el proveedor en Ajustes.')
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

// ── Pollinations (text.pollinations.ai, formato OpenAI) ──
// Sin key: tier anónimo (hoy 1 modelo de texto, sin visión, cola de 1 por
// IP). Con key gratuita de enter.pollinations.ai: catálogo completo, incl.
// modelos con visión. El razonamiento viene en un campo aparte del content.
// Catálogo conocido como fallback: /models exige token Turnstile (anti-bot
// de Cloudflare) y suele fallar desde el navegador. El endpoint de chat sí
// tiene CORS abierto, así que los modelos se pueden usar igual.
export const POLLINATIONS_FALLBACK_MODELS = [
  { id: 'openai-fast', label: 'openai-fast — GPT-OSS 20B (texto, tier gratuito)', vision: false },
]

export async function listPollinationsModels(token) {
  try {
    const res = await fetch(POLLINATIONS_MODELS_URL, {
      headers: token ? { authorization: `Bearer ${token}` } : {},
    })
    if (!res.ok) throw new Error(`Pollinations ${res.status}`)
    const data = await res.json()
    const models = (Array.isArray(data) ? data : []).map((m) => ({
      id: m.name,
      label: `${m.name}${m.vision ? ' · visión' : ''} — ${(m.description || '').slice(0, 48)}`,
      vision: !!m.vision,
    }))
    return models.length ? models : POLLINATIONS_FALLBACK_MODELS
  } catch {
    return POLLINATIONS_FALLBACK_MODELS
  }
}

export async function callPollinations({ token, model, system, user, maxTokens = 2000, image, images }) {
  const imgs = images || (image ? [image] : null)
  const content = imgs
    ? [
        { type: 'text', text: user },
        ...imgs.map((im) => ({
          type: 'image_url',
          image_url: { url: `data:${im.mediaType};base64,${im.base64}` },
        })),
      ]
    : user
  return withAbort(180_000, async (signal) => {
    const res = await fetch(POLLINATIONS_TEXT_URL, {
      method: 'POST',
      signal,
      headers: {
        'content-type': 'application/json',
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        model: model || 'openai-fast',
        max_tokens: maxTokens + 1024,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content },
        ],
      }),
    })
    if (!res.ok) {
      const body = await res.text().catch(() => '')
      if (/turnstile/i.test(body)) {
        // El tier anónimo exige el anti-bot de Cloudflare, no disponible
        // para apps de terceros: desde el navegador hace falta key.
        throw new Error('Pollinations requiere una key para usarse desde apps web — creá una gratis en enter.pollinations.ai y pegala en Ajustes')
      }
      if (/queue full/i.test(body)) {
        throw new Error('Cola llena en Pollinations (1 pedido por vez en el tier gratuito) — esperá unos segundos y reintentá')
      }
      if (/model not found/i.test(body)) {
        throw new Error(`Pollinations no reconoce el modelo "${model}" — revisá el nombre en Ajustes`)
      }
      throw new Error(`Pollinations ${res.status}: ${body.slice(0, 300)}`)
    }
    const data = await res.json()
    const msg = data.choices?.[0]?.message || {}
    const text = stripThink(msg.content || '')
    if (!text) throw new Error('Pollinations no devolvió texto' + (msg.reasoning ? ' (solo razonamiento)' : ''))
    return text
  }, 'No se pudo conectar con Pollinations (red o servicio caído). Reintentá en unos segundos.')
}

export async function callOllama({ url, model, system, user, maxTokens = 2000, image, images }) {
  if (!model) throw new Error('NO_OLLAMA_MODEL')
  const base = (url || OLLAMA_DEFAULT_URL).replace(/\/$/, '')
  const userMsg = { role: 'user', content: user }
  const imgs = images || (image ? [image] : null)
  if (imgs) userMsg.images = imgs.map((im) => im.base64)
  // Local y sin streaming: los modelos grandes con imágenes tardan minutos.
  return withAbort(600_000, async (signal) => {
    const doCall = async (numPredict) => {
      const res = await fetch(`${base}/api/chat`, {
        method: 'POST',
        signal,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          model,
          stream: false,
          // Sin razonamiento: los modelos pensantes (gemma, qwen…) gastaban
          // el presupuesto pensando y truncaban la salida a mitad de frase.
          // Los modelos sin thinking ignoran el parámetro (verificado).
          think: false,
          messages: [
            { role: 'system', content: system },
            userMsg,
          ],
          options: { num_predict: numPredict, temperature: 0.7 },
        }),
      })
      if (!res.ok) {
        const body = await res.text().catch(() => '')
        throw new Error(`Ollama ${res.status}: ${body.slice(0, 300)}`)
      }
      return res.json()
    }
    let data = await doCall(maxTokens + 1024)
    // Cinturón y tiradores: si igual se truncó (done_reason "length"),
    // un único reintento con presupuesto mucho mayor.
    if (data.done_reason === 'length') {
      data = await doCall(maxTokens + 8192)
    }
    const content = stripThink(data.message?.content || '')
    if (!content && data.message?.thinking) {
      throw new Error('El modelo agotó la respuesta razonando — probá de nuevo o usá un modelo sin razonamiento')
    }
    return content
  }, `No se pudo conectar con Ollama en ${base}. Verificá que esté corriendo (ollama serve) y que el origen esté permitido — o cambiá a Demo (Gemini) en Ajustes.`)
}

export async function callGemini({ apiKey, model, system, user, maxTokens = 2000, image, images }) {
  const key = apiKey || DEMO_GEMINI_KEY
  const m = model || 'gemini-2.5-flash'
  const imgs = images || (image ? [image] : null)
  const parts = [
    ...(imgs || []).map((im) => ({
      inline_data: { mime_type: im.mediaType, data: im.base64 },
    })),
    { text: user },
  ]
  return withAbort(180_000, async (signal) => {
    const attempt = () =>
      fetch(`${GEMINI_URL}/${m}:generateContent?key=${encodeURIComponent(key)}`, {
        method: 'POST',
        signal,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: system }] },
          contents: [{ role: 'user', parts }],
          generationConfig: {
            maxOutputTokens: maxTokens + 1024,
            temperature: 0.7,
            // Gemini 2.5 razona por defecto y el thinking consume el
            // presupuesto de salida (verificado: truncaba). Se apaga.
            thinkingConfig: { thinkingBudget: 0 },
          },
        }),
      })
    let res = await attempt()
    if (res.status === 429) {
      // El free tier limita por MINUTO además de por día. Google indica
      // cuánto esperar (retryDelay): si es corto, se espera y reintenta
      // solo una vez — clave con la key demo compartida entre varios.
      const body = await res.text().catch(() => '')
      const delay = parseInt(body.match(/retryDelay[^\d]*(\d+)/)?.[1] || '0', 10)
      if (delay > 0 && delay <= 35) {
        await new Promise((r, rej) => {
          const t = setTimeout(r, (delay + 1) * 1000)
          signal.addEventListener('abort', () => { clearTimeout(t); rej(new Error('Cancelado')) }, { once: true })
        })
        res = await attempt()
      }
    }
    if (!res.ok) {
      if (res.status === 429) {
        throw new Error('Cupo del modo demo saturado (límite por minuto o diario del free tier) — esperá un minuto y reintentá; si persiste, pegá tu propia key gratis de AI Studio en Ajustes, o usá Ollama/Claude')
      }
      const body = await res.text().catch(() => '')
      throw new Error(`Gemini ${res.status}: ${body.slice(0, 300)}`)
    }
    const data = await res.json()
    const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('') || ''
    if (!text) {
      const reason = data.candidates?.[0]?.finishReason || data.promptFeedback?.blockReason || 'sin contenido'
      throw new Error(`Gemini no devolvió texto (${reason})`)
    }
    return text
  }, 'No se pudo conectar con Gemini (red o CORS). Revisá tu conexión — si el problema sigue, probá con tu propia key en Ajustes.')
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
  if (settings.provider === 'pollinations') {
    // Guard de visión: el modelo elegido no ve imágenes → error claro antes
    // de gastar el request (el DNA Lab manda imágenes siempre).
    if ((image || images?.length) && settings.pollinationsVision === false) {
      return Promise.reject(new Error('El modelo de Pollinations elegido no tiene visión — elegí uno con "visión" en Ajustes (requiere key de enter.pollinations.ai) o usá el modo Demo (Gemini)'))
    }
    return callPollinations({
      token: settings.pollinationsToken, model: settings.pollinationsModel, system, user, maxTokens, image, images,
    })
  }
  // Default: Gemini (modo demo con key gratuita embebida, o la del usuario).
  return callGemini({
    apiKey: settings.geminiKey, model: settings.geminiModel, system, user, maxTokens, image, images,
  })
}

// ¿Está el proveedor listo para usarse?
export function isReady(settings) {
  if (settings.provider === 'ollama') return !!settings.ollamaModel
  if (settings.provider === 'pollinations') return !!settings.pollinationsToken
  return true // gemini: la key demo siempre está disponible
}

export function providerHint(settings) {
  if (settings.provider === 'ollama') return 'Elegí un modelo de Ollama en Ajustes'
  if (settings.provider === 'pollinations') return 'Pegá tu key gratuita de enter.pollinations.ai en Ajustes'
  return 'El proveedor debería funcionar — revisá Ajustes'
}
