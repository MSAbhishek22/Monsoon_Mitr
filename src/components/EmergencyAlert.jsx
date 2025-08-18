import React from 'react'

const EmergencyAlert = ({ alert, language, onClose }) => {
  const getAlertIcon = (type) => {
    switch (type) {
      case 'flood':
        return '🌊'
      case 'drought':
        return '🌵'
      default:
        return '⚠️'
    }
  }

  const getAlertColor = (color) => {
    switch (color) {
      case 'red':
        return 'bg-red-500 border-red-600'
      case 'orange':
        return 'bg-orange-500 border-orange-600'
      case 'yellow':
        return 'bg-yellow-500 border-yellow-600'
      default:
        return 'bg-red-500 border-red-600'
    }
  }

  const getCloseText = () => {
    if (language === 'HI') {
      return 'बंद करें'
    }
    return 'Close'
  }

  return (
    <div className="sticky top-0 z-50 animate-pulse">
      <div className={`${getAlertColor(alert.color)} text-white border-b-4 shadow-lg`}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{getAlertIcon(alert.type)}</div>
              <div className="text-lg font-bold">
                {alert.message}
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              {getCloseText()}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmergencyAlert
