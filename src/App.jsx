import React, { useState, useEffect, Suspense } from 'react'
import TopBar from './components/TopBar'
import WeatherCard from './components/WeatherCard'
import RecommendationCard from './components/RecommendationCard'
import SavingsCard from './components/SavingsCard'
import UnifiedCropSection from './components/UnifiedCropSection'
import StageSelector from './components/StageSelector'
import EmergencyAlert from './components/EmergencyAlert'
import VoiceInput from './components/VoiceInput'
// Lazy load AI Sahayak
const AISahayak = React.lazy(() => import('./components/ai/AISahayak'))
import { fetchOpenMeteo } from './api/providers/openMeteo'
import { getCachedWeather, setCachedWeather } from './api/cache'
import { getPrefs, setPrefs } from './state/prefs'
import { getHarvestRisk } from './utils/harvestRisk'
import { askGemini } from './components/ai/gemini'

function App() {
  const initialPrefs = getPrefs()
  const [language, setLanguage] = useState(initialPrefs.language || 'HI')
  const [theme, setTheme] = useState('light')
  const [loc, setLoc] = useState(null)
  const [wx, setWx] = useState(null)
  const [loading, setLoading] = useState(false)
  const [recommendation, setRecommendation] = useState('')
  const [isOffline, setIsOffline] = useState(!navigator.onLine)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [savings, setSavings] = useState(500)
  const [selectedCrop, setSelectedCrop] = useState('wheat')
  const [showVoiceInput, setShowVoiceInput] = useState(false)
  const [emergencyAlert, setEmergencyAlert] = useState(null)
  const [prefs, setPrefsState] = useState(initialPrefs)

  // Persist language preference
  useEffect(() => {
    setPrefs({ language })
  }, [language])

  // Global askAI hook for demos
  useEffect(() => {
    window.askAI = async (q) => {
      const res = await askGemini(q, language)
      console.log('AI:', res)
      return res
    }
    return () => { delete window.askAI }
  }, [language])

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const newLoc = { lat: pos.coords.latitude, lon: pos.coords.longitude }
        setLoc(newLoc)
        setPrefs({ location: { ...newLoc, name: 'Current Location' } })
      },
      () => {
        const fallbackLoc = { lat: 25.61, lon: 85.14 }
        setLoc(fallbackLoc)
        setPrefs({ location: { ...fallbackLoc, name: 'Patna' } })
      }
    )
  }, [])

  useEffect(() => {
    if (!loc) return
    const cached = getCachedWeather(loc.lat, loc.lon, 30)
    if (cached) {
      setWx(cached)
      setLastUpdate(new Date())
      checkEmergencyConditions(cached)
    }
    const loadWeather = async () => {
      try {
        setLoading(true)
        const data = await fetchOpenMeteo(loc)
        setWx(data)
        setLastUpdate(new Date())
        setCachedWeather(loc.lat, loc.lon, data)
        checkEmergencyConditions(data)
      } catch (e) {
        console.warn('Using cached/offline weather:', e.message)
        if (!cached) setWx(null)
      } finally { setLoading(false) }
    }
    if (navigator.onLine) loadWeather()
  }, [loc])

  useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const checkEmergencyConditions = (weather) => {
    if (!weather) return
    if (weather.next24h?.maxProb > 80) {
      setEmergencyAlert({ type: 'flood', message: language === 'HI' ? '⚠️ बाढ़ की चेतावनी: आज पानी न दें!' : "⚠️ Flood Warning: Don't irrigate today!", color: 'red' })
      return
    } else if (weather.next24h?.maxProb < 10 && weather.current?.tempC > 35) {
      setEmergencyAlert({ type: 'drought', message: language === 'HI' ? '🌵 सूखे की स्थिति: पानी बचाएं!' : '🌵 Drought Alert: Save water!', color: 'orange' })
      return
    }
    if (prefs.stage === 'Harvesting') {
      const harvestRisk = getHarvestRisk(weather)
      if (harvestRisk?.high) {
        setEmergencyAlert({ type: 'harvest', message: language === 'HI' ? '⚠️ कटाई टालें — अगले 48–72 घंटों में बारिश की आशंका है।' : '⚠️ Delay harvest — rain expected in next 48-72 hours.', color: 'red' })
        return
      }
    }
    setEmergencyAlert(null)
  }

  const generateRecommendation = (weather, crop) => {
    if (!weather) return ''
    const { next24h } = weather
    const maxProb = next24h?.maxProb ?? 0
    const totalRain = next24h?.totalRainMm ?? 0
    if (maxProb >= 50 || totalRain >= 5) {
      const cropAdvice = {
        wheat: language === 'HI' ? '🌧️ गेहूं के लिए पानी न दें, बारिश होगी' : "🌧️ Don't irrigate wheat, rain expected",
        rice: language === 'HI' ? '🌧️ धान के लिए बारिश का इंतजार करें' : '🌧️ Wait for rain for rice',
        vegetables: language === 'HI' ? '🌧️ सब्जियों को कम पानी दें' : '🌧️ Give less water to vegetables'
      }
      return cropAdvice[crop] || cropAdvice.wheat
    } else {
      const cropAdvice = {
        wheat: language === 'HI' ? '🚜 गेहूं के लिए सिंचाई करें' : '🚜 Irrigate wheat now',
        rice: language === 'HI' ? '💧 धान के लिए पानी दें' : '💧 Give water to rice',
        vegetables: language === 'HI' ? '🚜 सब्जियों की सिंचाई करें' : '🚜 Irrigate vegetables'
      }
      return cropAdvice[crop] || cropAdvice.wheat
    }
  }

  const calculateSavings = (weather, crop) => {
    if (!weather) return 500
    const { next24h } = weather
    const maxProb = next24h?.maxProb ?? 0
    const baseSavings = maxProb >= 50 ? 800 : 500
    const cropMultiplier = { wheat: 1.0, rice: 1.2, vegetables: 1.5 }
    return Math.round(baseSavings * (cropMultiplier[crop] || 1.0))
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  const handleLocationChange = (newLocation) => {
    setLoc({ lat: newLocation.lat, lon: newLocation.lon })
    setPrefsState(prev => ({ ...prev, location: newLocation }))
  }

  useEffect(() => {
    if (wx) {
      const newRecommendation = generateRecommendation(wx, selectedCrop)
      setRecommendation(newRecommendation)
      setSavings(calculateSavings(wx, selectedCrop))
    }
  }, [wx, language, selectedCrop])

  useEffect(() => { setPrefsState(getPrefs()) }, [])

  useEffect(() => {
    window.testEmergency = (type = 'flood') => {
      if (type === 'flood') setEmergencyAlert({ type: 'flood', message: language === 'HI' ? '⚠️ बाढ़ की चेतावनी: आज पानी न दें!' : "⚠️ Flood Warning: Don't irrigate today!", color: 'red' })
      else if (type === 'drought') setEmergencyAlert({ type: 'drought', message: language === 'HI' ? '🌵 सूखे की स्थिति: पानी बचाएं!' : '🌵 Drought Alert: Save water!', color: 'orange' })
    }
    return () => { delete window.testEmergency }
  }, [language])

  const legacyWeatherData = wx ? {
    condition: wx.current?.rainProb > 50 ? '🌧️ बारिश' : '☀️ धूप',
    temperature: `${wx.current?.tempC?.toFixed(1) ?? '--'}°C`,
    humidity: `${wx.current?.humidity?.toFixed(0) ?? '--'}%`,
    rainProbability: wx.current?.rainProb ?? 0
  } : null

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'light' ? 'bg-farmer-beige' : 'bg-gray-900'}`}>
      {emergencyAlert && (
        <EmergencyAlert alert={emergencyAlert} language={language} onClose={() => setEmergencyAlert(null)} />
      )}
      {isOffline && (
        <div className="offline-banner">⚠️ {language === 'HI' ? 'आप ऑफलाइन हैं, आखिरी सलाह दिखाई जा रही है' : 'You are offline, showing last saved advice'}</div>
      )}
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <TopBar 
          language={language}
          onLanguageToggle={() => setLanguage(language === 'HI' ? 'EN' : 'HI')}
          onLanguageChange={setLanguage}
          theme={theme}
          onThemeToggle={toggleTheme}
          onLocationChange={handleLocationChange}
          isOffline={isOffline}
        />

        <div className="text-center mb-8 mt-8">
          <h2 className={`mobile-heading ${theme === 'light' ? 'text-farmer-dark' : 'text-white'}`}>
            {language === 'HI' ? 'नमस्ते किसान भाई 👋' : 'Hello Farmer 👋'}
          </h2>
          <p className={`mobile-text ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
            {language === 'HI' ? 'आज का मौसम ये है...' : "Today's weather..."}
          </p>
        </div>

        <div className="mb-8">
          <StageSelector language={language} theme={theme} onLocationChange={handleLocationChange} />
        </div>
        
        {/* Unified Crop Section - Combines selection and information */}
        <div className="mb-8">
          <UnifiedCropSection 
            selectedCrop={selectedCrop} 
            onCropChange={setSelectedCrop} 
            language={language} 
            theme={theme} 
          />
        </div>

        <div className="mobile-grid lg:desktop-grid">
          <WeatherCard weatherData={legacyWeatherData} language={language} theme={theme} onRefresh={() => window.location.reload()} loading={loading} liveData={wx} />
          <RecommendationCard recommendation={recommendation} language={language} theme={theme} isOffline={isOffline} lastUpdate={lastUpdate} selectedCrop={selectedCrop} liveData={wx} areaAcre={prefs.areaAcre} />
          <div className="space-y-8">
            <SavingsCard savings={savings} language={language} theme={theme} selectedCrop={selectedCrop} />
            <Suspense fallback={<div>Loading AI Sahayak...</div>}>
              <AISahayak language={language} theme={theme} />
            </Suspense>
          </div>
        </div>

        {/* Removed separate CropInfoCard since it's now integrated */}

        {showVoiceInput && (
          <VoiceInput onClose={() => setShowVoiceInput(false)} onSubmit={() => {}} language={language} theme={theme} />
        )}

        <div className="fab-mobile">
          <button onClick={() => setShowVoiceInput(true)} className="bg-farmer-amber hover:bg-farmer-light-amber text-farmer-dark rounded-full shadow-lg transition-all duration-200 hover:scale-110 active:scale-95 audio-feedback flex items-center justify-center" title={language === 'HI' ? 'आवाज से बात करें' : 'Talk with voice'} aria-label={language === 'HI' ? 'आवाज से बात करें' : 'Talk with voice'}>
            <span className="text-4xl md:text-5xl">🎤</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default App 