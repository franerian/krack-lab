// Log persistente de corridas del Style DNA Lab, para iterar sobre la
// calidad: guarda para cada run los inputs objetivos, el prompt EXACTO
// enviado en cada pasada y la salida CRUDA del modelo (antes de parsear).
import { load, save } from './storage.js'

const KEY = 'dnaLog'
const MAX_RUNS = 20

export function getRuns() {
  return load(KEY, [])
}

export function addRun(run) {
  const runs = getRuns()
  runs.unshift(run)
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
