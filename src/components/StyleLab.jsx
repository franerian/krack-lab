import React, { useRef, useState } from 'react'
import { Dna, Bug, X, Camera, Crosshair, Search, Printer, Copy, Bookmark, ImagePlus, Plus } from 'lucide-react'
import { generateImage } from '../lib/imageGen.js'
import { analyzeImageStyle, critiqueStyleDNA, refineFromComparison, isReady, providerHint, cancelActive, pickDirectModel } from '../lib/anthropic.js'
import LogViewer from './LogViewer.jsx'
import ImageResult from './ImageResult.jsx'
import { clipSimilarity } from '../lib/clip.js'
import { fileToImage } from '../lib/image.js'
import { measureImage, extractFileMetadata, measurementsToText, multiMeasurementsToText, aggregateMetrics } from '../lib/imageAnalysis.js'
import { florenceGrounding, groundingToText } from '../lib/florence.js'
import { highlightHtml } from '../lib/highlight.js'
import { TARGETS, EXPORT_ASPECT_RATIOS } from '../data/targets.js'
import { addRun, getRuns } from '../lib/dnaLog.js'

const nowIso = () => new Date().toISOString().replace('T', ' ').slice(0, 19)
// Snapshot corto del prompt (secciones concatenadas, sin encabezados) para
// mostrarlo en el hover del thumbnail del strip de versiones.
const sectionsToPromptSnapshot = (secs) =>
  secs.filter((s) => s.text.trim() && s.name !== 'Negative').map((s) => s.text.trim()).join(' ')

const modelLabel = (s) =>
  s.provider === 'ollama' ? s.ollamaModel
  : s.provider === 'pollinations' ? (s.pollinationsModel || 'openai')
  : s.provider === 'fireworks' ? (s.fireworksModel || 'kimi-k2p7-code')
  : (s.geminiModel || 'gemini')

const MAX_REFS = 5

