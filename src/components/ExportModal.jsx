import React, { useMemo, useState } from 'react'
import { Send, X, Sparkles, Copy, ImagePlus } from 'lucide-react'
import { TARGETS, EXPORT_ASPECT_RATIOS } from '../data/targets.js'
import { callLLM, isReady, providerHint, cancelActive, pickDirectModel } from '../lib/anthropic.js'
import { generateImage, IMAGE_PROVIDERS } from '../lib/imageGen.js'
import ImageResult from './ImageResult.jsx'

// Pulido con IA: convierte el compilado mecánico (secciones concatenadas)
// en UN prompt fluido nativo de la plataforma — el formato que demostró
// funcionar es el "prompt dorado" escrito a mano: medio primero, cada dato
// dicho una vez, colores nombrados, ~120-160 palabras.
const POLISH_SYSTEM = (target) => `Output ONLY the final rewritten prompt. NO preamble, NO analysis, NO planning, NO "Let me…", NO word counting, NO markdown fences, NO commentary before OR after. If you output anything other than the prompt itself, the response is wrong.

You are a senior prompt engineer writing the FINAL prompt for the platform "${target.label}".

PLATFORM RULES (follow them exactly): ${target.notes}

Rewrite the compiled prompt the user gives you as ONE flowing, production-ready prompt in that platform's native style:
- Lead with the visual medium/style if the content defines one.
- Keep EVERY concrete detail: objects and their condition, each light source with its emitter, colors by NAME (never hex codes), edge/focus behavior, mood.
- Say each thing exactly ONCE — remove all redundancy.
- 120-160 words unless the platform rules say otherwise.
- If the input ends with parameters (--ar, --no …) or a "Negative prompt:" block, keep them verbatim at the end.
- English.

Reminder: your entire response is JUST the prompt. Start with the first word of the prompt.`

// Los modelos razonadores (Kimi K2.7, DeepSeek…) tienden a "pensar en voz alta"
// dentro del content (no en reasoning_content) — descartamos ese preámbulo y
// nos quedamos con el prompt final. Señales: "Draft:", "Final prompt:", el
// último bloque tras una línea en blanco, o simplemente todo si no hay señal.
const extractFinalPrompt = (raw) => {
  let s = raw.trim().replace(/^```[a-z]*\n?|```$/g, '').trim()
  // Marcadores explícitos: nos quedamos con lo que viene después del último.
  const markers = [
    /(?:^|\n)\s*(?:Final|Polished|Rewritten|Output|Result|Prompt|Draft)\s*(?:prompt)?\s*:\s*\n+/i,
  ]
  for (const m of markers) {
    const matches = [...s.matchAll(new RegExp(m.source, m.flags + 'g'))]
    if (matches.length) {
      const last = matches[matches.length - 1]
      s = s.slice(last.index + last[0].length).trim()
    }
  }
  // Si sigue habiendo preámbulo tipo "The user wants…" o "I need to…" o
  // enumeraciones "1. ", nos quedamos con el último párrafo suelto largo.
  if (/^(the user|i need|i should|let me|okay|first,|now,)/i.test(s)) {
    const paragraphs = s.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)
    // Preferimos el último párrafo que parezca un prompt (>200 chars, sin
    // dos puntos al comienzo tipo "Structure:" ni lista numerada).
    const promptLike = paragraphs.reverse().find(
      (p) => p.length > 200 && !/^\d+\./.test(p) && !/^[A-Z][a-z]+:/.test(p)
    )
    if (promptLike) s = promptLike
  }
  return s.replace(/^```[a-z]*\n?|```$/g, '').trim()
}

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
      // Pulir necesita output puro: si el modelo actual es un razonador que
      // piensa en voz alta dentro del content (Kimi K2.7 Code etc.), se hace
      // override transparente a un modelo "directo" del mismo proveedor.
      const { settings: polishSettings, override } = pickDirectModel(settings)
      const out = await callLLM(polishSettings, {
        system: POLISH_SYSTEM(current),
        user: `COMPILED PROMPT TO POLISH:\n\n${output}`,
        maxTokens: 3000,
      })
      const clean = extractFinalPrompt(out)
      if (!clean) throw new Error('respuesta vacía')
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
              <ImageResult src={genImg} onRemove={() => setGenImg(null)} name={`krack-${current.id}`} />
            )}
          </div>
        </div>
        <div className="modal-foot">
          <span className="hint">{visible.length} caracteres</span>
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
