import React, { useMemo, useState } from 'react'
import { Heart, X, ChevronRight } from 'lucide-react'
import { PRESET_GROUPS, CATEGORY_ORDER } from '../data/presets.js'

function PresetRow({ preset, fav, onToggleFav, onInsert, onDelete, applied, onHover }) {
  return (
    <div
      className={'preset-row' + (applied ? ' applied' : '')}
      onClick={() => onInsert(preset)}
      title={preset.text || preset.desc}
      onMouseEnter={() => applied && onHover?.(preset)}
      onMouseLeave={() => applied && onHover?.(null)}
    >
      {applied && <span className="applied-dot" />}
      <span className="preset-name">{preset.name}</span>
      {preset.section && <span className="preset-section-tag">{preset.section}</span>}
      {onDelete ? (
        <button
          className="preset-fav"
          title="Eliminar preset"
          onClick={(e) => { e.stopPropagation(); onDelete(preset) }}
        ><X className="ico solo" /></button>
      ) : (
        <button
          className={'preset-fav' + (fav ? ' on' : '')}
          title="Favorito"
          onClick={(e) => { e.stopPropagation(); onToggleFav(preset.id) }}
        ><Heart className="ico solo" fill={fav ? "currentColor" : "none"} /></button>
      )}
    </div>
  )
}

function Group({ label, presets, defaultOpen = false, children, count }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className={'group' + (open ? ' open' : '')}>
      <button className="group-head" onClick={() => setOpen(!open)}>
        {label}
        <span className="count">{count ?? presets?.length}</span>
        <span className="arrow"><ChevronRight /></span>
      </button>
      {open && <div className="group-body">{children}</div>}
    </div>
  )
}

// Etiqueta corta del proveedor+modelo actual para el panel de status.
const providerBadge = (s) => {
  if (!s) return { name: '—', model: '' }
  if (s.provider === 'ollama') return { name: 'Ollama', model: s.ollamaModel || 'sin modelo' }
  if (s.provider === 'pollinations') return { name: 'Pollinations', model: s.pollinationsModel || 'openai' }
  if (s.provider === 'fireworks') return { name: 'Fireworks', model: s.fireworksModel || 'kimi-k2p7-code' }
  return { name: 'Gemini', model: s.geminiModel || 'gemini-2.5-flash' }
}

const AR_OPTIONS = ['16:9', '9:16', '1:1', '4:3', '3:4', '2.39:1']

export default function PresetSidebar({
  open, favorites, onToggleFav, onInsert, customPresets, onDeleteCustom,
  sections, onHoverPreset,
  // Panel de status arriba (siempre visible, no ocupa espacio ni requiere abrir Ajustes)
  settings, onOpenSettings, ar, setAr,
}) {
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()

  // Un preset está "aplicado" si su texto vive hoy dentro de su sección.
  const sectionText = useMemo(() => {
    const map = {}
    for (const s of sections) map[s.name] = s.text
    return map
  }, [sections])

  const isApplied = (p) =>
    p.kind === 'insert' && !!p.text && (sectionText[p.section] || '').includes(p.text)

  const filtered = useMemo(() => {
    if (!q) return PRESET_GROUPS
    return PRESET_GROUPS.map((g) => ({
      ...g,
      presets: g.presets.filter(
        (p) => p.name.toLowerCase().includes(q) || p.text.toLowerCase().includes(q)
      ),
    })).filter((g) => g.presets.length)
  }, [q])

  // La búsqueda también cubre los presets guardados por el usuario
  // (incluidos los ADN de estilo, que no tienen `text`).
  const customFiltered = useMemo(() => {
    if (!q) return customPresets
    return customPresets.filter((p) =>
      [p.name, p.text, p.desc, p.section].filter(Boolean).some((f) => f.toLowerCase().includes(q))
    )
  }, [q, customPresets])

  const favPresets = useMemo(
    () => PRESET_GROUPS.flatMap((g) => g.presets).filter((p) => favorites.includes(p.id)),
    [favorites]
  )

  const byCategory = useMemo(() => {
    const map = new Map()
    for (const g of filtered) {
      if (!map.has(g.category)) map.set(g.category, [])
      map.get(g.category).push(g)
    }
    return map
  }, [filtered])

  const totalShown = filtered.reduce((n, g) => n + g.presets.length, 0)

  const badge = providerBadge(settings)
  const wordCount = sections.reduce((n, s) => n + (s.text.trim().split(/\s+/).filter(Boolean).length), 0)
  const filledSections = sections.filter((s) => s.text.trim()).length

  return (
    <aside className={'sidebar' + (open ? ' open' : '')}>
      {settings && (
        <div className="status-panel">
          <div className="status-row">
            <span className="slate-label">Modelo</span>
            <button
              type="button"
              className="status-value"
              onClick={onOpenSettings}
              title="Cambiar en Ajustes"
            >
              <span className="status-provider">{badge.name}</span>
              <span className="status-model">{badge.model}</span>
            </button>
          </div>
          <div className="status-row">
            <span className="slate-label">Aspecto</span>
            <select
              className="status-ar"
              value={ar || '16:9'}
              onChange={(e) => setAr && setAr(e.target.value)}
              title="Aspect ratio para exportar y generar"
            >
              {AR_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="status-row">
            <span className="slate-label">Prompt</span>
            <span className="status-meta">{filledSections} secc · {wordCount} palabras</span>
          </div>
        </div>
      )}
      <div className="sidebar-search">
        <input
          placeholder={`Buscar en ${PRESET_GROUPS.reduce((n, g) => n + g.presets.length, 0)} presets…`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="sidebar-scroll">
        {!q && favPresets.length > 0 && (
          <>
            <div className="cat-header">Favoritos</div>
            <Group label="Mis favoritos" presets={favPresets} defaultOpen>
              {favPresets.map((p) => (
                <PresetRow key={p.id} preset={p} fav onToggleFav={onToggleFav} onInsert={onInsert} applied={isApplied(p)} onHover={onHoverPreset} />
              ))}
            </Group>
          </>
        )}
        {customFiltered.length > 0 && (
          <>
            <div className="cat-header">Mis presets</div>
            <Group label="Guardados por mí" presets={customFiltered} defaultOpen>
              {customFiltered.map((p) => (
                <PresetRow key={p.id} preset={p} onInsert={onInsert} onDelete={onDeleteCustom} applied={isApplied(p)} onHover={onHoverPreset} />
              ))}
            </Group>
          </>
        )}
        {CATEGORY_ORDER.filter((c) => byCategory.has(c)).map((cat) => (
          <React.Fragment key={cat}>
            <div className="cat-header">{cat}</div>
            {byCategory.get(cat).map((g) => (
              <Group key={g.id} label={g.label} presets={g.presets} defaultOpen={!!q}>
                {g.presets.map((p) => (
                  <PresetRow
                    key={p.id}
                    preset={p}
                    fav={favorites.includes(p.id)}
                    onToggleFav={onToggleFav}
                    onInsert={onInsert}
                    applied={isApplied(p)}
                    onHover={onHoverPreset}
                  />
                ))}
              </Group>
            ))}
          </React.Fragment>
        ))}
        {q && totalShown === 0 && customFiltered.length === 0 && (
          <div className="cat-header">Sin resultados para “{query}”</div>
        )}
      </div>
    </aside>
  )
}
