import React from 'react'

const WeatherCard = ({ weatherData, language, theme, onRefresh, loading, liveData }) => {
  const isLoading = loading || (!liveData && !weatherData)

  const formatDay = (dateStr) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString(language === 'HI' ? 'hi-IN' : undefined, { weekday: 'short', day: 'numeric' })
  }

  if (isLoading && !weatherData) {
    return (
      <div className={`farmer-card texture-card transition-colors duration-300 ${ theme === 'light' ? 'bg-white' : 'bg-gray-800 border-gray-700' }`}>
        <div className={`${theme === 'light' ? 'texture-header-amber' : 'bg-amber-700'} farmer-header text-white`}>🌦️ {language === 'HI' ? 'मौसम जानकारी' : 'Weather Update'}</div>
        <div className="mobile-card space-y-4">
          <div className="animate-pulse space-y-3">
            <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
            <div className="grid grid-cols-1 gap-2">
              {Array.from({length:7}).map((_,i)=>(<div key={i} className="h-3 bg-gray-300 dark:bg-gray-700 rounded"></div>))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!weatherData && !liveData) {
    return (
      <div className={`farmer-card texture-card transition-colors duration-300 ${ theme === 'light' ? 'bg-white' : 'bg-gray-800 border-gray-700' }`}>
        <div className={`${theme === 'light' ? 'texture-header-amber' : 'bg-amber-700'} farmer-header text-white`}>🌦️ {language === 'HI' ? 'मौसम जानकारी' : 'Weather Update'}</div>
        <div className="mobile-card space-y-4">
          <div className="text-center py-8">
            <div className="text-4xl mb-4">⚠️</div>
            <p className="text-lg text-red-600 dark:text-red-400 mb-4">{language === 'HI' ? 'डेटा नहीं मिला' : 'Data not available'}</p>
            {onRefresh && <button onClick={onRefresh} className="farmer-button focus-ring">🔄 {language === 'HI' ? 'फिर से कोशिश करें' : 'Try Again'}</button>}
          </div>
        </div>
      </div>
    )
  }

  const currentData = liveData?.current || {}
  const daily = liveData?.daily || []
  const maxProb = Math.max(1, ...daily.map(d => d.probMax || 0))
  const maxTemp = Math.max(1, ...daily.map(d => (d.tMax ?? 0)))

  return (
    <div className={`farmer-card card-leaf-texture transition-colors duration-300 ${ theme === 'light' ? 'bg-white' : 'bg-gray-800 border-gray-700' }`}>
      <div className={`farmer-header header-amber-gradient`}>🌦️ {language === 'HI' ? 'मौसम जानकारी' : 'Weather Update'}</div>
      <div className="mobile-card space-y-5 card-tint-amber rounded-b-xl">
        {weatherData && (
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <div className="text-3xl">{weatherData.condition.includes('बारिश') ? '🌧️' : '☀️'}</div>
              <div>
                <div className={`text-xl font-bold ${ theme === 'light' ? 'text-gray-900' : 'text-gray-100' }`}>{weatherData.temperature}</div>
                <div className="text-sm text-gray-700 dark:text-gray-300">{language === 'HI' ? 'नमी' : 'Humidity'}: {weatherData.humidity}</div>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-3xl font-extrabold ${ theme === 'light' ? 'text-green-700' : 'text-green-300' }`}>{weatherData.rainProbability}%</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">{language === 'HI' ? 'बारिश संभावना' : 'Rain Prob'}</div>
            </div>
          </div>
        )}

        {liveData && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
            <h5 className={`font-semibold mb-2 ${ theme === 'light' ? 'text-blue-900' : 'text-blue-200' }`}>{language === 'HI' ? '7 दिन का पूर्वानुमान' : '7-Day Forecast'}</h5>
            <div className="grid grid-cols-7 gap-3">
              {daily.slice(0,7).map((d, idx) => {
                const prob = d.probMax || 0
                const temp = d.tMax ?? 0
                const probH = Math.round((prob / Math.max(maxProb, 1)) * 60)
                const dayLbl = formatDay(d.date)
                const title = `${dayLbl} • ${prob}% rain • ${temp}°C`
                return (
                  <div key={idx} className="flex flex-col items-center" title={title}>
                    <div className="w-3 relative h-20 flex items-end">
                      <div className={`w-3 rounded-t ${ theme === 'light' ? 'bg-green-700' : 'bg-green-300' }`} style={{ height: `${probH}px` }}></div>
                    </div>
                    <div className="text-[11px] mt-1 text-gray-800 dark:text-gray-300 text-center leading-tight">{dayLbl}</div>
                    <div className="text-[11px] text-gray-900 dark:text-gray-200">{temp}°C</div>
                    <div className="text-[11px] text-gray-900 dark:text-gray-200">{prob}%</div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default WeatherCard 