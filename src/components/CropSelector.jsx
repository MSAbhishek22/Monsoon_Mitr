import React from 'react'

const CropSelector = ({ selectedCrop, onCropChange, language, theme }) => {
  const crops = [
    {
      id: 'wheat',
      name: language === 'HI' ? 'गेहूं' : 'Wheat',
      icon: '🌾',
      color: 'bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700'
    },
    {
      id: 'rice',
      name: language === 'HI' ? 'धान' : 'Rice',
      icon: '🌾',
      color: 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700'
    },
    {
      id: 'vegetables',
      name: language === 'HI' ? 'सब्जी' : 'Vegetables',
      icon: '🥬',
      color: 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700'
    }
  ]

  const getTitleText = () => {
    if (language === 'HI') {
      return 'अपनी फसल चुनें'
    }
    return 'Select Your Crop'
  }

  const getSubtitleText = () => {
    if (language === 'HI') {
      return 'फसल के हिसाब से सटीक सलाह मिलेगी'
    }
    return 'Get precise advice based on your crop'
  }

  return (
    <div className={`farmer-card transition-colors duration-300 ${
      theme === 'light' ? 'bg-white' : 'bg-gray-800 border-gray-700'
    }`}>
      <div className="mobile-card">
        <div className="text-center mb-6">
          <h3 className={`mobile-heading ${
            theme === 'light' ? 'text-farmer-dark' : 'text-white'
          }`}>
            🌱 {getTitleText()}
          </h3>
          <p className={`mobile-text ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            {getSubtitleText()}
          </p>
        </div>
        
        <div className="crop-selector-mobile">
          {crops.map((crop) => (
            <button
              key={crop.id}
              onClick={() => onCropChange(crop.id)}
              className={`crop-button-mobile transition-all duration-200 ${
                selectedCrop === crop.id
                  ? 'border-farmer-green shadow-lg scale-105 bg-farmer-green/10'
                  : 'border-gray-200 dark:border-gray-600 hover:border-farmer-green/50'
              } ${crop.color}`}
              aria-label={`${language === 'HI' ? 'फसल चुनें' : 'Select crop'}: ${crop.name}`}
            >
              <div className="text-4xl mb-3">{crop.icon}</div>
              <div className={`text-base font-medium ${
                theme === 'light' ? 'text-gray-800' : 'text-gray-200'
              }`}>
                {crop.name}
              </div>
              {selectedCrop === crop.id && (
                <div className="text-farmer-green text-xl mt-2 font-bold">✓</div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CropSelector
