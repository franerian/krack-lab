import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Undo2, Redo2, Trash2, Folder, Save, X, Dna, UserRound, Copy, Send, Sun, Moon, Settings, Sparkles, SlidersHorizontal } from 'lucide-react'
import Editor from './components/Editor.jsx'
import PresetSidebar from './components/PresetSidebar.jsx'
import CharacterStudio from './components/CharacterStudio.jsx'
import StoryboardView from './components/StoryboardView.jsx'
import SettingsModal from './components/SettingsModal.jsx'
import ExportModal from './components/ExportModal.jsx'
import StyleLab from './components/StyleLab.jsx'
import { PRESET_GROUPS } from './data/presets.js'

const ALL_INSERT_PRESETS = PRESET_GROUPS.flatMap((g) => g.presets).filter((p) => p.kind === 'insert')
import { usePersistedState, uid } from './lib/storage.js'
import { ACTION_LIST, runAction, runSmartEdit, sectionsToText, isReady, providerHint, cancelActive, OLLAMA_DEFAULT_URL } from './lib/anthropic.js'

const DEFAULT_SECTIONS = []

export default function App() {
  const [sections, setSections] = usePersistedState('sections', DEFAULT_SECTIONS)
  const [favorites, setFavorites] = usePersistedState('favorites', [])
  const [customPresets, setCustomPresets] = usePersistedState('customPresets', [])
  const [characters, setCharacters] = usePersistedState('characters', [])
  // Demo (Gemini gratuito) como default: la app funciona sin configurar nada.
  const [settings, setSettings] = usePersistedState('settings', {
    provider: 'gemini', geminiKey: '', geminiModel: 'gemini-2.5-flash',
    apiKey: '', model: 'claude-sonnet-5',
    ollamaUrl: OLLAMA_DEFAULT_URL, ollamaModel: '',
  })
  const [view, setView] = useState('editor')
  const [busy, setBusy] = useState(null)
  const [instruction, setInstruction] = useState('')
  const [showCS, setShowCS] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [showStyleLab, setShowStyleLab] = useState(false)
  const [editMenu, setEditMenu] = useState(false)
  const [promptsMenu, setPromptsMenu] = useState(false)
  const [savedPrompts, setSavedPrompts] = usePersistedState('savedPrompts', [])
  // Tema claro/oscuro (persistido; default oscuro, identidad de la app)
  const [theme, setTheme] = usePersistedState('theme', 'dark')
  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])
  // Drawer de presets en mobile
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [hoverMark, setHoverMark] = useState(null)
  const [exportTarget, setExportTarget] = usePersistedState('exportTarget', 'structured')
  const [exportAr, setExportAr] = usePersistedState('exportAr', '16:9')
  const [toasts, setToasts] = useState([])
  const [lastAddedId, setLastAddedId] = useState(null)
  const undoStack = useRef([])
  const redoStack = useRef([])

  const toast = useCallback((msg, kind = '') => {
    const id = uid()
    setToasts((prev) => [...prev, { id, msg, kind }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500)
  }, [])

  const pushUndo = useCallback(() => {
    undoStack.current.push(JSON.stringify(sections))
    if (undoStack.current.length > 30) undoStack.current.shift()
    redoStack.current = []
  }, [sections])

  const undo = () => {
    const prev = undoStack.current.pop()
    if (!prev) return toast('Nada que deshacer')
    redoStack.current.push(JSON.stringify(sections))
    setSections(JSON.parse(prev))
  }

  const redo = () => {
    const next = redoStack.current.pop()
    if (!next) return toast('Nada que rehacer')
    undoStack.current.push(JSON.stringify(sections))
    setSections(JSON.parse(next))
  }

  // Secciones que contienen al menos un preset aplicado (para marcar # en accent).
  const appliedSections = React.useMemo(() => {
    const map = new Map(sections.map((s) => [s.name, s.text]))
    const out = new Set()
    for (const p of [...ALL_INSERT_PRESETS, ...customPresets]) {
      if (p.kind === 'insert' && p.text && (map.get(p.section) || '').includes(p.text)) out.add(p.section)
    }
    return out
  }, [sections, customPresets])

  // Reemplaza el contenido con secciones parseadas (de la IA), conservando ids.
  const applyParsed = (parsed) => {
    setSections((prev) => {
      const byName = new Map(prev.map((s) => [s.name, s.id]))
      return parsed.map((p) => ({ id: byName.get(p.name) || uid(), name: p.name, text: p.text }))
    })
  }

  // Fusiona un objeto {Sección: texto} dentro del prompt actual.
  const mergeSections = (obj) => {
    pushUndo()
    setSections((prev) => {
      let next = prev.map((s) => ({ ...s }))
      for (const [name, text] of Object.entries(obj)) {
        if (!text || !text.trim()) continue
        const existing = next.find((s) => s.name === name)
        if (existing) {
          const cur = existing.text.trim()
          existing.text = cur ? cur + (cur.endsWith('.') ? ' ' : '. ') + text : text
        } else {
          next.push({ id: uid(), name, text })
        }
      }
      return next
    })
  }

  const addSection = (name) => {
    const id = uid()
    setLastAddedId(id)
    setSections((prev) => [...prev, { id, name, text: '' }])
  }

  const insertPreset = (preset) => {
    if (preset.kind === 'template') {
      pushUndo()
      setSections(Object.entries(preset.sections).map(([name, text]) => ({ id: uid(), name, text })))
      toast(`Plantilla “${preset.name}” cargada`, 'ok')
      return
    }
    if (preset.kind === 'style') {
      mergeSections(preset.sections)
      toast(`ADN “${preset.name}” aplicado al prompt`, 'ok')
      return
    }
    mergeSections({ [preset.section]: preset.text })
    toast(`“${preset.name}” → # ${preset.section}`, 'ok')
  }

  const saveStylePreset = (name, sectionsObj) => {
    setCustomPresets((prev) => [
      ...prev,
      { id: 'c' + uid(), kind: 'style', name, sections: sectionsObj, desc: 'ADN visual extraído de una imagen' },
    ])
  }

  const replaceSections = (obj) => {
    pushUndo()
    setSections(Object.entries(obj).map(([name, text]) => ({ id: uid(), name, text })))
  }

  const savePresetFromSection = (section) => {
    if (!section.text.trim()) return toast('La sección está vacía', 'error')
    const name = window.prompt('Nombre del preset:', section.name + ' custom')
    if (!name) return
    setCustomPresets((prev) => [
      ...prev,
      { id: 'c' + uid(), kind: 'insert', name, section: section.name, text: section.text.trim() },
    ])
    toast(`Preset “${name}” guardado`, 'ok')
  }

  const doAction = async (actionId) => {
    if (busy) return
    if (!isReady(settings)) {
      setShowSettings(true)
      return toast(providerHint(settings), 'error')
    }
    setBusy(actionId)
    try {
      pushUndo()
      const parsed = await runAction({ settings, actionId, sections })
      applyParsed(parsed)
      toast(`${ACTION_LIST.find((a) => a.id === actionId)?.label} aplicado ✓`, 'ok')
    } catch (e) {
      if (e.message === 'EMPTY_PROMPT') toast('El prompt está vacío', 'error')
      else toast('Error: ' + e.message, 'error')
    } finally {
      setBusy(null)
    }
  }

  const doSmartEdit = async () => {
    if (busy) return
    const ins = instruction.trim()
    if (!ins) return
    if (!isReady(settings)) {
      setShowSettings(true)
      return toast(providerHint(settings), 'error')
    }
    setBusy('smart')
    try {
      pushUndo()
      const parsed = await runSmartEdit({ settings, instruction: ins, sections })
      applyParsed(parsed)
      setInstruction('')
      toast('Smart Edit aplicado ✓', 'ok')
    } catch (e) {
      toast('Error: ' + e.message, 'error')
    } finally {
      setBusy(null)
    }
  }

  const copyPrompt = () => {
    const text = sectionsToText(sections)
    if (!text) return toast('El prompt está vacío', 'error')
    navigator.clipboard.writeText(text)
    toast('Prompt copiado al portapapeles', 'ok')
  }

  // Limpia el editor (el prompt anterior queda a un Undo de distancia).
  const clearPrompt = () => {
    if (!sections.length) return toast('El prompt ya está vacío')
    pushUndo()
    setSections([])
    toast('Prompt nuevo — Undo recupera el anterior', 'ok')
  }

  // ── Prompts guardados (sesiones) ──
  const suggestName = () => {
    const subject = sections.find((s) => s.name === 'Subject')?.text.trim()
    const base = subject || sections.find((s) => s.text.trim())?.text.trim() || ''
    return base ? base.split(/\s+/).slice(0, 5).join(' ').replace(/[.,;:]$/, '') : 'Prompt sin título'
  }

  const saveSession = () => {
    if (!sections.some((s) => s.text.trim())) return toast('El prompt está vacío', 'error')
    const name = window.prompt('Nombre del prompt:', suggestName())
    if (!name) return
    setSavedPrompts((prev) => [
      { id: uid(), name, ts: Date.now(), sections: sections.map((s) => ({ ...s })) },
      ...prev,
    ].slice(0, 30))
    toast(`“${name}” guardado en Prompts`, 'ok')
  }

  const loadSession = (session) => {
    pushUndo()
    setSections(session.sections.map((s) => ({ ...s })))
    toast(`“${session.name}” abierto (Undo vuelve al anterior)`, 'ok')
  }

  const deleteSession = (id) => {
    setSavedPrompts((prev) => prev.filter((s) => s.id !== id))
  }

  const sessionDate = (ts) => {
    const d = new Date(ts)
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  }


  return (
    <div className="app">
      <header className="topbar">
        <div className="logo">
          <span className="spark"><Sparkles /></span>
          KRACK<span className="lab">LAB</span>
        </div>
        <div className="tb-actions">
          <button
            className={'tb-btn' + (view === 'editor' ? ' active' : '')}
            onClick={() => setView('editor')}
          >Editor</button>
          <button
            className={'tb-btn' + (view === 'storyboard' ? ' active' : '')}
            onClick={() => setView('storyboard')}
          >Storyboard</button>
          <span style={{ width: 1, background: 'var(--border)', margin: '8px 6px' }} />
          <div className="dropdown">
            <button
              className={'tb-btn' + (editMenu ? ' active' : '')}
              disabled={!!busy && busy !== 'smart'}
              onClick={() => setEditMenu((v) => !v)}
            >{busy && busy !== 'smart' ? <span className="spinner" /> : null}Edit ▾</button>
            {editMenu && (
              <>
                <div className="menu-backdrop" onClick={() => setEditMenu(false)} />
                <div className="menu">
                  {ACTION_LIST.map((a) => (
                    <button
                      key={a.id}
                      className="menu-item"
                      onClick={() => { setEditMenu(false); doAction(a.id) }}
                    >{a.label}</button>
                  ))}
                </div>
              </>
            )}
          </div>
          <button className="tb-btn" onClick={undo} title="Deshacer"><Undo2 className="ico" />Undo</button>
          <button className="tb-btn" onClick={redo} title="Rehacer"><Redo2 className="ico" />Redo</button>
          <button className="tb-btn" onClick={clearPrompt} title="Empezar un prompt nuevo (el actual queda a un Undo)"><Trash2 className="ico" />Nuevo</button>
          <div className="dropdown">
            <button
              className={'tb-btn' + (promptsMenu ? ' active' : '')}
              onClick={() => setPromptsMenu((v) => !v)}
              title="Prompts guardados"
            ><Folder className="ico" />Prompts{savedPrompts.length ? ` (${savedPrompts.length})` : ''} ▾</button>
            {promptsMenu && (
              <>
                <div className="menu-backdrop" onClick={() => setPromptsMenu(false)} />
                <div className="menu" style={{ minWidth: 260 }}>
                  <button
                    className="menu-item"
                    onClick={() => { setPromptsMenu(false); saveSession() }}
                  ><Save className="ico" />Guardar prompt actual</button>
                  {savedPrompts.length > 0 && <div className="menu-divider" />}
                  {savedPrompts.map((s) => (
                    <div key={s.id} className="menu-row">
                      <button
                        className="menu-item"
                        title={`Abrir (${s.sections.filter((x) => x.text.trim()).length} secciones)`}
                        onClick={() => { setPromptsMenu(false); loadSession(s) }}
                      >
                        {s.name}
                        <span className="menu-date">{sessionDate(s.ts)}</span>
                      </button>
                      <button
                        className="icon-btn danger"
                        title="Borrar este prompt guardado"
                        onClick={() => deleteSession(s.id)}
                      ><X className="ico solo" /></button>
                    </div>
                  ))}
                  {!savedPrompts.length && (
                    <div className="menu-empty">Sin prompts guardados aún.</div>
                  )}
                </div>
              </>
            )}
          </div>
          {busy && (
            <button
              className="tb-btn cancel"
              title="Cancelar la operación de IA en curso"
              onClick={() => { cancelActive(); setBusy(null) }}
            ><X className="ico" />Cancelar</button>
          )}
        </div>
        <button className="btn" onClick={() => setShowStyleLab(true)} title="Extraer el ADN visual de una imagen"><Dna className="ico" />Style DNA</button>
        <button className="btn" onClick={() => setShowCS(true)}><UserRound className="ico" />Character Studio</button>
        <button className="btn" onClick={copyPrompt} title="Copiar con # encabezados"><Copy className="ico" />Copiar</button>
        <button className="btn primary" onClick={() => setShowExport(true)} title="Compilar para Midjourney, Sora, Kling, SDXL…"><Send className="ico" />Exportar</button>
        <button
          className="btn ghost"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
        >{theme === 'dark' ? <Sun className="ico solo" /> : <Moon className="ico solo" />}</button>
        <button className="btn ghost" onClick={() => setShowSettings(true)} title="Ajustes"><Settings className="ico solo" /></button>
      </header>

      <main className="main">
        {view === 'editor' ? (
          <Editor
            sections={sections}
            setSections={setSections}
            lastAddedId={lastAddedId}
            hoverMark={hoverMark}
            appliedSections={appliedSections}
            onAddSection={addSection}
            onSavePreset={savePresetFromSection}
            onLoadTemplate={(t) => insertPreset(t)}
          />
        ) : (
          <StoryboardView sections={sections} settings={settings} toast={toast} />
        )}
      </main>

      {view === 'editor' && (
        <div className="smartbar">
          <input
            placeholder='Smart Edit — escribí una instrucción… ej: "cambiá la luz a un día nublado"'
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && doSmartEdit()}
          />
          <button className="btn primary" onClick={doSmartEdit} disabled={busy === 'smart'}>
            {busy === 'smart' ? <span className="spinner" /> : <Sparkles className="ico" />}Smart Edit
          </button>
        </div>
      )}

      {/* FAB + backdrop del drawer de presets (solo visibles en mobile) */}
      {!sidebarOpen && (
        <button className="sidebar-fab" title="Presets" onClick={() => setSidebarOpen(true)}><SlidersHorizontal /></button>
      )}
      {sidebarOpen && <div className="drawer-backdrop" onClick={() => setSidebarOpen(false)} />}
      <PresetSidebar
        open={sidebarOpen}
        favorites={favorites}
        onToggleFav={(id) =>
          setFavorites((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
        }
        onInsert={insertPreset}
        customPresets={customPresets}
        onDeleteCustom={(p) => setCustomPresets((prev) => prev.filter((x) => x.id !== p.id))}
        sections={sections}
        onHoverPreset={(p) => setHoverMark(p ? { section: p.section, text: p.text } : null)}
      />

      {showCS && (
        <CharacterStudio
          settings={settings}
          characters={characters}
          setCharacters={setCharacters}
          onUse={mergeSections}
          onClose={() => setShowCS(false)}
          toast={toast}
        />
      )}
      {showStyleLab && (
        <StyleLab
          settings={settings}
          onApply={mergeSections}
          onReplace={replaceSections}
          onSavePreset={saveStylePreset}
          onClose={() => setShowStyleLab(false)}
          toast={toast}
          target={exportTarget}
          setTarget={setExportTarget}
          ar={exportAr}
          setAr={setExportAr}
        />
      )}
      {showExport && (
        <ExportModal
          sections={sections}
          target={exportTarget}
          setTarget={setExportTarget}
          ar={exportAr}
          setAr={setExportAr}
          onClose={() => setShowExport(false)}
          toast={toast}
          settings={settings}
        />
      )}
      {showSettings && (
        <SettingsModal
          settings={settings}
          setSettings={setSettings}
          onClose={() => setShowSettings(false)}
          toast={toast}
        />
      )}

      <div className="toasts">
        {toasts.map((t) => (
          <div key={t.id} className={'toast ' + t.kind}>{t.msg}</div>
        ))}
      </div>
    </div>
  )
}
