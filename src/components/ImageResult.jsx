import React, { useState } from 'react'
import { Maximize2, Download, X } from 'lucide-react'

// Muestra una imagen generada con acciones: agrandar (lightbox a pantalla
// completa) y guardar (descarga el dataUrl). Reutilizable en Export y Lab.
export default function ImageResult({ src, onRemove, name = 'krack-image' }) {
  const [zoom, setZoom] = useState(false)

  const download = (e) => {
    e?.stopPropagation()
    const a = document.createElement('a')
    a.href = src
    const ext = (src.match(/^data:image\/(\w+)/)?.[1] || 'jpg').replace('jpeg', 'jpg')
    a.download = `${name}.${ext}`
    a.click()
  }

  return (
    <div className="gen-preview">
      <div className="gen-thumb" onClick={() => setZoom(true)} title="Click para agrandar">
        <img src={src} alt="imagen generada" />
        <span className="gen-thumb-hint"><Maximize2 className="ico solo" /></span>
      </div>
      <div className="gen-actions">
        <button className="btn small" onClick={() => setZoom(true)}><Maximize2 className="ico" />Agrandar</button>
        <button className="btn small" onClick={download}><Download className="ico" />Guardar</button>
        {onRemove && <button className="btn small ghost" onClick={onRemove}><X className="ico" />Quitar</button>}
      </div>

      {zoom && (
        <div className="lightbox" onClick={() => setZoom(false)}>
          <img src={src} alt="imagen generada" onClick={(e) => e.stopPropagation()} />
          <div className="lightbox-bar" onClick={(e) => e.stopPropagation()}>
            <button className="btn small" onClick={download}><Download className="ico" />Guardar</button>
            <button className="btn small ghost" onClick={() => setZoom(false)}><X className="ico" />Cerrar</button>
          </div>
        </div>
      )}
    </div>
  )
}
