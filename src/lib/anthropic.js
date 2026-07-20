// Prompt-engineering de KRACK: acciones del editor, Character Studio,
// coberturas y Style DNA Lab. El transporte (clientes, timeouts,
// cancelación) vive en llm.js; este archivo re-exporta lo usado por la UI.

import { callLLM, pickDirectModel } from './llm.js'

export {
  GEMINI_MODELS, FIREWORKS_MODELS, OLLAMA_DEFAULT_URL, DEMO_GEMINI_KEY,
  callOllama, callGemini, callPollinations, callFireworks, callLLM,
  listOllamaModels, listPollinationsModels, pickDirectModel,
  isReady, providerHint, cancelActive, hasActive,
} from './llm.js'

// ── Formato compartido de prompt estructurado ──
export function sectionsToText(sections) {
  return sections
    .filter((s) => s.text.trim())
    .map((s) => `# ${s.name}\n${s.text.trim()}`)
    .join('\n\n')
}

export function textToSections(text) {
  // Normaliza las derivas de formato típicas de modelos chicos antes de
  // parsear: fences de markdown, "## Style", "**Style**", "# Style:".
  const normalized = text
    .replace(/```[a-z]*\n?/gi, '')
    .replace(/^\s*\*{1,2}#?\s*([A-Za-z][A-Za-z /&]{1,24})\*{1,2}\s*:?\s*$/gm, '# $1')
    .replace(/^#{2,6}\s*/gm, '# ')
    .replace(/^(#\s*[^\n:]+):\s*$/gm, '$1')
  const out = []
  const re = /^#\s*([^\n]+)\n([\s\S]*?)(?=^#\s|\s*$(?![\s\S]))/gm
  let m
  while ((m = re.exec(normalized)) !== null) {
    const name = m[1].trim()
    const body = m[2].trim()
    if (name && body) out.push({ name, text: body })
  }
  return out
}

// Una llamada que DEBE devolver secciones parseables: si el modelo deriva
// el formato, reintenta UNA vez con un recordatorio correctivo (los modelos
// chicos fallan el formato ocasionalmente; sin esto se pierde la corrida).
const FORMAT_REMINDER = `

FORMAT REMINDER: your previous reply could not be parsed. Respond ONLY with the structured sections — lines starting with "# SectionName" followed by the section text. No preamble, no fences, no commentary.`

// Structured Outputs: schema JSON de las secciones del prompt. En modo
// "style" no se piden Subject/Action/Environment; en "replica" van todas.
// Fireworks respeta json_schema y elimina el bug de razonadores hablando
// en voz alta dentro del content (verificado con Kimi K2.7 Code: pasa de
// 3000+ tokens de razonamiento inline a 250 tokens de JSON limpio).
const ALL_SECTION_KEYS = ['Subject', 'Style', 'Composition', 'Camera', 'Lighting', 'Color', 'Mood', 'Action', 'Environment', 'Negative']
const STYLE_BANNED = new Set(['Subject', 'Action', 'Environment'])

export function sectionsSchema(mode = 'style', { withElements = false } = {}) {
  const keys = ALL_SECTION_KEYS.filter((k) => mode === 'replica' || !STYLE_BANNED.has(k))
  const properties = {}
  for (const k of keys) properties[k] = { type: 'string' }
  const required = [...keys]
  if (withElements) {
    // Mapa espacial (schema Ideogram): los objetos visuales principales con
    // bbox en grilla 0-1000 [ymin,xmin,ymax,xmax]. Solo en modo réplica.
    properties.Elements = {
      type: 'array',
      maxItems: 8,
      items: {
        type: 'object',
        properties: {
          desc: { type: 'string' },
          bbox: { type: 'array', items: { type: 'integer' }, minItems: 4, maxItems: 4 },
        },
        required: ['desc', 'bbox'],
        additionalProperties: false,
      },
    }
    required.push('Elements')
  }
  return { type: 'object', properties, required, additionalProperties: false }
}

const jsonToSections = (obj) => {
  if (!obj || typeof obj !== 'object') return []
  return ALL_SECTION_KEYS
    .filter((k) => typeof obj[k] === 'string' && obj[k].trim())
    .map((k) => ({ name: k, text: obj[k].trim() }))
}

// Los 4 proveedores tienen Structured Outputs: Fireworks/Pollinations vía
// response_format (OpenAI), Gemini vía responseSchema, Ollama vía format.
// Si un modelo puntual lo ignora, callParsed cae al parseo por texto.
const supportsStructured = () => true

async function callParsed(settings, req) {
  const useSchema = req.schema && supportsStructured(settings)
  let raw = await callLLM(settings, useSchema ? { ...req, responseSchema: req.schema } : req)
  let parsed = []
  let json = null // objeto crudo (para campos extra del schema, ej. Elements)
  if (useSchema) {
    try {
      json = JSON.parse(raw)
      parsed = jsonToSections(json)
    } catch { /* cae al parseo por texto abajo */ }
  }
  if (!parsed.length) parsed = textToSections(raw)
  let retried = false
  if (!parsed.length) {
    retried = true
    raw = await callLLM(settings, { ...req, user: req.user + FORMAT_REMINDER })
    parsed = textToSections(raw)
  }
  return { raw, parsed, retried, json }
}

// Las pasadas correctivas (autocrítica, loop) reescriben un borrador que ya
// era válido: si la salida viene incompleta (truncado, secciones omitidas),
// NUNCA se pierden secciones — lo que falta se conserva del borrador.
function mergeOverDraft(draft, corrected) {
  const byName = new Map(corrected.map((s) => [s.name, s]))
  const merged = draft.map((d) => byName.get(d.name) || d)
  for (const c of corrected) {
    if (!draft.some((d) => d.name === c.name)) merged.push(c)
  }
  return merged
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
  const { parsed } = await callParsed(settings, {
    system: SYSTEM_BASE,
    user: ACTIONS[actionId].instruction(text),
  })
  if (!parsed.length) throw new Error('PARSE_ERROR')
  return parsed
}

export async function runSmartEdit({ settings, instruction, sections }) {
  const text = sectionsToText(sections)
  const { parsed } = await callParsed(settings, {
    system: SYSTEM_BASE,
    user: `Apply this instruction to the structured prompt below. Change only what the instruction requires; keep everything else intact.\n\nINSTRUCTION: ${instruction}\n\nPROMPT:\n${text || '(empty — create a new prompt from the instruction)'}`,
  })
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

STEP 0 — MEDIUM CLASSIFICATION (do this FIRST, it governs everything else):
Decide what the image physically IS at the rendering level. Pick the single best match:
- Photograph (film or digital camera)
- 3D render — and specify: photoreal CGI · STYLIZED / LOW-POLY game render · PS1/PS2-era real-time · Pixar/DreamWorks-style · clay/toy render
- 2D digital illustration · concept art · matte painting
- Cel / anime / cartoon animation
- Painterly — oil, gouache, watercolor, acrylic
- Vector / flat design · pixel art · risograph · collage / mixed media

⚠ ANTI-BIAS RULE: the single most common and most damaging error is defaulting to "cinematic photography / photorealistic" for images that are actually renders or illustrations. RESIST IT. Look for non-photographic tells and, if ANY are present, it is NOT a photograph:
- faceted / low-polygon geometry, flat triangulated surfaces
- flat or banded color fills, posterized gradients
- ABSENCE of photographic sensor grain, chromatic aberration, real lens bokeh
- visible brushstrokes, vertex/Gouraud shading, cel outlines, hand-placed edges
- simplified / stylized forms, painted atmosphere rather than optically-captured haze
Any caption or object inventory you may receive describes literal CONTENT and is phrased as if the scene were photographed — it is NOT evidence about the medium. Judge the medium ONLY from rendering qualities in the pixels.

PRIMARY DIRECTIVE — STYLISTIC HEGEMONY (THE STYLE IS THE LAW):
After Step 0, silently lock:
1. VISUAL MEDIUM — the exact medium from Step 0. Be specific ("stylized low-poly 3D game render", not "digital art"). This is the governing law.
2. EXECUTION RULES — the hard constraints that define THIS medium's look: e.g. for low-poly render "flat-shaded polygonal facets, no photographic grain, painted volumetric fog, simplified silhouettes"; for 35mm photo "sensor grain, real lens falloff, optical bokeh". These rules are LAW.
3. ERA / IP ADJACENCY — decade, engine, movement or adjacent title if present (e.g. "PS2-era survival-horror render", "The Long Drive / Jalopy indie-game look", "1970s Kodachrome").

Every clause you write MUST obey that DNA. You are FORBIDDEN from naming any texture, material or optical effect that belongs to a DIFFERENT medium than the one in Step 0 (e.g. never write "film grain", "lens flare" or "photographic depth of field" for a flat-shaded render; never write "flat-color" and "gradient" together). Zero logical contradictions. Each clause is one atomic concept. The # Style section MUST open by naming the medium from Step 0 verbatim.

${mode === 'style'
  ? `MODE: STYLE ONLY. Describe ONLY the aesthetic treatment so it can be transferred to a completely different scene. You are FORBIDDEN from describing the subject, characters, objects or specific content of the image. No # Subject section.`
  : `MODE: FULL REPLICA. Also reconstruct the scene: include # Subject (and # Action / # Environment if relevant), each described through the lens of the Style DNA.
REPLICA COMPLETENESS — INVENTORY, DON'T INVENT: # Subject must inventory every significant visible object (including easy-to-miss ones: hands, mirrors, wipers, signage, screens), each WITH its physical condition (bare/dead vs lush, worn vs new, lit vs off). And the reverse is LAW: never add objects, text, signs or details that are NOT in the image — generators invent clutter, so if the image contains no readable text or signage, # Negative MUST include "no text, no signage, no lettering".`}

MANDATORY: the # Camera section MUST state the precise shot type AND camera angle (e.g. "extreme low-angle wide shot"), plus lens character if readable.

MANDATORY — LIGHT SOURCES: the # Lighting section MUST name every VISIBLE light source in the image, especially practicals (vehicle headlights, lamps, screens, fire, neon, dashboard glow). For each light, attribute it to its EMITTING OBJECT — never describe a glow without saying what produces it. State the time of day consistently with the measured brightness: brightness ≤3/10 means dusk/night — never describe it as "day".

MANDATORY — ACCENT COLORS: the # Color section must account for EVERY measured dominant hex, including minority accents (a 5-10% warm tone against a muted field is usually the soul of the image — dropping it is a critical failure). Write every color as an evocative NAME first with the hex in parentheses after it — e.g. "dusty slate blue-green (#494c50)". Generators read the names; the hexes are internal calibration.

MANDATORY — NO REDUNDANCY, MAX BREVITY: each section contributes ONLY its own dimension. The framing/POV is stated ONCE, in # Camera — # Subject says WHAT is visible, never how it is framed. Max 2 short atomic sentences per section: a tight 130-word prompt outperforms a 300-word one; repetition dilutes every signal.

3D-vs-2D TELL: if the image shows true 3D perspective depth with faceted/flat-shaded geometry (even with painted-looking fog or textures), it is a STYLIZED 3D GAME RENDER — not a 2D illustration. Reserve "2D illustration / concept art" for images with no coherent 3D geometry.

MANDATORY — EDGE & FOCUS QUALITY: the Style DNA must state the EDGE CHARACTER of the image (soft/blended/diffuse vs crisp/defined/hard-lined) — getting this wrong changes the entire medium. The # Camera section must state the FOCUS BEHAVIOR: which planes are sharp and which are blurred (e.g. "foreground out of focus, midground readable"). If the image has no hard edges anywhere, the prompt must say so explicitly and # Negative must forbid crisp linework.

MANDATORY — DETAIL ECONOMY: state how much micro-detail the style permits, as an execution rule. A minimal/simplified style must say "sparse, simplified forms, large empty planes — no added clutter, no invented micro-detail"; a dense style must say so too. Generators fill silence with detail — if the original is economical, the prompt must actively forbid extra detail.

CALIBRATED SCALES: when the user message includes MEASURED GROUND TRUTH, those values were computed programmatically from the pixels and are non-negotiable facts. Your wording for contrast, saturation and brightness MUST be consistent with the measured N/10 values (e.g. contrast 3/10 can never be "high contrast"). In # Color, cite the dominant hex values verbatim alongside their color names. If CAMERA EXIF is present, # Camera must be built on it. Express contrast, saturation and brightness as "N/10" ratings inside the prompt so they stay reproducible.

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

export async function analyzeImageStyle({ settings: rawSettings, image, images, mode = 'style', measurements = '', hint = '' }) {
  // El Structured Output garantiza JSON válido pero NO impide que un
  // razonador pesado (Kimi K2.7) divague DENTRO de los strings de sección
  // ni que ignore Elements (verificado con logs reales) → el fallback a
  // un modelo directo con visión aplica siempre.
  const settings = pickDirectModel(rawSettings, { needsVision: true }).settings
  const imgs = images && images.length ? images : (image ? [image] : [])
  const multi = imgs.length > 1
  const base = multi
    ? `You are given ${imgs.length} reference images that SHARE ONE common visual style (a moodboard). Extract ONLY the Style DNA that is CONSISTENT across ALL of them — the medium, execution rules, lighting, palette and mood they have in common. IGNORE the specific subject/content of any single image; the style will be applied to completely different scenes.`
    : mode === 'style'
      ? 'Extract the Style DNA of this image. Style only — the content will be replaced by other scenes.'
      : 'Deconstruct this image into a full replication prompt, Style DNA first.'
  // Mapa espacial: en modo réplica (una imagen, layout definido) se piden
  // también los elementos con bbox. Todos los proveedores tienen Structured
  // Outputs; si el modelo ignora el campo, elements queda vacío sin romper.
  const wantElements = mode === 'replica' && !multi
  let system = DNA_SYSTEM(mode)
  if (wantElements) {
    system += `\n\nSPATIAL MAP: additionally output "Elements" — the 2 to 6 most important distinct visual objects in the image. Each element: a short desc (what it is, its condition) and a TIGHT bbox as [ymin, xmin, ymax, xmax] on a 0-1000 grid (origin at top-left; 1000 = full height/width). Do not include the background as an element.`
  }
  const withHint = hint.trim() ? `${base}\n\nUSER GUIDANCE (apply while extracting): ${hint.trim()}` : base
  const user = measurements ? `${withHint}\n\n${measurements}` : withHint
  const { raw, parsed, retried, json } = await callParsed(settings, {
    system, user, maxTokens: 1600, images: imgs,
    schema: sectionsSchema(mode, { withElements: wantElements }),
  })
  const banned = mode === 'style' ? ['Subject', 'Action', 'Environment'] : []
  const sections = parsed.filter((s) => !banned.includes(s.name))
  const trace = { pass: 'extract', system, user, raw, retried }
  if (!parsed.length) { const e = new Error('PARSE_ERROR'); e.trace = trace; throw e }
  // Elementos espaciales validados (bbox 0-1000 coherente y con área real).
  const elements = (json?.Elements || [])
    .filter((e) => Array.isArray(e.bbox) && e.bbox.length === 4 && e.desc)
    .map((e) => ({ desc: e.desc, bbox: e.bbox.map((v) => Math.max(0, Math.min(1000, Math.round(v)))) }))
    .filter((e) => e.bbox[2] > e.bbox[0] && e.bbox[3] > e.bbox[1])
  return { sections, elements, trace }
}

// Pasada de autocrítica: compara el borrador contra la imagen y las
// mediciones, corrige omisiones, exageraciones y contradicciones.
// Loop fotocopiadora: compara la generación contra el original y corrige
// el prompt para que la próxima iteración converja. El original es siempre
// el objetivo; nunca se persiguen los artefactos de la generación.
export async function refineFromComparison({ settings: rawSettings, original, generated, draft, mode = 'style', comparisonData = '' }) {
  const settings = pickDirectModel(rawSettings, { needsVision: true }).settings
  const draftText = draft.map((s) => `# ${s.name}\n${s.text}`).join('\n\n')
  const system = DNA_SYSTEM(mode) + `

PHOTOCOPIER MODE: you receive TWO images. The FIRST is the ORIGINAL reference — the absolute target. The SECOND is an AI GENERATION produced from the CURRENT PROMPT. You are the error-correction system of a photocopier: you do not judge beauty, you measure drift and correct it.
1. Silently diff the generation against the original: what did it LOSE (elements, texture, light behavior), what did it ADD that isn't in the original, what did it EXAGGERATE or UNDERSHOOT (contrast, saturation, mood intensity, scale)?
2. If OBJECTIVE COMPARISON DATA is provided, treat it as measured fact and compensate explicitly (e.g. generation more saturated than original → lower the saturation wording).
3. Output the CORRECTED full prompt in the exact same section format — nothing else. Strengthen constraints where the generation drifted, add what it lost, remove or soften what it over-produced. Never describe the generation; describe what the NEXT generation must do to match the ORIGINAL.`
  const user = `CURRENT PROMPT (the one that produced the second image):\n${draftText}${comparisonData ? `\n\n${comparisonData}` : ''}\n\nFirst image = ORIGINAL reference (target). Second image = generation to correct. Output the corrected prompt.`
  // Usa la versión chica del base64 (512max, 0.75) para ahorrar tokens; si
  // el caller no la calculó (ej. imagen del historial), cae al base64 normal.
  const asLlm = (im) => ({ base64: im.llmBase64 || im.base64, mediaType: im.mediaType })
  const { raw, parsed, retried } = await callParsed(settings, { system, user, maxTokens: 1600, images: [asLlm(original), asLlm(generated)], schema: sectionsSchema(mode) })
  const banned = mode === 'style' ? ['Subject', 'Action', 'Environment'] : []
  const sections = mergeOverDraft(draft, parsed.filter((s) => !banned.includes(s.name)))
  const trace = { pass: 'refine', system, user, raw, retried }
  if (!parsed.length) { const e = new Error('PARSE_ERROR'); e.trace = trace; throw e }
  return { sections, trace }
}

// Schema del caption de layout (para Structured Outputs): lo usan
// "Construir desde imagen" y "Editar escena con IA" del Layout Builder.
const CAPTION_SCHEMA = {
  type: 'object',
  properties: {
    high_level_description: { type: 'string' },
    background: { type: 'string' },
    elements: {
      type: 'array',
      maxItems: 8,
      items: {
        type: 'object',
        properties: {
          type: { type: 'string', enum: ['obj', 'text'] },
          bbox: { type: 'array', items: { type: 'integer' }, minItems: 4, maxItems: 4 },
          desc: { type: 'string' },
          text: { type: 'string' },
        },
        required: ['type', 'bbox', 'desc'],
        additionalProperties: false,
      },
    },
  },
  required: ['high_level_description', 'background', 'elements'],
  additionalProperties: false,
}

const BBOX_RULES = 'bbox = [ymin, xmin, ymax, xmax] on a 0-1000 grid, origin top-left, tight around the object. background describes ONLY walls/ground/sky/light — every object goes in elements. All text in English.'

// Rescata el objeto JSON aunque el modelo lo envuelva en razonamiento o
// fences ("The user wants… { … }"): fences primero, después el bloque entre
// el primer "{" y el último "}".
const extractJson = (raw) => {
  const s = (raw || '').trim()
  try { return JSON.parse(s) } catch { /* sigue */ }
  const fence = s.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fence) { try { return JSON.parse(fence[1]) } catch { /* sigue */ } }
  const start = s.indexOf('{')
  const end = s.lastIndexOf('}')
  if (start >= 0 && end > start) {
    try { return JSON.parse(s.slice(start, end + 1)) } catch { /* sigue */ }
  }
  throw new Error('el modelo no devolvió JSON (respondió texto libre) — probá de nuevo o cambiá de modelo en Ajustes')
}

