import React, { useMemo, useState } from 'react'
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
        >✕</button>
      ) : (
        <button
          className={'preset-fav' + (fav ? ' on' : '')}
          title="Favorito"
          onClick={(e) => { e.stopPropagation(); onToggleFav(preset.id) }}
        >{fav ? '♥' : '♡'}</button>
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
        <span className="arrow">▶</span>
      </button>
      {open && <div className="group-body">{children}</div>}
    </div>
  )
}

export default function PresetSidebar({ favorites, onToggleFav, onInsert, customPresets, onDeleteCustom, sections, onHoverPreset }) {
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

  return (
    <aside className="sidebar">
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
            <div className="cat-header">♥ Favoritos</div>
            <Group label="Mis favoritos" presets={favPresets} defaultOpen>
              {favPresets.map((p) => (
                <PresetRow key={p.id} preset={p} fav onToggleFav={onToggleFav} onInsert={onInsert} applied={isApplied(p)} onHover={onHoverPreset} />
              ))}
            </Group>
          </>
        )}
        {!q && customPresets.length > 0 && (
          <>
            <div className="cat-header">🔖 Mis presets</div>
            <Group label="Guardados por mí" presets={customPresets} defaultOpen>
              {customPresets.map((p) => (
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
        {q && totalShown === 0 && <div className="cat-header">Sin resultados para “{query}”</div>}
      </div>
    </aside>
  )
}
