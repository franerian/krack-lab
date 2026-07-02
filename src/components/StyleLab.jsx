import React, { useRef, useState } from 'react'
import { analyzeImageStyle, isReady, providerHint } from '../lib/anthropic.js'
import { fileToImage } from '../lib/image.js'
import { highlightHtml } from '../lib/highlight.js'
import { TARGETS, EXPORT_ASPECT_RATIOS } from '../data/targets.js'

export default function StyleLab({ settings, onApply, onReplace, onSavePreset, onClose, toast, target, setTarget, ar, setAr }) {
  const [img, setImg] = useState(null)
  const [mode, setMode] = useState('style')
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState(null)
  const [drag, setDrag] = useState(false)
  const fileRef = useRef(null)

  const loadFile = async (file) => {
    try {
      const loaded = await fileToImage(file)
      setImg(loaded)
      setResult(null)
    } catch {
      toast('Ese archivo no es una imagen válida', 'error')
    }
  }

  const analyze = async () => {
    if (!img) return toast('Cargá primero una imagen de referencia', 'error')
    if (!isReady(settings)) return toast(providerHint(settings), 'error')
    setBusy(true)
    try {
      const sections = await analyzeImageStyle({ settings, image: img, mode })
      setResult(sections)
      toast('ADN visual extraído ✓', 'ok')
    } catch (e) {
      toast('Error al analizar: ' + e.message, 'error')
    } finally {
      setBusy(false)
    }
  }

  const toObj = () => Object.fromEntries(result.map((s) => [s.name, s.text]))

  const currentTarget = TARGETS.find((t) => t.id === target) || TARGETS[0]

  const copyCompiled = () => {
    const compiled = currentTarget.compile(result, { ar })
    if (!compiled) return toast('No hay nada para copiar', 'error')
    navigator.clipboard.writeText(compiled)
    toast(`ADN copiado en formato ${currentTarget.label}`, 'ok')
  }

  const save = () => {
    const name = window.prompt('Nombre para este ADN de estilo:', 'Estilo extraído')
    if (!name) return
    onSavePreset(name, toObj())
    toast(`ADN “${name}” guardado en Mis presets`, 'ok')
  }

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-head">
          <div className="modal-title">🧬 Style <span className="accent">DNA Lab</span></div>
          <div className="tabs">
            <button
              className={'tab' + (mode === 'style' ? ' active' : '')}
              onClick={() => { setMode('style'); setResult(null) }}
              title="Solo el tratamiento visual, transferible a cualquier escena"
            >Solo estilo (ADN)</button>
            <button
              className={'tab' + (mode === 'replica' ? ' active' : '')}
              onClick={() => { setMode('replica'); setResult(null) }}
              title="Reconstruye también el sujeto y la escena"
            >Réplica completa</button>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body sl-body">
          <div className="sl-left">
            <div
              className={'sl-drop' + (drag ? ' dragover' : '')}
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
              onDragLeave={() => setDrag(false)}
              onDrop={(e) => { e.preventDefault(); setDrag(false); loadFile(e.dataTransfer.files[0]) }}
              onPaste={(e) => loadFile(e.clipboardData.files[0])}
            >
              {img
                ? <img src={img.dataUrl} alt="referencia" />
                : <span>Arrastrá, pegá o clickeá<br />para cargar la imagen de referencia</span>}
            </div>
            <button className="btn primary" style={{ width: '100%' }} onClick={analyze} disabled={busy || !img}>
              {busy ? <span className="spinner" /> : '🧬 '}Extraer ADN visual
            </button>
            <p className="hint">
              {mode === 'style'
                ? 'Extrae medio, reglas de ejecución, cámara, luz, color y mood — sin el sujeto. El resultado se aplica sobre tus propias escenas.'
                : 'Deconstruye la imagen completa (incluido el sujeto) como prompt de replicación fiel al ADN.'}
            </p>
          </div>
          <div className="sl-right">
            {result ? (
              result.map((s) => (
                <div key={s.name} className="sl-section">
                  <div className="section-name"><span className="hash">#</span>{s.name}</div>
                  <div
                    className="sl-section-text"
                    dangerouslySetInnerHTML={{ __html: highlightHtml(s.text) }}
                  />
                </div>
              ))
            ) : (
              <div className="sl-placeholder">
                {busy ? 'Analizando la imagen…' : 'El ADN extraído aparece acá.'}
              </div>
            )}
          </div>
        </div>
        <div className="modal-foot" style={{ flexWrap: 'wrap' }}>
          {result && (
            <>
              <select
                className="target-select"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                title={currentTarget.notes}
              >
                {TARGETS.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
              {currentTarget.usesAr && (
                <select className="target-select" value={ar} onChange={(e) => setAr(e.target.value)}>
                  {EXPORT_ASPECT_RATIOS.map((r) => <option key={r}>{r}</option>)}
                </select>
              )}
              <button className="btn" onClick={copyCompiled}>⧉ Copiar</button>
            </>
          )}
          <button className="btn" onClick={save} disabled={!result}>🔖 Guardar como preset</button>
          <div style={{ flex: 1 }} />
          {mode === 'replica' && (
            <button
              className="btn"
              disabled={!result}
              onClick={() => { onReplace(toObj()); onClose() }}
            >Reemplazar prompt</button>
          )}
          <button
            className="btn primary"
            disabled={!result}
            onClick={() => { onApply(toObj()); onClose() }}
          >Aplicar al prompt →</button>
        </div>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => loadFile(e.target.files[0])} />
      </div>
    </div>
  )
}
