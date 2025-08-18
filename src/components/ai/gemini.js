const API_KEY = import.meta.env.VITE_GEMINI_API_KEY

const MODELS = [
  'gemini-1.5-flash-latest',
  'gemini-1.5-flash',
  'gemini-pro',
]

function buildPrompt(question) {
  return [
    'आप एक कृषि सहायक हैं। हमेशा साधारण भाषा में उत्तर दें।',
    'फॉर्मैट:',
    '1) पहली पंक्ति: एक-वाक्य निष्कर्ष (✅/⛔).',
    '2) 3–6 बुलेट्स, प्रत्येक नई पंक्ति "- " से.',
    '3) उपयोगकर्ता की भाषा (Hindi/English/Hinglish) में उत्तर.',
    'प्रश्न:',
    question
  ].join('\n')
}

async function callModel(model, question) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`
  const body = { contents: [ { role: 'user', parts: [ { text: buildPrompt(question) } ] } ] }
  const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`HTTP ${res.status}${text ? `: ${text.slice(0,120)}` : ''}`)
  }
  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
  return text || ''
}

export async function askGemini(question) {
  try {
    if (!question || !question.trim()) return ''
    if (!navigator.onLine) return 'आप ऑफलाइन हैं, आखिरी सलाह दिखाई जा रही है'
    if (!API_KEY) return '⚠️ कॉन्फ़िगरेशन आवश्यक: VITE_GEMINI_API_KEY सेट नहीं है.'

    let lastErr = null
    for (const model of MODELS) {
      try {
        const out = await callModel(model, question)
        if (out) return out
      } catch (e) { lastErr = e }
    }
    if (lastErr) throw lastErr
    return 'यह सुविधा जल्द ही आ रही है'
  } catch (err) {
    console.warn('Gemini error:', err)
    return '⚠️ AI सेवा अस्थायी रूप से उपलब्ध नहीं है'
  }
}
