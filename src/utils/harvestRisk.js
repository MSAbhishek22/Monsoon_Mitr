// Demo flag for testing harvest risk
let demoHighRainFlag = false

// Toggle demo flag for testing
export function toggleDemoHighRain() {
  demoHighRainFlag = !demoHighRainFlag
  return demoHighRainFlag
}

// Get demo flag status
export function getDemoHighRain() {
  return demoHighRainFlag
}

// Analyze harvest risk for next 72 hours
export function getHarvestRisk(wx) {
  // Use demo flag if set
  if (demoHighRainFlag) {
    return { high: true, horizonHours: 72 }
  }
  
  // Use hourly first 72 entries if available; fallback to daily
  if (!wx) return null
  
  const probs = wx?.raw?.hourly?.precipitation_probability || []
  const rain = wx?.raw?.hourly?.rain || []
  const horizon = Math.min(72, probs.length)
  
  let high = false
  for (let i = 0; i < horizon; i++) {
    const p = probs[i] ?? 0
    const r = rain[i] ?? 0
    if (p >= 40 || r >= 2) { 
      high = true 
      break 
    }
  }
  
  return { high, horizonHours: horizon }
}
