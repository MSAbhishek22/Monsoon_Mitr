import React, { useState } from 'react'
import { getPrefs, setPrefs } from '../state/prefs'

const AccessibilitySettings = ({ language, theme, onClose, isOpen }) => {
  const [settings, setSettings] = useState({
    highContrast: getPrefs().highContrast || false,
    largeText: getPrefs().largeText || false,
    outdoorMode: getPrefs().outdoorMode || false,
    hapticFeedback: getPrefs().hapticFeedback || true,
    voicePrompts: getPrefs().voicePrompts || true
  })

  // Don't render if not open
  if (!isOpen) {
    return null
  }
  
  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    setPrefs({ [key]: value })
    
    // Apply settings immediately
    if (key === 'highContrast') {
      document.body.classList.toggle('farmer-high-contrast', value)
    }
    if (key === 'largeText') {
      document.body.classList.toggle('farmer-large-text', value)
    }
    if (key === 'outdoorMode') {
      document.body.classList.toggle('farmer-outdoor-mode', value)
    }
  }

  const getText = (key) => {
    const texts = {
      title: language === 'HI' ? 'सुलभता सेटिंग्स' : 'Accessibility Settings',
      highContrast: language === 'HI' ? 'उच्च कंट्रास्ट' : 'High Contrast',
      highContrastDesc: language === 'HI' ? 'बाहर के लिए बेहतर दिखाई देता है' : 'Better visibility for outdoor use',
      largeText: language === 'HI' ? 'बड़ा टेक्स्ट' : 'Large Text',
      largeTextDesc: language === 'HI' ? 'सभी टेक्स्ट को बड़ा करें' : 'Make all text larger',
      outdoorMode: language === 'HI' ? 'बाहरी मोड' : 'Outdoor Mode',
      outdoorModeDesc: language === 'HI' ? 'धूप में बेहतर दिखाई देता है' : 'Better visibility in sunlight',
      hapticFeedback: language === 'HI' ? 'स्पर्श प्रतिक्रिया' : 'Touch Feedback',
      hapticFeedbackDesc: language === 'HI' ? 'बटन दबाने पर प्रतिक्रिया' : 'Feedback when pressing buttons',
      voicePrompts: language === 'HI' ? 'आवाज संकेत' : 'Voice Prompts',
      voicePromptsDesc: language === 'HI' ? 'आवाज में निर्देश सुनें' : 'Hear instructions in voice',
      close: language === 'HI' ? 'बंद करें' : 'Close',
      reset: language === 'HI' ? 'रीसेट करें' : 'Reset to Default'
    }
    return texts[key] || key
  }

  const resetToDefault = () => {
    const defaultSettings = {
      highContrast: false,
      largeText: false,
      outdoorMode: false,
      hapticFeedback: true,
      voicePrompts: true
    }
    setSettings(defaultSettings)
    Object.entries(defaultSettings).forEach(([key, value]) => {
      setPrefs({ [key]: value })
      if (key === 'highContrast') document.body.classList.remove('farmer-high-contrast')
      if (key === 'largeText') document.body.classList.remove('farmer-large-text')
      if (key === 'outdoorMode') document.body.classList.remove('farmer-outdoor-mode')
    })
  }

  return (
    <div className="accessibility-modal bg-black/60 backdrop-blur-sm">
      <div 
        className={`accessibility-modal-content ${
          theme === 'light' ? 'bg-white' : 'bg-gray-800'
        } border-2 ${
          theme === 'light' ? 'border-gray-200' : 'border-gray-700'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="accessibility-title"
      >
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 id="accessibility-title" className={`text-2xl font-bold flex items-center gap-3 ${
                theme === 'light' ? 'text-farmer-dark' : 'text-white'
              }`}>
                <span className="farmer-icon text-3xl">♿</span> 
                <span>{getText('title')}</span>
              </h2>
              <button 
                onClick={onClose}
                className="farmer-touch-target p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 farmer-focus-visible transition-colors duration-200"
                aria-label={getText('close')}
              >
                <span className="farmer-icon text-xl">✕</span>
              </button>
            </div>

            <div className="space-y-6">
              {/* High Contrast Mode */}
              <div className={`p-5 rounded-xl border-2 ${
                theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-gray-700 border-gray-600'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                      <span className="farmer-icon">🎨</span>
                      {getText('highContrast')}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {getText('highContrastDesc')}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.highContrast}
                      onChange={(e) => handleSettingChange('highContrast', e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-14 h-7 rounded-full transition-all duration-300 ${
                      settings.highContrast 
                        ? 'bg-farmer-green' 
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}>
                      <div className={`w-6 h-6 bg-white rounded-full transition-all duration-300 transform ${
                        settings.highContrast ? 'translate-x-7' : 'translate-x-1'
                      } shadow-lg`}></div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Large Text Mode */}
              <div className={`p-5 rounded-xl border-2 ${
                theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-gray-700 border-gray-600'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                      <span className="farmer-icon">📝</span>
                      {getText('largeText')}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {getText('largeTextDesc')}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.largeText}
                      onChange={(e) => handleSettingChange('largeText', e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-14 h-7 rounded-full transition-all duration-300 ${
                      settings.largeText 
                        ? 'bg-farmer-green' 
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}>
                      <div className={`w-6 h-6 bg-white rounded-full transition-all duration-300 transform ${
                        settings.largeText ? 'translate-x-7' : 'translate-x-1'
                      } shadow-lg`}></div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Outdoor Mode */}
              <div className={`p-5 rounded-xl border-2 ${
                theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-gray-700 border-gray-600'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                      <span className="farmer-icon">☀️</span>
                      {getText('outdoorMode')}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {getText('outdoorModeDesc')}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.outdoorMode}
                      onChange={(e) => handleSettingChange('outdoorMode', e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-14 h-7 rounded-full transition-all duration-300 ${
                      settings.outdoorMode 
                        ? 'bg-farmer-green' 
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}>
                      <div className={`w-6 h-6 bg-white rounded-full transition-all duration-300 transform ${
                        settings.outdoorMode ? 'translate-x-7' : 'translate-x-1'
                      } shadow-lg`}></div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Haptic Feedback */}
              <div className={`p-5 rounded-xl border-2 ${
                theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-gray-700 border-gray-600'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                      <span className="farmer-icon">📳</span>
                      {getText('hapticFeedback')}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {getText('hapticFeedbackDesc')}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.hapticFeedback}
                      onChange={(e) => handleSettingChange('hapticFeedback', e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-14 h-7 rounded-full transition-all duration-300 ${
                      settings.hapticFeedback 
                        ? 'bg-farmer-green' 
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}>
                      <div className={`w-6 h-6 bg-white rounded-full transition-all duration-300 transform ${
                        settings.hapticFeedback ? 'translate-x-7' : 'translate-x-1'
                      } shadow-lg`}></div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Voice Prompts */}
              <div className={`p-5 rounded-xl border-2 ${
                theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-gray-700 border-gray-600'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                      <span className="farmer-icon">🔊</span>
                      {getText('voicePrompts')}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {getText('voicePromptsDesc')}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.voicePrompts}
                      onChange={(e) => handleSettingChange('voicePrompts', e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-14 h-7 rounded-full transition-all duration-300 ${
                      settings.voicePrompts 
                        ? 'bg-farmer-green' 
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}>
                      <div className={`w-6 h-6 bg-white rounded-full transition-all duration-300 transform ${
                        settings.voicePrompts ? 'translate-x-7' : 'translate-x-1'
                      } shadow-lg`}></div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8 pt-6 border-t-2 border-gray-200 dark:border-gray-600">
              <button
                onClick={resetToDefault}
                className="flex-1 farmer-touch-target px-6 py-3 rounded-xl font-medium transition-all duration-200 border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
              >
                {getText('reset')}
              </button>
              <button
                onClick={onClose}
                className="flex-1 farmer-touch-target px-6 py-3 rounded-xl font-medium transition-all duration-200 bg-farmer-green hover:bg-green-600 text-white shadow-lg hover:shadow-xl"
              >
                {getText('close')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccessibilitySettings
