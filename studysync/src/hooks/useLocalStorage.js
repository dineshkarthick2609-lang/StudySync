import { useState } from 'react'
import { readStore, writeStore } from '../utils/storage.js'

export function useLocalStorage(key, defaultValue) {
  const [storedValue, setStoredValue] = useState(() => readStore(key, defaultValue))

  function setValue(value) {
    const valueToStore = value instanceof Function ? value(storedValue) : value
    setStoredValue(valueToStore)
    writeStore(key, valueToStore)
  }

  return [storedValue, setValue]
}
