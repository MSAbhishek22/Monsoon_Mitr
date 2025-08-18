import React, { useState, useEffect } from 'react'

const InstallPWA = ({ language, theme }) => {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isInstallable, setIsInstallable] = useState(false)

  useEffect(() => {
    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
    }

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstallable(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    // Show the install prompt
    deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt')
    } else {
      console.log('User dismissed the install prompt')
    }

    // Clear the deferredPrompt
    setDeferredPrompt(null)
    setIsInstallable(false)
  }

  if (!isInstallable) return null

  const getButtonText = () => {
    if (language === 'HI') {
      return '📱 ऐप इंस्टॉल करें'
    } else {
      return '📱 Install App'
    }
  }

  return (
    <button
      onClick={handleInstallClick}
      className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95 ${
        theme === 'light'
          ? 'bg-farmer-green hover:bg-farmer-light-green text-white shadow-md hover:shadow-lg'
          : 'bg-farmer-light-green hover:bg-farmer-green text-farmer-dark shadow-md hover:shadow-lg'
      }`}
      title={language === 'HI' ? 'होम स्क्रीन पर इंस्टॉल करें' : 'Install on home screen'}
      aria-label={language === 'HI' ? 'ऐप इंस्टॉल करें' : 'Install app'}
    >
      {getButtonText()}
    </button>
  )
}

export default InstallPWA
