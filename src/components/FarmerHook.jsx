import React from 'react'

const FarmerHook = ({ language, theme }) => {
  const isHindi = language === 'HI'
  
  // Accessibility labels in different languages
  const accessibilityLabels = {
    HI: {
      mainMessage: 'मुख्य संदेश',
      keyFeatures: 'मुख्य विशेषताएं',
      mainMessageLabel: 'मुख्य संदेश'
    },
    EN: {
      mainMessage: 'Main Message',
      keyFeatures: 'Key Features',
      mainMessageLabel: 'Main Message'
    },
    BN: {
      mainMessage: 'প্রধান বার্তা',
      keyFeatures: 'প্রধান বৈশিষ্ট্য',
      mainMessageLabel: 'প্রধান বার্তা'
    },
    MR: {
      mainMessage: 'मुख्य संदेश',
      keyFeatures: 'मुख्य वैशिष्ट्ये',
      mainMessageLabel: 'मुख्य संदेश'
    },
    PA: {
      mainMessage: 'ਮੁੱਖ ਸੁਨੇਹਾ',
      keyFeatures: 'ਮੁੱਖ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ',
      mainMessageLabel: 'ਮੁੱਖ ਸੁਨੇਹਾ'
    }
  }
  
  const currentLabels = accessibilityLabels[language] || accessibilityLabels.HI
  
  const hookData = {
    HI: {
      mainTitle: "🌦️ आज का मौसम आपका दोस्त है या दुश्मन?",
      subtitle: "Monsoon Mitra बताएगा:",
      points: [
        "✅ कब पानी देना है",
        "✅ कब पानी बचाना है", 
        "✅ कल का मौसम कैसा रहेगा",
        "✅ फसल को कैसे सुरक्षित रखना है"
      ],
      benefit: "💰 एक बार का पानी बचाना = ₹50 बचाना",
      cta: "🎯 आज ही अपनी फसल को स्मार्ट बनाएं!"
    },
    EN: {
      mainTitle: "🌦️ Is today's weather your friend or enemy?",
      subtitle: "Monsoon Mitra will tell you:",
      points: [
        "✅ When to give water",
        "✅ When to save water",
        "✅ How tomorrow's weather will be",
        "✅ How to protect your crop"
      ],
      benefit: "💰 Saving water once = Saving ₹50",
      cta: "🎯 Make your crop smart today!"
    },
    BN: {
      mainTitle: "🌦️ আজকের আবহাওয়া আপনার বন্ধু নাকি শত্রু?",
      subtitle: "মনসুন মিত্র আপনাকে বলবে:",
      points: [
        "✅ কখন জল দিতে হবে",
        "✅ কখন জল বাঁচাতে হবে",
        "✅ কালকের আবহাওয়া কেমন হবে",
        "✅ ফসল কীভাবে রক্ষা করতে হবে"
      ],
      benefit: "💰 একবার জল বাঁচানো = ₹50 বাঁচানো",
      cta: "🎯 আজই আপনার ফসলকে স্মার্ট করুন!"
    },
    MR: {
      mainTitle: "🌦️ आजचे हवामान तुमचा मित्र आहे की शत्रू?",
      subtitle: "मान्सून मित्र तुम्हाला सांगेल:",
      points: [
        "✅ कधी पाणी द्यायचे",
        "✅ कधी पाणी वाचवायचे",
        "✅ उद्या हवामान कसे असेल",
        "✅ पीक कसे वाचवायचे"
      ],
      benefit: "💰 एकदा पाणी वाचवणे = ₹50 वाचवणे",
      cta: "🎯 आजच तुमचे पीक स्मार्ट करा!"
    },
    PA: {
      mainTitle: "🌦️ ਅੱਜ ਦਾ ਮੌਸਮ ਤੁਹਾਡਾ ਦੋਸਤ ਹੈ ਜਾਂ ਦੁਸ਼ਮਣ?",
      subtitle: "ਮੌਨਸੂਨ ਮਿਤਰ ਤੁਹਾਨੂੰ ਦੱਸੇਗਾ:",
      points: [
        "✅ ਕਦੋਂ ਪਾਣੀ ਦੇਣਾ ਹੈ",
        "✅ ਕਦੋਂ ਪਾਣੀ ਬਚਾਉਣਾ ਹੈ",
        "✅ ਕੱਲ੍ਹ ਦਾ ਮੌਸਮ ਕਿਹੋ ਜਿਹਾ ਹੋਵੇਗਾ",
        "✅ ਫਸਲ ਨੂੰ ਕਿਵੇਂ ਸੁਰੱਖਿਅਤ ਰੱਖਣਾ ਹੈ"
      ],
      benefit: "💰 ਇੱਕ ਵਾਰ ਪਾਣੀ ਬਚਾਉਣਾ = ₹50 ਬਚਾਉਣਾ",
      cta: "🎯 ਅੱਜ ਹੀ ਆਪਣੀ ਫਸਲ ਨੂੰ ਸਮਾਰਟ ਬਣਾਓ!"
    }
  }

  const currentData = hookData[language] || hookData.HI
  
  // Fallback for unsupported languages
  if (!hookData[language]) {
    console.warn(`Language ${language} not supported in FarmerHook, falling back to Hindi`)
  }

  return (
    <div className="hook-container" role="banner" aria-label={currentLabels.mainMessage}>
      {/* Main Title - Responsive and optimized */}
      <h2 
        className={`hook-main-title ${theme === 'light' ? 'text-farmer-dark' : 'text-white'} px-2 sm:px-4`}
        aria-label={currentData.mainTitle}
      >
        {currentData.mainTitle}
      </h2>

      {/* Subtitle */}
      <p 
        className={`hook-subtitle ${theme === 'light' ? 'text-farmer-green' : 'text-green-400'} px-2 sm:px-4`}
        aria-label={currentData.subtitle}
      >
        {currentData.subtitle}
      </p>

      {/* Points Grid - Responsive layout */}
      <div 
        className="hook-points-grid px-4 sm:px-6"
        role="list"
        aria-label={currentLabels.keyFeatures}
      >
        {currentData.points.map((point, index) => (
          <div 
            key={index} 
            className={`hook-point-item ${
              theme === 'light' 
                ? 'text-gray-700 bg-green-50 border border-green-200' 
                : 'text-gray-200 bg-gray-800 border border-gray-700'
            }`}
            role="listitem"
            aria-label={point.replace('✅ ', '').replace('• ', '')}
          >
            <span className="mr-2 sm:mr-3 text-xl sm:text-2xl" aria-hidden="true">
              {point.includes('✅') ? '✅' : '•'}
            </span>
            <span className="text-center sm:text-left">
              {point.replace('✅ ', '').replace('• ', '')}
            </span>
          </div>
        ))}
      </div>

      {/* Benefit Highlight */}
      <div 
        className={`hook-benefit ${
          theme === 'light' 
            ? 'text-amber-700 bg-amber-50 border border-amber-200' 
            : 'text-amber-400 bg-amber-900/20 border border-amber-700'
        } px-2 sm:px-4 animate-pulse`}
        role="note"
        aria-label={currentData.benefit}
      >
        {currentData.benefit}
      </div>

      {/* Call to Action */}
      <p 
        className={`hook-cta ${
          theme === 'light' 
            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
            : 'bg-gradient-to-r from-green-600 to-green-700 text-white'
        } px-2 sm:px-4`}
        role="button"
        tabIndex="0"
        aria-label={currentData.cta}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            // Add any action here if needed
          }
        }}
      >
        {currentData.cta}
      </p>
    </div>
  )
}

export default FarmerHook
