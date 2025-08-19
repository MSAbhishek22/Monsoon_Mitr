import React from 'react'
import LocationSearch from './LocationSearch'
import InstallPWA from './InstallPWA'
import AccessibilitySettings from './AccessibilitySettings'
import { getPrefs, setPrefs } from '../state/prefs'

const TopBar = ({ language, onLanguageToggle, theme, onThemeToggle, onLocationChange, onLanguageChange, isOffline }) => {
  const [openLang, setOpenLang] = React.useState(false)
  const [showAccessibility, setShowAccessibility] = React.useState(false)

  const setLang = (code) => {
    setPrefs({ language: code })
    if (onLanguageChange) onLanguageChange(code)
    setOpenLang(false)
  }

  return (
    <div className={`mobile-nav sticky top-0 z-50 backdrop-blur-md border-b ${ theme === 'light' ? 'bg-white/80 border-gray-200' : 'bg-gray-900/80 border-gray-700' }`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <div className="flex-shrink-0">
              <h1 className={`mobile-heading title-underline ${ theme === 'light' ? 'text-farmer-dark' : 'text-white' }`}>
                <span className="farmer-icon-large">🌾</span> {language === 'HI' ? 'मॉनसून मित्र' : 'Monsoon Mitra'}
              </h1>
              <p className={`${ theme === 'light' ? 'text-green-700' : 'text-green-300' } text-xs md:text-sm font-semibold`}>{language === 'HI' ? 'किसानों का मौसम साथी' : "Farmer's Weather Companion"}</p>
            </div>
            <div className="hidden md:block flex-1 max-w-xs">
              <LocationSearch language={language} theme={theme} onLocationChange={onLocationChange} />
            </div>
          </div>

          <div className="flex items-center space-x-3 relative flex-shrink-0">
            {/* Enhanced online/offline indicator */}
            <div 
              className={`w-4 h-4 rounded-full transition-all duration-300 ${ isOffline ? 'bg-red-500 animate-pulse' : 'bg-green-500' }`} 
              title={isOffline ? (language === 'HI' ? 'ऑफलाइन' : 'Offline') : (language === 'HI' ? 'ऑनलाइन' : 'Online')}
              aria-label={isOffline ? (language === 'HI' ? 'इंटरनेट कनेक्शन नहीं है' : 'No internet connection') : (language === 'HI' ? 'इंटरनेट कनेक्शन है' : 'Internet connection available')}
              role="status"
              aria-live="polite"
            ></div>
            
            <InstallPWA language={language} theme={theme} compact />
            
            {/* Button Container for Better Spacing */}
            <div className="top-bar-buttons">
              {/* Weather Alerts Button - Red Siren */}
              <button
                onClick={() => console.log('Weather Alerts Clicked!')} // Placeholder for weather alert logic
                className="weather-alert-button topbar-compact-btn farmer-focus-visible farmer-haptic text-white rounded-lg transition-all duration-300"
                aria-label={language === 'HI' ? 'मौसम चेतावनी' : 'Weather Alerts'}
                title={language === 'HI' ? 'मौसम चेतावनी' : 'Weather Alerts'}
              >
                <span className="topbar-icon">🚨</span>
                <span className="sr-only">
                  {language === 'HI' ? 'मौसम चेतावनी' : 'Weather Alerts'}
                </span>
              </button>

              {/* Accessibility Settings Button - Blue */}
              <button
                onClick={() => setShowAccessibility(true)}
                className="accessibility-button topbar-compact-btn farmer-focus-visible farmer-haptic text-white rounded-lg transition-all duration-300"
                aria-label={language === 'HI' ? 'सुलभता सेटिंग्स' : 'Accessibility Settings'}
                title={language === 'HI' ? 'सुलभता सेटिंग्स' : 'Accessibility Settings'}
              >
                <span className="topbar-icon">♿</span>
                <span className="sr-only">
                  {language === 'HI' ? 'सुलभता सेटिंग्स' : 'Accessibility Settings'}
                </span>
              </button>
            </div>
            
            {/* Enhanced theme toggle */}
            <button 
              onClick={onThemeToggle} 
              className={`topbar-compact-btn rounded-lg farmer-focus-visible farmer-haptic ${ theme === 'light' ? 'bg-green-50 hover:bg-green-100 text-green-700' : 'bg-green-900/30 hover:bg-green-900/50 text-green-200' }`} 
              title={theme === 'light' ? (language === 'HI' ? 'डार्क मोड' : 'Dark mode') : (language === 'HI' ? 'लाइट मोड' : 'Light mode')} 
              aria-label={theme === 'light' ? (language === 'HI' ? 'डार्क मोड में बदलें' : 'Switch to dark mode') : (language === 'HI' ? 'लाइट मोड में बदलें' : 'Switch to light mode')}
            >
              <span className="topbar-icon">{theme === 'light' ? '🌙' : '☀️'}</span>
            </button>
            
            {/* Enhanced language selector */}
            <div className="relative">
              <button 
                onClick={() => setOpenLang(!openLang)} 
                className={`topbar-compact-btn px-3 rounded-lg font-medium farmer-focus-visible farmer-haptic ${ theme === 'light' ? 'btn-green' : 'btn-green' }`} 
                title={language === 'HI' ? 'भाषा बदलें' : 'Change language'} 
                aria-label={language === 'HI' ? 'भाषा बदलें' : 'Change language'}
                aria-expanded={openLang}
                aria-haspopup="true"
                aria-describedby="language-menu"
              >
                <span className="topbar-icon">🌐</span> <span className="hidden sm:inline">{language === 'HI' ? 'भाषा बदलें' : 'Change Language'}</span>
              </button>
              {openLang && (
                <div 
                  id="language-menu"
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 farmer-outdoor-visible"
                  role="menu"
                  aria-orientation="vertical"
                >
                  <button 
                    onClick={() => setLang('HI')} 
                    className="w-full text-left px-4 py-3 hover:bg-green-50 dark:hover:bg-green-900/30 font-medium farmer-focus-visible"
                    role="menuitem"
                    aria-label="हिंदी में बदलें"
                  >
                    🇮🇳 हिंदी
                  </button>
                  <button 
                    onClick={() => setLang('EN')} 
                    className="w-full text-left px-4 py-3 hover:bg-green-50 dark:hover:bg-green-900/30 font-medium farmer-focus-visible"
                    role="menuitem"
                    aria-label="Change to English"
                  >
                    🇺🇸 English
                  </button>
                  <button 
                    onClick={() => setLang('BN')} 
                    className="w-full text-left px-4 py-3 hover:bg-green-50 dark:hover:bg-green-900/30 font-medium farmer-focus-visible"
                    role="menuitem"
                    aria-label="বাংলায় পরিবর্তন করুন"
                  >
                    🇧🇩 বাংলা
                  </button>
                  <button 
                    onClick={() => setLang('MR')} 
                    className="w-full text-left px-4 py-3 hover:bg-green-50 dark:hover:bg-green-900/30 font-medium farmer-focus-visible"
                    role="menuitem"
                    aria-label="मराठीत बदला"
                  >
                    🇮🇳 मराठी
                  </button>
                  <button 
                    onClick={() => setLang('PA')} 
                    className="w-full text-left px-4 py-3 hover:bg-green-50 dark:hover:bg-green-900/30 font-medium farmer-focus-visible"
                    role="menuitem"
                    aria-label="ਪੰਜਾਬੀ ਵਿੱਚ ਬਦਲੋ"
                  >
                    🇮🇳 ਪੰਜਾਬੀ
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="md:hidden mt-3">
          <LocationSearch language={language} theme={theme} onLocationChange={onLocationChange} />
        </div>
      </div>
      
      {/* Accessibility Settings Modal */}
      <AccessibilitySettings 
        language={language}
        theme={theme}
        isOpen={showAccessibility}
        onClose={() => setShowAccessibility(false)}
      />
    </div>
  )
}

export default TopBar 