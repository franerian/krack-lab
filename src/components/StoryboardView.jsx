import React, { useRef, useState } from 'react'
import { Clapperboard, Sparkles, Copy } from 'lucide-react'
import { COVERAGE_TYPES } from '../data/coverage.js'
import { generateCoverage, offlineCoverage, isReady, textToSections } from '../lib/anthropic.js'

// Los planos se muestran estructurados, pero se copian como prosa limpia:
// los generadores no entienden los encabezados "#".
const toProse = (text) => {
  const sections = textToSections(text)
  if (!sections.length) return text
  return sections
    .filter((s) => s.name !== 'Negative')
    .map((s) => s.text.trim())
    .join(' ')
}

function ShotCard({ index, label, text, toast }) {
  const [img, setImg] = useState(null)
  const [drag, setDrag] = useState(false)
  const fileRef = useRef(null)

  const loadFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    setImg((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return URL.createObjectURL(file)
    })
  }

  const clearImg = () => {
    setImg((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return null
    })
  }

  const copy = () => {
    navigator.clipboard.writeText(toProse(text))
    toast(`Plano ${index + 1} copiado (limpio, sin encabezados)`, 'ok')
  }

  // Resalta los encabezados "# Sección" en la vista del plano.
  const parts = text.split(/^(#\s*[^\n]+)$/m).filter(Boolean)

  return (
    <div className="shot-card">
      <div className="shot-card-head">
        <span className="shot-num">{String(index + 1).padStart(2, '0')}</span>
        <span className="shot-label">{label}</span>
      </div>
      <div
        className={'shot-drop' + (drag ? ' dragover' : '')}
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); loadFile(e.dataTransfer.files[0]) }}
        onPaste={(e) => loadFile(e.clipboardData.files[0])}
        title="Arrastrá o pegá la imagen generada para compararla"
      >
        {img ? <img src={img} alt={label} /> : 'Arrastrá aquí la imagen generada'}
      </div>
      <div className="shot-text">
        {parts.map((p, i) =>
          p.startsWith('#') ? <b key={i}>{p}{'\n'}</b> : <span key={i}>{p}</span>
        )}
      </div>
      <div className="shot-actions">
        <button className="btn small" onClick={copy}><Copy className="ico" />Copiar prompt</button>
        {img && <button className="btn small ghost" onClick={clearImg}>Quitar imagen</button>}
      </div>
      <input
        ref={fileRef} type="file" accept="image/*" hidden
        onChange={(e) => loadFile(e.target.files[0])}
      />
    </div>
  )
}

export default function StoryboardView({ sections, settings, toast }) {
  const [coverageId, setCoverageId] = useState(COVERAGE_TYPES[0].id)
  const [shots, setShots] = useState(null)
  const [busy, setBusy] = useState(false)
  const coverage = COVERAGE_TYPES.find((c) => c.id === coverageId)

  const generate = async () => {
    const hasContent = sections.some((s) => s.text.trim())
    if (!hasContent) return toast('Escribí primero la escena en el editor', 'error')
    if (isReady(settings)) {
      setBusy(true)
      try {
        const out = await generateCoverage({ settings, coverage, sections })
        setShots(out.slice(0, coverage.shots.length))
        toast('Cobertura generada con IA', 'ok')
      } catch (e) {
        toast('Error de IA, usando modo plantilla: ' + e.message, 'error')
        setShots(offlineCoverage(coverage, sections))
      } finally {
        setBusy(false)
      }
    } else {
      setShots(offlineCoverage(coverage, sections))
      toast('Cobertura por plantillas (activá Claude u Ollama en Ajustes para versiones IA)', 'ok')
    }
  }

  const copyAll = () => {
    if (!shots) return
    const all = shots
      .map((s, i) => `── SHOT ${i + 1} · ${coverage.shots[i]?.label || ''} ──\n${toProse(s)}`)
      .join('\n\n')
    navigator.clipboard.writeText(all)
    toast('Storyboard completo copiado (planos limpios)', 'ok')
  }

  return (
    <div className="storyboard">
      <div className="sb-head">
        <h2><Clapperboard className="ico" />Storyboard</h2>
        <select value={coverageId} onChange={(e) => { setCoverageId(e.target.value); setShots(null) }}>
          {COVERAGE_TYPES.map((c) => (
            <option key={c.id} value={c.id}>{c.name} · {c.shots.length} shots</option>
          ))}
        </select>
        <button className="btn primary" onClick={generate} disabled={busy}>
          {busy ? <span className="spinner" /> : <Sparkles className="ico" />}Generar cobertura
        </button>
        {shots && <button className="btn" onClick={copyAll}><Copy className="ico" />Copiar todo</button>}
      </div>
      <p className="sb-desc">{coverage.desc} La escena base es la del editor; cada plano cambia solo la cinematografía.</p>
      {shots ? (
        <div className="sb-grid">
          {shots.map((text, i) => (
            <ShotCard
              key={coverageId + i}
              index={i}
              label={coverage.shots[i]?.label || `Shot ${i + 1}`}
              text={text}
              toast={toast}
            />
          ))}
        </div>
      ) : (
        <div className="sb-grid">
          {coverage.shots.map((s, i) => (
            <div key={i} className="shot-card">
              <div className="shot-card-head">
                <span className="shot-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="shot-label">{s.label}</span>
              </div>
              <div className="shot-text">{s.instruction}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
