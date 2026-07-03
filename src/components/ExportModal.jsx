import React, { useMemo, useState } from 'react'
import { TARGETS, EXPORT_ASPECT_RATIOS } from '../data/targets.js'
import { callLLM, isReady, providerHint, cancelActive } from '../lib/anthropic.js'

// Pulido con IA: convierte el compilado mecánico (secciones concatenadas)
// en UN prompt fluido nativo de la plataforma — el formato que demostró
// funcionar es el "prompt dorado" escrito a mano: medio primero, cada dato
// dicho una vez, colores nombrados, ~120-160 palabras.
const POLISH_SYSTEM = (target) => `You are a senior prompt engineer writing the FINAL prompt for the platform "${target.label}".

PLATFORM RULES (follow them exactly): ${target.notes}

Rewrite the compiled prompt the user gives you as ONE flowing, production-ready prompt in that platform's native style:
- Lead with the visual medium/style if the content defines one.
- Keep EVERY concrete detail: objects and their condition, each light source with its emitter, colors by NAME (never hex codes), edge/focus behavior, mood.
- Say each thing exactly ONCE — remove all redundancy.
- 120-160 words unless the platform rules say otherwise.
- If the input ends with parameters (--ar, --no …) or a "Negative prompt:" block, keep them verbatim at the end.
- English. Output ONLY the prompt, nothing else.`

export default function ExportModal({ sections, target, setTarget, ar, setAr, onClose, toast, settings }) {
  const current = TARGETS.find((t) => t.id === target) || TARGETS[0]
  const output = useMemo(
    () => current.compile(sections, { ar }),
    [current, sections, ar]
  )
  const [polished, setPolished] = useState(null)
  const [polishing, setPolishing] = useState(false)

  const visible = polished ?? output
  const canPolish = current.id !== 'structured' && current.id !== 'plain'

  const changeTarget = (id) => {
    setTarget(id)
    setPolished(null)
  }

  const polish = async () => {
    if (polishing) return
    if (!isReady(settings)) return toast(providerHint(settings), 'error')
    setPolishing(true)
    try {
      const out = await callLLM(settings, {
        system: POLISH_SYSTEM(current),
        user: `COMPILED PROMPT TO POLISH:\n\n${output}`,
        maxTokens: 800,
      })
      const clean = out.trim().replace(/^```[a-z]*\n?|```$/g, '').trim()
      if (!clean) throw new Error('respuesta vacía')
      setPolished(clean)
      toast('Prompt pulido con IA ✓', 'ok')
    } catch (e) {
      toast('Error al pulir: ' + e.message, 'error')
    } finally {
      setPolishing(false)
    }
  }

  const copy = () => {
    navigator.clipboard.writeText(visible)
    toast(`Prompt ${polished ? 'pulido ' : ''}copiado en formato ${current.label}`, 'ok')
  }

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-head">
          <div className="modal-title">🎯 Exportar <span className="accent">para…</span></div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body export-body">
          <div className="export-targets">
            {TARGETS.map((t) => (
              <button
                key={t.id}
                className={'target-btn' + (t.id === target ? ' active' : '')}
                onClick={() => changeTarget(t.id)}
              >{t.label}</button>
            ))}
          </div>
          <div className="export-main">
            <p className="hint" style={{ marginTop: 0 }}>{current.notes}</p>
            {current.usesAr && (
              <div className="field" style={{ maxWidth: 180, marginBottom: 10 }}>
                <label>Aspect Ratio</label>
                <select value={ar} onChange={(e) => { setAr(e.target.value); setPolished(null) }}>
                  {EXPORT_ASPECT_RATIOS.map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>
            )}
            {polished && (
              <div className="polish-bar">
                <span className="metric-badge" style={{ color: 'var(--accent-soft)' }}>✨ pulido con IA</span>
                <button className="btn small ghost" onClick={() => setPolished(null)}>ver compilado mecánico</button>
              </div>
            )}
            <pre className="export-pre">{visible || '— el prompt está vacío —'}</pre>
          </div>
        </div>
        <div className="modal-foot">
          <span className="hint">{visible.length} caracteres</span>
          <div style={{ flex: 1 }} />
          {canPolish && (
            <button
              className="btn"
              onClick={polishing ? () => cancelActive() : polish}
              disabled={!output}
              title="Reescribe el compilado como un prompt fluido nativo de la plataforma (una llamada de IA)"
            >
              {polishing ? <><span className="spinner" />Cancelar</> : '✨ Pulir con IA'}
            </button>
          )}
          <button className="btn primary" onClick={copy} disabled={!visible}>⧉ Copiar</button>
        </div>
      </div>
    </div>
  )
}
