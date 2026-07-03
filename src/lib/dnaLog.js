// Log persistente de corridas del Style DNA Lab, para iterar sobre la
// calidad: guarda para cada run los inputs objetivos, el prompt EXACTO
// enviado en cada pasada y la salida CRUDA del modelo (antes de parsear).
import { load, save } from './storage.js'

const KEY = 'dnaLog'
const MAX_RUNS = 20
// Cap por campo: protege la cuota de localStorage (~5MB) sin perder lo
// útil para diagnóstico (los system prompts rondan 6-8k).
const CAP = 20_000
const cap = (s) => (typeof s === 'string' && s.length > CAP ? s.slice(0, CAP) + '\n…[truncado]' : s)

export function getRuns() {
  return load(KEY, [])
}

export function addRun(run) {
  const runs = getRuns()
  runs.unshift({
    ...run,
    measurements: cap(run.measurements),
    passes: (run.passes || []).map((p) => ({
      ...p, system: cap(p.system), user: cap(p.user), raw: cap(p.raw),
    })),
  })
  save(KEY, runs.slice(0, MAX_RUNS))
}

export function clearRuns() {
  save(KEY, [])
}

// Render legible (markdown) de un run — lo que se copia para iterar.
export function runToMarkdown(run) {
  const L = []
  L.push(`# DNA Lab run — ${run.ts}`)
  L.push(`mode: ${run.mode} · provider: ${run.provider} · model: ${run.model}`)
  L.push(`verify: ${run.verify} · deep(Florence-2): ${run.deep}`)
  L.push('')
  if (run.measurements) {
    L.push('## MEASUREMENTS + GROUNDING injected into the prompt')
    L.push('```')
    L.push(run.measurements)
    L.push('```')
    L.push('')
  }
  run.passes.forEach((p, i) => {
    L.push(`## Pass ${i + 1}: ${p.pass}`)
    L.push('### SYSTEM prompt')
    L.push('```')
    L.push(p.system)
    L.push('```')
    L.push('### USER prompt')
    L.push('```')
    L.push(p.user)
    L.push('```')
    L.push('### RAW model output')
    L.push('```')
    L.push(p.raw)
    L.push('```')
    L.push('')
  })
  return L.join('\n')
}

export function allRunsToMarkdown(runs) {
  return runs.map(runToMarkdown).join('\n\n---\n\n')
}
