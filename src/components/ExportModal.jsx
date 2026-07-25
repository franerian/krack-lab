import React, { useMemo, useState } from 'react'
import { Send, X, Sparkles, Copy, ImagePlus } from 'lucide-react'
import { TARGETS, EXPORT_ASPECT_RATIOS } from '../data/targets.js'
import { isReady, providerHint, cancelActive, polishForTarget } from '../lib/anthropic.js'
import { generateImage, IMAGE_PROVIDERS } from '../lib/imageGen.js'
import ImageResult from './ImageResult.jsx'

export default function ExportModal({ sections, target, setTarget, ar, setAr, onClose, toast, settings, imageProvider, setImageProvider }) {
  const current = TARGETS.find((t) => t.id === target) || TARGETS[0]
  const output = useMemo(
    () => current.compile(sections, { ar }),
    [current, sections, ar]
  )
  const [polished, setPolished] = useState(null)
  const [polishing, setPolishing] = useState(false)
  // Probar el prompt generando una imagen real (proveedor gratuito o propio)
  const [genImg, setGenImg] = useState(null)
  const [generating, setGenerating] = useState(false)

  const tryPrompt = async () => {
    if (generating) return
    setGenerating(true)
    try {
      const img = await generateImage({
        provider: imageProvider,
        prompt: visible,
        aspectRatio: current.usesAr ? ar : '16:9',
        settings,
      })
      setGenImg(img.dataUrl)
      toast('Imagen de prueba generada', 'ok')
    } catch (e) {
      toast('Error al generar: ' + e.message, 'error')
    } finally {
      setGenerating(false)
    }
  }

  const visible = polished ?? output
  const canPolish = current.id !== 'structured' && current.id !== 'plain'

  const changeTarget = (id) => {
    setTarget(id)
    setPolished(null)
  }

  const polish = async () => {
    if (polishing) return
    if (!isReady(settings)) return toast(providerHint(settings), 'error')
    setPolishing(true)
    try {
      const { polished: clean, override } = await polishForTarget({ settings, target: current, compiled: output })
      setPolished(clean)
      toast(override ? `Prompt pulido ✓ (${override})` : 'Prompt pulido con IA ✓', 'ok')
    } catch (e) {
      toast('Error al pulir: ' + e.message, 'error')
    } finally {
      setPolishing(false)
    }
  }

  const copy = () => {
    navigator.clipboard.writeText(visible)
    toast(`Prompt ${polished ? 'pulido ' : ''}copiado en formato ${current.label}`, 'ok')
  }

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-head">
          <div className="modal-title"><Send className="ico" />Exportar <span className="accent">para…</span></div>
          <button className="modal-close" onClick={onClose}><X className="ico solo" /></button>
        </div>
        <div className="modal-body export-body">
          <div className="export-targets">
            {TARGETS.map((t) => (
              <button
                key={t.id}
                className={'target-btn' + (t.id === target ? ' active' : '')}
                onClick={() => changeTarget(t.id)}
              >{t.label}</button>
            ))}
          </div>
          <div className="export-main">
            <p className="hint" style={{ marginTop: 0 }}>{current.notes}</p>
            {current.usesAr && (
              <div className="field" style={{ maxWidth: 180, marginBottom: 10 }}>
                <label>Aspect Ratio</label>
                <select value={ar} onChange={(e) => { setAr(e.target.value); setPolished(null) }}>
                  {EXPORT_ASPECT_RATIOS.map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>
            )}
            {polished && (
              <div className="polish-bar">
                <span className="metric-badge" style={{ color: 'var(--accent-soft)' }}><Sparkles className="ico" />pulido con IA</span>
                <button className="btn small ghost" onClick={() => setPolished(null)}>ver compilado mecánico</button>
              </div>
            )}
            <pre className="export-pre">{visible || '— el prompt está vacío —'}</pre>
            {genImg && (
              <ImageResult
                src={genImg}
                onRemove={() => setGenImg(null)}
                name={`krack-${current.id}`}
                bookmarkMeta={{
                  prompt: visible,
                  provider: imageProvider,
                  target: current.id,
                  aspectRatio: current.usesAr ? ar : '',
                  meta: { source: 'export', polished: !!polished },
                }}
              />
            )}
          </div>
        </div>
        <div className="modal-foot">
          {(() => {
            // Midjourney V8.1 tiene un "Prompt Shortener" que recorta
            // automáticamente al superar el límite (umbral no publicado,
            // 1024-1300 chars según fuentes de terceros contradictorias).
            // Objetivo de trabajo: <900. Advertimos antes.
            const mjOver = current.id === 'midjourney' && visible.length > 900
            return (
              <span
                className={'hint' + (mjOver ? ' warn' : '')}
                title={mjOver ? `Midjourney V8.1 podría recortar prompts largos (Prompt Shortener). Objetivo: <900 caracteres.` : ''}
              >
                {visible.length} caracteres{mjOver ? ' · Midjourney podría recortar' : ''}
              </span>
            )
          })()}
          <div style={{ flex: 1 }} />
          <select
            className="target-select"
            value={imageProvider}
            onChange={(e) => setImageProvider(e.target.value)}
            title="Proveedor para generar la imagen de prueba"
          >
            {IMAGE_PROVIDERS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
          <button
            className="btn"
            onClick={generating ? () => cancelActive() : tryPrompt}
            disabled={!visible}
            title="Genera una imagen real con este prompt para probarlo"
          >
            {generating ? <><span className="spinner" />Cancelar</> : <><ImagePlus className="ico" />Probar</>}
          </button>
          {canPolish && (
            <button
              className="btn"
              onClick={polishing ? () => cancelActive() : polish}
              disabled={!output}
              title="Reescribe el compilado como un prompt fluido nativo de la plataforma (una llamada de IA)"
            >
              {polishing ? <><span className="spinner" />Cancelar</> : <><Sparkles className="ico" />Pulir con IA</>}
            </button>
          )}
          <button className="btn primary" onClick={copy} disabled={!visible}><Copy className="ico" />Copiar</button>
        </div>
      </div>
    </div>
  )
}
