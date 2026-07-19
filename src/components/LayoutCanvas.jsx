import React, { useRef } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { paletteForRegion } from '../lib/imageAnalysis.js'

// Canvas de layout embebible (fusión DNA Lab ↔ Layout Builder): la imagen
// como fondo y cajas (bbox) editables encima — dibujar, mover, redimensionar.
// Componente CONTROLADO: boxes/selected viven en el padre (StyleLab).
// Cada caja: { id, box:{x,y,w,h} 0-1, desc, type:'obj'|'text', text, palette, color }

const clamp01 = (v) => Math.max(0, Math.min(1, v))
const MIN_SIZE = 0.02
export const BOX_COLORS = ['#f8615a', '#60a5fa', '#4ade80', '#eab308', '#c084fc', '#fb923c', '#52b5d9', '#f472b6']
export const newBoxId = () => Math.random().toString(36).slice(2, 9)

export default function LayoutCanvas({ bg, ratio, boxes, setBoxes, selected, setSelected }) {
  const canvasRef = useRef(null)
  const gesture = useRef(null)
  const sel = boxes.find((b) => b.id === selected) || null

  const relPoint = (e) => {
    const r = canvasRef.current.getBoundingClientRect()
    return { x: clamp01((e.clientX - r.left) / r.width), y: clamp01((e.clientY - r.top) / r.height) }
  }

  const patchBox = (id, patch) =>
    setBoxes((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)))

  const measurePalette = async (id, box) => {
    if (!bg) return
    const palette = await paletteForRegion(bg, box)
    if (palette.length) patchBox(id, { palette })
  }

  const onCanvasDown = (e) => {
    if (e.target !== canvasRef.current && !e.target.classList?.contains('lb-img')) return
    const p = relPoint(e)
    const id = newBoxId()
    setBoxes((prev) => [...prev, {
      id, box: { x: p.x, y: p.y, w: 0, h: 0 }, desc: '', type: 'obj', text: '',
      palette: [], color: BOX_COLORS[boxes.length % BOX_COLORS.length],
    }])
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
      let nx0 = Math.min(o.x, o.x + o.w), ny0 = Math.min(o.y, o.y + o.h)
      let nx1 = Math.max(o.x, o.x + o.w), ny1 = Math.max(o.y, o.y + o.h)
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
    const id = newBoxId()
    const box = { x: 0.3, y: 0.3, w: 0.4, h: 0.4 }
    setBoxes((prev) => [...prev, { id, box, desc: '', type: 'obj', text: '', palette: [], color: BOX_COLORS[boxes.length % BOX_COLORS.length] }])
    setSelected(id)
    measurePalette(id, box)
  }

  const removeSelected = () => {
    if (!selected) return
    setBoxes((prev) => prev.filter((b) => b.id !== selected))
    setSelected(null)
  }

  return (
    <>
      <div
        ref={canvasRef}
        className="lb-canvas"
        style={{ aspectRatio: String(ratio) }}
        onPointerDown={onCanvasDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
      >
        {bg && <img className="lb-img" src={bg} alt="referencia" draggable={false} />}
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
        <span className="hint" style={{ alignSelf: 'center' }}>Arrastrá sobre la imagen para crear una zona.</span>
      </div>
      {sel && (
        <div className="lb-inspector">
          <div className="field">
            <label>Región {String(boxes.indexOf(sel) + 1).padStart(2, '0')} · tipo</label>
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
              rows={3}
              value={sel.desc}
              placeholder="Qué es, condición, materiales, pose…"
              onChange={(e) => patchBox(sel.id, { desc: e.target.value })}
            />
          </div>
          {sel.palette.length > 0 && (
            <div className="el-palette">
              {sel.palette.map((h) => <span key={h} className="accent-chip" style={{ background: h }} title={h} />)}
            </div>
          )}
        </div>
      )}
    </>
  )
}