// Llamada que DEBE devolver un caption JSON: extrae el JSON del ruido y, si
// no aparece, reintenta UNA vez con recordatorio (proveedores sin Structured
// Outputs efectivos, ej. algunos modelos de Pollinations).
const callForCaption = async (settings, req) => {
  let raw = await callLLM(settings, { ...req, responseSchema: CAPTION_SCHEMA })
  try {
    return extractJson(raw)
  } catch {
    raw = await callLLM(settings, {
      ...req,
      user: req.user + '\n\nIMPORTANT: your previous reply was not valid JSON. Respond ONLY with the JSON object — no commentary, no reasoning, no fences.',
    })
    return extractJson(raw)
  }
}

const parseCaptionJson = (obj) => {
  const elements = (obj.elements || [])
    .filter((e) => Array.isArray(e.bbox) && e.bbox.length === 4 && e.desc)
    .map((e) => ({
      type: e.type === 'text' ? 'text' : 'obj',
      text: e.text || '',
      desc: e.desc,
      bbox: e.bbox.map((v) => Math.max(0, Math.min(1000, Math.round(v)))),
    }))
    .filter((e) => e.bbox[2] > e.bbox[0] && e.bbox[3] > e.bbox[1])
  return { highLevel: obj.high_level_description || '', background: obj.background || '', elements }
}

