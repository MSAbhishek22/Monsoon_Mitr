const API_KEY = "AIzaSyCHQKSrOodgcOIXENjqQwfLefuO4DJJ6MA"

const MODELS = [
  'gemini-1.5-flash-latest',
  'gemini-1.5-flash',
  'gemini-pro',
]

function buildPrompt(question) {
  return [
    'आप एक कृषि सहायक हैं। हमेशा साधारण भाषा में उत्तर दें।',
    'फॉर्मैट सख्ती से यह रखें:',
    '1) पहली पंक्ति: एक-वाक्य निष्कर्ष (जैसे “✅ पानी दें” या “⛔ पानी न दें”).',
    '2) अगली पंक्तियाँ: 3–6 बिंदु, प्रत्येक नई पंक्ति में “- ” के साथ।',
    '3) अनावश्यक लंबी बात नहीं, कोई मार्कडाउन/टेबल नहीं।',
    '4) उपयोगकर्ता जिस भाषा में पूछे, उसी भाषा में उत्तर दें (English/Hindi/Hinglish). अगर मिलीजुली भाषा हो तो हिंदी में उत्तर दें।',
    'प्रश्न:',
    question
  ].join('\n')
}

async function callModel(model, question) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`
  const body = { contents: [ { role: 'user', parts: [ { text: buildPrompt(question) } ] } ] }
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
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
    if (!navigator.onLine) {
      return 'आप ऑफलाइन हैं, आखिरी सलाह दिखाई जा रही है'
    }

    let lastErr = null
    for (const model of MODELS) {
      try {
        const out = await callModel(model, question)
        if (out) return out
      } catch (e) {
        lastErr = e
      }
    }
    if (lastErr) throw lastErr
    return 'यह सुविधा जल्द ही आ रही है'
  } catch (err) {
    console.warn('Gemini error:', err)
    return `⚠️ AI त्रुटि: सेवा उपलब्ध नहीं है (कृपया बाद में प्रयास करें)`
  }
}
