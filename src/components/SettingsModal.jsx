import React, { useEffect, useState } from 'react'
import { MODELS, callLLM, listOllamaModels, OLLAMA_DEFAULT_URL } from '../lib/anthropic.js'

export default function SettingsModal({ settings, setSettings, onClose, toast }) {
  const [provider, setProvider] = useState(settings.provider || 'anthropic')
  const [apiKey, setApiKey] = useState(settings.apiKey || '')
  const [model, setModel] = useState(settings.model || MODELS[0].id)
  const [ollamaUrl, setOllamaUrl] = useState(settings.ollamaUrl || OLLAMA_DEFAULT_URL)
  const [ollamaModel, setOllamaModel] = useState(settings.ollamaModel || '')
  const [ollamaModels, setOllamaModels] = useState([])
  const [ollamaError, setOllamaError] = useState('')
  const [testing, setTesting] = useState(false)

  // Detecta los modelos instalados en Ollama al abrir o cambiar la URL.
  useEffect(() => {
    if (provider !== 'ollama') return
    let cancelled = false
    setOllamaError('')
    listOllamaModels(ollamaUrl)
      .then((models) => {
        if (cancelled) return
        setOllamaModels(models)
        if (models.length && !models.includes(ollamaModel)) setOllamaModel(models[0])
      })
      .catch(() => !cancelled && setOllamaError('No se pudo conectar con Ollama en esa URL. ¿Está corriendo `ollama serve`?'))
    return () => { cancelled = true }
  }, [provider, ollamaUrl]) // eslint-disable-line react-hooks/exhaustive-deps

  const current = { provider, apiKey: apiKey.trim(), model, ollamaUrl: ollamaUrl.trim(), ollamaModel }

  const test = async () => {
    setTesting(true)
    try {
      await callLLM(current, { system: 'Reply with OK.', user: 'ping', maxTokens: 10 })
      toast('Conexión correcta ✓', 'ok')
    } catch (e) {
      toast('Fallo de conexión: ' + e.message, 'error')
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal narrow">
        <div className="modal-head">
          <div className="modal-title">⚙️ Ajustes</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="field">
            <label>Proveedor de IA</label>
            <div className="tabs">
              <button
                className={'tab' + (provider === 'anthropic' ? ' active' : '')}
                onClick={() => setProvider('anthropic')}
              >Claude (API)</button>
              <button
                className={'tab' + (provider === 'ollama' ? ' active' : '')}
                onClick={() => setProvider('ollama')}
              >Ollama (local, gratis)</button>
            </div>
          </div>

          {provider === 'anthropic' ? (
            <>
              <div className="field">
                <label>Anthropic API Key</label>
                <input
                  type="password"
                  value={apiKey}
                  placeholder="sk-ant-…"
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
              <div className="field">
                <label>Modelo</label>
                <select value={model} onChange={(e) => setModel(e.target.value)}>
                  {MODELS.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
                </select>
              </div>
              <p className="hint">
                La clave se guarda solo en el <code>localStorage</code> de tu navegador y se envía
                únicamente a <code>api.anthropic.com</code>. Requiere crédito en{' '}
                <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noreferrer">
                  console.anthropic.com
                </a>.
              </p>
            </>
          ) : (
            <>
              <div className="field">
                <label>URL de Ollama</label>
                <input
                  value={ollamaUrl}
                  placeholder={OLLAMA_DEFAULT_URL}
                  onChange={(e) => setOllamaUrl(e.target.value)}
                />
              </div>
              <div className="field">
                <label>Modelo instalado</label>
                <select value={ollamaModel} onChange={(e) => setOllamaModel(e.target.value)}>
                  {!ollamaModels.length && <option value="">— sin modelos detectados —</option>}
                  {ollamaModels.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              {ollamaError
                ? <p className="hint" style={{ color: '#fca5a5' }}>{ollamaError}</p>
                : <p className="hint">
                    100% local y gratis. Corre contra tu Ollama (<code>{ollamaModels.length}</code> modelos
                    detectados). Los modelos chicos siguen el formato un poco peor que Claude,
                    pero para Beautify / Smart Edit / Fill funcionan bien.
                  </p>}
            </>
          )}
        </div>
        <div className="modal-foot">
          <button
            className="btn"
            onClick={test}
            disabled={testing || (provider === 'anthropic' ? !apiKey : !ollamaModel)}
          >
            {testing ? <span className="spinner" /> : ''}Probar conexión
          </button>
          <div style={{ flex: 1 }} />
          <button
            className="btn primary"
            onClick={() => { setSettings(current); onClose(); toast('Ajustes guardados', 'ok') }}
          >Guardar</button>
        </div>
      </div>
    </div>
  )
}
