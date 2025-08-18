import React from 'react'
import { speakHi } from '../utils/tts'
import { addAvoided } from '../state/savings'
import ShareButton from './ShareButton'

const RecommendationCard = ({ recommendation, language, theme, isOffline, lastUpdate, selectedCrop, liveData, areaAcre = 1 }) => {
  const getRecommendationIcon = (rec) => {
    if (rec.includes('🌧️')) return '🌧️'
    if (rec.includes('🚜')) return '🚜'
    if (rec.includes('💧')) return '💧'
    return '💡'
  }

  const getRecommendationColor = (rec) => {
    if (rec.includes('🌧️')) return 'text-red-700 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700'
    if (rec.includes('🚜')) return 'text-green-700 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
    if (rec.includes('💧')) return 'text-blue-700 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
    return 'text-gray-700 bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-700'
  }

  const getCropIcon = (crop) => {
    switch (crop) {
      case 'wheat': return '🌾'
      case 'rice': return '🌾'
      case 'vegetables': return '🥬'
      default: return '🌱'
    }
  }

  const getCropName = (crop) => {
    switch (crop) {
      case 'wheat': return language === 'HI' ? 'गेहूं' : 'Wheat'
      case 'rice': return language === 'HI' ? 'धान' : 'Rice'
      case 'vegetables': return language === 'HI' ? 'सब्जी' : 'Vegetables'
      default: return language === 'HI' ? 'फसल' : 'Crop'
    }
  }

  const getPriorityLevel = (liveData) => {
    if (!liveData) return 'medium'
    const { next24h } = liveData
    const maxProb = next24h?.maxProb ?? 0
    const totalRain = next24h?.totalRainMm ?? 0
    
    if (maxProb >= 70 || totalRain >= 10) return 'high'
    if (maxProb >= 50 || totalRain >= 5) return 'medium'
    return 'low'
  }

  const getPriorityColor = (level) => {
    switch (level) {
      case 'high': return 'text-red-700 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700'
      case 'medium': return 'text-yellow-700 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700'
      case 'low': return 'text-green-700 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
      default: return 'text-gray-700 bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-700'
    }
  }

  const getPriorityText = (level) => {
    if (language === 'HI') {
      switch (level) {
        case 'high': return '🔴 तुरंत ध्यान दें'
        case 'medium': return '🟡 सावधान रहें'
        case 'low': return '🟢 सामान्य स्थिति'
        default: return '⚪ जानकारी नहीं'
      }
    } else {
      switch (level) {
        case 'high': return '🔴 Immediate Attention'
        case 'medium': return '🟡 Be Cautious'
        case 'low': return '🟢 Normal Condition'
        default: return '⚪ No Information'
      }
    }
  }

  const getActionItems = (liveData) => {
    if (!liveData) return []
    
    const { next24h } = liveData
    const maxProb = next24h?.maxProb ?? 0
    const totalRain = next24h?.totalRainMm ?? 0
    
    if (maxProb >= 50 || totalRain >= 5) {
      return language === 'HI' ? [
        'सिंचाई न करें',
        'बारिश का इंतजार करें',
        'पानी बचाएं',
        'खेत में जाने से बचें'
      ] : [
        'Don\'t irrigate',
        'Wait for rain',
        'Save water',
        'Avoid going to field'
      ]
    } else {
      return language === 'HI' ? [
        'सिंचाई करें',
        'पानी की व्यवस्था करें',
        'फसल की देखभाल करें',
        'खेत में जाएं'
      ] : [
        'Irrigate now',
        'Arrange water supply',
        'Take care of crop',
        'Go to field'
      ]
    }
  }

  // Handle savings tracking
  const handleAvoidedIrrigation = () => {
    const savedEvent = addAvoided(areaAcre)
    if (savedEvent) {
      const message = language === 'HI' 
        ? `बधाई! आपने ₹${savedEvent.rupees} बचाए`
        : `Congratulations! You saved ₹${savedEvent.rupees}`
      alert(message)
      window.location.reload()
    }
  }

  const isWaitRecommendation = recommendation && (
    recommendation.includes('🌧️') || 
    recommendation.includes('Don\'t irrigate') ||
    recommendation.includes('Wait for rain')
  )

  const priorityLevel = getPriorityLevel(liveData)

  return (
    <div className={`farmer-card texture-card transition-colors duration-300 ${
      theme === 'light' ? 'bg-white' : 'bg-gray-800 border-gray-700'
    }`}>
      <div className={`farmer-header header-green-gradient` }>
        🌱 💧 {language === 'HI' ? 'सलाह' : 'Recommendation'}
      </div>
      
      <div className="mobile-card space-y-4 card-tint-green rounded-b-xl">
        {/* Crop Information */}
        <div className="p-4 rounded-lg border bg-white/70 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{getCropIcon(selectedCrop)}</div>
            <div>
              <div className="font-semibold text-gray-900 dark:text-gray-100">
                {language === 'HI' ? 'फसल' : 'Crop'}: {getCropName(selectedCrop)}
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                {language === 'HI' ? 'सलाह फसल के अनुसार' : 'Advice based on crop'}
              </div>
            </div>
          </div>
        </div>

        {/* Priority Indicator */}
        <div className={`p-4 rounded-lg border ${getPriorityColor(priorityLevel)}`}>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold">
              {getPriorityText(priorityLevel)}
            </span>
          </div>
        </div>

        {/* Main Recommendation with TTS and Share */}
        {recommendation ? (
          <div className="p-4 rounded-lg border bg-blue-50/80 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
            <div className="flex items-start space-x-3">
              <div className="text-2xl mt-1">{getRecommendationIcon(recommendation)}</div>
              <div className="flex-1">
                <div className={`text-xl font-extrabold leading-tight ${
                  theme === 'light' ? 'text-blue-900' : 'text-blue-200'
                }`}>
                  {recommendation}
                </div>
                <div className="text-sm mt-2 text-blue-700 dark:text-blue-300">
                  {language === 'HI' 
                    ? 'वर्तमान मौसम की स्थिति और बारिश की संभावना के आधार पर'
                    : 'Based on current weather conditions and rain probability'
                  }
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-3 mt-4">
              <button
                onClick={() => speakHi(recommendation)}
                className={`btn-green px-3 py-2 font-medium focus-ring`}
              >
                🔊 {language === 'HI' ? 'सुनें' : 'Listen'}
              </button>

              <div className="inline-block"><ShareButton text={recommendation} language={language} theme={theme} /></div>

              {isWaitRecommendation && (
                <button
                  onClick={handleAvoidedIrrigation}
                  className={`btn-green px-3 py-2 font-medium focus-ring`}
                >
                  ✅ {language === 'HI' ? 'मैंने इंतज़ार किया' : 'I waited'}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-lg border bg-white/70 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600">
            <div className="text-center text-gray-600 dark:text-gray-300">
              {language === 'HI' ? 'कोई सलाह नहीं मिली' : 'No recommendation available'}
            </div>
          </div>
        )}

        {/* Action Items */}
        {recommendation && (
          <div className="p-4 rounded-lg border bg-green-50/80 dark:bg-green-900/20 border-green-200 dark:border-green-700">
            <h4 className="font-bold mb-3 text-green-800 dark:text-green-200">
              📋 {language === 'HI' ? 'आज क्या करें' : 'What to do today'}
            </h4>
            <ul className="space-y-2">
              {getActionItems(liveData).map((item, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span className="text-green-800 dark:text-green-200 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Live Data Summary */}
        {liveData && (
          <div className="p-4 rounded-lg border bg-purple-50/80 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700">
            <h4 className="font-bold mb-3 text-purple-800 dark:text-purple-200">
              📊 {language === 'HI' ? 'मौसम सारांश' : 'Weather Summary'}
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{language === 'HI' ? '24 घंटे में बारिश संभावना' : '24h Rain Probability'}:</span>
                <span className="font-semibold">{liveData.next24h?.maxProb || '--'}%</span>
              </div>
              <div className="flex justify-between">
                <span>{language === 'HI' ? '24 घंटे में वर्षा' : '24h Rainfall'}:</span>
                <span className="font-semibold">{liveData.next24h?.totalRainMm?.toFixed(1) || '--'} mm</span>
              </div>
              <div className="flex justify-between">
                <span>{language === 'HI' ? 'वर्तमान तापमान' : 'Current Temperature'}:</span>
                <span className="font-semibold">{liveData.current?.tempC?.toFixed(1) || '--'}°C</span>
              </div>
            </div>
          </div>
        )}

        {isOffline && (
          <div className="p-3 rounded-lg border bg-amber-50/80 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700">
            <div className="flex items-center space-x-2">
              <span className="text-amber-600 dark:text-amber-400">⚠️</span>
              <span className="text-amber-800 dark:text-amber-300 text-sm">
                {language === 'HI' 
                  ? 'ऑफलाइन मोड: पिछली जानकारी दिख रही है'
                  : 'Offline mode: showing last saved information'
                }
              </span>
            </div>
          </div>
        )}

        <div className="text-center text-xs text-gray-600 dark:text-gray-300">
          {language === 'HI' ? 'अंतिम अपडेट' : 'Last updated'}: {lastUpdate.toLocaleTimeString()}
        </div>
      </div>
    </div>
  )
}

export default RecommendationCard 