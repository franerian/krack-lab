// Prompt-engineering de KRACK: acciones del editor, Character Studio,
// coberturas y Style DNA Lab. El transporte (clientes, timeouts,
// cancelación) vive en llm.js; este archivo re-exporta lo usado por la UI.

import { callLLM } from './llm.js'

export {
  MODELS, GEMINI_MODELS, OLLAMA_DEFAULT_URL, DEMO_GEMINI_KEY,
  callClaude, callOllama, callGemini, callLLM, listOllamaModels,
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

async function callParsed(settings, req) {
  let raw = await callLLM(settings, req)
  let parsed = textToSections(raw)
  let retried = false
  if (!parsed.length) {
    retried = true
    raw = await callLLM(settings, { ...req, user: req.user + FORMAT_REMINDER })
    parsed = textToSections(raw)
  }
  return { raw, parsed, retried }
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

export async function analyzeImageStyle({ settings, image, mode = 'style', measurements = '' }) {
  const base = mode === 'style'
    ? 'Extract the Style DNA of this image. Style only — the content will be replaced by other scenes.'
    : 'Deconstruct this image into a full replication prompt, Style DNA first.'
  const system = DNA_SYSTEM(mode)
  const user = measurements ? `${base}\n\n${measurements}` : base
  const { raw, parsed, retried } = await callParsed(settings, { system, user, maxTokens: 1600, image })
  const banned = mode === 'style' ? ['Subject', 'Action', 'Environment'] : []
  const sections = parsed.filter((s) => !banned.includes(s.name))
  const trace = { pass: 'extract', system, user, raw, retried }
  if (!parsed.length) { const e = new Error('PARSE_ERROR'); e.trace = trace; throw e }
  return { sections, trace }
}

// Pasada de autocrítica: compara el borrador contra la imagen y las
// mediciones, corrige omisiones, exageraciones y contradicciones.
// Loop fotocopiadora: compara la generación contra el original y corrige
// el prompt para que la próxima iteración converja. El original es siempre
// el objetivo; nunca se persiguen los artefactos de la generación.
export async function refineFromComparison({ settings, original, generated, draft, mode = 'style', comparisonData = '' }) {
  const draftText = draft.map((s) => `# ${s.name}\n${s.text}`).join('\n\n')
  const system = DNA_SYSTEM(mode) + `

PHOTOCOPIER MODE: you receive TWO images. The FIRST is the ORIGINAL reference — the absolute target. The SECOND is an AI GENERATION produced from the CURRENT PROMPT. You are the error-correction system of a photocopier: you do not judge beauty, you measure drift and correct it.
1. Silently diff the generation against the original: what did it LOSE (elements, texture, light behavior), what did it ADD that isn't in the original, what did it EXAGGERATE or UNDERSHOOT (contrast, saturation, mood intensity, scale)?
2. If OBJECTIVE COMPARISON DATA is provided, treat it as measured fact and compensate explicitly (e.g. generation more saturated than original → lower the saturation wording).
3. Output the CORRECTED full prompt in the exact same section format — nothing else. Strengthen constraints where the generation drifted, add what it lost, remove or soften what it over-produced. Never describe the generation; describe what the NEXT generation must do to match the ORIGINAL.`
  const user = `CURRENT PROMPT (the one that produced the second image):\n${draftText}${comparisonData ? `\n\n${comparisonData}` : ''}\n\nFirst image = ORIGINAL reference (target). Second image = generation to correct. Output the corrected prompt.`
  const { raw, parsed, retried } = await callParsed(settings, { system, user, maxTokens: 1600, images: [original, generated] })
  const banned = mode === 'style' ? ['Subject', 'Action', 'Environment'] : []
  const sections = mergeOverDraft(draft, parsed.filter((s) => !banned.includes(s.name)))
  const trace = { pass: 'refine', system, user, raw, retried }
  if (!parsed.length) { const e = new Error('PARSE_ERROR'); e.trace = trace; throw e }
  return { sections, trace }
}

export async function critiqueStyleDNA({ settings, image, draft, mode = 'style', measurements = '' }) {
  const draftText = draft.map((s) => `# ${s.name}\n${s.text}`).join('\n\n')
  const system = DNA_SYSTEM(mode) + `

VERIFICATION MODE: you receive a DRAFT prompt produced from this same image. Audit it against this CHECKLIST, item by item, and fix EVERY failure:
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
  const { raw, parsed, retried } = await callParsed(settings, { system, user, maxTokens: 1600, image })
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
