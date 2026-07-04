import React, { useEffect, useState } from 'react'
import { Settings, X, Sparkles, Copy, RefreshCw } from 'lucide-react'
import { MODELS, GEMINI_MODELS, callLLM, listOllamaModels, OLLAMA_DEFAULT_URL } from '../lib/anthropic.js'

export default function SettingsModal({ settings, setSettings, onClose, toast }) {
  const [provider, setProvider] = useState(settings.provider || 'gemini')
  const [apiKey, setApiKey] = useState(settings.apiKey || '')
  const [model, setModel] = useState(settings.model || MODELS[0].id)
  const [geminiKey, setGeminiKey] = useState(settings.geminiKey || '')
  const [geminiModel, setGeminiModel] = useState(settings.geminiModel || GEMINI_MODELS[0].id)
  const [ollamaUrl, setOllamaUrl] = useState(settings.ollamaUrl || OLLAMA_DEFAULT_URL)
  const [ollamaModel, setOllamaModel] = useState(settings.ollamaModel || '')
  const [ollamaModels, setOllamaModels] = useState([])
  // 'checking' | 'ok' | 'cors' (corre pero bloquea este origen) | 'down'
  const [ollamaState, setOllamaState] = useState('checking')
  const [testing, setTesting] = useState(false)

  // Diagnóstico de conexión: distingue "no corre" de "corre pero CORS bloquea".
  const diagnose = async (url) => {
    setOllamaState('checking')
    try {
      const models = await listOllamaModels(url)
      setOllamaModels(models)
      setOllamaModel((cur) => (models.length && !models.includes(cur) ? models[0] : cur))
      setOllamaState('ok')
    } catch {
      try {
        // no-cors: si resuelve (respuesta opaca), el servidor está vivo
        // y el problema es que Ollama no permite este origen.
        await fetch((url || OLLAMA_DEFAULT_URL).replace(/\/$/, '') + '/', { mode: 'no-cors' })
        setOllamaState('cors')
      } catch {
        setOllamaState('down')
      }
    }
  }

  useEffect(() => {
    if (provider !== 'ollama') return
    diagnose(ollamaUrl)
  }, [provider, ollamaUrl]) // eslint-disable-line react-hooks/exhaustive-deps

  const originCmd = `launchctl setenv OLLAMA_ORIGINS "${window.location.origin}" && killall Ollama && open -a Ollama`

  const current = {
    provider, apiKey: apiKey.trim(), model,
    ollamaUrl: ollamaUrl.trim(), ollamaModel,
    geminiKey: geminiKey.trim(), geminiModel,
  }

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
          <div className="modal-title"><Settings className="ico" />Ajustes</div>
          <button className="modal-close" onClick={onClose}><X className="ico solo" /></button>
        </div>
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="field">
            <label>Proveedor de IA</label>
            <div className="tabs">
              <button
                className={'tab' + (provider === 'gemini' ? ' active' : '')}
                onClick={() => setProvider('gemini')}
              ><Sparkles className="ico" />Demo (Gemini)</button>
              <button
                className={'tab' + (provider === 'ollama' ? ' active' : '')}
                onClick={() => setProvider('ollama')}
              >Ollama (local)</button>
              <button
                className={'tab' + (provider === 'anthropic' ? ' active' : '')}
                onClick={() => setProvider('anthropic')}
              >Claude (API)</button>
            </div>
          </div>

          {provider === 'gemini' && (
            <>
              <div className="field">
                <label>Modelo</label>
                <select value={geminiModel} onChange={(e) => setGeminiModel(e.target.value)}>
                  {GEMINI_MODELS.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Tu API key de Gemini (opcional)</label>
                <input
                  type="password"
                  value={geminiKey}
                  placeholder="Vacío = key demo compartida"
                  onChange={(e) => setGeminiKey(e.target.value)}
                />
              </div>
              <p className="hint">
                Funciona <b>sin configurar nada</b>: usa una key demo compartida del free tier
                de Google (con visión — el Style DNA Lab anda completo). Si el cupo diario se
                agota, creá tu propia key gratis (sin tarjeta) en{' '}
                <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer">
                  aistudio.google.com/apikey
                </a>{' '}y pegala arriba — se guarda solo en tu navegador.
              </p>
            </>
          )}

          {provider === 'anthropic' && (
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
          )}

          {provider === 'ollama' && (
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

              {ollamaState === 'checking' && (
                <p className="hint"><span className="spinner" />Buscando Ollama en {ollamaUrl || OLLAMA_DEFAULT_URL}…</p>
              )}
              {ollamaState === 'ok' && (
                <p className="hint" style={{ color: '#86efac' }}>
                  ● Conectado — {ollamaModels.length} modelo{ollamaModels.length !== 1 && 's'} detectado{ollamaModels.length !== 1 && 's'}.
                  100% local y gratis. Los modelos chicos siguen el formato un poco peor que
                  Claude, pero para Beautify / Smart Edit / Fill funcionan bien.
                  {' '}Para el <b>Style DNA Lab</b> conviene un modelo de visión con buen
                  ojo para el medio (foto vs render/ilustración): probá{' '}
                  <code>qwen2.5vl</code> (<code>ollama pull qwen2.5vl</code>).
                </p>
              )}
              {ollamaState === 'cors' && (
                <div className="ollama-diag">
                  <p className="hint" style={{ color: '#fdba74' }}>
                    ⚠ Ollama <b>está corriendo</b>, pero no permite peticiones desde{' '}
                    <code>{window.location.origin}</code>. Autorizá este origen corriendo esto
                    una vez en la Terminal de la Mac donde está Ollama:
                  </p>
                  <div className="cmd-box">
                    <code>{originCmd}</code>
                    <button
                      className="btn small"
                      onClick={() => { navigator.clipboard.writeText(originCmd); toast('Comando copiado', 'ok') }}
                    ><Copy className="ico solo" /></button>
                  </div>
                  <p className="hint">
                    (El navegador no puede hacer esto por vos: las páginas web no tienen permiso
                    para configurar apps del sistema.) Después tocá Reintentar.
                  </p>
                </div>
              )}
              {ollamaState === 'down' && (
                <p className="hint" style={{ color: '#fca5a5' }}>
                  No se detecta Ollama en <code>{ollamaUrl || OLLAMA_DEFAULT_URL}</code>.
                  Abrí la app Ollama (o corré <code>ollama serve</code>) en esta máquina y tocá Reintentar.
                  Si no tenés Ollama, usá el modo Demo (Gemini) o Claude (API).
                </p>
              )}
              {ollamaState !== 'ok' && ollamaState !== 'checking' && (
                <button className="btn small" style={{ alignSelf: 'flex-start' }} onClick={() => diagnose(ollamaUrl)}>
                  <RefreshCw className="ico" />Reintentar conexión
                </button>
              )}
            </>
          )}
        </div>
        <div className="modal-foot">
          <button
            className="btn"
            onClick={test}
            disabled={testing || (provider === 'anthropic' ? !apiKey : provider === 'ollama' ? !ollamaModel : false)}
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
