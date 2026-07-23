import React, { useState } from 'react'
import { Maximize2, Download, X, Bookmark, BookmarkCheck } from 'lucide-react'
import { saveGeneration } from '../lib/imageStore.js'

// Muestra una imagen generada con acciones: agrandar (lightbox), descargar
// al disco, y guardar en el historial local (IndexedDB — persiste entre
// sesiones, FIFO de 30). Reutilizable en Export y Lab.
export default function ImageResult({ src, onRemove, name = 'krack-image', bookmarkMeta }) {
  const [zoom, setZoom] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  const download = (e) => {
    e?.stopPropagation()
    const a = document.createElement('a')
    a.href = src
    const ext = (src.match(/^data:image\/(\w+)/)?.[1] || 'jpg').replace('jpeg', 'jpg')
    a.download = `${name}.${ext}`
    a.click()
  }

  const bookmark = async (e) => {
    e?.stopPropagation()
    if (saving || saved) return
    setSaving(true)
    try {
      await saveGeneration({ dataUrl: src, label: name, ...(bookmarkMeta || {}) })
      setSaved(true)
    } catch (err) {
      console.error('IndexedDB save failed:', err)
      alert('No se pudo guardar la imagen: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const BookmarkIcon = saved ? BookmarkCheck : Bookmark
  const bookmarkLabel = saved ? 'Guardada' : (saving ? 'Guardando…' : 'Guardar')

  return (
    <div className="gen-preview">
      <div className="gen-thumb" onClick={() => setZoom(true)} title="Click para agrandar">
        <img src={src} alt="imagen generada" />
        <span className="gen-thumb-hint"><Maximize2 className="ico solo" /></span>
      </div>
      <div className="gen-actions">
        <button className="btn small" onClick={() => setZoom(true)}><Maximize2 className="ico" />Agrandar</button>
        <button className="btn small" onClick={download}><Download className="ico" />Descargar</button>
        <button className="btn small" onClick={bookmark} disabled={saved || saving} title="Guardar en el historial local del navegador">
          <BookmarkIcon className="ico" />{bookmarkLabel}
        </button>
        {onRemove && <button className="btn small ghost" onClick={onRemove}><X className="ico" />Quitar</button>}
      </div>

      {zoom && (
        <div className="lightbox" onClick={() => setZoom(false)}>
          <img src={src} alt="imagen generada" onClick={(e) => e.stopPropagation()} />
          <div className="lightbox-bar" onClick={(e) => e.stopPropagation()}>
            <button className="btn small" onClick={download}><Download className="ico" />Descargar</button>
            <button className="btn small" onClick={bookmark} disabled={saved || saving}>
              <BookmarkIcon className="ico" />{bookmarkLabel}
            </button>
            <button className="btn small ghost" onClick={() => setZoom(false)}><X className="ico" />Cerrar</button>
          </div>
        </div>
      )}
    </div>
  )
}
