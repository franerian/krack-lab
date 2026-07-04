import React, { useState } from 'react'
import { getRuns, clearRuns, runToMarkdown, allRunsToMarkdown } from '../lib/dnaLog.js'

// Visor del log de corridas del DNA Lab: prompt exacto + salida cruda de
// cada pasada, para copiar/descargar e iterar sobre la calidad del ADN.
export default function LogViewer({ onClose, onCleared, toast }) {
  const [runs, setRuns] = useState(() => getRuns())
  const [sel, setSel] = useState(0)
  const run = runs[sel]

  const copyOne = () => {
    navigator.clipboard.writeText(runToMarkdown(run))
    toast('Run copiado (markdown)', 'ok')
  }
  const copyAll = () => {
    navigator.clipboard.writeText(allRunsToMarkdown(runs))
    toast(`${runs.length} runs copiados`, 'ok')
  }
  const download = () => {
    const blob = new Blob([JSON.stringify(runs, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'dna-lab-log.json'
    a.click()
    URL.revokeObjectURL(a.href)
  }
  const clear = () => {
    if (!window.confirm('¿Borrar todo el log de corridas?')) return
    clearRuns(); setRuns([]); onCleared(); toast('Log borrado', 'ok')
  }

  return (
    <div className="overlay" style={{ zIndex: 60 }} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-head">
          <div className="modal-title">🐞 DNA Lab <span className="accent">Log</span></div>
          <div style={{ flex: 1 }} />
          <button className="btn small" onClick={copyOne} disabled={!run}>⧉ Copiar run</button>
          <button className="btn small" onClick={copyAll} disabled={!runs.length}>⧉ Copiar todos</button>
          <button className="btn small" onClick={download} disabled={!runs.length}>⭳ JSON</button>
          <button className="btn small ghost" onClick={clear} disabled={!runs.length}>Limpiar</button>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body log-body">
          <div className="log-list">
            {!runs.length && <div className="sl-placeholder">Sin corridas aún.</div>}
            {runs.map((r, i) => (
              <button
                key={i}
                className={'log-item' + (i === sel ? ' active' : '')}
                onClick={() => setSel(i)}
              >
                <div className="log-item-ts">{r.ts.slice(11)} · {r.mode === 'style' ? 'ADN' : 'réplica'}</div>
                <div className="log-item-sub">
                  {r.model} · {r.passes.length}p{r.error ? ' · ⚠' : ''}
                </div>
              </button>
            ))}
          </div>
          <div className="log-detail">
            {run ? (
              <pre className="export-pre" style={{ maxHeight: '60vh' }}>{runToMarkdown(run)}</pre>
            ) : <div className="sl-placeholder">Elegí una corrida.</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