// "Construir desde imagen" del Layout Builder: deconstruye la imagen de
// fondo directamente al modelo de layout (más liviano que la réplica del
// DNA Lab — no extrae estilo, solo composición y elementos).
export async function layoutFromImage({ settings: rawSettings, image }) {
  const { settings } = pickDirectModel(rawSettings, { needsVision: true })
  const raw = await callLLM(settings, {
    system: `Deconstruct the image into an Ideogram-style layout. Output: high_level_description (one sentence summarizing the whole image), background, and elements — the 2 to 6 most important distinct objects, each with a rich desc (what it is, condition, materials, pose). ${BBOX_RULES}`,
    user: 'Deconstruct this image into the layout.',
    maxTokens: 900,
    image,
    responseSchema: CAPTION_SCHEMA,
  })
  return parseCaptionJson(raw)
}

// "Editar escena con IA": aplica una instrucción en lenguaje natural al
// caption actual (mover/agregar/quitar/redescribir elementos) y devuelve el
// caption editado completo.
export async function editLayout({ settings: rawSettings, caption, instruction }) {
  const { settings } = pickDirectModel(rawSettings, { needsVision: false })
  const raw = await callLLM(settings, {
    system: `You edit an Ideogram layout caption. Apply the user's instruction; keep everything not mentioned unchanged (same bboxes, same descs). You may add, remove, move, resize or redescribe elements as instructed. ${BBOX_RULES}`,
    user: `CURRENT CAPTION:\n${JSON.stringify(caption)}\n\nINSTRUCTION: ${instruction}`,
    maxTokens: 1200,
    responseSchema: CAPTION_SCHEMA,
  })
  return parseCaptionJson(raw)
}

