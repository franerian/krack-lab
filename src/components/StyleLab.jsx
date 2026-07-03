import React, { useRef, useState } from 'react'
import { analyzeImageStyle, critiqueStyleDNA, refineFromComparison, isReady, providerHint, cancelActive } from '../lib/anthropic.js'
import LogViewer from './LogViewer.jsx'
import { clipSimilarity } from '../lib/clip.js'
import { fileToImage } from '../lib/image.js'
import { measureImage, extractFileMetadata, measurementsToText } from '../lib/imageAnalysis.js'
import { florenceGrounding, groundingToText } from '../lib/florence.js'
import { highlightHtml } from '../lib/highlight.js'
import { TARGETS, EXPORT_ASPECT_RATIOS } from '../data/targets.js'
import { addRun, getRuns } from '../lib/dnaLog.js'

const nowIso = () => new Date().toISOString().replace('T', ' ').slice(0, 19)
const modelLabel = (s) => (s.provider === 'ollama' ? s.ollamaModel : s.model)

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
  // Loop fotocopiadora
  const [genImg, setGenImg] = useState(null)
  const [genMetrics, setGenMetrics] = useState(null)
  const [clipScore, setClipScore] = useState(null)
  const [scoring, setScoring] = useState(false)
  const [refining, setRefining] = useState(false)
  const [version, setVersion] = useState(1)
  const [history, setHistory] = useState([])
  const genRef = useRef(null)
  // Log para iterar sobre la calidad del ADN
  const [showLog, setShowLog] = useState(false)
  const [runCount, setRunCount] = useState(() => getRuns().length)

  const loadFile = async (file) => {
    try {
      const loaded = await fileToImage(file)
      setImg(loaded)
      setResult(null)
      setGrounding(null)
      setGenImg(null)
      setClipScore(null)
      setVersion(1)
      setHistory([])
      // Mediciones objetivas: paleta, contraste, saturación, AR + metadata
      // embebida (EXIF / prompt de generadores IA). Instantáneo, sin IA.
      setMetrics(await measureImage(loaded.dataUrl).catch(() => null))
      setMeta(await extractFileMetadata(file))
    } catch {
      toast('Ese archivo no es una imagen válida', 'error')
    }
  }

  const analyze = async () => {
    if (busy) return
    if (!img) return toast('Cargá primero una imagen de referencia', 'error')
    if (!isReady(settings)) return toast(providerHint(settings), 'error')
    setBusy(true)
    let measurements = measurementsToText(metrics, meta)
    try {
      if (deep) {
        // Pasada Florence-2: inventario objetivo por regiones + OCR, en el
        // navegador. Si ya se analizó esta misma imagen (ej. reintento tras
        // un parse error), se reutiliza — grounding se resetea al cargar otra.
        setPass('florence')
        try {
          const g = grounding || await florenceGrounding(img.dataUrl, (p) => {
            if (p.status === 'progress' && p.file?.endsWith('.onnx')) {
              setDeepStatus(`Descargando Florence-2… ${Math.round(p.progress || 0)}%`)
            } else if (p.status === 'done') {
              setDeepStatus('Analizando regiones…')
            }
          })
          setGrounding(g)
          measurements = [measurements, groundingToText(g, mode)].filter(Boolean).join('\n\n')
        } catch (e) {
          toast('Florence-2 no disponible (sigo sin inventario): ' + e.message, 'error')
        }
        setDeepStatus('')
      }
      const passes = []
      setPass(1)
      let r = await analyzeImageStyle({ settings, image: img, mode, measurements })
      passes.push(r.trace)
      let sections = r.sections
      if (verify) {
        setPass(2)
        setResult(sections) // muestra el borrador mientras verifica
        r = await critiqueStyleDNA({ settings, image: img, draft: sections, mode, measurements })
        passes.push(r.trace)
        sections = r.sections
      }
      setResult(sections)
      logRun({ passes, measurements, final: sections })
      toast(verify ? 'ADN extraído y verificado ✓' : 'ADN visual extraído ✓', 'ok')
    } catch (e) {
      if (e.trace) logRun({ passes: [e.trace], measurements, final: null, error: e.message })
      toast('Error al analizar: ' + e.message, 'error')
    } finally {
      setBusy(false)
      setPass(0)
    }
  }

  // Guarda una corrida completa (inputs + prompts exactos + salida cruda).
  const logRun = ({ passes, measurements, final, error }) => {
    addRun({
      ts: nowIso(), mode, provider: settings.provider, model: modelLabel(settings),
      verify, deep, measurements,
      grounding: grounding ? { caption: grounding.caption, cells: grounding.cells, ocr: grounding.ocr } : null,
      passes, final, error,
    })
    setRunCount(getRuns().length)
  }

  const toObj = () => Object.fromEntries(result.map((s) => [s.name, s.text]))

  // ── Loop fotocopiadora ──
  const loadGenFile = async (file) => {
    try {
      const loaded = await fileToImage(file)
      setGenImg(loaded)
      setClipScore(null)
      setScoring(true)
      const [gm, score] = await Promise.all([
        measureImage(loaded.dataUrl).catch(() => null),
        clipSimilarity(img.dataUrl, loaded.dataUrl).catch(() => null),
      ])
      setGenMetrics(gm)
      setClipScore(score)
      if (score != null) setHistory((prev) => [...prev, { v: version, score }])
      setScoring(false)
    } catch {
      setScoring(false)
      toast('Ese archivo no es una imagen válida', 'error')
    }
  }

  const comparisonText = () => {
    const lines = ['OBJECTIVE COMPARISON DATA (measured programmatically — facts):']
    if (clipScore != null) lines.push(`- CLIP visual similarity between original and generation: ${clipScore}/100`)
    if (metrics && genMetrics) {
      // Paleta COMPLETA con porcentajes: los acentos minoritarios (ej. un tono
      // cálido al 7%) suelen ser el alma de la imagen — nunca recortarlos.
      // Incluye los acentos salientes: son los primeros que se pierden.
      const pal = (m) => [...m.palette, ...(m.accents || [])].map((c) => `${c.hex} (${c.pct}%)`).join(' ')
      lines.push(
        `- ORIGINAL: brightness ${metrics.brightness10}/10 (${metrics.key}), contrast ${metrics.contrast10}/10, saturation ${metrics.saturation10}/10, palette ${pal(metrics)}`,
        `- GENERATION: brightness ${genMetrics.brightness10}/10 (${genMetrics.key}), contrast ${genMetrics.contrast10}/10, saturation ${genMetrics.saturation10}/10, palette ${pal(genMetrics)}`,
      )
      const db = genMetrics.brightness10 - metrics.brightness10
      const dc = genMetrics.contrast10 - metrics.contrast10
      const ds = genMetrics.saturation10 - metrics.saturation10
      const drifts = [
        db && `generation brightness is ${db > 0 ? 'higher' : 'lower'} by ${Math.abs(db)} points${db > 1 ? ' (wrong time-of-day / exposure — correct explicitly)' : ''}`,
        dc && `generation contrast is ${dc > 0 ? 'higher' : 'lower'} by ${Math.abs(dc)} points`,
        ds && `generation saturation is ${ds > 0 ? 'higher' : 'lower'} by ${Math.abs(ds)} points`,
      ].filter(Boolean)
      if (drifts.length) lines.push(`- Drift to compensate: ${drifts.join('; ')}.`)
      // Acentos del original ausentes en la generación. La distancia RGB sola
      // no alcanza: un acento CÁLIDO (#9c837c) queda "cerca" de un gris neutro
      // de igual luminancia — por eso también se compara la temperatura (R−B).
      const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
      const isMissing = (c) =>
        !genMetrics.palette.some((g) => {
          const [ar, ag, ab2] = rgb(c.hex)
          const [br, bg, bb] = rgb(g.hex)
          const rgbClose = Math.sqrt((ar - br) ** 2 + (ag - bg) ** 2 + (ab2 - bb) ** 2) <= 60
          const warmthClose = Math.abs((ar - ab2) - (br - bb)) <= 30
          return rgbClose && warmthClose
        })
      const missing = metrics.palette.filter(isMissing)
      if (missing.length) {
        lines.push(`- MISSING COLORS: the original contains ${missing.map((c) => `${c.hex} (${c.pct}%)`).join(', ')} with no close match in the generation — restore these (they are often practicals/accents like headlight glow).`)
      }
    }
    return lines.join('\n')
  }

  const refine = async () => {
    if (!genImg || !result) return
    if (!isReady(settings)) return toast(providerHint(settings), 'error')
    setRefining(true)
    const comparisonData = comparisonText()
    try {
      const r = await refineFromComparison({
        settings, original: img, generated: genImg, draft: result, mode, comparisonData,
      })
      setResult(r.sections)
      setVersion((v) => v + 1)
      setGenImg(null)
      setClipScore(null)
      logRun({ passes: [r.trace], measurements: comparisonData, final: r.sections })
      toast(`Prompt corregido → v${version + 1}. Generá de nuevo y traé el resultado.`, 'ok')
    } catch (e) {
      if (e.trace) logRun({ passes: [e.trace], measurements: comparisonData, final: null, error: e.message })
      toast('Error al refinar: ' + e.message, 'error')
    } finally {
      setRefining(false)
    }
  }

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
          <button
            className="btn small"
            title="Ver el log de corridas (prompts exactos y salida cruda) para iterar la calidad"
            onClick={() => setShowLog(true)}
          >🐞 Log{runCount ? ` (${runCount})` : ''}</button>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        {showLog && (
          <LogViewer
            onClose={() => setShowLog(false)}
            onCleared={() => setRunCount(0)}
            toast={toast}
          />
        )}
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
                {metrics.accents?.length > 0 && (
                  <div className="accent-row" title="Colores de poca área pero visualmente definitorios (detectados como outliers cromáticos)">
                    <span className="accent-label">acentos</span>
                    {metrics.accents.map((c) => (
                      <span
                        key={c.hex}
                        className="accent-chip"
                        style={{ background: c.hex }}
                        title={`${c.hex} · ${c.pct}%`}
                      />
                    ))}
                  </div>
                )}
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
            {busy && (
              <button className="btn ghost" style={{ width: '100%' }} onClick={() => cancelActive()}>
                ✕ Cancelar
              </button>
            )}
            {grounding && (
              <div className="grounding-info" title={groundingToText(grounding)}>
                🔎 Florence-2: {grounding.regionCount} regiones inventariadas
                {grounding.ocr ? ' · texto detectado' : ''} — «{grounding.caption.slice(0, 90)}…»
              </div>
            )}
            {result && (
              <div className="loop-panel">
                <div className="metrics-title">📠 Loop de fidelidad · prompt v{version}</div>
                <div
                  className="loop-drop"
                  onClick={() => genRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => { e.preventDefault(); loadGenFile(e.dataTransfer.files[0]) }}
                  title="Generá una imagen con este prompt en tu plataforma y traela acá para medir la fidelidad"
                >
                  {genImg
                    ? <img src={genImg.dataUrl} alt="generación" />
                    : <span>Arrastrá acá la imagen<br />generada con el prompt v{version}</span>}
                </div>
                {scoring && <p className="hint"><span className="spinner" />Midiendo similitud (CLIP)…</p>}
                {clipScore != null && (
                  <div className="clip-score">
                    <span className={'score-badge ' + (clipScore >= 90 ? 'good' : clipScore >= 75 ? 'mid' : 'bad')}>
                      {clipScore}/100
                    </span>
                    similitud CLIP
                    {genMetrics && metrics && (
                      <span className="hint" style={{ marginLeft: 4 }}>
                        · Δcontraste {genMetrics.contrast10 - metrics.contrast10 >= 0 ? '+' : ''}{genMetrics.contrast10 - metrics.contrast10}
                        · Δsat {genMetrics.saturation10 - metrics.saturation10 >= 0 ? '+' : ''}{genMetrics.saturation10 - metrics.saturation10}
                      </span>
                    )}
                  </div>
                )}
                {history.length > 0 && (
                  <div className="score-history">
                    {history.map((h, i) => (
                      <span key={i} className="metric-badge">v{h.v}: {h.score}</span>
                    ))}
                    {history.length >= 2 && (
                      <span className="hint">
                        {history[history.length - 1].score > history[0].score ? '↑ convergiendo' : ''}
                      </span>
                    )}
                  </div>
                )}
                {genImg && !scoring && (
                  <button className="btn" style={{ width: '100%' }} onClick={refine} disabled={refining}>
                    {refining ? <span className="spinner" /> : '📠 '}Corregir prompt → v{version + 1}
                  </button>
                )}
                <input ref={genRef} type="file" accept="image/*" hidden onChange={(e) => loadGenFile(e.target.files[0])} />
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
