// Florence-2 (Microsoft, MIT) corriendo en el navegador vía Transformers.js:
// captioning denso, inventario por regiones y OCR — evidencia objetiva de
// QUÉ hay y DÓNDE, para alimentar al extractor de ADN. Import dinámico para
// que los ~230 MB del modelo solo se descarguen si se activa el modo profundo
// (quedan cacheados por el navegador).

const MODEL_ID = 'onnx-community/Florence-2-base-ft'
let _pipe = null

export async function loadFlorence(onProgress) {
  if (_pipe) return _pipe
  const { Florence2ForConditionalGeneration, AutoProcessor, AutoTokenizer } =
    await import('@huggingface/transformers')
  const dtype = {
    embed_tokens: 'fp16',
    vision_encoder: 'fp16',
    encoder_model: 'q4',
    decoder_model_merged: 'q4',
  }
  let model
  try {
    model = await Florence2ForConditionalGeneration.from_pretrained(MODEL_ID, {
      dtype, device: 'webgpu', progress_callback: onProgress,
    })
  } catch {
    // Sin WebGPU: fallback a WASM (más lento pero funciona en cualquier navegador)
    model = await Florence2ForConditionalGeneration.from_pretrained(MODEL_ID, {
      dtype, progress_callback: onProgress,
    })
  }
  const processor = await AutoProcessor.from_pretrained(MODEL_ID)
  const tokenizer = await AutoTokenizer.from_pretrained(MODEL_ID)
  _pipe = { model, processor, tokenizer }
  return _pipe
}

async function runTask(pipe, image, task) {
  const { model, processor, tokenizer } = pipe
  const vision_inputs = await processor(image)
  const prompts = processor.construct_prompts(task)
  const text_inputs = tokenizer(prompts)
  const generated_ids = await model.generate({
    ...text_inputs,
    ...vision_inputs,
    max_new_tokens: 512,
  })
  const generated_text = tokenizer.batch_decode(generated_ids, { skip_special_tokens: false })[0]
  const result = processor.post_process_generation(generated_text, task, image.size)
  return result[task]
}

// Corre las tres tareas de grounding sobre la imagen.
export async function florenceGrounding(dataUrl, onProgress) {
  const pipe = await loadFlorence(onProgress)
  const { RawImage } = await import('@huggingface/transformers')
  const image = await RawImage.fromURL(dataUrl)

  const caption = await runTask(pipe, image, '<MORE_DETAILED_CAPTION>')
  const regions = await runTask(pipe, image, '<DENSE_REGION_CAPTION>')
  let ocr = ''
  try {
    ocr = await runTask(pipe, image, '<OCR>')
  } catch { /* OCR es opcional */ }

  // Mapea cada región a la grilla de tercios (inventario espacial).
  const cells = {}
  const W = image.width
  const H = image.height
  if (regions?.labels && regions?.bboxes) {
    regions.labels.forEach((label, i) => {
      const [x1, y1, x2, y2] = regions.bboxes[i]
      const cx = (x1 + x2) / 2 / W
      const cy = (y1 + y2) / 2 / H
      const col = cx < 1 / 3 ? 'left' : cx > 2 / 3 ? 'right' : 'center'
      const row = cy < 1 / 3 ? 'top' : cy > 2 / 3 ? 'bottom' : 'middle'
      const areaPct = Math.round(((x2 - x1) * (y2 - y1)) / (W * H) * 100)
      const key = `${row}-${col}`
      ;(cells[key] ||= []).push(areaPct >= 20 ? `${label} (${areaPct}% of frame)` : label)
    })
  }
  return {
    caption: typeof caption === 'string' ? caption : '',
    cells,
    ocr: typeof ocr === 'string' ? ocr.trim() : '',
    regionCount: regions?.labels?.length || 0,
  }
}

// Bloque de texto para inyectar al prompt del extractor.
export function groundingToText(g) {
  if (!g) return ''
  const lines = [
    'OBJECTIVE VISUAL INVENTORY (produced by a specialized grounding model — factual evidence of WHAT is where; use it for composition, framing and completeness. In STYLE ONLY mode, use it to reason but never name these objects in your output):',
  ]
  if (g.caption) lines.push(`- Detailed caption: ${g.caption}`)
  const cellLines = Object.entries(g.cells).map(
    ([cell, items]) => `  · ${cell}: ${items.join('; ')}`
  )
  if (cellLines.length) lines.push('- Region inventory (rule-of-thirds grid):', ...cellLines)
  if (g.ocr) lines.push(`- Text detected in the image (OCR): "${g.ocr}"`)
  return lines.join('\n')
}
