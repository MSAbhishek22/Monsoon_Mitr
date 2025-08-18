// Geocoding API using Open-Meteo (no key required)
export async function searchPlace(q) {
  if (!q || q.trim().length < 2) return []
  
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=5&language=hi&format=json`
  
  try {
    const res = await fetch(url, { cache: "no-store" })
    if (!res.ok) throw new Error("Geocoding failed")
    
    const data = await res.json()
    return (data?.results || []).map(r => ({
      name: [r.name, r.admin1, r.country].filter(Boolean).join(", "),
      lat: r.latitude, 
      lon: r.longitude
    }))
  } catch (error) {
    console.warn('Geocoding error:', error.message)
    return []
  }
}
