import React, { useState, useEffect } from 'react'
import { getPrefs, setPrefs } from '../state/prefs'

const StageSelector = ({ language, theme, onLocationChange }) => {
  const [prefs, setPrefsState] = useState(getPrefs())
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Update preferences and persist to localStorage
  const updatePrefs = (newPrefs) => {
    const updated = { ...prefs, ...newPrefs }
    setPrefsState(updated)
    setPrefs(updated)
    
    // Trigger location change if coordinates changed
    if (newPrefs.location && onLocationChange) {
      onLocationChange(newPrefs.location)
    }
  }

  // Get localized text
  const getText = (key) => {
    if (language === 'HI') {
      const texts = {
        title: 'फसल और क्षेत्र जानकारी',
        crop: 'फसल',
        stage: 'किस चरण में',
        area: 'क्षेत्र (एकड़)',
        help: 'अपनी फसल की वर्तमान स्थिति बताएं',
        wheat: 'गेहूं',
        rice: 'धान',
        vegetables: 'सब्जी',
        sowing: 'बुवाई',
        growing: 'वृद्धि',
        harvesting: 'कटाई'
      }
      return texts[key] || key
    } else {
      const texts = {
        title: 'Crop & Field Information',
        crop: 'Crop',
        stage: 'Current Stage',
        area: 'Area (Acres)',
        help: 'Tell us about your crop\'s current status',
        wheat: 'Wheat',
        rice: 'Rice',
        vegetables: 'Vegetables',
        sowing: 'Sowing',
        growing: 'Growing',
        harvesting: 'Harvesting'
      }
      return texts[key] || key
    }
  }

  return (
    <div className={`farmer-card transition-colors duration-300 ${
      theme === 'light' ? 'bg-white' : 'bg-gray-800 border-gray-700'
    }`}>
      <div className="mobile-card">
        {/* Header with collapse toggle */}
        <div className="flex items-center justify-between mb-4">
          <h3 className={`mobile-heading ${
            theme === 'light' ? 'text-farmer-dark' : 'text-white'
          }`}>
            🌱 {getText('title')}
          </h3>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
            aria-label={isCollapsed ? 'Expand' : 'Collapse'}
          >
            {isCollapsed ? '▼' : '▲'}
          </button>
        </div>

        {!isCollapsed && (
          <div className="space-y-4">
            {/* Help text */}
            <p className={`mobile-text ${
              theme === 'light' ? 'text-gray-600' : 'text-gray-400'
            }`}>
              {getText('help')}
            </p>

            {/* Crop Selection */}
            <div>
              <label className={`block font-medium mb-2 ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}>
                {getText('crop')}
              </label>
              <select
                value={prefs.crop}
                onChange={(e) => updatePrefs({ crop: e.target.value })}
                className={`farmer-input ${
                  theme === 'light' 
                    ? 'border-gray-200 focus:border-farmer-green' 
                    : 'border-gray-600 focus:border-farmer-light-green bg-gray-700 text-white'
                }`}
              >
                <option value="wheat">{getText('wheat')}</option>
                <option value="rice">{getText('rice')}</option>
                <option value="vegetables">{getText('vegetables')}</option>
              </select>
            </div>

            {/* Stage Selection */}
            <div>
              <label className={`block font-medium mb-2 ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}>
                {getText('stage')}
              </label>
              <select
                value={prefs.stage}
                onChange={(e) => updatePrefs({ stage: e.target.value })}
                className={`farmer-input ${
                  theme === 'light' 
                    ? 'border-gray-200 focus:border-farmer-green' 
                    : 'border-gray-600 focus:border-farmer-light-green bg-gray-700 text-white'
                }`}
              >
                <option value="Sowing">{getText('sowing')}</option>
                <option value="Growing">{getText('growing')}</option>
                <option value="Harvesting">{getText('harvesting')}</option>
              </select>
            </div>

            {/* Area Input */}
            <div>
              <label className={`block font-medium mb-2 ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-300'
              }`}>
                {getText('area')}
              </label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={prefs.areaAcre}
                onChange={(e) => updatePrefs({ areaAcre: parseFloat(e.target.value) || 1 })}
                className={`farmer-input ${
                  theme === 'light' 
                    ? 'border-gray-200 focus:border-farmer-green' 
                    : 'border-gray-600 focus:border-farmer-light-green bg-gray-700 text-white'
                }`}
                placeholder="1.0"
              />
            </div>

            {/* Current Location Display */}
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className={`text-sm ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-400'
              }`}>
                <span className="font-medium">📍 {language === 'HI' ? 'वर्तमान स्थान' : 'Current Location'}:</span>
                <br />
                {prefs.location.name} ({prefs.location.lat.toFixed(2)}, {prefs.location.lon.toFixed(2)})
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default StageSelector