export default function StyleLab({ settings, onApply, onReplace, onSavePreset, onClose, toast, target, setTarget, ar, setAr, imageProvider }) {
  // Referencias de estilo: 1 en modo réplica, hasta MAX_REFS en "solo estilo".
  // Cada item: { dataUrl, base64, mediaType, file, metrics, meta }.
  const [images, setImages] = useState([])
  const [mode, setMode] = useState('style')
  const [busy, setBusy] = useState(false)
  const [pass, setPass] = useState(0) // 0 idle | 'florence' | 1 extracción | 2 autocrítica
  // Ambos ON por default: un solo botón "Extraer ADN" corre todo el pipeline.
  // Autocrítica siempre suma calidad con costo mínimo; Florence-2 descarga
  // 230 MB la primera vez (cacheado después). Los toggles quedan como
  // "opciones avanzadas" para desactivar si querés más velocidad.
  const [verify, setVerify] = useState(true)
  const [deep, setDeep] = useState(true)
  const [advanced, setAdvanced] = useState(false)
  const [deepStatus, setDeepStatus] = useState('')
  const [grounding, setGrounding] = useState(null)
  const [result, setResult] = useState(null)
  const [drag, setDrag] = useState(false)
  const fileRef = useRef(null)
  const addRef = useRef(null)

  // La primera imagen es la de referencia del loop; sus métricas alimentan el
  // comparador. El panel de mediciones muestra el agregado si hay varias.
  const primary = images[0] || null
  const metrics = primary?.metrics || null
  const meta = primary?.meta || null
  const panelMetrics = images.length > 1
    ? aggregateMetrics(images.map((i) => i.metrics).filter(Boolean))
    : metrics
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

  // Al cambiar el set de referencias, se invalida el análisis previo.
  const resetAnalysis = () => {
    setResult(null); setGrounding(null); setGenImg(null)
    setClipScore(null); setVersion(1); setHistory([])
  }

  // Carga y mide una o varias imágenes. En réplica reemplaza (una sola);
  // en "solo estilo" agrega hasta MAX_REFS.
  const addFiles = async (fileList) => {
    const files = [...(fileList || [])].filter((f) => f && f.type.startsWith('image/'))
    if (!files.length) return
    const loaded = []
    for (const file of files) {
      try {
        const im = await fileToImage(file)
        // Mediciones objetivas + metadata embebida (EXIF / prompt), sin IA.
        const [m, mt] = await Promise.all([
          measureImage(im.dataUrl).catch(() => null),
          extractFileMetadata(file),
        ])
        loaded.push({ ...im, file, metrics: m, meta: mt })
      } catch {
        toast('Ese archivo no es una imagen válida', 'error')
      }
    }
    if (!loaded.length) return
    setImages((prev) => (mode === 'replica' ? loaded.slice(0, 1) : [...prev, ...loaded].slice(0, MAX_REFS)))
    resetAnalysis()
  }

  const removeImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx))
    resetAnalysis()
  }

  const analyze = async () => {
    if (busy) return
    if (!images.length) return toast('Cargá primero una imagen de referencia', 'error')
    if (!isReady(settings)) return toast(providerHint(settings), 'error')
    setBusy(true)
    // Usa la versión chica (512max, JPEG 0.75) para el LLM — ahorra ~5x
    // en tokens de imagen sin perder señal de estilo. La grande queda para
    // display, mediciones y CLIP.
    const imgPayload = images.map((i) => ({ base64: i.llmBase64 || i.base64, mediaType: i.mediaType }))
    let measurements = images.length > 1 ? multiMeasurementsToText(images) : measurementsToText(metrics, meta)
    try {
      if (deep) {
        // Pasada Florence-2: inventario objetivo por regiones + OCR, en el
        // navegador. Si ya se analizó esta misma imagen (ej. reintento tras
        // un parse error), se reutiliza — grounding se resetea al cargar otra.
        setPass('florence')
        try {
          const g = grounding || await florenceGrounding(primary.dataUrl, (p) => {
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
      let r = await analyzeImageStyle({ settings, images: imgPayload, mode, measurements })
      passes.push(r.trace)
      let sections = r.sections
      if (verify) {
        setPass(2)
        setResult(sections) // muestra el borrador mientras verifica
        r = await critiqueStyleDNA({ settings, images: imgPayload, draft: sections, mode, measurements })
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
  // Procesa una generación (cargada o generada in-app): mide y puntúa.
  const processGen = async (loaded) => {
    setGenImg(loaded)
    setClipScore(null)
    setScoring(true)
    const [gm, score] = await Promise.all([
      measureImage(loaded.dataUrl).catch(() => null),
      clipSimilarity(primary.dataUrl, loaded.dataUrl).catch(() => null),
    ])
    setGenMetrics(gm)
    setClipScore(score)
    // Guarda también dataUrl y snapshot del prompt para el strip de versiones
    // (permite volver a comparar cualquier iteración sin regenerarla).
    setHistory((prev) => [
      ...prev.filter((h) => h.v !== version),
      { v: version, score, dataUrl: loaded.dataUrl, prompt: result ? sectionsToPromptSnapshot(result) : '' },
    ].sort((a, b) => a.v - b.v))
    setScoring(false)
  }

  // Restaura una versión anterior del loop desde el strip: repone su imagen y
  // score sin re-generar, y deja el prompt actual intacto (para comparar).
  const restoreHistory = (h) => {
    setGenImg({ dataUrl: h.dataUrl, base64: h.dataUrl.split(',')[1], mediaType: 'image/jpeg' })
    setClipScore(h.score)
  }

  const loadGenFile = async (file) => {
    try {
      await processGen(await fileToImage(file))
    } catch {
      setScoring(false)
      toast('Ese archivo no es una imagen válida', 'error')
    }
  }

  // Genera in-app desde el ADN actual (prosa estilo Flux) y mide al toque.
  const [genBusy, setGenBusy] = useState(false)
  const generateAndMeasure = async () => {
    if (genBusy || !result) return
    setGenBusy(true)
    try {
      const prompt = TARGETS.find((t) => t.id === 'flux').compile(result)
      const loaded = await generateImage({
        provider: imageProvider,
        prompt,
        aspectRatio: metrics?.aspectNearest || '16:9',
        settings,
      })
      await processGen(loaded)
      toast('Generada y medida — mirá el score', 'ok')
    } catch (e) {
      toast('Error al generar: ' + e.message, 'error')
    } finally {
      setGenBusy(false)
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
        settings, original: primary, generated: genImg, draft: result, mode, comparisonData,
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
          <div className="modal-title"><Dna className="ico" />Style <span className="accent">DNA Lab</span></div>
          <div className="tabs">
            <button
              className={'tab' + (mode === 'style' ? ' active' : '')}
              onClick={() => { setMode('style'); setResult(null) }}
              title="Solo el tratamiento visual, transferible a cualquier escena. Podés combinar varias imágenes de referencia."
            >Solo estilo (ADN)</button>
            <button
              className={'tab' + (mode === 'replica' ? ' active' : '')}
              onClick={() => { setMode('replica'); setResult(null); setImages((p) => p.slice(0, 1)) }}
              title="Reconstruye también el sujeto y la escena. Una sola imagen."
            >Réplica completa</button>
          </div>
          <button
            className="btn small"
            title="Ver el log de corridas (prompts exactos y salida cruda) para iterar la calidad"
            onClick={() => setShowLog(true)}
          ><Bug className="ico" />Log{runCount ? ` (${runCount})` : ''}</button>
          <button className="modal-close" onClick={onClose}><X className="ico solo" /></button>
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
            {images.length === 0 ? (
              <div
                className={'sl-drop' + (drag ? ' dragover' : '')}
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
                onDragLeave={() => setDrag(false)}
                onDrop={(e) => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files) }}
                onPaste={(e) => addFiles(e.clipboardData.files)}
              >
                <span>
                  Arrastrá, pegá o clickeá<br />para cargar {mode === 'style' ? 'imágenes' : 'la imagen'} de referencia
                  {mode === 'style' && <><br /><span className="sl-drop-sub">podés combinar varias — se extrae el estilo común</span></>}
                </span>
              </div>
            ) : (
              <div className="ref-strip">
                {images.map((im, i) => (
                  <div className="ref-thumb" key={im.dataUrl.slice(-24) + i}>
                    <img src={im.dataUrl} alt={`referencia ${i + 1}`} />
                    {i === 0 && images.length > 1 && <span className="ref-badge" title="Referencia del loop de fidelidad">1ª</span>}
                    <button className="ref-remove" title="Quitar" onClick={() => removeImage(i)}><X className="ico solo" /></button>
                  </div>
                ))}
                {mode === 'style' && images.length < MAX_REFS && (
                  <button
                    className={'ref-add' + (drag ? ' dragover' : '')}
                    onClick={() => addRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
                    onDragLeave={() => setDrag(false)}
                    onDrop={(e) => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files) }}
                    title="Agregar otra imagen de referencia"
                  >
                    <Plus className="ico solo" /><span>sumar</span>
                  </button>
                )}
              </div>
            )}
            <input ref={addRef} type="file" accept="image/*" multiple hidden onChange={(e) => { addFiles(e.target.files); e.target.value = '' }} />
            {panelMetrics && (
              <div className="metrics-panel">
                <div className="metrics-title">
                  Mediciones (código, no IA)
                  {images.length > 1 && <span className="metrics-sub"> · promedio de {images.length} imágenes</span>}
                </div>
                <div className="palette-row">
                  {panelMetrics.palette.map((c) => (
                    <span
                      key={c.hex}
                      className="swatch"
                      style={{ background: c.hex, flexGrow: c.pct }}
                      title={`${c.hex} · ${c.pct}%`}
                    />
                  ))}
                </div>
                {panelMetrics.accents?.length > 0 && (
                  <div className="accent-row" title="Colores de poca área pero visualmente definitorios (detectados como outliers cromáticos)">
                    <span className="accent-label">acentos</span>
                    {panelMetrics.accents.map((c) => (
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
                  <span className="metric-badge" title="Desviación tonal medida">Contraste {panelMetrics.contrast10}/10</span>
                  <span className="metric-badge">Saturación {panelMetrics.saturation10}/10</span>
                  <span className="metric-badge">{panelMetrics.key}</span>
                  <span className="metric-badge">{panelMetrics.aspect}</span>
                </div>
                {images.length === 1 && meta?.kind === 'exif' && (
                  <div className="meta-found" title={meta.text}><Camera className="ico" />EXIF real: {meta.text}</div>
                )}
                {images.length === 1 && meta?.kind === 'ai-prompt' && (
                  <div className="meta-found gold" title={meta.text}>
                    <Crosshair className="ico" />¡Prompt original embebido detectado! ({meta.source}) — se usará como fuente principal
                  </div>
                )}
              </div>
            )}
            <button className="btn primary" style={{ width: '100%' }} onClick={analyze} disabled={busy || !images.length}>
              {busy ? <span className="spinner" /> : <Dna className="ico" />}
              {busy
                ? (pass === 'florence'
                    ? (deepStatus || 'Leyendo la imagen (Florence-2)…')
                    : pass === 2 ? 'Verificando fidelidad… (2/2)' : `Extrayendo ADN… (1/${verify ? 2 : 1})`)
                : 'Extraer ADN visual'}
            </button>
            <button
              type="button"
              className="advanced-toggle"
              onClick={() => setAdvanced((v) => !v)}
              title="Ajustes finos del pipeline: autocrítica y análisis profundo con Florence-2"
            >
              {advanced ? '▾' : '▸'} Opciones avanzadas
              {(!verify || !deep) && <span className="advanced-hint"> · algunas desactivadas</span>}
            </button>
            {advanced && (
              <div className="advanced-panel">
                <label className="verify-toggle">
                  <input type="checkbox" checked={verify} onChange={(e) => setVerify(e.target.checked)} />
                  <span>
                    Autocrítica <span className="opt-desc">— 2ª pasada anti-exageración (recomendado)</span>
                  </span>
                </label>
                <label className="verify-toggle" title="Corre Florence-2 en tu navegador para inventario objetivo por regiones + OCR. Descarga ~230 MB la primera vez, queda cacheado.">
                  <input type="checkbox" checked={deep} onChange={(e) => setDeep(e.target.checked)} />
                  <span>
                    Análisis profundo <span className="opt-desc">— Florence-2 local (~230 MB la 1ª vez, cacheado después)</span>
                  </span>
                </label>
              </div>
            )}
            {busy && (
              <button className="btn ghost" style={{ width: '100%' }} onClick={() => cancelActive()}>
                <X className="ico" />Cancelar
              </button>
            )}
            {grounding && (
              <div className="grounding-info" title={groundingToText(grounding)}>
                <Search className="ico" />Florence-2: {grounding.regionCount} regiones inventariadas
                {grounding.ocr ? ' · texto detectado' : ''} — «{grounding.caption.slice(0, 90)}…»
              </div>
            )}
            {(() => {
              // Con Fireworks el DNA Lab ahora usa Structured Outputs → Kimi
              // responde en JSON limpio sin fallback. Para otros proveedores
              // sigue el override preventivo.
              if (settings.provider === 'fireworks') return null
              const { override } = pickDirectModel(settings, { needsVision: true })
              return override ? <div className="model-override" title="Fallback automático para tareas del DNA Lab">↳ {override}</div> : null
            })()}
            {result && (
              <div className="loop-panel">
                <div className="metrics-title"><Printer className="ico" />Loop de fidelidad · prompt v{version}</div>
                {genImg ? (
                  <ImageResult
                    src={genImg.dataUrl}
                    onRemove={() => { setGenImg(null); setClipScore(null) }}
                    name={`krack-gen-v${version}`}
                  />
                ) : (
                  <div
                    className="loop-drop"
                    onClick={() => genRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => { e.preventDefault(); loadGenFile(e.dataTransfer.files[0]) }}
                    title="Generá una imagen con este prompt en tu plataforma y traela acá para medir la fidelidad"
                  >
                    <span>Arrastrá acá la imagen<br />generada con el prompt v{version}</span>
                  </div>
                )}
                <button
                  className="btn small"
                  style={{ width: '100%' }}
                  onClick={genBusy ? () => cancelActive() : generateAndMeasure}
                  title="Genera una imagen con el prompt actual y la mide automáticamente"
                >
                  {genBusy
                    ? <><span className="spinner" />Cancelar generación</>
                    : <><ImagePlus className="ico" />Generar y medir (gratis)</>}
                </button>
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
                  <>
                    <div className="version-strip">
                      {history.map((h) => (
                        <button
                          key={h.v}
                          type="button"
                          className={'version-thumb' + (h.v === version && genImg?.dataUrl === h.dataUrl ? ' active' : '')}
                          onClick={() => restoreHistory(h)}
                          title={`v${h.v} · CLIP ${h.score} — click para comparar`}
                        >
                          <img src={h.dataUrl} alt={`v${h.v}`} />
                          <span className={'version-score ' + (h.score >= 90 ? 'good' : h.score >= 75 ? 'mid' : 'bad')}>
                            v{h.v} · {h.score}
                          </span>
                        </button>
                      ))}
                    </div>
                    {history.length >= 2 && (
                      <div className="hint">
                        {history[history.length - 1].score > history[0].score
                          ? `↑ convergiendo (v1 ${history[0].score} → v${history[history.length - 1].v} ${history[history.length - 1].score})`
                          : ''}
                      </div>
                    )}
                  </>
                )}
                {genImg && !scoring && (
                  <button className="btn" style={{ width: '100%' }} onClick={refine} disabled={refining}>
                    {refining ? <span className="spinner" /> : <Printer className="ico" />}Corregir prompt → v{version + 1}
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
              <button className="btn" onClick={copyCompiled}><Copy className="ico" />Copiar</button>
            </>
          )}
          <button className="btn" onClick={save} disabled={!result}><Bookmark className="ico" />Guardar como preset</button>
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
        <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => { addFiles(e.target.files); e.target.value = '' }} />
      </div>
    </div>
  )
}
