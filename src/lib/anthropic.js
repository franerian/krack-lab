// Clientes de IA para uso directo desde el navegador: Anthropic (API key del
// usuario, solo en localStorage) u Ollama local (gratis, sin clave).

const API_URL = 'https://api.anthropic.com/v1/messages'
export const OLLAMA_DEFAULT_URL = 'http://localhost:11434'

export const MODELS = [
  { id: 'claude-sonnet-5', label: 'Claude Sonnet 5 (recomendado)' },
  { id: 'claude-haiku-4-5-20251001', label: 'Claude Haiku 4.5 (rápido y barato)' },
  { id: 'claude-opus-4-8', label: 'Claude Opus 4.8 (máxima calidad)' },
]

export async function callClaude({ apiKey, model, system, user, maxTokens = 2000, image }) {
  if (!apiKey) throw new Error('NO_API_KEY')
  const content = image
    ? [
        { type: 'image', source: { type: 'base64', media_type: image.mediaType, data: image.base64 } },
        { type: 'text', text: user },
      ]
    : user
  const res = await fetch(API_URL, {
    method: 'POST',
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
}

export async function callOllama({ url, model, system, user, maxTokens = 2000, image }) {
  if (!model) throw new Error('NO_OLLAMA_MODEL')
  const base = (url || OLLAMA_DEFAULT_URL).replace(/\/$/, '')
  const userMsg = { role: 'user', content: user }
  if (image) userMsg.images = [image.base64]
  const res = await fetch(`${base}/api/chat`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      model,
      stream: false,
      messages: [
        { role: 'system', content: system },
        userMsg,
      ],
      options: { num_predict: maxTokens, temperature: 0.7 },
    }),
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Ollama ${res.status}: ${body.slice(0, 300)}`)
  }
  const data = await res.json()
  return data.message?.content || ''
}

export async function listOllamaModels(url) {
  const base = (url || OLLAMA_DEFAULT_URL).replace(/\/$/, '')
  const res = await fetch(`${base}/api/tags`)
  if (!res.ok) throw new Error(`Ollama ${res.status}`)
  const data = await res.json()
  return (data.models || []).map((m) => m.name)
}

// Despachador según el proveedor elegido en Ajustes.
export function callLLM(settings, { system, user, maxTokens, image }) {
  if (settings.provider === 'ollama') {
    return callOllama({
      url: settings.ollamaUrl, model: settings.ollamaModel, system, user, maxTokens, image,
    })
  }
  return callClaude({
    apiKey: settings.apiKey, model: settings.model, system, user, maxTokens, image,
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

// ── Formato compartido de prompt estructurado ──
export function sectionsToText(sections) {
  return sections
    .filter((s) => s.text.trim())
    .map((s) => `# ${s.name}\n${s.text.trim()}`)
    .join('\n\n')
}

export function textToSections(text) {
  const out = []
  const re = /^#\s*([^\n]+)\n([\s\S]*?)(?=^#\s|\s*$(?![\s\S]))/gm
  let m
  while ((m = re.exec(text)) !== null) {
    out.push({ name: m[1].trim(), text: m[2].trim() })
  }
  return out
}

const SYSTEM_BASE = `You are a prompt engineering assistant inside KRACK, a tool for filmmakers and visual artists writing prompts for AI image/video generators (Midjourney, Sora, Kling, Luma, Krea...).

Prompts are structured in sections with this exact format:

# Subject
...text...

# Lighting
...text...

Valid section names: Subject, Composition, Style, Lighting, Camera, Mood, Action, Environment, Color, Details, Negative.

RULES:
- ALWAYS reply with ONLY the structured prompt in that format. No preamble, no explanations, no markdown fences.
- Write section content in English (the language image models understand best), even if the user writes in Spanish.
- Keep the filmmaker's intent intact. Be concrete and visual: light, lens, texture, emotion.
- Never invent a Negative section unless the input already has one.`

const ACTIONS = {
  beautify: {
    label: 'Beautify',
    instruction: (text) => `Restructure the following raw prompt into clean sections. Distribute existing ideas into the right sections (Subject, Style, Lighting, Camera, Mood, plus Composition/Action/Environment/Color/Details only if clearly present). Do NOT add new creative content — only organize, deduplicate and polish the wording.\n\nRAW PROMPT:\n${text}`,
  },
  format: {
    label: 'Format',
    instruction: (text) => `Polish the wording of this structured prompt: fix grammar, unify tense and tone, remove redundancy. Keep the same sections and the same creative content.\n\n${text}`,
  },
  shorten: {
    label: 'Shorten',
    instruction: (text) => `Compress this prompt to roughly half its length. Keep every section that exists, keep the strongest and most visually specific words, cut filler.\n\n${text}`,
  },
  expand: {
    label: 'Expand',
    instruction: (text) => `Enrich this prompt with more visual specificity: concrete textures, precise light behavior, lens/camera detail, atmosphere. Stay faithful to the vision — deepen it, don't change it. Max 2-3 sentences per section.\n\n${text}`,
  },
  simplify: {
    label: 'Simplify',
    instruction: (text) => `Rewrite this prompt in simpler, clearer language. One or two plain sentences per section. Remove jargon while keeping the visual intent.\n\n${text}`,
  },
  shot: {
    label: 'Shot',
    instruction: (text) => `Rewrite ONLY the Camera section proposing a different, more interesting shot type for this scene (change framing/shot size). Keep every other section exactly as is.\n\n${text}`,
  },
  angle: {
    label: 'Angle',
    instruction: (text) => `Rewrite ONLY the Camera section proposing a different camera ANGLE (low/high/dutch/overhead/POV...) that amplifies the scene's emotion. Keep every other section exactly as is.\n\n${text}`,
  },
}

export const ACTION_LIST = Object.entries(ACTIONS).map(([id, a]) => ({ id, label: a.label }))

export async function runAction({ settings, actionId, sections }) {
  const text = sectionsToText(sections)
  if (!text.trim()) throw new Error('EMPTY_PROMPT')
  const out = await callLLM(settings, {
    system: SYSTEM_BASE,
    user: ACTIONS[actionId].instruction(text),
  })
  const parsed = textToSections(out)
  if (!parsed.length) throw new Error('PARSE_ERROR')
  return parsed
}

export async function runSmartEdit({ settings, instruction, sections }) {
  const text = sectionsToText(sections)
  const out = await callLLM(settings, {
    system: SYSTEM_BASE,
    user: `Apply this instruction to the structured prompt below. Change only what the instruction requires; keep everything else intact.\n\nINSTRUCTION: ${instruction}\n\nPROMPT:\n${text || '(empty — create a new prompt from the instruction)'}`,
  })
  const parsed = textToSections(out)
  if (!parsed.length) throw new Error('PARSE_ERROR')
  return parsed
}

export async function fillCharacter({ settings, description, fieldIds, image }) {
  const out = await callLLM(settings, {
    system: `You fill character sheets for a filmmaking prompt tool. Reply ONLY with a valid JSON object, no fences, whose keys are exactly: ${fieldIds.join(', ')}. Values are short English phrases (comma-separated descriptors, like "silver-gray, short, tousled"). ${image ? 'Describe the PERSON in the provided image with forensic precision: exact hair color/cut/texture, facial structure, skin, wardrobe fabrics and fit, expression, gaze, and the surrounding light. What you cannot see, infer coherently.' : 'Invent coherent, specific, cinematic details.'}`,
    user: image
      ? `Fill the character sheet from this reference image.${description ? ` Extra notes: ${description}` : ''}`
      : `Character description: ${description}`,
    maxTokens: 1000,
    image,
  })
  const jsonMatch = out.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('PARSE_ERROR')
  return JSON.parse(jsonMatch[0])
}

// ── Style DNA Lab: deconstrucción visual de una imagen de referencia ──
const DNA_SYSTEM = (mode) => `You are a visual deconstruction engine and a master prompt engineer. You receive ONE reference image. Your function is to extract its governing "Style DNA" and output a replication recipe that is 100% faithful and internally consistent.

PRIMARY DIRECTIVE — STYLISTIC HEGEMONY (THE STYLE IS THE LAW):
Silently identify, before writing anything:
1. VISUAL MEDIUM — what this actually is: 35mm film photography, digital photo, brutalist 2D animation, digital collage, 3D render, watercolor, cel animation, risograph print, CGI, etc. Be precise, never generic.
2. EXECUTION RULES — the hard constraints that define the look: e.g. "flat-color fills, no gradients, no fine textures, heavy angular outlines" or "soft halation, visible film grain, gentle highlight rolloff". These rules are LAW.
3. ERA / IP ADJACENCY — decade, movement, or adjacent style if clearly present (e.g. "1970s Kodachrome documentary", "Ghibli-adjacent", "Swiss poster design").

Every clause you write MUST obey that DNA. You are FORBIDDEN from naming any texture, gradient, pattern or material that violates the execution rules. Zero logical contradictions (never "flat-color" and "gradient" in the same output). Each clause is one atomic concept. Lead the Style section with the governing DNA.

${mode === 'style'
  ? `MODE: STYLE ONLY. Describe ONLY the aesthetic treatment so it can be transferred to a completely different scene. You are FORBIDDEN from describing the subject, characters, objects or specific content of the image. No # Subject section.`
  : `MODE: FULL REPLICA. Also reconstruct the scene: include # Subject (and # Action / # Environment if relevant), each described through the lens of the Style DNA.`}

