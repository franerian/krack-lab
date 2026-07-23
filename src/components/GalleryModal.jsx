import React, { useEffect, useState } from 'react'
import { Images, X, Trash2, Copy, Download, Maximize2, Eraser } from 'lucide-react'
import { listGenerations, deleteGeneration, clearAll, estimateSize, HISTORY_CAP } from '../lib/imageStore.js'

// Modal "Generaciones guardadas": grid de miniaturas de las últimas
// HISTORY_CAP generaciones que el usuario marcó con el bookmark. Cada
// tarjeta ofrece agrandar, copiar el prompt origen, descargar y borrar.
// Los datos viven en IndexedDB (varios GB), FIFO se encarga en el store.
export default function GalleryModal({ onClose, toast }) {
  const [items, setItems] = useState(null) // null = cargando
  const [size, setSize] = useState({ count: 0, approxBytes: 0 })
  const [zoom, setZoom] = useState(null)

  const reload = async () => {
    try {
      const [list, s] = await Promise.all([listGenerations(), estimateSize()])
      setItems(list)
      setSize(s)
    } catch (e) {
      toast?.(`No se pudo leer el historial: ${e.message}`, 'error')
      setItems([])
    }
  }

  useEffect(() => { reload() }, [])

  const removeOne = async (id) => {
    try {
      await deleteGeneration(id)
      toast?.('Imagen eliminada del historial', 'ok')
      reload()
    } catch (e) {
      toast?.(`Error al borrar: ${e.message}`, 'error')
    }
  }

  const clearEverything = async () => {
    if (!items?.length) return
    if (!window.confirm(`¿Borrar las ${items.length} generaciones guardadas? No se pueden recuperar.`)) return
    try {
      await clearAll()
      toast?.('Historial vaciado', 'ok')
      reload()
    } catch (e) {
      toast?.(`Error al vaciar: ${e.message}`, 'error')
    }
  }

  const copyPrompt = (text) => {
    if (!text) return toast?.('Esta generación no tiene prompt asociado', 'error')
    navigator.clipboard.writeText(text)
    toast?.('Prompt copiado', 'ok')
  }

  const download = (dataUrl, label) => {
    const a = document.createElement('a')
    a.href = dataUrl
    const ext = (dataUrl.match(/^data:image\/(\w+)/)?.[1] || 'jpg').replace('jpeg', 'jpg')
    a.download = `${label || 'krack'}.${ext}`
    a.click()
  }

  const humanSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const humanDate = (ts) => {
    const d = new Date(ts)
    const now = new Date()
    const sameDay = d.toDateString() === now.toDateString()
    const time = d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
    return sameDay ? `hoy ${time}` : `${d.toLocaleDateString('es-AR')} ${time}`
  }

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-head">
          <div className="modal-title"><Images className="ico" />Generaciones <span className="accent">guardadas</span></div>
          <button className="modal-close" onClick={onClose}><X className="ico solo" /></button>
        </div>
        <div className="modal-body">
          <p className="hint" style={{ marginTop: 0 }}>
            Historial local del navegador — hasta {HISTORY_CAP} generaciones (las más viejas se descartan).
            {items?.length ? ` Actualmente ${size.count} · ${humanSize(size.approxBytes)}.` : ''}
          </p>
          {items === null && <div className="menu-empty">Cargando…</div>}
          {items?.length === 0 && (
            <div className="menu-empty">
              Todavía no guardaste ninguna generación.
              <br />En el modal Exportar o en el Style DNA Lab, al generar una imagen aparece el botón "Guardar".
            </div>
          )}
          {items?.length > 0 && (
            <div className="gallery-grid">
              {items.map((it) => (
                <div key={it.id} className="gallery-card">
                  <div className="gallery-thumb" onClick={() => setZoom(it)}>
                    <img src={it.dataUrl} alt="generación guardada" />
                    <span className="gen-thumb-hint"><Maximize2 className="ico solo" /></span>
                  </div>
                  <div className="gallery-meta">
                    <div className="gallery-tags">
                      {it.provider && <span className="metric-badge">{it.provider}</span>}
                      {it.target && <span className="metric-badge">{it.target}</span>}
                      {it.aspectRatio && <span className="metric-badge">{it.aspectRatio}</span>}
                    </div>
                    <div className="gallery-date">{humanDate(it.savedAt)}</div>
                  </div>
                  <div className="gallery-actions">
                    <button className="btn small" onClick={() => copyPrompt(it.prompt)} disabled={!it.prompt} title={it.prompt ? 'Copiar el prompt que generó esta imagen' : 'Sin prompt asociado'}>
                      <Copy className="ico" />Prompt
                    </button>
                    <button className="btn small" onClick={() => download(it.dataUrl, it.label)}>
                      <Download className="ico" />Descargar
                    </button>
                    <button className="btn small ghost danger" onClick={() => removeOne(it.id)} title="Borrar del historial">
                      <Trash2 className="ico solo" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="modal-foot">
          <div style={{ flex: 1 }} />
          {items?.length > 0 && (
            <button className="btn ghost danger" onClick={clearEverything}>
              <Eraser className="ico" />Vaciar historial
            </button>
          )}
        </div>
      </div>

      {zoom && (
        <div className="lightbox" onClick={() => setZoom(null)}>
          <img src={zoom.dataUrl} alt="generación guardada" onClick={(e) => e.stopPropagation()} />
          <div className="lightbox-bar" onClick={(e) => e.stopPropagation()}>
            <button className="btn small" onClick={() => copyPrompt(zoom.prompt)} disabled={!zoom.prompt}>
              <Copy className="ico" />Copiar prompt
            </button>
            <button className="btn small" onClick={() => download(zoom.dataUrl, zoom.label)}>
              <Download className="ico" />Descargar
            </button>
            <button className="btn small ghost" onClick={() => setZoom(null)}>
              <X className="ico" />Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
