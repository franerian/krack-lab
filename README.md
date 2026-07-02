# KRACK LAB — Prompt Lab para cineastas

Webapp inspirada en CRAFTR (promptr-studios) para escribir prompts estructurados
y cinematográficos para generadores de imagen/video IA (Midjourney, Sora, Kling,
Luma, Krea…), pero como aplicación web en vez de extensión de Chrome.

## Correr

```bash
npm install
npm run dev      # http://localhost:5199
npm run build    # bundle de producción en dist/
```

## Funcionalidades

- **Editor estructurado** por secciones (`# Subject`, `# Style`, `# Lighting`,
  `# Camera`, `# Mood`, …) con **syntax highlighting en vivo** por categorías:
  iluminación (amarillo), cámara/lente (azul), estilo (violeta), composición
  (verde), emoción (naranja), movimiento (rojo).
- **217 presets profesionales** en la barra lateral: Photo Styles, Film Stocks,
  Realism Boosters, Cinematic/Commercial Styles, Composition, Single Shots,
  Angles, Camera Movement, Lighting Setups, Cameras, Lens Characteristics,
  Color Grades, What If…, Scene Extender, Emotion Wheel, Environments,
  Time & Weather. Buscador, favoritos ♥ y **presets propios** (🔖 en cada
  sección del editor).
- **Acciones IA** (Claude): Beautify, Format, Shorten, Expand, Simplify,
  Shot, Angle — más **Smart Edit** por instrucción en lenguaje natural.
- **Character Studio**: fichas de personaje con 6 looks (Cinematic, Interview,
  Fashion, Film Scene, Portrait, Street), autocompletado por IA desde una
  descripción, guardado de personajes y compilación al prompt.
- **Storyboard**: 8 coberturas de rodaje (Full, Dialogue, Motion, Extreme
  Action, Establishing, Surveillance, Entrance, Parallel Action) que
  descomponen la escena en 6 planos. Funciona con IA o en modo plantilla sin
  API key. Cada plano tiene copy propio y zona para arrastrar/pegar la imagen
  generada y comparar.
- **Style DNA Lab** (🧬): subís una imagen de referencia y un modelo con visión
  extrae su "ADN visual" — medio, reglas de ejecución, cámara, luz, color,
  mood — bajo la directiva de *hegemonía estilística* (cero contradicciones
  internas, cámara obligatoria, `Negative` que protege el ADN). Dos modos:
  **Solo estilo** (transferible a cualquier escena, nunca describe el sujeto) y
  **Réplica completa**. El resultado se aplica al prompt, lo reemplaza o se
  guarda como preset de estilo reutilizable. Desde el mismo Lab se puede
  copiar el ADN compilado para cualquier plataforma (selector de destino + AR).
  El pipeline de fidelidad completo:
  1. *Mediciones por código* (instantáneas): paleta hex real por k-means,
     contraste/saturación/brillo en escalas 1-10, AR; EXIF de cámara y
     detección del prompt original embebido en PNGs de A1111/ComfyUI.
  2. *Análisis profundo* (opcional): Florence-2 corriendo en el navegador
     (Transformers.js + WebGPU, ~230 MB cacheados) — caption denso,
     inventario por grilla de tercios y OCR como evidencia objetiva.
  3. *Extracción* con el LLM de visión, obligado a obedecer las mediciones.
  4. *Autocrítica* (opcional): segunda pasada anti-exageración.
  5. *Loop de fidelidad* (📠): traés la imagen generada, CLIP (en browser)
     mide la similitud 0-100 y los deltas medidos (Δcontraste, Δsat), y la
     IA corrige el prompt (v2, v3…) comparando ambas imágenes hasta converger.
- **Undo / Redo** de todas las operaciones (acciones IA, presets, plantillas).
- **Presets aplicados marcados**: el preset usado se marca con punto naranja en
  la sidebar y la sección que lo contiene con punto en su `#`; al pasar el
  mouse por un preset aplicado, su texto se ilumina en el editor.
- **Character Studio desde foto**: además de la descripción, podés subir una
  foto de referencia (📷) y la IA completa la ficha del personaje observándola.
- **Exportar por modelo destino** (🎯): compiladores factorizados según la
  documentación oficial de prompting de cada modelo (07/2026) — ver
  `src/data/targets.js`:
  - *Midjourney V7*: lenguaje natural conciso, lo esencial primero (los
    primeros tokens pesan más), parámetros al final (`--ar`, `--no`).
  - *Sora 2* (OpenAI Cookbook): brief de cinematógrafo en prosa + sonido
    diegético; sin negativos.
  - *Veo 3* (DeepMind prompt guide): Subject + Context + Action + Style +
    Camera + Composition + Ambiance + Audio; Negative al campo
    `negative_prompt` de la API.
  - *Kling* (guía oficial): Sujeto + Movimiento + Escena + (Cámara + Luz +
    Atmósfera); negative en campo aparte.
  - *Runway Gen-4* (help.runwayml.com): solo frases positivas (negativos no
    soportados), cámara explícita primero, descripción física simple.
  - *SDXL*: keywords por coma, importante primero, negative aparte.
  - *Flux / Nano Banana* (Google prompting guide): narrativa descriptiva
    fluida, sin negative prompts.

## Proveedores de IA

En Ajustes (⚙) se elige el proveedor:

- **Ollama (local, gratis)** — recomendado si no tenés crédito de API. Requiere
  [Ollama](https://ollama.com) corriendo (`ollama serve`); la app detecta sola
  los modelos instalados (ej. `gemma4`, `llama3.1:8b`) y llama a
  `http://localhost:11434` directo desde el navegador. Cero costo.
- **Claude (API)** — pegar tu clave de
  [console.anthropic.com](https://console.anthropic.com/settings/keys). Se
  guarda **solo en el `localStorage` de tu navegador** y se envía únicamente a
  `api.anthropic.com` (cabecera oficial `anthropic-dangerous-direct-browser-access`).
  Requiere crédito en la cuenta. Mejor calidad de seguimiento de formato.

Sin proveedor configurado, todo lo no-IA funciona igual (editor, presets,
storyboard en modo plantillas, Character Studio manual).

> Nota: no existe forma oficial de usar la **suscripción** de claude.ai desde
> una app propia; la suscripción no expone API. Por eso las opciones son API
> con crédito u Ollama local.

## Estructura

```
src/
  data/presets.js          # 217 presets + 5 plantillas de escena
  data/coverage.js         # 8 coberturas de storyboard (6 planos c/u)
  data/characterStudio.js  # campos y looks del Character Studio
  data/keywords.js         # diccionarios del syntax highlighting
  lib/anthropic.js         # cliente API + prompts de las acciones IA
  lib/highlight.js         # motor de highlighting
  components/              # Editor, PresetSidebar, CharacterStudio,
                           # StoryboardView, SettingsModal
```
