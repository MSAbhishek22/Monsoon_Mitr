import React from 'react'

const ShareButton = ({ text, language, theme }) => {
  const handleShare = () => {
    if (navigator.share) {
      // Use native sharing if available
      navigator.share({
        title: language === 'HI' ? 'मौसम सलाह' : 'Weather Advice',
        text: text,
        url: window.location.href
      })
    } else {
      // Fallback to WhatsApp
      const whatsappText = encodeURIComponent(
        `${language === 'HI' ? '🌾 मौसम सलाह:' : '🌾 Weather Advice:'}\n\n${text}\n\n${language === 'HI' ? 'मॉनसून मित्र ऐप से' : 'From Monsoon Mitra App'}`
      )
      const whatsappUrl = `https://wa.me/?text=${whatsappText}`
      window.open(whatsappUrl, '_blank')
    }
  }

  const getButtonText = () => {
    if (language === 'HI') {
      return '📱 साझा करें'
    } else {
      return '📱 Share'
    }
  }

  return (
    <button
      onClick={handleShare}
      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95 ${
        theme === 'light'
          ? 'bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg'
          : 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg'
      }`}
      title={language === 'HI' ? 'WhatsApp पर साझा करें' : 'Share on WhatsApp'}
      aria-label={language === 'HI' ? 'सलाह साझा करें' : 'Share advice'}
    >
      {getButtonText()}
    </button>
  )
}

export default ShareButton
