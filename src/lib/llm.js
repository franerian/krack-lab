// Transporte LLM: clientes Gemini/Pollinations/Fireworks/Ollama para el
// navegador, despacho por proveedor, timeouts y cancelación. El prompt-
// engineering vive en anthropic.js (acciones) — acá solo viaja texto.

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models'
// API nueva (gen.pollinations.ai, docs en github.com/pollinations/pollinations/
// blob/main/APIDOCS.md) — OpenAI-compatible de verdad, requiere key propia
// (sk_/pk_ de enter.pollinations.ai). El endpoint legacy (text.pollinations.ai)
// exige un desafío Turnstile que bloquea las apps web incluso con key.
const POLLINATIONS_CHAT_URL = 'https://gen.pollinations.ai/v1/chat/completions'
const POLLINATIONS_MODELS_URL = 'https://gen.pollinations.ai/v1/models'
// Fireworks también OpenAI-compat, Bearer con key fw_. Los slugs usan "p"
// en lugar de "." (ej. kimi-k2p7-code, no kimi-k2.7-code — verificado).
const FIREWORKS_CHAT_URL = 'https://api.fireworks.ai/inference/v1/chat/completions'
export const OLLAMA_DEFAULT_URL = 'http://localhost:11434'

export const GEMINI_MODELS = [
  { id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash (visión, recomendado)' },
  { id: 'gemini-2.5-flash-lite', label: 'Gemini 2.5 Flash Lite (más cupo diario)' },
]

// Catálogo curado de Fireworks. Los slugs son "accounts/fireworks/models/<id>";
// acá guardamos solo el <id> (el prefijo se agrega en el request).
// Verificado 2026-07-15 con la key de Fran:
//   - Kimi K2.7 Code (kimi-k2p7-code) responde correctamente con visión
//   - MiniMax M3 (minimax-m3) tiene visión declarada pero identifica MAL
//     los colores en pruebas básicas — recomendado SOLO para texto.
// Modelos de Fireworks que razonan TANTO en el content (no en reasoning_content
// separado) que rompen tareas de output puro: gastan miles de tokens
// planificando y contando palabras antes (o en lugar) de emitir el resultado.
// Verificado con Kimi K2.7 Code: 1720 palabras de razonamiento inline, cortado.
export const FIREWORKS_HEAVY_REASONERS = ['kimi-k2p7-code', 'kimi-k2p6', 'deepseek-v4-pro']

// Selecciona un modelo "directo" (razona en reasoning_content separado, no
// en el content) para tareas que necesitan output puro. Solo transforma
// settings cuando el actual es un razonador pesado conocido y existe una
// alternativa buena en el mismo proveedor.
// `needsVision` decide el fallback: sin visión → MiniMax M3 (barato, texto);
// con visión → Qwen3.7 Plus (visión funcional, razonamiento aparte).
// Devuelve { settings, override }; override sirve para mostrar el cambio al usuario.
export function pickDirectModel(settings, { needsVision = false } = {}) {
  if (settings.provider === 'fireworks' && FIREWORKS_HEAVY_REASONERS.includes(settings.fireworksModel)) {
    if (needsVision) {
      // Qwen3.7 Plus: visión OK, razonamiento en reasoning_content separado.
      return {
        settings: { ...settings, fireworksModel: 'qwen3p7-plus', fireworksVision: true },
        override: `${settings.fireworksModel} razona en voz alta — se usa Qwen3.7 Plus (visión OK, sin ruido)`,
      }
    }
    return {
      settings: { ...settings, fireworksModel: 'minimax-m3', fireworksVision: false },
      override: `${settings.fireworksModel} razona demasiado — se usa MiniMax M3`,
    }
  }
  return { settings, override: null }
}

export const FIREWORKS_MODELS = [
  { id: 'kimi-k2p7-code', label: 'Kimi K2.7 Code · visión — recomendado ($4/M out)', vision: true },
  { id: 'minimax-m3', label: 'MiniMax M3 · SOLO TEXTO — visión falla ($1.20/M out)', vision: false },
  { id: 'qwen3p7-plus', label: 'Qwen3.7 Plus · visión ($1.60/M out)', vision: true },
  { id: 'kimi-k2p6', label: 'Kimi K2.6 · visión ($4/M out)', vision: true },
  { id: 'glm-5p2', label: 'GLM 5.2 · texto', vision: false },
  { id: 'deepseek-v4-pro', label: 'DeepSeek V4 Pro · texto', vision: false },
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
// Modelos recomendados (con visión) para preferir en el selector; el resto
// del catálogo (126+ modelos) se agrega debajo, en el orden que devuelve la API.
const POLLINATIONS_PREFERRED = ['openai', 'openai-large', 'gemini', 'grok', 'mistral-large', 'qwen-vision']

export const POLLINATIONS_FALLBACK_MODELS = [
  { id: 'openai', label: 'openai · visión — GPT (recomendado)', vision: true },
]

export async function listPollinationsModels(token) {
  if (!token) return POLLINATIONS_FALLBACK_MODELS
  try {
    const res = await fetch(POLLINATIONS_MODELS_URL, {
      headers: { authorization: `Bearer ${token}` },
    })
    if (!res.ok) throw new Error(`Pollinations ${res.status}`)
    const data = await res.json()
    const list = Array.isArray(data) ? data : (data.data || [])
    const models = list.map((m) => ({
      id: m.id || m.name,
      label: `${m.id || m.name}${(m.input_modalities || []).includes('image') ? ' · visión' : ''}`,
      vision: (m.input_modalities || []).includes('image'),
    }))
    models.sort((a, b) => {
      const ia = POLLINATIONS_PREFERRED.indexOf(a.id)
      const ib = POLLINATIONS_PREFERRED.indexOf(b.id)
      if (ia === -1 && ib === -1) return 0
      if (ia === -1) return 1
      if (ib === -1) return -1
      return ia - ib
    })
    return models.length ? models : POLLINATIONS_FALLBACK_MODELS
  } catch {
    return POLLINATIONS_FALLBACK_MODELS
  }
}

export async function callPollinations({ token, model, system, user, maxTokens = 2000, image, images }) {
  if (!token) throw new Error('NO_POLLINATIONS_KEY')
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
    const doCall = async (tokenBudget) => {
      const res = await fetch(POLLINATIONS_CHAT_URL, {
        method: 'POST',
        signal,
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          model: model || 'openai',
          max_tokens: tokenBudget,
          messages: [
            { role: 'system', content: system },
            { role: 'user', content },
          ],
        }),
      })
      if (!res.ok) {
        const body = await res.text().catch(() => '')
        if (/turnstile/i.test(body)) {
          throw new Error('Pollinations rechazó la key — revisá que sea válida en enter.pollinations.ai')
        }
        if (res.status === 401 || res.status === 403) {
          throw new Error('Key de Pollinations inválida o sin permiso para este modelo — revisá Ajustes')
        }
        if (res.status === 429) {
          throw new Error('Límite de Pollinations alcanzado — esperá un momento y reintentá')
        }
        if (/model not found|unknown model/i.test(body)) {
          throw new Error(`Pollinations no reconoce el modelo "${model}" — revisá el nombre en Ajustes`)
        }
        throw new Error(`Pollinations ${res.status}: ${body.slice(0, 300)}`)
      }
      return res.json()
    }
    let data = await doCall(maxTokens + 1024)
    // Modelos razonadores (gpt-5-nano y similares) gastan el presupuesto
    // pensando y devuelven contenido vacío con finish_reason "length"
    // (verificado: reasoning_tokens > 0, content ""). Reintento con más margen.
    let choice = data.choices?.[0]
    if (choice?.finish_reason === 'length' && !choice.message?.content) {
      data = await doCall(maxTokens + 8192)
      choice = data.choices?.[0]
    }
    const text = stripThink(choice?.message?.content || '')
    if (!text) throw new Error('Pollinations no devolvió texto (el modelo agotó la respuesta razonando) — probá de nuevo o elegí otro modelo')
    return text
  }, 'No se pudo conectar con Pollinations (red o servicio caído). Reintentá en unos segundos.')
}

