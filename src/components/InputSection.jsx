import React, { useState } from 'react'

const InputSection = ({ onSubmit, language, theme }) => {
  const [question, setQuestion] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (question.trim()) {
      onSubmit(question)
      setQuestion('')
    }
  }

  const getPlaceholderText = () => {
    if (language === 'HI') {
      return 'अपना सवाल यहाँ लिखें...'
    }
    return 'Type your question here...'
  }

  const getSubmitButtonText = () => {
    if (language === 'HI') {
      return 'भेजें'
    }
    return 'Submit'
  }

  const getTitleText = () => {
    if (language === 'HI') {
      return 'प्रश्न पूछें'
    }
    return 'Ask a Question'
  }

  const getDescriptionText = () => {
    if (language === 'HI') {
      return 'मौसम के आधार पर व्यक्तिगत खेती सलाह प्राप्त करें'
    }
    return 'Get personalized farming advice based on weather'
  }

  const getCommonQuestions = () => {
    if (language === 'HI') {
      return [
        'क्या आज सिंचाई करूं?',
        'कल बारिश होगी?',
        'फसल में कीटनाशक कब डालूं?',
        'पानी कितना दूं?',
        'कौन सी फसल बोऊं?'
      ]
    } else {
      return [
        'Should I irrigate today?',
        'Will it rain tomorrow?',
        'When to apply pesticides?',
        'How much water to give?',
        'Which crop to sow?'
      ]
    }
  }

  const getVoiceSuggestionText = () => {
    if (language === 'HI') {
      return '🎤 या माइक बटन पर क्लिक करके बोलें'
    }
    return '🎤 Or click the mic button to speak'
  }

  const handleQuickQuestion = (quickQuestion) => {
    setQuestion(quickQuestion)
  }

  return (
    <div className={`farmer-card transition-colors duration-300 ${
      theme === 'light' ? 'bg-white' : 'bg-gray-800 border-gray-700'
    }`}>
      <div className="mobile-card">
        <h3 className={`mobile-heading ${
          theme === 'light' ? 'text-farmer-dark' : 'text-white'
        }`}>
          {getTitleText()}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={getPlaceholderText()}
              className={`farmer-input resize-none h-28 md:h-24 transition-colors duration-300 ${
                theme === 'light' 
                  ? 'border-gray-200 focus:border-farmer-green' 
                  : 'border-gray-600 focus:border-farmer-light-green bg-gray-700 text-white'
              }`}
              rows="3"
              aria-label={getPlaceholderText()}
            />
          </div>
          
          <button
            type="submit"
            disabled={!question.trim()}
            className="farmer-button w-full disabled:opacity-50 disabled:cursor-not-allowed touch-target"
            aria-label={getSubmitButtonText()}
          >
            ➡️ {getSubmitButtonText()}
          </button>
        </form>

        {/* Voice Input Suggestion - Better mobile sizing */}
        <div className="mt-4 text-center">
          <p className={`text-sm md:text-base ${
            theme === 'light' ? 'text-gray-500' : 'text-gray-400'
          }`}>
            {getVoiceSuggestionText()}
          </p>
        </div>
        
        {/* Common Questions - Better mobile sizing */}
        <div className="mt-6">
          <h4 className={`font-medium mb-3 ${
            theme === 'light' ? 'text-gray-700' : 'text-gray-300'
          }`}>
            💡 {language === 'HI' ? 'आम सवाल' : 'Common Questions'}
          </h4>
          <div className="grid grid-cols-1 gap-3">
            {getCommonQuestions().map((q, index) => (
              <button
                key={index}
                onClick={() => handleQuickQuestion(q)}
                className={`text-left p-3 rounded-lg text-base transition-colors duration-200 touch-target ${
                  theme === 'light' 
                    ? 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200' 
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300 border border-gray-600'
                }`}
                aria-label={`Quick question: ${q}`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <p className={`mobile-text ${
            theme === 'light' ? 'text-gray-500' : 'text-gray-400'
          }`}>
            {getDescriptionText()}
          </p>
        </div>
      </div>
    </div>
  )
}

export default InputSection 