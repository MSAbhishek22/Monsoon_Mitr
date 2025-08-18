// Savings tracker for irrigation avoidance
const STORAGE_KEY = 'mm:savings'

// Default rate per acre for avoided irrigation
const DEFAULT_RATE = 800

// Get all savings events
export function getSavingsEvents() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

// Add avoided irrigation event
export function addAvoided(areaAcre, rate = DEFAULT_RATE) {
  try {
    const events = getSavingsEvents()
    const newEvent = {
      ts: Date.now(),
      type: 'avoided_irrigation',
      areaAcre,
      rupees: Math.round(areaAcre * rate)
    }
    events.push(newEvent)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
    return newEvent
  } catch {
    return null
  }
}

// Get total savings
export function getTotals() {
  const events = getSavingsEvents()
  const totalRupees = events.reduce((sum, event) => sum + event.rupees, 0)
  const totalIrrigations = events.filter(e => e.type === 'avoided_irrigation').length
  
  return {
    totalRupees,
    totalIrrigations,
    lastEvents: events.slice(-3).reverse() // Last 3 events, newest first
  }
}

// Clear all savings (for testing)
export function clearSavings() {
  try {
    localStorage.removeItem(STORAGE_KEY)
    return true
  } catch {
    return false
  }
}
