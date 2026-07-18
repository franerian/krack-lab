import React, { useEffect, useRef, useState } from 'react'
import { LayoutGrid, X, Copy, Plus, Trash2, ImagePlus, ClipboardPaste, Send } from 'lucide-react'
import { buildIdeogramCaption, parseIdeogramCaption, captionToSections } from '../lib/ideogram.js'
import { paletteForRegion } from '../lib/imageAnalysis.js'
import { fileToImage } from '../lib/image.js'

// Layout Builder: cajas (bbox) sobre un canvas con o sin imagen de fondo,
// al estilo del Prompt Builder de Ideogram 4. Cada caja lleva descripción,
// tipo (obj/text) y paleta (medida de los píxeles del recorte si hay imagen).
// Compila al caption JSON de Ideogram (interoperable con node-special /
// Forge) y también a secciones del editor ("Aplicar al prompt").
//
// Alcance deliberado (MVP): rectángulos con mover/redimensionar — el dibujo
// a mano alzada, flood fill y polilíneas viven en node-special (ComfyUI).

const uid = () => Math.random().toString(36).slice(2, 9)
const clamp01 = (v) => Math.max(0, Math.min(1, v))
const MIN_SIZE = 0.02

const COLORS = ['#f8615a', '#60a5fa', '#4ade80', '#eab308', '#c084fc', '#fb923c', '#52b5d9', '#f472b6']

