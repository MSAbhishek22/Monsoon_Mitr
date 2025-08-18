// Simple localStorage wrapper for user preferences
const STORAGE_KEY = 'mm:prefs'

// Default preferences
const DEFAULT_PREFS = {
  language: 'HI',
  crop: 'wheat',
  stage: 'Growing',
  areaAcre: 1,
  location: {
    lat: 25.61,
    lon: 85.14,
    name: 'Patna'
  }
}

// Get all preferences
export function getPrefs() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? { ...DEFAULT_PREFS, ...JSON.parse(stored) } : DEFAULT_PREFS
  } catch {
    return DEFAULT_PREFS
  }
}

// Set specific preference
export function setPref(key, value) {
  try {
    const prefs = getPrefs()
    prefs[key] = value
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
    return true
  } catch {
    return false
  }
}

// Get specific preference
export function getPref(key) {
  return getPrefs()[key]
}

// Set multiple preferences at once
export function setPrefs(newPrefs) {
  try {
    const current = getPrefs()
    const updated = { ...current, ...newPrefs }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    return true
  } catch {
    return false
  }
}

// Reset to defaults
export function resetPrefs() {
  try {
    localStorage.removeItem(STORAGE_KEY)
    return true
  } catch {
    return false
  }
}
