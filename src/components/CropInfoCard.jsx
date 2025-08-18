import React, { useEffect, useRef } from 'react'

const DATA = {
  wheat: {
    hi: { name: 'गेहूं', sow: 'नवंबर- दिसंबर', harvest: 'मार्च- अप्रैल', irrigation: '15-20 दिन में' },
    en: { name: 'Wheat', sow: 'Nov - Dec', harvest: 'Mar - Apr', irrigation: 'Every 15-20 days' },
    bn: { name: 'গম', sow: 'নভেম্বর- ডিসেম্বর', harvest: 'মার্চ- এপ্রিল', irrigation: '১৫-২০ দিনে' },
    mr: { name: 'गहू', sow: 'नोव्हेंबर- डिसेंबर', harvest: 'मार्च- एप्रिल', irrigation: '१५-२० दिवसांनी' },
    pa: { name: 'ਗੰਹੂ', sow: 'ਨਵੰਬਰ- ਦਸੰਬਰ', harvest: 'ਮਾਰਚ- ਅਪ੍ਰੈਲ', irrigation: '15-20 ਦਿਨਾਂ ਵਿਚ' }
  },
  rice: {
    hi: { name: 'धान', sow: 'जून- जुलाई', harvest: 'अक्टूबर- नवंबर', irrigation: '7-10 दिन में' },
    en: { name: 'Rice', sow: 'Jun - Jul', harvest: 'Oct - Nov', irrigation: 'Every 7-10 days' },
    bn: { name: 'ধান', sow: 'জুন- জুলাই', harvest: 'অক্টোবর- নভেম্বর', irrigation: '৭-১০ দিনে' },
    mr: { name: 'तांदूळ', sow: 'जून- जुलै', harvest: 'ऑक्टोबर- नोव्हेंबर', irrigation: '७-१० दिवसांनी' },
    pa: { name: 'ਧਾਨ', sow: 'ਜੂਨ- ਜੁਲਾਈ', harvest: 'ਅਕਤੂਬਰ- ਨਵੰਬਰ', irrigation: '7-10 ਦਿਨਾਂ ਵਿਚ' }
  },
  vegetables: {
    hi: { name: 'सब्ज़ियाँ', sow: 'फसल पर निर्भर', harvest: 'फसल पर निर्भर', irrigation: '5-7 दिन में' },
    en: { name: 'Vegetables', sow: 'Depends on crop', harvest: 'Depends on crop', irrigation: 'Every 5-7 days' },
    bn: { name: 'সবজি', sow: 'ফসলের উপর নির্ভর', harvest: 'ফসলের উপর নির্ভর', irrigation: '৫-৭ দিনে' },
    mr: { name: 'भाजीपाला', sow: 'पिकावर अवलंबून', harvest: 'पिकावर अवलंबून', irrigation: '५-७ दिवसांनी' },
    pa: { name: 'ਸਬਜ਼ੀਆਂ', sow: 'ਫਸਲ ਤੇ ਨਿਰਭਰ', harvest: 'ਫਸਲ ਤੇ ਨਿਰਭਰ', irrigation: '5-7 ਦਿਨਾਂ ਵਿਚ' }
  },
  maize: {
    hi: { name: 'मक्का', sow: 'जून- जुलाई / फरवरी', harvest: 'सितंबर- अक्टूबर', irrigation: '10-12 दिन में' },
    en: { name: 'Maize', sow: 'Jun - Jul / Feb', harvest: 'Sep - Oct', irrigation: 'Every 10-12 days' },
    bn: { name: 'ভুট্টা', sow: 'জুন- জুলাই / ফেব্রুয়ারি', harvest: 'সেপ্টেম্বর- অক্টোবর', irrigation: '১০-১২ দিনে' },
    mr: { name: 'मका', sow: 'जून- जुलै / फेब्रुवारी', harvest: 'सप्टेंबर- ऑक्टोबर', irrigation: '१०-१२ दिवसांनी' },
    pa: { name: 'ਮੱਕੀ', sow: 'ਜੂਨ- ਜੁਲਾਈ / ਫਰਵਰੀ', harvest: 'ਸਤੰਬਰ- ਅਕਤੂਬਰ', irrigation: '10-12 ਦਿਨਾਂ ਵਿਚ' }
  },
  mustard: {
    hi: { name: 'सरसों', sow: 'अक्टूबर- नवंबर', harvest: 'फरवरी- मार्च', irrigation: '20-25 दिन में' },
    en: { name: 'Mustard', sow: 'Oct - Nov', harvest: 'Feb - Mar', irrigation: 'Every 20-25 days' },
    bn: { name: 'সরিষা', sow: 'অক্টোবর- নভেম্বর', harvest: 'ফেব্রুয়ারি- মার্চ', irrigation: '২০-২৫ দিনে' },
    mr: { name: 'मोहरी', sow: 'ऑक्टोबर- नोव्हेंबर', harvest: 'फेब्रु- मार्च', irrigation: '२०-२५ दिवसांनी' },
    pa: { name: 'ਸਰੋਂ', sow: 'ਅਕਤੂਬਰ- ਨਵੰਬਰ', harvest: 'ਫ਼ਰਵਰੀ- ਮਾਰਚ', irrigation: '20-25 ਦਿਨਾਂ ਵਿਚ' }
  },
  sugarcane: {
    hi: { name: 'गन्ना', sow: 'फरवरी- मार्च', harvest: 'दिसंबर- मार्च (अगला वर्ष)', irrigation: '12-15 दिन में' },
    en: { name: 'Sugarcane', sow: 'Feb - Mar', harvest: 'Dec - Mar (next year)', irrigation: 'Every 12-15 days' },
    bn: { name: 'আখ', sow: 'ফেব্রুয়ারি- মার্চ', harvest: 'ডিসেম্বর- মার্চ', irrigation: '১২-১৫ দিনে' },
    mr: { name: 'ऊस', sow: 'फेब्रु- मार्च', harvest: 'डिसेंबर- मार्च (पुढचे)', irrigation: '१२-१५ दिवसांनी' },
    pa: { name: 'ਗੰਨਾ', sow: 'ਫਰਵਰੀ- ਮਾਰਚ', harvest: 'ਦਸੰਬਰ- ਮਾਰਚ', irrigation: '12-15 ਦਿਨਾਂ ਵਿਚ' }
  }
}

