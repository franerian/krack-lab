import React, { useRef, useState } from 'react'
import { analyzeImageStyle, critiqueStyleDNA, isReady, providerHint } from '../lib/anthropic.js'
import { fileToImage } from '../lib/image.js'
import { measureImage, extractFileMetadata, measurementsToText } from '../lib/imageAnalysis.js'
import { florenceGrounding, groundingToText } from '../lib/florence.js'
import { highlightHtml } from '../lib/highlight.js'
import { TARGETS, EXPORT_ASPECT_RATIOS } from '../data/targets.js'

export default function StyleLab({ settings, onApply, onReplace, onSavePreset, onClose, toast, target, setTarget, ar, setAr }) {
  const [img, setImg] = useState(null)
  const [mode, setMode] = useState('style')
  const [busy, setBusy] = useState(false)
  const [pass, setPass] = useState(0) // 0 idle | 'florence' | 1 extracción | 2 autocrítica
  const [verify, setVerify] = useState(true)
  const [deep, setDeep] = useState(false)
  const [deepStatus, setDeepStatus] = useState('')
  const [grounding, setGrounding] = useState(null)
  const [result, setResult] = useState(null)
  const [metrics, setMetrics] = useState(null)
  const [meta, setMeta] = useState(null)
  const [drag, setDrag] = useState(false)
  const fileRef = useRef(null)

  const loadFile = async (file) => {
    try {
      const loaded = await fileToImage(file)
      setImg(loaded)
      setResult(null)
      setGrounding(null)
      // Mediciones objetivas: paleta, contraste, saturación, AR + metadata
      // embebida (EXIF / prompt de generadores IA). Instantáneo, sin IA.
      setMetrics(await measureImage(loaded.dataUrl).catch(() => null))
      setMeta(await extractFileMetadata(file))
    } catch {
      toast('Ese archivo no es una imagen válida', 'error')
    }
  }

  const analyze = async () => {
    if (!img) return toast('Cargá primero una imagen de referencia', 'error')
    if (!isReady(settings)) return toast(providerHint(settings), 'error')
    setBusy(true)
    let measurements = measurementsToText(metrics, meta)
    try {
      if (deep) {
        // Pasada Florence-2: inventario objetivo por regiones + OCR, en el navegador.
        setPass('florence')
        try {
          const g = await florenceGrounding(img.dataUrl, (p) => {
            if (p.status === 'progress' && p.file?.endsWith('.onnx')) {
              setDeepStatus(`Descargando Florence-2… ${Math.round(p.progress || 0)}%`)
            } else if (p.status === 'done') {
              setDeepStatus('Analizando regiones…')
            }
          })
          setGrounding(g)
          measurements = [measurements, groundingToText(g)].filter(Boolean).join('\n\n')
        } catch (e) {
          toast('Florence-2 no disponible (sigo sin inventario): ' + e.message, 'error')
        }
        setDeepStatus('')
      }
      setPass(1)
      let sections = await analyzeImageStyle({ settings, image: img, mode, measurements })
      if (verify) {
        setPass(2)
        setResult(sections) // muestra el borrador mientras verifica
        sections = await critiqueStyleDNA({ settings, image: img, draft: sections, mode, measurements })
      }
      setResult(sections)
      toast(verify ? 'ADN extraído y verificado ✓' : 'ADN visual extraído ✓', 'ok')
    } catch (e) {
      toast('Error al analizar: ' + e.message, 'error')
    } finally {
      setBusy(false)
      setPass(0)
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
            {metrics && (
              <div className="metrics-panel">
                <div className="metrics-title">Mediciones (código, no IA)</div>
                <div className="palette-row">
                  {metrics.palette.map((c) => (
                    <span
                      key={c.hex}
                      className="swatch"
                      style={{ background: c.hex, flexGrow: c.pct }}
                      title={`${c.hex} · ${c.pct}%`}
                    />
                  ))}
                </div>
                <div className="metric-badges">
                  <span className="metric-badge" title="Desviación tonal medida">Contraste {metrics.contrast10}/10</span>
                  <span className="metric-badge">Saturación {metrics.saturation10}/10</span>
                  <span className="metric-badge">{metrics.key}</span>
                  <span className="metric-badge">{metrics.aspect}</span>
                </div>
                {meta?.kind === 'exif' && (
                  <div className="meta-found" title={meta.text}>📷 EXIF real: {meta.text}</div>
                )}
                {meta?.kind === 'ai-prompt' && (
                  <div className="meta-found gold" title={meta.text}>
                    🎯 ¡Prompt original embebido detectado! ({meta.source}) — se usará como fuente principal
                  </div>
                )}
              </div>
            )}
            <label className="verify-toggle">
              <input type="checkbox" checked={verify} onChange={(e) => setVerify(e.target.checked)} />
              Autocrítica (2ª pasada anti-exageración)
            </label>
            <label className="verify-toggle" title="Corre Florence-2 en tu navegador para un inventario objetivo por regiones + OCR. Descarga ~230 MB la primera vez (queda cacheado).">
              <input type="checkbox" checked={deep} onChange={(e) => setDeep(e.target.checked)} />
              Análisis profundo (Florence-2 local, ~230 MB la 1ª vez)
            </label>
            <button className="btn primary" style={{ width: '100%' }} onClick={analyze} disabled={busy || !img}>
              {busy ? <span className="spinner" /> : '🧬 '}
              {busy
                ? (pass === 'florence'
                    ? (deepStatus || 'Leyendo la imagen (Florence-2)…')
                    : pass === 2 ? 'Verificando fidelidad… (2/2)' : `Extrayendo ADN… (1/${verify ? 2 : 1})`)
                : 'Extraer ADN visual'}
            </button>
            {grounding && (
              <div className="grounding-info" title={groundingToText(grounding)}>
                🔎 Florence-2: {grounding.regionCount} regiones inventariadas
                {grounding.ocr ? ' · texto detectado' : ''} — «{grounding.caption.slice(0, 90)}…»
              </div>
            )}
            <p className="hint">
              {mode === 'style'
                ? 'Extrae medio, reglas de ejecución, cámara, luz, color y mood — sin el sujeto. Las mediciones de arriba se le imponen a la IA como hechos.'
                : 'Deconstruye la imagen completa (incluido el sujeto) como prompt de replicación fiel al ADN, calibrado con las mediciones.'}
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
