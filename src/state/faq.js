const KEY_FAQ = 'mm:faq'

export function getFAQs(limit = 10) {
  try {
    const raw = localStorage.getItem(KEY_FAQ)
    const arr = raw ? JSON.parse(raw) : []
    return arr.slice(-limit).reverse()
  } catch {
    return []
  }
}

export function addFAQ(question) {
  try {
    const raw = localStorage.getItem(KEY_FAQ)
    const arr = raw ? JSON.parse(raw) : []
    // Avoid duplicates in immediate succession
    if (!arr.length || arr[arr.length - 1] !== question) arr.push(question)
    localStorage.setItem(KEY_FAQ, JSON.stringify(arr.slice(-50)))
  } catch {}
}