MANDATORY: the # Camera section MUST state the precise shot type AND camera angle (e.g. "extreme low-angle wide shot"), plus lens character if readable.

OUTPUT FORMAT — your entire response is EXACTLY this structure and nothing else (no preamble, no notes, no fences), in English:

${mode === 'replica' ? '# Subject\n(scene content, filtered through the DNA)\n\n' : ''}# Style
(governing DNA first: medium, execution rules, era/adjacency)

# Composition
(framing logic, balance, negative space, depth layers)

# Camera
(precise shot type + angle, lens character, focus behavior)

# Lighting
(sources, direction, hardness, contrast behavior)

# Color
(exact palette, grade, saturation and contrast rules)

# Mood
(emotional register the treatment produces)

# Negative
avoid: (elements that would break this DNA)`

export async function analyzeImageStyle({ settings, image, mode = 'style' }) {
  const out = await callLLM(settings, {
    system: DNA_SYSTEM(mode),
    user: mode === 'style'
      ? 'Extract the Style DNA of this image. Style only — the content will be replaced by other scenes.'
      : 'Deconstruct this image into a full replication prompt, Style DNA first.',
    maxTokens: 1600,
    image,
  })
  const parsed = textToSections(out)
  if (!parsed.length) throw new Error('PARSE_ERROR')
  const banned = mode === 'style' ? ['Subject', 'Action', 'Environment'] : []
  return parsed.filter((s) => !banned.includes(s.name))
}

export async function generateCoverage({ settings, coverage, sections }) {
  const base = sectionsToText(sections)
  const shotList = coverage.shots.map((s, i) => `${i + 1}. [${s.label}] ${s.instruction}`).join('\n')
  const out = await callLLM(settings, {
    maxTokens: 4000,
    system: SYSTEM_BASE + `\n\nYou are generating STORYBOARD COVERAGE: multiple shots of the SAME scene. Reply with the shots separated by a line containing only "===". Each shot is a full structured prompt (at minimum Subject, Camera, Lighting, Mood). The scene content stays consistent across shots; only the cinematography changes per the shot instruction.`,
    user: `BASE SCENE:\n${base}\n\nGenerate these ${coverage.shots.length} shots:\n${shotList}`,
  })
  return out.split(/^===\s*$/m).map((chunk) => chunk.trim()).filter(Boolean)
}

// Fallback sin API: fusiona la instrucción del plano con la escena base.
export function offlineCoverage(coverage, sections) {
  const others = sections.filter((s) => s.name !== 'Camera' && s.text.trim())
  return coverage.shots.map((shot) => {
    const merged = [
      ...others.map((s) => `# ${s.name}\n${s.text.trim()}`),
      `# Camera\n${shot.instruction}`,
    ]
    return merged.join('\n\n')
  })
}
