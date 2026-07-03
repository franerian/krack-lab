// Persistencia simple en localStorage con prefijo de app.
import { useState, useEffect } from 'react'

const PREFIX = 'krack:'

export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function save(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    // cuota llena o modo privado: se ignora
  }
}

export function usePersistedState(key, fallback) {
  const [state, setState] = useState(() => load(key, fallback))
  useEffect(() => { save(key, state) }, [key, state])
  return [state, setState]
}

export const uid = () => Math.random().toString(36).slice(2, 10)
