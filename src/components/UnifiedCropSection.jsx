import React, { useState } from 'react'

const CROP_DATA = {
  wheat: {
    hi: { 
      name: 'गेहूं', 
      sow: 'नवंबर- दिसंबर', 
      harvest: 'मार्च- अप्रैल', 
      irrigation: '15-20 दिन में',
      advice: 'गेहूं के लिए मौसम अनुकूल है। अगले 3 दिन में बारिश की संभावना है, इसलिए सिंचाई न करें।'
    },
    en: { 
      name: 'Wheat', 
      sow: 'Nov - Dec', 
      harvest: 'Mar - Apr', 
      irrigation: 'Every 15-20 days',
      advice: 'Weather is favorable for wheat. Rain is expected in next 3 days, so avoid irrigation.'
    }
  },
  rice: {
    hi: { 
      name: 'धान', 
      sow: 'जून- जुलाई', 
      harvest: 'अक्टूबर- नवंबर', 
      irrigation: '7-10 दिन में',
      advice: 'धान के लिए पानी की आवश्यकता है। आज सिंचाई करें क्योंकि अगले 5 दिन में बारिश नहीं होगी।'
    },
    en: { 
      name: 'Rice', 
      sow: 'Jun - Jul', 
      harvest: 'Oct - Nov', 
      irrigation: 'Every 7-10 days',
      advice: 'Rice needs water. Irrigate today as no rain is expected for next 5 days.'
    }
  },
  vegetables: {
    hi: { 
      name: 'सब्ज़ियाँ', 
      sow: 'फसल पर निर्भर', 
      harvest: 'फसल पर निर्भर', 
      irrigation: '5-7 दिन में',
      advice: 'सब्जियों के लिए नियमित सिंचाई जरूरी है। आज सिंचाई करें।'
    },
    en: { 
      name: 'Vegetables', 
      sow: 'Depends on crop', 
      harvest: 'Depends on crop', 
      irrigation: 'Every 5-7 days',
      advice: 'Regular irrigation is essential for vegetables. Irrigate today.'
    }
  },
  maize: {
    hi: { 
      name: 'मक्का', 
      sow: 'जून- जुलाई / फरवरी', 
      harvest: 'सितंबर- अक्टूबर', 
      irrigation: '10-12 दिन में',
      advice: 'मक्का के लिए मौसम अनुकूल है। अगले 2 दिन में बारिश होगी।'
    },
    en: { 
      name: 'Maize', 
      sow: 'Jun - Jul / Feb', 
      harvest: 'Sep - Oct', 
      irrigation: 'Every 10-12 days',
      advice: 'Weather is favorable for maize. Rain expected in next 2 days.'
    }
  },
  mustard: {
    hi: { 
      name: 'सरसों', 
      sow: 'अक्टूबर- नवंबर', 
      harvest: 'फरवरी- मार्च', 
      irrigation: '20-25 दिन में',
      advice: 'सरसों के लिए सिंचाई की आवश्यकता है। आज सिंचाई करें।'
    },
    en: { 
      name: 'Mustard', 
      sow: 'Oct - Nov', 
      harvest: 'Feb - Mar', 
      irrigation: 'Every 20-25 days',
      advice: 'Mustard needs irrigation. Irrigate today.'
    }
  }
}

const UnifiedCropSection = ({ language, theme, onCropChange, selectedCrop }) => {
  const [showAdvice, setShowAdvice] = useState(false)

  const getText = (key) => {
    const texts = {
      title: language === 'HI' ? '🌱 अपनी फसल चुनें' : '🌱 Select Your Crop',
      subtitle: language === 'HI' ? 'फसल के हिसाब से सटीक सलाह मिलेगी' : 'Get precise advice based on your crop',
      cropInfo: language === 'HI' ? '📘 फसल जानकारी' : '📘 Crop Information',
      advice: language === 'HI' ? '💧 सलाह' : '💧 Advice',
      sow: language === 'HI' ? 'बुवाई' : 'Sowing',
      harvest: language === 'HI' ? 'कटाई' : 'Harvest',
      irrigation: language === 'HI' ? 'सिंचाई' : 'Irrigation',
      viewAdvice: language === 'HI' ? 'सलाह देखें' : 'View Advice',
      hideAdvice: language === 'HI' ? 'सलाह छिपाएं' : 'Hide Advice',
      selectCrop: language === 'HI' ? 'पहले फसल चुनें' : 'Please select a crop first'
    }
    return texts[key] || key
  }

  const getLangKey = () => language === 'HI' ? 'hi' : 'en'

  const handleCropSelect = (cropId) => {
    onCropChange(cropId)
    setShowAdvice(true)
  }

  const selectedCropData = selectedCrop ? CROP_DATA[selectedCrop]?.[getLangKey()] : null

  return (
    <div className={`farmer-card unified-crop-section transition-all duration-500 ${
      theme === 'light' ? 'bg-white' : 'bg-gray-800 border-gray-700'
    }`}>
      <div className="mobile-card">
        {/* Header Section */}
        <div className="text-center mb-6">
          <h3 className={`mobile-heading ${
            theme === 'light' ? 'text-farmer-dark' : 'text-white'
          }`}>
            {getText('title')}
          </h3>
          <p className={`mobile-text ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            {getText('subtitle')}
          </p>
        </div>

        {/* Crop Selection Grid */}
        <div className="crop-selector-mobile mb-6">
          {Object.entries(CROP_DATA).map(([cropId, cropData]) => {
            const cropInfo = cropData[getLangKey()]
            const isSelected = selectedCrop === cropId
            
            return (
              <button
                key={cropId}
                onClick={() => handleCropSelect(cropId)}
                className={`crop-button-mobile transition-all duration-300 farmer-focus-visible ${
                  isSelected
                    ? 'border-farmer-green shadow-lg scale-105 bg-farmer-green/10 ring-2 ring-farmer-green selected'
                    : 'border-gray-200 dark:border-gray-600 hover:border-farmer-green/50 hover:scale-105'
                } ${theme === 'light' ? 'bg-white' : 'bg-gray-700'}`}
                aria-label={`${language === 'HI' ? 'फसल चुनें' : 'Select crop'}: ${cropInfo.name}`}
                style={{
                  minHeight: '120px',
                  minWidth: '120px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1rem',
                  boxSizing: 'border-box'
                }}
              >
                <div className="text-4xl mb-3" style={{ fontSize: '2.5rem' }}>
                  {cropId === 'rice' ? '🌾' : cropId === 'vegetables' ? '🥬' : cropId === 'maize' ? '🌽' : cropId === 'mustard' ? '🟡' : '🌾'}
                </div>
                <div className={`text-base font-medium text-center ${
                  theme === 'light' ? 'text-gray-800' : 'text-gray-200'
                }`} style={{ fontSize: '0.875rem', lineHeight: '1.2' }}>
                  {cropInfo.name}
                </div>
                {isSelected && (
                  <div className="text-farmer-green text-xl mt-2 font-bold">✓</div>
                )}
              </button>
            )
          })}
        </div>

        {/* Crop Information & Advice Section */}
        {selectedCrop && selectedCropData && (
          <div className="space-y-4">
            {/* Crop Information Card */}
            <div className={`crop-info-card p-4 rounded-xl border-2 ${
              theme === 'light' 
                ? 'bg-green-50 border-green-200' 
                : 'bg-green-900/20 border-green-700'
            }`}>
              <h4 className={`text-lg font-bold mb-3 ${
                theme === 'light' ? 'text-green-800' : 'text-green-200'
              }`}>
                📘 {getText('cropInfo')}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className={`p-3 rounded-lg ${
                  theme === 'light' ? 'bg-white border border-green-300' : 'bg-gray-700 border border-green-600'
                }`}>
                  <div className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">
                    {getText('sow')}
                  </div>
                  <div className={`font-semibold ${
                    theme === 'light' ? 'text-gray-800' : 'text-gray-200'
                  }`}>
                    {selectedCropData.sow}
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${
                  theme === 'light' ? 'bg-white border border-green-300' : 'bg-gray-700 border border-green-600'
                }`}>
                  <div className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">
                    {getText('harvest')}
                  </div>
                  <div className={`font-semibold ${
                    theme === 'light' ? 'text-gray-800' : 'text-gray-200'
                  }`}>
                    {selectedCropData.harvest}
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${
                  theme === 'light' ? 'bg-white border border-green-300' : 'bg-gray-700 border border-green-600'
                }`}>
                  <div className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">
                    {getText('irrigation')}
                  </div>
                  <div className={`font-semibold ${
                    theme === 'light' ? 'text-gray-800' : 'text-gray-200'
                  }`}>
                    {selectedCropData.irrigation}
                  </div>
                </div>
              </div>
            </div>

            {/* Advice Section */}
            <div className={`advice-card p-4 rounded-xl border-2 ${
              theme === 'light' 
                ? 'bg-blue-50 border-blue-200' 
                : 'bg-blue-900/20 border-blue-700'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <h4 className={`text-lg font-bold ${
                  theme === 'light' ? 'text-blue-800' : 'text-blue-200'
                }`}>
                  💧 {getText('advice')}
                </h4>
                <button
                  onClick={() => setShowAdvice(!showAdvice)}
                  className={`farmer-touch-target px-3 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    theme === 'light' 
                      ? 'bg-blue-100 hover:bg-blue-200 text-blue-700' 
                      : 'bg-blue-800 hover:bg-blue-700 text-blue-200'
                  }`}
                  aria-label={showAdvice ? getText('hideAdvice') : getText('viewAdvice')}
                >
                  {showAdvice ? '👁️' : '👁️'}
                </button>
              </div>
              
              {showAdvice && (
                <div className={`p-3 rounded-lg ${
                  theme === 'light' ? 'bg-white border border-blue-300' : 'bg-gray-700 border border-blue-600'
                }`}>
                  <p className={`text-base leading-relaxed ${
                    theme === 'light' ? 'text-gray-800' : 'text-gray-200'
                  }`}>
                    {selectedCropData.advice}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* No Crop Selected Message */}
        {!selectedCrop && (
          <div className={`text-center p-6 ${
            theme === 'light' ? 'text-gray-500' : 'text-gray-400'
          }`}>
            <div className="text-4xl mb-3">🌱</div>
            <p className="text-lg">{getText('selectCrop')}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default UnifiedCropSection
