import React from 'react'
import LocationSearch from './LocationSearch'
import InstallPWA from './InstallPWA'
import { getPrefs, setPrefs } from '../state/prefs'

const TopBar = ({ language, onLanguageToggle, theme, onThemeToggle, onLocationChange, onLanguageChange, isOffline }) => {
  const [openLang, setOpenLang] = React.useState(false)

  const setLang = (code) => {
    setPrefs({ language: code })
    if (onLanguageChange) onLanguageChange(code)
    setOpenLang(false)
  }

  return (
    <div className={`mobile-nav sticky top-0 z-50 backdrop-blur-md border-b ${ theme === 'light' ? 'bg-white/80 border-gray-200' : 'bg-gray-900/80 border-gray-700' }`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className="flex-shrink-0">
              <h1 className={`mobile-heading title-underline ${ theme === 'light' ? 'text-farmer-dark' : 'text-white' }`}>
                🌾 {language === 'HI' ? 'मॉनसून मित्र' : 'Monsoon Mitra'}
              </h1>
              <p className={`${ theme === 'light' ? 'text-green-700' : 'text-green-300' } text-xs md:text-sm`}>{language === 'HI' ? 'किसानों का मौसम साथी' : "Farmer's Weather Companion"}</p>
            </div>
            <div className="hidden md:block flex-1 max-w-xs">
              <LocationSearch language={language} theme={theme} onLocationChange={onLocationChange} />
            </div>
          </div>

          <div className="flex items-center space-x-3 relative">
            <div className={`w-3 h-3 rounded-full ${ isOffline ? 'bg-red-500' : 'bg-green-500' }`} title={isOffline ? 'Offline' : 'Online'}></div>
            <InstallPWA language={language} theme={theme} />
            <button onClick={onThemeToggle} className={`touch-target p-2 rounded-lg focus-ring ${ theme === 'light' ? 'bg-green-50 hover:bg-green-100 text-green-700' : 'bg-green-900/30 hover:bg-green-900/50 text-green-200' }`} title={theme === 'light' ? 'Dark mode' : 'Light mode'} aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>{theme === 'light' ? '🌙' : '☀️'}</button>
            <div className="relative">
              <button onClick={() => setOpenLang(!openLang)} className={`touch-target px-3 py-2 rounded-lg font-medium focus-ring ${ theme === 'light' ? 'btn-green' : 'btn-green' }`} title="Change language" aria-label="Change language">🌐 {language === 'HI' ? 'भाषा बदलें' : 'Change Language'}</button>
              {openLang && (
                <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                  <button onClick={() => setLang('HI')} className="w-full text-left px-3 py-2 hover:bg-green-50 dark:hover:bg-green-900/30">हिंदी</button>
                  <button onClick={() => setLang('EN')} className="w-full text-left px-3 py-2 hover:bg-green-50 dark:hover:bg-green-900/30">English</button>
                  <button onClick={() => setLang('BN')} className="w-full text-left px-3 py-2 hover:bg-green-50 dark:hover:bg-green-900/30">বাংলা</button>
                  <button onClick={() => setLang('MR')} className="w-full text-left px-3 py-2 hover:bg-green-50 dark:hover:bg-green-900/30">मराठी</button>
                  <button onClick={() => setLang('PA')} className="w-full text-left px-3 py-2 hover:bg-green-50 dark:hover:bg-green-900/30">ਪੰਜਾਬੀ</button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="md:hidden mt-3">
          <LocationSearch language={language} theme={theme} onLocationChange={onLocationChange} />
        </div>
      </div>
    </div>
  )
}

export default TopBar 