// ── Pulido por plataforma (compartido por Exportar y el DNA Lab) ──
// Convierte el compilado mecánico en UN prompt fluido nativo del modelo
// destino, siguiendo SUS reglas documentadas (target.notes). El formato que
// demostró funcionar es el "prompt dorado": medio primero, cada dato dicho
// una vez, colores nombrados, ~120-160 palabras.
const POLISH_SYSTEM = (target) => `Output ONLY the final rewritten prompt. NO preamble, NO analysis, NO planning, NO "Let me…", NO word counting, NO markdown fences, NO commentary before OR after. If you output anything other than the prompt itself, the response is wrong.

You are a senior prompt engineer writing the FINAL prompt for the platform "${target.label}".

PLATFORM RULES (follow them exactly): ${target.notes}

Rewrite the compiled prompt the user gives you as ONE flowing, production-ready prompt in that platform's native style:
- Lead with the visual medium/style if the content defines one.
- Keep EVERY concrete detail: objects and their condition, each light source with its emitter, colors by NAME (never hex codes), edge/focus behavior, mood.
- Say each thing exactly ONCE — remove all redundancy.
- 120-160 words unless the platform rules say otherwise.
- If the input ends with parameters (--ar, --no …) or a "Negative prompt:" block, keep them verbatim at the end.
- English.

Reminder: your entire response is JUST the prompt. Start with the first word of the prompt.`

