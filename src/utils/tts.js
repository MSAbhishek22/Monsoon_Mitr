let cachedVoices = null

function loadVoices() {
  try {
    const vs = window.speechSynthesis.getVoices() || []
    cachedVoices = vs
    return vs
  } catch { return [] }
}

export function ensureVoices() {
  return new Promise((resolve) => {
    const ready = () => resolve(loadVoices())
    const exist = loadVoices()
    if (exist && exist.length > 0) return resolve(exist)
    try {
      window.speechSynthesis.onvoiceschanged = () => {
        try { window.speechSynthesis.onvoiceschanged = null } catch {}
        ready()
      }
    } catch { resolve([]) }
  })
}

function pickHindiVoice() {
  const voices = cachedVoices || loadVoices()
  if (!voices || voices.length === 0) return null
  // Prefer explicit hi-IN
  const strict = voices.find(v => (v.lang || '').toLowerCase() === 'hi-in')
  if (strict) return strict
  // Any lang starting with hi
  const prefix = voices.find(v => (v.lang || '').toLowerCase().startsWith('hi'))
  if (prefix) return prefix
  // Names mentioning Hindi/India
  const nameMatch = voices.find(v => /hindi|india/i.test(v.name || ''))
  if (nameMatch) return nameMatch
  // Fallback: any local default
  return voices.find(v => v.default) || voices[0]
}

export async function speakHi(text, opts = {}) {
  try {
    if (!('speechSynthesis' in window) || !text) return
    await ensureVoices()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'hi-IN'
    const v = pickHindiVoice()
    if (v) u.voice = v
    // Tune for clarity
    u.rate = typeof opts.rate === 'number' ? opts.rate : 0.95
    u.pitch = typeof opts.pitch === 'number' ? opts.pitch : 1.0
    u.volume = typeof opts.volume === 'number' ? opts.volume : 1.0
    // Stop any ongoing speech and speak
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(u)
  } catch {}
}
