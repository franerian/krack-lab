import React, { useEffect, useRef, useState } from 'react'
import { Sparkles, ImagePlus, X } from 'lucide-react'
import { fileToImage } from '../lib/image.js'

// Compositor único: texto e imagen entran por el mismo gesto (Variante B del
// wireframe — la imagen queda como chip inline dentro del flujo del texto,
// no en un carril aparte). Con texto solo funciona como Smart Edit de
// siempre; con imagen (+ texto opcional como guía) dispara una extracción
// de ADN liviana y la fusiona en el prompt. El Style DNA Lab completo
// (autocrítica, análisis profundo, loop de fidelidad) sigue intacto aparte
// para cuando se necesita ese control fino — esto es el on-ramp rápido.
export default function ComposeBar({ instruction, setInstruction, image, setImage, onSubmit, busy, hasContent }) {
  const [drag, setDrag] = useState(false)
  const taRef = useRef(null)
  const fileRef = useRef(null)

  useEffect(() => {
    const ta = taRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 220) + 'px'
  }, [instruction])

  const loadFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) return
    try {
      const loaded = await fileToImage(file)
      // Se conserva el File original junto al dataUrl: mediciones/EXIF lo
      // necesitan crudo (arrayBuffer), no la copia redimensionada.
      setImage({ ...loaded, file })
    } catch {
      // silencioso: archivo inválido, no interrumpe el compositor
    }
  }

  const placeholder = image
    ? 'Opcional: contame qué cambiar del estilo, o dejalo así y extraigo tal cual…'
    : hasContent
    ? 'Smart Edit — escribí una instrucción, o soltá una imagen de referencia…'
    : 'Describí una escena, o soltá una imagen de referencia…'

  const label = image ? 'Extraer y aplicar' : hasContent ? 'Smart Edit' : 'Generar'

  return (
    <div
      className={'smartbar compose-bar' + (drag ? ' dragover' : '')}
      onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); loadFile(e.dataTransfer.files[0]) }}
    >
      {image && (
        <span className="compose-chip">
          <img src={image.dataUrl} alt="referencia" />
          <span className="compose-chip-label">referencia</span>
          <button
            type="button"
            className="compose-chip-x"
            title="Quitar imagen"
            onClick={() => setImage(null)}
          ><X /></button>
        </span>
      )}
      <textarea
        ref={taRef}
        className="compose-input"
        rows={1}
        value={instruction}
        placeholder={placeholder}
        onChange={(e) => setInstruction(e.target.value)}
        onPaste={(e) => {
          const f = [...(e.clipboardData?.files || [])].find((x) => x.type.startsWith('image/'))
          if (f) loadFile(f)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSubmit() }
        }}
      />
      <div className="compose-actions">
        <button
          type="button"
          className="icon-btn"
          title="Adjuntar imagen de referencia"
          onClick={() => fileRef.current?.click()}
        ><ImagePlus /></button>
        <button className="btn primary" onClick={onSubmit} disabled={busy}>
          {busy ? <span className="spinner" /> : <Sparkles className="ico" />}{label}
        </button>
      </div>
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => loadFile(e.target.files[0])} />
    </div>
  )
}
