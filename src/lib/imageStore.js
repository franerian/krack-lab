// Persistencia de generaciones en IndexedDB. Historial local por navegador,
// FIFO acotado, sin backend. localStorage no sirve (5MB total y cada JPEG
// pesa 200KB-1MB → se llena en 5-10 imágenes y rompe todo lo demás).
// IndexedDB da varios GB por origen, es asíncrono y guarda blobs binarios.
//
// IMPORTANTE — IndexedDB auto-CIERRA una transacción cuando no tiene más
// requests activos al final del microtask. Awaitear entre operaciones de la
// misma tx (`await addReq; await countReq`) cierra la tx entre ambas y las
// segundas fallan con "transaction inactive". Por eso todo el flujo dentro
// de una tx se hace encadenando `.onsuccess` sincronamente, no con await.

const DB_NAME = 'krack'
const DB_VERSION = 1
const STORE = 'generations'
export const HISTORY_CAP = 30 // FIFO — al superar, se borran las más viejas

let dbPromise = null

const openDB = () => {
  if (dbPromise) return dbPromise
  dbPromise = new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB no disponible en este navegador'))
      return
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true })
        store.createIndex('savedAt', 'savedAt', { unique: false })
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error || new Error('IndexedDB error'))
  })
  return dbPromise
}

// Guarda una generación. Devuelve el id asignado. Todos los campos son
// opcionales excepto dataUrl.
export async function saveGeneration({ dataUrl, prompt = '', provider = '', target = '', aspectRatio = '', label = '', meta = {} } = {}) {
  if (!dataUrl) throw new Error('dataUrl requerido')
  const entry = {
    dataUrl,
    prompt: String(prompt).slice(0, 8000),
    provider,
    target,
    aspectRatio,
    label,
    meta,
    savedAt: Date.now(),
  }
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    const store = tx.objectStore(STORE)
    let assignedId = null

    const addReq = store.add(entry)
    addReq.onerror = () => reject(addReq.error)
    addReq.onsuccess = () => {
      assignedId = addReq.result
      // Enforce FIFO: contar → si excede, cursor sobre índice savedAt
      // ascendente y borrar hasta volver al tope. Todo dentro de la MISMA
      // transacción para que no se cierre.
      const countReq = store.count()
      countReq.onerror = () => reject(countReq.error)
      countReq.onsuccess = () => {
        const count = countReq.result
        if (count <= HISTORY_CAP) return // resolve al oncomplete
        const toDelete = count - HISTORY_CAP
        let deleted = 0
        const cursorReq = store.index('savedAt').openCursor()
        cursorReq.onerror = () => reject(cursorReq.error)
        cursorReq.onsuccess = () => {
          const cursor = cursorReq.result
          if (!cursor || deleted >= toDelete) return
          cursor.delete()
          deleted++
          cursor.continue()
        }
      }
    }
    tx.oncomplete = () => resolve(assignedId)
    tx.onerror = () => reject(tx.error || new Error('IndexedDB tx error'))
    tx.onabort = () => reject(tx.error || new Error('IndexedDB tx aborted'))
  })
}

// Lista todas las generaciones, más nueva primero.
export async function listGenerations() {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly')
    const store = tx.objectStore(STORE)
    const out = []
    const req = store.openCursor()
    req.onsuccess = () => {
      const cursor = req.result
      if (!cursor) return
      out.push(cursor.value)
      cursor.continue()
    }
    req.onerror = () => reject(req.error)
    tx.oncomplete = () => resolve(out.sort((a, b) => b.savedAt - a.savedAt))
    tx.onerror = () => reject(tx.error || new Error('IndexedDB tx error'))
  })
}

export async function deleteGeneration(id) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    const req = tx.objectStore(STORE).delete(id)
    req.onerror = () => reject(req.error)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error || new Error('IndexedDB tx error'))
  })
}

export async function clearAll() {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    const req = tx.objectStore(STORE).clear()
    req.onerror = () => reject(req.error)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error || new Error('IndexedDB tx error'))
  })
}

// Estimación aproximada del tamaño ocupado en disco (los dataURLs base64
// pesan ~4/3 el binario real, así que decodificado = length × 0.75).
export async function estimateSize() {
  const all = await listGenerations()
  const bytes = all.reduce((s, e) => s + (e.dataUrl?.length || 0), 0)
  return { count: all.length, approxBytes: Math.round(bytes * 0.75) }
}
