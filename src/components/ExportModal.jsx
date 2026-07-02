import React, { useMemo } from 'react'
import { TARGETS, EXPORT_ASPECT_RATIOS } from '../data/targets.js'

export default function ExportModal({ sections, target, setTarget, ar, setAr, onClose, toast }) {
  const current = TARGETS.find((t) => t.id === target) || TARGETS[0]
  const output = useMemo(
    () => current.compile(sections, { ar }),
    [current, sections, ar]
  )

  const copy = () => {
    navigator.clipboard.writeText(output)
    toast(`Prompt copiado en formato ${current.label}`, 'ok')
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
                onClick={() => setTarget(t.id)}
              >{t.label}</button>
            ))}
          </div>
          <div className="export-main">
            <p className="hint" style={{ marginTop: 0 }}>{current.notes}</p>
            {current.usesAr && (
              <div className="field" style={{ maxWidth: 180, marginBottom: 10 }}>
                <label>Aspect Ratio</label>
                <select value={ar} onChange={(e) => setAr(e.target.value)}>
                  {EXPORT_ASPECT_RATIOS.map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>
            )}
            <pre className="export-pre">{output || '— el prompt está vacío —'}</pre>
          </div>
        </div>
        <div className="modal-foot">
          <span className="hint">{output.length} caracteres</span>
          <div style={{ flex: 1 }} />
          <button className="btn primary" onClick={copy} disabled={!output}>⧉ Copiar</button>
        </div>
      </div>
    </div>
  )
}
