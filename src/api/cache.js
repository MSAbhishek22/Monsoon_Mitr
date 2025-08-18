const KEY = (lat, lon) => `wx:${lat.toFixed(2)},${lon.toFixed(2)}`;

export function getCachedWeather(lat, lon, maxAgeMin = 30) {
  try {
    const raw = localStorage.getItem(KEY(lat, lon));
    if (!raw) return null;
    const { ts, data } = JSON.parse(raw);
    const ageMin = (Date.now() - ts) / 60000;
    if (ageMin > maxAgeMin) return null;
    return data;
  } catch { return null; }
}

export function setCachedWeather(lat, lon, data) {
  try {
    localStorage.setItem(KEY(lat, lon), JSON.stringify({ ts: Date.now(), data }));
  } catch {}
}