// Rescate anti-razonadores: si el modelo igual antepone pensamiento, nos
// quedamos con el prompt final (último marcador o último párrafo largo).
export const extractFinalPrompt = (raw) => {
  let s = raw.trim().replace(/^```[a-z]*\n?|```$/g, '').trim()
  const marker = /(?:^|\n)\s*(?:Final|Polished|Rewritten|Output|Result|Prompt|Draft)\s*(?:prompt)?\s*:\s*\n+/i
  const matches = [...s.matchAll(new RegExp(marker.source, marker.flags + 'g'))]
  if (matches.length) {
    const last = matches[matches.length - 1]
    s = s.slice(last.index + last[0].length).trim()
  }
  if (/^(the user|i need|i should|let me|okay|first,|now,)/i.test(s)) {
    const paragraphs = s.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)
    const promptLike = paragraphs.reverse().find(
      (p) => p.length > 200 && !/^\d+\./.test(p) && !/^[A-Z][a-z]+:/.test(p)
    )
    if (promptLike) s = promptLike
  }
  return s.replace(/^```[a-z]*\n?|```$/g, '').trim()
}

export async function polishForTarget({ settings, target, compiled }) {
  const { settings: s, override } = pickDirectModel(settings)
  const out = await callLLM(s, {
    system: POLISH_SYSTEM(target),
    user: `COMPILED PROMPT TO POLISH:\n\n${compiled}`,
    maxTokens: 3000,
  })
  const clean = extractFinalPrompt(out)
  if (!clean) throw new Error('respuesta vacía')
  return { polished: clean, override }
}

