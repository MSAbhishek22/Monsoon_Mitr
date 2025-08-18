import React, { useState, useEffect } from 'react'
import { getTotals } from '../state/savings'

const SavingsCard = ({ savings, language, theme, selectedCrop }) => {
  const [savingsData, setSavingsData] = useState(getTotals())

  // Refresh savings data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setSavingsData(getTotals())
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

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

  const getSavingsBreakdown = (savings, crop) => {
    const cropMultiplier = {
      wheat: 1.0,
      rice: 1.2,
      vegetables: 1.5
    }
    const multiplier = cropMultiplier[crop] || 1.0
    return Math.round(savings * multiplier)
  }

  const getProgressColor = (savings) => {
    if (savings >= 2000) return 'bg-green-500'
    if (savings >= 1000) return 'bg-yellow-500'
    return 'bg-blue-500'
  }

  const getProgressText = (savings) => {
    if (language === 'HI') {
      if (savings >= 2000) return 'उत्कृष्ट! बहुत अच्छी बचत'
      if (savings >= 1000) return 'अच्छा! नियमित बचत'
      return 'शुरुआत अच्छी है'
    } else {
      if (savings >= 2000) return 'Excellent! Great savings'
      if (savings >= 1000) return 'Good! Regular savings'
      return 'Good start'
    }
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString(language === 'HI' ? 'hi-IN' : 'en-US', {
      day: 'numeric',
      month: 'short'
    })
  }

  return (
    <div className={`farmer-card transition-colors duration-300 ${
      theme === 'light' ? 'bg-white' : 'bg-gray-800 border-gray-700'
    }`}>
      <div className="farmer-header bg-farmer-amber">
        💰 {language === 'HI' ? 'बचत ट्रैकर' : 'Savings Tracker'}
      </div>
      
      <div className="mobile-card space-y-4">
        {/* Crop-specific Savings */}
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-700">
          <div className="flex items-center space-x-3 mb-3">
            <div className="text-2xl">{getCropIcon(selectedCrop)}</div>
            <div>
              <div className="font-semibold text-amber-800 dark:text-amber-200">
                {getCropName(selectedCrop)} {language === 'HI' ? 'के लिए' : 'for'}
              </div>
              <div className="text-sm text-amber-600 dark:text-amber-400">
                {language === 'HI' ? 'आज की बचत' : 'Today\'s savings'}
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <div className={`savings-amount-mobile font-bold ${
              theme === 'light' ? 'text-amber-800' : 'text-amber-200'
            }`}>
              ₹{getSavingsBreakdown(savings, selectedCrop)}
            </div>
            <div className="text-sm text-amber-600 dark:text-amber-400">
              {language === 'HI' ? 'बचाए गए रुपये' : 'Rupees saved'}
            </div>
          </div>
        </div>

        {/* Total Savings Overview */}
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
          <h4 className="font-bold mb-3 text-green-800 dark:text-green-200">
            📊 {language === 'HI' ? 'कुल बचत सारांश' : 'Total Savings Summary'}
          </h4>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-green-700 dark:text-green-300">
                {language === 'HI' ? 'कुल बचत' : 'Total Saved'}:
              </span>
              <span className="font-bold text-lg text-green-800 dark:text-green-200">
                ₹{savingsData.totalRupees}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-green-700 dark:text-green-300">
                {language === 'HI' ? 'टाली गई सिंचाइयाँ' : 'Avoided Irrigations'}:
              </span>
              <span className="font-bold text-lg text-green-800 dark:text-green-200">
                {savingsData.totalIrrigations}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-green-600 dark:text-green-400 mb-2">
              <span>{language === 'HI' ? 'बचत लक्ष्य' : 'Savings Goal'}</span>
              <span>₹{savingsData.totalRupees}/₹5000</span>
            </div>
            <div className="bg-green-200 dark:bg-green-800 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-1000 ${getProgressColor(savingsData.totalRupees)}`}
                style={{ width: `${Math.min((savingsData.totalRupees / 5000) * 100, 100)}%` }}
              ></div>
            </div>
            <div className="text-center mt-2 text-sm text-green-600 dark:text-green-400">
              {getProgressText(savingsData.totalRupees)}
            </div>
          </div>
        </div>

        {/* Recent Events */}
        {savingsData.lastEvents.length > 0 && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
            <h4 className="font-bold mb-3 text-blue-800 dark:text-blue-200">
              📝 {language === 'HI' ? 'हाल की गतिविधियाँ' : 'Recent Activities'}
            </h4>
            
            <div className="space-y-2">
              {savingsData.lastEvents.map((event, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-white dark:bg-gray-700 rounded border border-blue-200 dark:border-blue-600">
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-500">💧</span>
                    <span className="text-sm text-blue-700 dark:text-blue-300">
                      {language === 'HI' ? 'सिंचाई टाली' : 'Avoided irrigation'}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-blue-800 dark:text-blue-200">
                      ₹{event.rupees}
                    </div>
                    <div className="text-xs text-blue-600 dark:text-blue-400">
                      {formatDate(event.ts)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Savings Tips */}
        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
          <h4 className="font-bold mb-3 text-purple-800 dark:text-purple-200">
            💡 {language === 'HI' ? 'बचत के टिप्स' : 'Savings Tips'}
          </h4>
          
          <ul className="space-y-2 text-sm text-purple-700 dark:text-purple-300">
            <li className="flex items-start space-x-2">
              <span className="text-purple-500 mt-1">•</span>
              <span>
                {language === 'HI' 
                  ? 'मौसम की जानकारी लेकर सिंचाई करें'
                  : 'Check weather before irrigating'
                }
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-purple-500 mt-1">•</span>
              <span>
                {language === 'HI' 
                  ? 'बारिश का इंतजार करें, पानी बचाएं'
                  : 'Wait for rain, save water'
                }
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-purple-500 mt-1">•</span>
              <span>
                {language === 'HI' 
                  ? 'सही समय पर सिंचाई करें'
                  : 'Irrigate at the right time'
                }
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default SavingsCard