// ── Fireworks (api.fireworks.ai, formato OpenAI) ──
// Requiere key fw_ del usuario (créditos pagos). Los slugs Fireworks usan "p"
// donde el catálogo web muestra "." (kimi-k2p7-code = "Kimi K2.7 Code").
// Los modelos razonadores (Kimi, MiniMax, DeepSeek…) devuelven el pensamiento
// en `message.reasoning_content` separado del `content` — se descarta y solo
// se lee el content final. Si finish_reason es "length" y content está vacío,
// se reintenta con más margen (mismo patrón que Pollinations/Gemini/Ollama).
export async function callFireworks({ token, model, system, user, maxTokens = 2000, image, images, responseSchema }) {
  if (!token) throw new Error('NO_FIREWORKS_KEY')
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
  const slug = `accounts/fireworks/models/${model || 'kimi-k2p7-code'}`
  return withAbort(180_000, async (signal) => {
    const doCall = async (tokenBudget) => {
      const res = await fetch(FIREWORKS_CHAT_URL, {
        method: 'POST',
        signal,
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          model: slug,
          max_tokens: tokenBudget,
          temperature: 0.7,
          messages: [
            { role: 'system', content: system },
            { role: 'user', content },
          ],
          // Structured Outputs: fuerza al modelo a devolver JSON válido con
          // este schema. Elimina que Kimi/DeepSeek razonen en voz alta en el
          // content — el reasoning sigue en reasoning_content aparte.
          ...(responseSchema ? {
            response_format: {
              type: 'json_schema',
              json_schema: { name: 'krack_sections', schema: responseSchema },
            },
          } : {}),
        }),
      })
      if (!res.ok) {
        const body = await res.text().catch(() => '')
        if (res.status === 401 || res.status === 403) {
          throw new Error('Key de Fireworks inválida o sin permiso — revisá Ajustes')
        }
        if (res.status === 402) {
          throw new Error('Fireworks: sin créditos — recargá en fireworks.ai o cambiá de proveedor en Ajustes')
        }
        if (res.status === 429) {
          throw new Error('Límite de Fireworks alcanzado — esperá un momento y reintentá')
        }
        if (res.status === 404 || /model not found|not deployed/i.test(body)) {
          throw new Error(`Fireworks no reconoce el modelo "${model}" — usá slugs con "p" en vez de "." (ej. kimi-k2p7-code)`)
        }
        throw new Error(`Fireworks ${res.status}: ${body.slice(0, 300)}`)
      }
      return res.json()
    }
    let data = await doCall(maxTokens + 1024)
    let choice = data.choices?.[0]
    // Razonadores agotan el presupuesto pensando (reasoning_content va aparte).
    if (choice?.finish_reason === 'length' && !choice.message?.content) {
      data = await doCall(maxTokens + 8192)
      choice = data.choices?.[0]
    }
    const text = stripThink(choice?.message?.content || '')
    if (!text) throw new Error('Fireworks no devolvió texto (el modelo agotó la respuesta razonando) — probá con otro modelo del catálogo')
    return text
  }, 'No se pudo conectar con Fireworks (red o servicio caído). Reintentá en unos segundos.')
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
export function callLLM(settings, { system, user, maxTokens, image, images, responseSchema }) {
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
  if (settings.provider === 'fireworks') {
    // Mismo guard: MiniMax M3 declara visión pero identifica MAL los colores
    // (verificado con imagen roja pura → dijo "Black"). Solo se bloquea si
    // el modelo está marcado explícitamente como vision:false en el catálogo.
    if ((image || images?.length) && settings.fireworksVision === false) {
      return Promise.reject(new Error('Este modelo de Fireworks no tiene visión funcional — elegí Kimi K2.7 Code u otro con visión en Ajustes'))
    }
    return callFireworks({
      token: settings.fireworksToken, model: settings.fireworksModel, system, user, maxTokens, image, images, responseSchema,
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
  if (settings.provider === 'fireworks') return !!settings.fireworksToken
  return true // gemini: la key demo siempre está disponible
}

export function providerHint(settings) {
  if (settings.provider === 'ollama') return 'Elegí un modelo de Ollama en Ajustes'
  if (settings.provider === 'pollinations') return 'Pegá tu key gratuita de enter.pollinations.ai en Ajustes'
  if (settings.provider === 'fireworks') return 'Pegá tu key fw_ de fireworks.ai en Ajustes'
  return 'El proveedor debería funcionar — revisá Ajustes'
}
