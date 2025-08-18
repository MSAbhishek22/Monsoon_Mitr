import React, { useState, useEffect, useCallback } from 'react'
import { searchPlace } from '../api/geocode'
import { setPrefs } from '../state/prefs'

const LocationSearch = ({ language, theme, onLocationChange }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)

  // Debounced search
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId
      return (searchQuery) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(async () => {
          if (searchQuery.trim().length >= 2) {
            setIsSearching(true)
            const searchResults = await searchPlace(searchQuery)
            setResults(searchResults)
            setIsSearching(false)
          } else {
            setResults([])
          }
        }, 300)
      }
    })(),
    []
  )

  // Handle search input
  useEffect(() => {
    debouncedSearch(query)
  }, [query, debouncedSearch])

  // Handle location selection
  const handleLocationSelect = (location) => {
    setPrefs({ location })
    setQuery(location.name)
    setShowResults(false)
    setResults([])
    
    if (onLocationChange) {
      onLocationChange(location)
    }
  }

  // Get localized text
  const getText = (key) => {
    if (language === 'HI') {
      return {
        placeholder: 'जिला/गाँव खोजें…',
        searching: 'खोज रहे हैं...',
        noResults: 'कोई परिणाम नहीं मिला',
        selectLocation: 'स्थान चुनें'
      }[key]
    } else {
      return {
        placeholder: 'Search district/village...',
        searching: 'Searching...',
        noResults: 'No results found',
        selectLocation: 'Select location'
      }[key]
    }
  }

  return (
    <div className="relative">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setShowResults(true)
          }}
          onFocus={() => setShowResults(true)}
          placeholder={getText('placeholder')}
          className={`farmer-input pr-10 ${
            theme === 'light' 
              ? 'border-gray-200 focus:border-farmer-green' 
              : 'border-gray-600 focus:border-farmer-light-green bg-gray-700 text-white'
          }`}
        />
        
        {/* Search Icon */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          🔍
        </div>
      </div>

      {/* Search Results Dropdown */}
      {showResults && (query.trim().length >= 2) && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {isSearching ? (
            <div className="p-3 text-center text-gray-500 dark:text-gray-400">
              {getText('searching')}
            </div>
          ) : results.length > 0 ? (
            <div className="py-1">
              {results.map((result, index) => (
                <button
                  key={index}
                  onClick={() => handleLocationSelect(result)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <div className="font-medium text-gray-800 dark:text-gray-200">
                    {result.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {result.lat.toFixed(2)}, {result.lon.toFixed(2)}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-3 text-center text-gray-500 dark:text-gray-400">
              {getText('noResults')}
            </div>
          )}
        </div>
      )}

      {/* Click outside to close */}
      {showResults && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowResults(false)}
        />
      )}
    </div>
  )
}

export default LocationSearch
