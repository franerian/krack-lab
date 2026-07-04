import React, { useEffect, useMemo, useRef } from 'react'
import { ChevronUp, ChevronDown, Bookmark, X } from 'lucide-react'
import { highlightWithMark } from '../lib/highlight.js'
import { SECTION_NAMES } from '../data/keywords.js'
import { SCENE_TEMPLATES } from '../data/presets.js'

function SectionBlock({ section, onChange, onRemove, onMove, onSaveAsPreset, autoFocus, mark, hasApplied }) {
  const taRef = useRef(null)
  const html = useMemo(() => highlightWithMark(section.text, mark), [section.text, mark])

  useEffect(() => {
    const ta = taRef.current
    if (!ta) return
    const fit = () => {
      ta.style.height = 'auto'
      ta.style.height = ta.scrollHeight + 'px'
    }
    fit()
    // El alto depende del ancho: recalcular en resize (rotación, drawer…).
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [section.text])

  useEffect(() => {
    if (autoFocus) taRef.current?.focus()
  }, [autoFocus])

  return (
    <div className={'section-block' + (mark ? ' marked' : '')}>
      <div className="section-head">
        <span className={'section-name' + (hasApplied ? ' applied' : '')}>
          <span className="hash">#</span>{section.name}
          {hasApplied && <span className="applied-dot" title="Contiene presets aplicados" />}
        </span>
        <div className="section-tools">
          <button className="icon-btn" title="Subir" onClick={() => onMove(-1)}><ChevronUp className="ico solo" /></button>
          <button className="icon-btn" title="Bajar" onClick={() => onMove(1)}><ChevronDown className="ico solo" /></button>
          <button className="icon-btn" title="Guardar como preset" onClick={onSaveAsPreset}><Bookmark className="ico solo" /></button>
          <button className="icon-btn danger" title="Eliminar sección" onClick={onRemove}><X className="ico solo" /></button>
        </div>
      </div>
      <div className="section-body">
        <div className="hl-layer" dangerouslySetInnerHTML={{ __html: html + '\n' }} />
        <textarea
          ref={taRef}
          className="section-input"
          rows={1}
          spellCheck={false}
          value={section.text}
          placeholder={`Describe ${section.name.toLowerCase()}…`}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  )
}

export default function Editor({ sections, setSections, onLoadTemplate, onAddSection, onSavePreset, lastAddedId, hoverMark, appliedSections }) {
  const usedNames = new Set(sections.map((s) => s.name))
  const available = SECTION_NAMES.filter((n) => !usedNames.has(n))

  const update = (id, patch) =>
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)))

  const move = (id, dir) =>
    setSections((prev) => {
      const i = prev.findIndex((s) => s.id === id)
      const j = i + dir
      if (j < 0 || j >= prev.length) return prev
      const next = [...prev]
      ;[next[i], next[j]] = [next[j], next[i]]
      return next
    })

  return (
    <div className="editor">
      {sections.length === 0 && (
        <div className="editor-empty">
          <h2>Empezá tu prompt</h2>
          <p>Elegí una plantilla de escena o agregá secciones abajo.</p>
          <div className="template-row">
            {SCENE_TEMPLATES.map((t) => (
              <div key={t.id} className="template-card" onClick={() => onLoadTemplate(t)}>
                {t.name}
              </div>
            ))}
          </div>
        </div>
      )}
      {sections.map((s) => (
        <SectionBlock
          key={s.id}
          section={s}
          mark={hoverMark && hoverMark.section === s.name ? hoverMark.text : null}
          hasApplied={appliedSections?.has(s.name)}
          autoFocus={s.id === lastAddedId}
          onChange={(text) => update(s.id, { text })}
          onRemove={() => setSections((prev) => prev.filter((x) => x.id !== s.id))}
          onMove={(dir) => move(s.id, dir)}
          onSaveAsPreset={() => onSavePreset(s)}
        />
      ))}
      <div className="add-section">
        {available.map((n) => (
          <button key={n} className="chip" onClick={() => onAddSection(n)}>
            + {n}
          </button>
        ))}
      </div>
    </div>
  )
}
