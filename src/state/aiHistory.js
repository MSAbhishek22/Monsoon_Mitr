const KEY_HISTORY = 'mm:ai:history'
const KEY_FAVS = 'mm:ai:favs'
const KEY_SOUND = 'mm:ai:sound'

export function getHistory() {
  try { return JSON.parse(localStorage.getItem(KEY_HISTORY)) || [] } catch { return [] }
}
export function addHistory(entry) {
  try {
    const hist = getHistory()
    hist.push({ ...entry, ts: Date.now() })
    localStorage.setItem(KEY_HISTORY, JSON.stringify(hist.slice(-20)))
  } catch {}
}
export function getLast(n = 3) { return getHistory().slice(-n).reverse() }

export function getFavorites() {
  try { return JSON.parse(localStorage.getItem(KEY_FAVS)) || [] } catch { return [] }
}
export function toggleFavorite(entry) {
  try {
    const favs = getFavorites()
    const idx = favs.findIndex(f => f.q === entry.q && f.a === entry.a)
    if (idx >= 0) { favs.splice(idx, 1) } else { favs.push(entry) }
    localStorage.setItem(KEY_FAVS, JSON.stringify(favs.slice(-50)))
    return idx < 0
  } catch { return false }
}

export function getSoundEnabled() {
  try { const v = localStorage.getItem(KEY_SOUND); return v === null ? true : v === '1' } catch { return true }
}
export function setSoundEnabled(v) {
  try { localStorage.setItem(KEY_SOUND, v ? '1' : '0') } catch {}
}

export function playTick(success = true) {
  if (!getSoundEnabled()) return
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain); gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.value = success ? 880 : 220
    gain.gain.value = 0.07
    osc.start(); osc.stop(ctx.currentTime + 0.12)
  } catch {}
}