export default function LayoutBuilder({ initial, onApply, onClose, toast, ar = '16:9' }) {
  const [boxes, setBoxes] = useState(() => (initial?.elements || []).map((el, i) => ({
    id: uid(), box: el.box, desc: el.desc || '', type: el.type || 'obj',
    text: el.text || '', palette: el.palette || [], color: COLORS[i % COLORS.length],
  })))
  const [selected, setSelected] = useState(null)
  const [bg, setBg] = useState(initial?.image || null)
  const [highLevel, setHighLevel] = useState(initial?.highLevel || '')
  const [background, setBackground] = useState(initial?.background || '')
  const canvasRef = useRef(null)
  const fileRef = useRef(null)
  // Gesto en curso: {mode:'create'|'move'|'resize', id, corner, startX, startY, orig}
  const gesture = useRef(null)

  const sel = boxes.find((b) => b.id === selected) || null

  // Aspecto del canvas: el de la imagen si hay; si no, el AR de exportación.
  const [imgRatio, setImgRatio] = useState(null)
  useEffect(() => {
    if (!bg) { setImgRatio(null); return }
    const im = new Image()
    im.onload = () => setImgRatio(im.naturalWidth / im.naturalHeight)
    im.src = bg
  }, [bg])
  const [arW, arH] = (ar || '16:9').split(':').map(Number)
  const ratio = imgRatio || (arW && arH ? arW / arH : 16 / 9)

  const relPoint = (e) => {
    const r = canvasRef.current.getBoundingClientRect()
    return { x: clamp01((e.clientX - r.left) / r.width), y: clamp01((e.clientY - r.top) / r.height) }
  }

  const patchBox = (id, patch) =>
    setBoxes((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)))

  // Paleta local medida del recorte (solo si hay imagen de fondo).
  const measurePalette = async (id, box) => {
    if (!bg) return
    const palette = await paletteForRegion(bg, box)
    if (palette.length) patchBox(id, { palette })
  }

  const onCanvasDown = (e) => {
    if (e.target !== canvasRef.current && !e.target.classList?.contains('lb-img')) return
    const p = relPoint(e)
    const id = uid()
    const color = COLORS[boxes.length % COLORS.length]
    setBoxes((prev) => [...prev, { id, box: { x: p.x, y: p.y, w: 0, h: 0 }, desc: '', type: 'obj', text: '', palette: [], color }])
    setSelected(id)
    gesture.current = { mode: 'create', id, startX: p.x, startY: p.y }
  }

  const onBoxDown = (e, id) => {
    e.stopPropagation()
    setSelected(id)
    const p = relPoint(e)
    const b = boxes.find((x) => x.id === id)
    gesture.current = { mode: 'move', id, startX: p.x, startY: p.y, orig: { ...b.box } }
  }

  const onHandleDown = (e, id, corner) => {
    e.stopPropagation()
    setSelected(id)
    const b = boxes.find((x) => x.id === id)
    gesture.current = { mode: 'resize', id, corner, orig: { ...b.box } }
  }

  const onMove = (e) => {
    const g = gesture.current
    if (!g) return
    const p = relPoint(e)
    if (g.mode === 'create') {
      patchBox(g.id, { box: { x: g.startX, y: g.startY, w: p.x - g.startX, h: p.y - g.startY } })
    } else if (g.mode === 'move') {
      const dx = p.x - g.startX
      const dy = p.y - g.startY
      const w = Math.abs(g.orig.w)
      const h = Math.abs(g.orig.h)
      patchBox(g.id, { box: { x: clamp01(Math.min(g.orig.x, g.orig.x + g.orig.w) + dx), y: clamp01(Math.min(g.orig.y, g.orig.y + g.orig.h) + dy), w, h } })
    } else if (g.mode === 'resize') {
      const o = g.orig
      const x0 = Math.min(o.x, o.x + o.w)
      const y0 = Math.min(o.y, o.y + o.h)
      const x1 = Math.max(o.x, o.x + o.w)
      const y1 = Math.max(o.y, o.y + o.h)
      let nx0 = x0, ny0 = y0, nx1 = x1, ny1 = y1
      if (g.corner.includes('l')) nx0 = p.x
      if (g.corner.includes('r')) nx1 = p.x
      if (g.corner.includes('t')) ny0 = p.y
      if (g.corner.includes('b')) ny1 = p.y
      patchBox(g.id, { box: { x: Math.min(nx0, nx1), y: Math.min(ny0, ny1), w: Math.abs(nx1 - nx0), h: Math.abs(ny1 - ny0) } })
    }
  }

  const onUp = () => {
    const g = gesture.current
    gesture.current = null
    if (!g) return
    const b = boxes.find((x) => x.id === g.id)
    if (!b) return
    // Normaliza w/h negativos; descarta cajas de un click sin arrastre.
    const norm = {
      x: Math.min(b.box.x, b.box.x + b.box.w), y: Math.min(b.box.y, b.box.y + b.box.h),
      w: Math.abs(b.box.w), h: Math.abs(b.box.h),
    }
    if (g.mode === 'create' && (norm.w < MIN_SIZE || norm.h < MIN_SIZE)) {
      setBoxes((prev) => prev.filter((x) => x.id !== g.id))
      setSelected(null)
      return
    }
    patchBox(g.id, { box: norm })
    measurePalette(g.id, norm)
  }

  const addCenteredBox = () => {
    const id = uid()
    const box = { x: 0.3, y: 0.3, w: 0.4, h: 0.4 }
    setBoxes((prev) => [...prev, { id, box, desc: '', type: 'obj', text: '', palette: [], color: COLORS[boxes.length % COLORS.length] }])
    setSelected(id)
    measurePalette(id, box)
  }

  const removeSelected = () => {
    if (!selected) return
    setBoxes((prev) => prev.filter((b) => b.id !== selected))
    setSelected(null)
  }

  const loadBg = async (file) => {
    try {
      const im = await fileToImage(file)
      setBg(im.dataUrl)
      // Re-mide paletas de todas las cajas contra la imagen nueva.
      for (const b of boxes) measurePalette(b.id, b.box)
    } catch {
      toast('Ese archivo no es una imagen válida', 'error')
    }
  }

  const compileCaption = () =>
    buildIdeogramCaption({
      sections: initial?.sections || [],
      elements: boxes.map((b) => ({ box: b.box, desc: b.desc, type: b.type, text: b.text, palette: b.palette })),
      background,
      highLevel,
    })

  const copyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(compileCaption(), null, 1))
    toast('Caption JSON de Ideogram copiado', 'ok')
  }

  const importJson = () => {
    const raw = window.prompt('Pegá el caption JSON de Ideogram (de node-special, Forge o la app):')
    if (!raw) return
    try {
      const parsed = parseIdeogramCaption(raw)
      setHighLevel(parsed.highLevel)
      setBackground(parsed.background)
      setBoxes(parsed.elements.filter((e) => e.box).map((el, i) => ({
        id: uid(), box: el.box, desc: el.desc, type: el.type, text: el.text,
        palette: el.palette, color: COLORS[i % COLORS.length],
      })))
      setSelected(null)
      toast('Layout importado ✓', 'ok')
    } catch {
      toast('No se pudo parsear el JSON', 'error')
    }
  }

  const apply = () => {
    const secs = captionToSections(parseIdeogramCaption(compileCaption()))
    if (!Object.keys(secs).length) return toast('El layout está vacío', 'error')
    onApply(secs)
    toast('Layout aplicado al prompt', 'ok')
    onClose()
  }

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal wide">
        <div className="modal-head">
          <div className="modal-title"><LayoutGrid className="ico" />Layout <span className="accent">Builder</span></div>
          <button className="btn small" onClick={importJson} title="Importar un caption JSON de Ideogram"><ClipboardPaste className="ico" />Importar JSON</button>
          <button className="btn small" onClick={copyJson} disabled={!boxes.length && !background && !highLevel}><Copy className="ico" />Copiar JSON</button>
          <button className="modal-close" onClick={onClose}><X className="ico solo" /></button>
        </div>
        <div className="modal-body lb-body">
          <div className="lb-left">
            <div
              ref={canvasRef}
              className="lb-canvas"
              style={{ aspectRatio: String(ratio) }}
              onPointerDown={onCanvasDown}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerLeave={onUp}
            >
              {bg && <img className="lb-img" src={bg} alt="fondo" draggable={false} />}
              {!bg && !boxes.length && (
                <span className="lb-hint-empty">Arrastrá para dibujar una caja<br />o subí una imagen de referencia</span>
              )}
              {boxes.map((b, i) => {
                const x = Math.min(b.box.x, b.box.x + b.box.w)
                const y = Math.min(b.box.y, b.box.y + b.box.h)
                const w = Math.abs(b.box.w)
                const h = Math.abs(b.box.h)
                const active = b.id === selected
                return (
                  <div
                    key={b.id}
                    className={'lb-box' + (active ? ' active' : '')}
                    style={{
                      left: `${x * 100}%`, top: `${y * 100}%`,
                      width: `${w * 100}%`, height: `${h * 100}%`,
                      borderColor: b.color,
                      background: active ? `${b.color}22` : 'transparent',
                    }}
                    onPointerDown={(e) => onBoxDown(e, b.id)}
                  >
                    <span className="el-num" style={{ background: b.color }}>{String(i + 1).padStart(2, '0')}</span>
                    {active && ['tl', 'tr', 'bl', 'br'].map((corner) => (
                      <span
                        key={corner}
                        className={`lb-handle ${corner}`}
                        style={{ borderColor: b.color }}
                        onPointerDown={(e) => onHandleDown(e, b.id, corner)}
                      />
                    ))}
                  </div>
                )
              })}
            </div>
            <div className="lb-toolbar">
              <button className="btn small" onClick={addCenteredBox}><Plus className="ico" />Caja</button>
              <button className="btn small" onClick={removeSelected} disabled={!selected}><Trash2 className="ico" />Quitar</button>
              <button className="btn small" onClick={() => fileRef.current?.click()}><ImagePlus className="ico" />{bg ? 'Cambiar imagen' : 'Imagen de fondo'}</button>
              {bg && <button className="btn small ghost" onClick={() => setBg(null)}>Sin imagen</button>}
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => { loadBg(e.target.files[0]); e.target.value = '' }} />
            </div>
            <div className="field">
              <label>Descripción general (high-level)</label>
              <textarea rows={2} value={highLevel} placeholder="Una oración que resume la imagen completa…" onChange={(e) => setHighLevel(e.target.value)} />
            </div>
            <div className="field">
              <label>Fondo / entorno (background)</label>
              <textarea rows={2} value={background} placeholder="Solo paredes, piso, luz y entorno — los objetos van en cajas…" onChange={(e) => setBackground(e.target.value)} />
            </div>
          </div>
          <div className="lb-right">
            <div className="metrics-title">Regiones ({boxes.length})</div>
            <div className="lb-regions">
              {!boxes.length && <div className="menu-empty">Dibujá cajas en el canvas para los sujetos, objetos y textos.</div>}
              {boxes.map((b, i) => (
                <button
                  key={b.id}
                  className={'lb-region-row' + (b.id === selected ? ' active' : '')}
                  onClick={() => setSelected(b.id)}
                  style={{ borderLeftColor: b.color }}
                >
                  <span className="el-num-badge" style={{ color: b.color, borderColor: b.color }}>{String(i + 1).padStart(2, '0')}</span>
                  <span className="el-desc">{b.desc || (b.type === 'text' ? `"${b.text}"` : 'sin descripción')}</span>
                  <span className="el-palette">
                    {b.palette.slice(0, 3).map((h) => <span key={h} className="accent-chip" style={{ background: h }} title={h} />)}
                  </span>
                </button>
              ))}
            </div>
            {sel && (
              <div className="lb-inspector">
                <div className="field">
                  <label>Tipo</label>
                  <select value={sel.type} onChange={(e) => patchBox(sel.id, { type: e.target.value })}>
                    <option value="obj">Objeto / sujeto</option>
                    <option value="text">Texto literal</option>
                  </select>
                </div>
                {sel.type === 'text' && (
                  <div className="field">
                    <label>Texto a renderizar</label>
                    <input value={sel.text} placeholder="OPEN 24H" onChange={(e) => patchBox(sel.id, { text: e.target.value })} />
                  </div>
                )}
                <div className="field">
                  <label>Descripción</label>
                  <textarea
                    rows={4}
                    value={sel.desc}
                    placeholder="Qué es, condición, materiales, pose…"
                    onChange={(e) => patchBox(sel.id, { desc: e.target.value })}
                  />
                </div>
                {sel.palette.length > 0 && (
                  <div className="field">
                    <label>Paleta medida del recorte</label>
                    <div className="el-palette">
                      {sel.palette.map((h) => <span key={h} className="accent-chip" style={{ background: h }} title={h} />)}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="modal-foot">
          <span className="hint">Las cajas se compilan al caption JSON de Ideogram 4; "Aplicar" las vuelca como secciones del editor.</span>
          <div style={{ flex: 1 }} />
          <button className="btn primary" onClick={apply} disabled={!boxes.length && !background && !highLevel}>
            <Send className="ico" />Aplicar al prompt →
          </button>
        </div>
      </div>
    </div>
  )
}