// Layout Builder → prompt: convierte el caption espacial (descripciones del
// usuario en cualquier idioma + bboxes + paletas) en secciones bien
// redactadas EN INGLÉS. Los bboxes se traducen a lenguaje espacial en
// # Composition — así cualquier generador (no solo Ideogram) recibe el
// layout como palabras.
export async function layoutToSections({ settings: rawSettings, caption }) {
  const { settings } = pickDirectModel(rawSettings, { needsVision: false })
  const system = `You are a master prompt engineer. You receive an Ideogram-style layout caption as JSON: a high-level description, a background, and elements each with an optional bbox on a 0-1000 grid ([ymin, xmin, ymax, xmax], origin top-left) and an optional color palette.

Write a complete structured generation prompt IN ENGLISH (translate any non-English text):
- # Subject: the elements, each described richly (expand terse user notes into vivid, concrete wording — never invent objects that are not listed).
- # Composition: MANDATORY — convert each element's bbox into spatial language: position in the frame (e.g. "low center", "upper right third"), relative size (a bbox covering >60% of an axis is "dominant", <25% is "small"), and overlaps/relationships between elements. Also state the negative space.
- # Environment: the background description, enriched.
- # Color: name every palette color evocatively with its hex in parentheses, e.g. "burnt sienna (#502915)".
- # Style / # Lighting / # Mood: derive from the descriptions if implied; otherwise write a coherent minimal choice that serves the scene.
Keep each section to max 2 sentences. No preamble — output only the sections.`
  const user = `LAYOUT CAPTION (JSON):\n${JSON.stringify(caption)}`
  const { raw, parsed, retried } = await callParsed(settings, {
    system, user, maxTokens: 1200, schema: sectionsSchema('replica'),
  })
  const trace = { pass: 'layout', system, user, raw, retried }
  if (!parsed.length) { const e = new Error('PARSE_ERROR'); e.trace = trace; throw e }
  return { sections: parsed, trace }
}