function getLangKey(language) {
  switch (language) {
    case 'HI': return 'hi'
    case 'BN': return 'bn'
    case 'MR': return 'mr'
    case 'PA': return 'pa'
    default: return 'en'
  }
}

const CropInfoCard = ({ selectedCrop = 'wheat', language = 'HI', theme = 'light' }) => {
  const langKey = getLangKey(language)
  const scrollRef = useRef(null)

  useEffect(() => {
    // Auto-scroll to the selected crop on mount
    const idx = Object.keys(DATA).indexOf(selectedCrop)
    if (idx > -1 && scrollRef.current) {
      const child = scrollRef.current.children[idx]
      if (child) child.scrollIntoView({ block: 'start', behavior: 'smooth' })
    }
  }, [selectedCrop])

  const labels = {
    title: language === 'HI' ? 'फसल जानकारी' : 'Crop Information',
    sow: language === 'HI' ? 'बुवाई' : 'Sowing',
    harvest: language === 'HI' ? 'कटाई' : 'Harvest',
    irrigation: language === 'HI' ? 'सिंचाई' : 'Irrigation',
    hint: language === 'HI' ? 'ऊपर/नीचे स्वाइप करके अन्य फसलें देखें' : 'Swipe up/down to view more crops'
  }

  const cropKeys = Object.keys(DATA)

  return (
    <div className={`farmer-card card-leaf-texture transition-colors duration-300 ${ theme === 'light' ? 'bg-white' : 'bg-gray-800 border-gray-700' }`}>
      <div className={`farmer-header header-amber-gradient`}>📘 {labels.title}</div>
      <div className="mobile-card">
        <div className={`text-sm mb-3 ${ theme === 'light' ? 'text-green-700' : 'text-green-300' }`}>
          {labels.hint}
        </div>
        <div ref={scrollRef} className="max-h-80 md:max-h-96 overflow-y-auto pr-2 snap-y snap-mandatory space-y-4">
          {cropKeys.map((key) => {
            const info = DATA[key][langKey] || DATA[key].en
            const isSelected = key === selectedCrop
            const icon = key === 'rice' ? '🌾' : key === 'vegetables' ? '🥬' : key === 'maize' ? '🌽' : key === 'mustard' ? '🟡' : key === 'sugarcane' ? '🍬' : '🌾'
            return (
              <div key={key} className={`snap-start p-4 rounded-lg border ${ theme === 'light' ? 'bg-white/80 border-green-200' : 'bg-gray-700/50 border-green-700' } ${ isSelected ? 'ring-2 ring-green-500' : '' }`}>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="text-2xl">{icon}</div>
                  <div className={`text-xl font-semibold ${ theme === 'light' ? 'text-gray-900' : 'text-gray-100'}`}>{info.name}</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700">
                    <div className="text-xs text-green-700 dark:text-green-300">{labels.sow}</div>
                    <div className={`font-medium ${ theme === 'light' ? 'text-gray-900' : 'text-gray-100'}`}>{info.sow}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700">
                    <div className="text-xs text-green-700 dark:text-green-300">{labels.harvest}</div>
                    <div className={`font-medium ${ theme === 'light' ? 'text-gray-900' : 'text-gray-100'}`}>{info.harvest}</div>
                  </div>
                  <div className="col-span-2 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700">
                    <div className="text-xs text-green-700 dark:text-green-300">{labels.irrigation}</div>
                    <div className={`font-medium ${ theme === 'light' ? 'text-gray-900' : 'text-gray-100'}`}>{info.irrigation}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default CropInfoCard
