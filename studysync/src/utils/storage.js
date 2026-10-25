/**
 * Read a value from localStorage.
 * Returns `defaultValue` if key is missing or JSON is invalid.
 */
export function readStore(key, defaultValue = null) {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return defaultValue
    return JSON.parse(raw)
  } catch {
    return defaultValue
  }
}

/**
 * Write a value to localStorage.
 * Returns true on success, false on QuotaExceededError.
 */
export function writeStore(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (err) {
    if (err && (err.name === 'QuotaExceededError' || err.code === 22)) {
      return false
    }
    throw err
  }
}

/**
 * Remove a key from localStorage.
 */
export function clearStore(key) {
  try {
    localStorage.removeItem(key)
  } catch {
    // ignore
  }
}
