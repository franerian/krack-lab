import React, { useRef, useState } from 'react'
import { UserRound, X, Sparkles, Save, Camera } from 'lucide-react'
import { CHARACTER_FIELDS, CHARACTER_LOOKS, compileCharacter } from '../data/characterStudio.js'
import { fillCharacter, isReady, providerHint } from '../lib/anthropic.js'
import { fileToImage } from '../lib/image.js'

const ALL_FIELDS = CHARACTER_FIELDS.flatMap((g) => g.fields)
const TEXT_FIELD_IDS = ALL_FIELDS.filter((f) => f.type === 'text').map((f) => f.id)

export default function CharacterStudio({ settings, characters, setCharacters, onUse, onClose, toast }) {
  const [look, setLook] = useState('cinematic')
  const [values, setValues] = useState({})
  const [desc, setDesc] = useState('')
  const [filling, setFilling] = useState(false)
  const [refImg, setRefImg] = useState(null)
  const fileRef = useRef(null)

  const set = (id, v) => setValues((prev) => ({ ...prev, [id]: v }))

  const loadRef = async (file) => {
    try {
      setRefImg(await fileToImage(file))
    } catch {
      toast('Ese archivo no es una imagen válida', 'error')
    }
  }

  const handleFill = async () => {
    if (!desc.trim() && !refImg) return toast('Escribí una descripción o cargá una foto', 'error')
    if (!isReady(settings)) return toast(providerHint(settings), 'error')
    setFilling(true)
    try {
      const filled = await fillCharacter({
        settings, description: desc, fieldIds: TEXT_FIELD_IDS, image: refImg,
      })
      setValues((prev) => ({ ...prev, ...filled }))
      toast('Ficha completada con IA', 'ok')
    } catch (e) {
      toast('Error al completar: ' + e.message, 'error')
    } finally {
      setFilling(false)
    }
  }

  const handleSave = () => {
    const name = (values.name || '').trim() || 'Personaje sin nombre'
    setCharacters((prev) => [
      ...prev.filter((c) => c.name !== name),
      { name, look, values },
    ])
    toast(`“${name}” guardado`, 'ok')
  }

  const loadCharacter = (c) => {
    setValues(c.values)
    setLook(c.look)
  }

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-head">
          <div className="modal-title"><UserRound className="ico" />Character <span className="accent">Studio</span></div>
          <div className="tabs">
            {CHARACTER_LOOKS.map((l) => (
              <button
                key={l.id}
                className={'tab' + (look === l.id ? ' active' : '')}
                onClick={() => setLook(l.id)}
              >{l.label}</button>
            ))}
          </div>
          <button className="modal-close" onClick={onClose}><X className="ico solo" /></button>
        </div>
        <div className="modal-body">
          {characters.length > 0 && (
            <div className="char-list">
              {characters.map((c) => (
                <span key={c.name} className="char-pill" onClick={() => loadCharacter(c)}>
                  {c.name}
                  <button
                    className="del"
                    title="Eliminar"
                    onClick={(e) => {
                      e.stopPropagation()
                      setCharacters((prev) => prev.filter((x) => x.name !== c.name))
                    }}
                  ><X className="ico solo" /></button>
                </span>
              ))}
            </div>
          )}
          <div className="cs-grid">
            {CHARACTER_FIELDS.map((group) => (
              <React.Fragment key={group.group}>
                <div className="cs-group-label">{group.group}</div>
                {group.fields.map((f) => (
                  <div key={f.id} className={`field w-${String(f.width).replace('.', '')}`}>
                    <label>{f.label}</label>
                    {f.type === 'select' ? (
                      <select value={values[f.id] || f.options[0]} onChange={(e) => set(f.id, e.target.value)}>
                        {f.options.map((o) => <option key={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input
                        value={values[f.id] || ''}
                        placeholder={f.placeholder}
                        onChange={(e) => set(f.id, e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
          <div className="cs-fill-row">
            <button
              className={'cs-photo' + (refImg ? ' has-img' : '')}
              title={refImg ? 'Cambiar foto de referencia' : 'Subir foto de referencia'}
              onClick={() => fileRef.current?.click()}
            >
              {refImg ? <img src={refImg.dataUrl} alt="ref" /> : <Camera className="ico solo" />}
            </button>
            {refImg && (
              <button className="icon-btn danger" title="Quitar foto" onClick={() => setRefImg(null)}><X className="ico solo" /></button>
            )}
            <input
              placeholder={refImg
                ? 'Notas extra sobre la foto (opcional)…'
                : 'Describí un personaje… (ej: viejo pescador de Sicilia) o subí una foto 📷'}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleFill()}
            />
            <button className="btn" onClick={handleFill} disabled={filling}>
              {filling ? <span className="spinner" /> : <Sparkles className="ico" />}{refImg ? 'Fill desde foto' : 'Fill'}
            </button>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => loadRef(e.target.files[0])} />
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn ghost" onClick={() => setValues({})}>Limpiar</button>
          <button className="btn" onClick={handleSave}><Save className="ico" />Guardar personaje</button>
          <div style={{ flex: 1 }} />
          <button
            className="btn primary"
            onClick={() => {
              const compiled = compileCharacter(values, look)
              onUse(compiled)
              onClose()
            }}
          >Usar en el prompt →</button>
        </div>
      </div>
    </div>
  )
}
