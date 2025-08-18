import { getPrefs } from '../../state/prefs'
import { getCachedWeather } from '../../api/cache'
import { getHarvestRisk } from '../../utils/harvestRisk'

function toFixed(value, digits = 1) {
  return (value ?? '--') === '--' ? '--' : Number(value).toFixed(digits)
}

export function generateOfflineAnswer(question, language = 'HI') {
  const prefs = getPrefs()
  const { crop = 'wheat', stage = 'Growing', location } = prefs || {}
  const lat = location?.lat
  const lon = location?.lon
  const wx = (lat && lon) ? getCachedWeather(lat, lon, 720) : null // up to 12h old OK

  const hi = {
    irrigate: '✅ पानी दें',
    wait: '⛔ पानी न दें',
    noData: 'ℹ️ सीमित डेटा मिला — हाल की सेव जानकारी के आधार पर सलाह',
    bullets: (rec) => (
      rec === 'wait' ? [
        'बारिश की संभावना अधिक है — सिंचाई टालें',
        'खेत में पानी भराव से बचाएँ',
        'नमी बनी रहे तो उर्वरक/कीटनाशक रोकें',
      ] : [
        'बारिश की संभावना कम है — सिंचाई करें',
        'मिट्टी की ऊपरी 5–7 सेमी नमी जाँचें',
        'पौधे की ज़रूरत के अनुसार पानी दें',
      ]
    ),
    rainYes: '✅ आज बारिश होने की संभावना है',
    rainNo: '✅ आज बारिश की संभावना कम है',
    harvestDelay: '⛔ कटाई टालें — अगले 48–72 घंटों में बारिश/नमी जोखिम',
  }

  const lines = []

  const q = (question || '').toLowerCase()
  const askRain = /rain|बारिश|barsaat/.test(q)
  const askIrr = /irrigat|सिंचाई|pani|pa(i|ee)ni|water/.test(q)
  const askHarvest = /harvest|कटाई/.test(q)

  const maxProb = wx?.next24h?.maxProb ?? null
  const totalRain = wx?.next24h?.totalRainMm ?? null
  const temp = wx?.current?.tempC ?? null
  const humidity = wx?.current?.humidity ?? null

  const shouldWait = (maxProb !== null && maxProb >= 50) || (totalRain !== null && totalRain >= 5)

  // Conclusion
  if (askIrr) {
    lines.push(shouldWait ? hi.wait : hi.irrigate)
  } else if (askRain) {
    lines.push((maxProb ?? 0) >= 50 ? hi.rainYes : hi.rainNo)
  } else if (askHarvest && stage === 'Harvesting') {
    const risk = getHarvestRisk(wx)
    lines.push(risk?.high ? hi.harvestDelay : '✅ कटाई कर सकते हैं')
  } else {
    // Generic advice from current weather
    lines.push(shouldWait ? hi.wait : hi.irrigate)
  }

  // Details
  const detail = hi.bullets(shouldWait ? 'wait' : 'irrigate')
  lines.push(...detail)

  // Weather summary bullets
  if (wx) {
    lines.push(`आज: तापमान ${toFixed(temp)}°C, नमी ${toFixed(humidity,0)}%`)
    lines.push(`अगले 24 घंटे: अधिकतम बारिश संभावना ${maxProb ?? '--'}%, अनुमानित वर्षा ${toFixed(totalRain)}mm`)
  } else {
    lines.push(hi.noData)
  }

  // Crop context
  if (crop) {
    const cropMap = { wheat: 'गेहूं', rice: 'धान', vegetables: 'सब्ज़ियाँ' }
    const cropName = cropMap[crop] || 'फसल'
    lines.push(`फसल: ${cropName} | चरण: ${stage}`)
  }

  return lines.join('\n')
}