export async function critiqueStyleDNA({ settings: rawSettings, image, images, draft, mode = 'style', measurements = '' }) {
  const settings = pickDirectModel(rawSettings, { needsVision: true }).settings
  const imgs = images && images.length ? images : (image ? [image] : [])
  const multi = imgs.length > 1
  const draftText = draft.map((s) => `# ${s.name}\n${s.text}`).join('\n\n')
  const system = DNA_SYSTEM(mode) + `

VERIFICATION MODE: you receive a DRAFT prompt produced from ${multi ? `these ${imgs.length} reference images that share ONE common style` : 'this same image'}. Audit it against this CHECKLIST, item by item, and fix EVERY failure:${multi ? '\n0. SHARED STYLE — the DNA must describe only what is CONSISTENT across all images; drop anything specific to a single image.' : ''}
1. MEDIUM — is the Step-0 medium right? 3D perspective + faceted geometry = 3D render, never "2D illustration"; no photo tells = never "photography".
2. TIME & BRIGHTNESS — does the wording match the measured brightness? ≤3/10 and any form of "day/daylight" appears = FAILURE, rewrite as dusk/night.
3. LIGHTS — is every visible light present AND attributed to its emitting object (headlights, radio dial, lamp, sky)? A glow with no named source = failure.
4. COLORS — is every measured hex present as "name (#hex)", including minority accents? A dropped accent = failure.
5. EDGES & FOCUS — does the draft state the edge character (soft vs crisp) and which planes are blurred?
6. DETAIL ECONOMY — if the image is sparse, does the draft forbid added clutter?
7. INVENTORY (replica mode) — every visible object present with its condition (hands, mirrors, wipers…)? Anything invented that is not in the image? Image has no readable text → # Negative must include "no text, no signage".
8. REDUNDANCY — framing stated more than once across sections = failure; keep it only in # Camera. Max 2 short sentences per section.
9. EXAGGERATIONS & CONTRADICTIONS — any wording stronger than what the image shows, or violating the measurements or the DNA itself.
Output the CORRECTED full prompt in the exact same section format — nothing else. Keep what the draft got right.`
  const user = `DRAFT TO VERIFY:\n${draftText}${measurements ? `\n\n${measurements}` : ''}`
  const { raw, parsed, retried } = await callParsed(settings, { system, user, maxTokens: 1600, images: imgs, schema: sectionsSchema(mode) })
  const banned = mode === 'style' ? ['Subject', 'Action', 'Environment'] : []
  const sections = mergeOverDraft(draft, parsed.filter((s) => !banned.includes(s.name)))
  const trace = { pass: 'critique', system, user, raw, retried }
  if (!parsed.length) { const e = new Error('PARSE_ERROR'); e.trace = trace; throw e }
  return { sections, trace }
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
