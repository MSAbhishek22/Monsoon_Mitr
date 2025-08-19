import React, { useEffect, useRef, useState } from 'react'
import { startListening as startStt } from '../utils/speech'

const VoiceInput = ({ onClose, onSubmit, language, theme }) => {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState('')
  const [unsupported, setUnsupported] = useState(false)
  const textareaRef = useRef(null)
  let stopFn = null

  useEffect(() => {
    // If previously marked unsupported, focus the text area for manual input
    if (unsupported && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [unsupported])

  const handleStart = () => {
    setError('')
    try {
      setIsListening(true)
      stopFn = startStt(
        (text) => {
          setIsListening(false)
          setTranscript(text || '')
        },
        (err) => {
          setIsListening(false)
          const msg = (err && err.message) || 'Mic error'
          if (msg.toLowerCase().includes('not supported')) setUnsupported(true)
          setError(msg)
        }
      )
      // Safety timeout
      setTimeout(() => { try { stopFn && stopFn() } catch {} }, 10000)
    } catch (e) {
      setIsListening(false)
      setUnsupported(true)
      setError(e.message)
    }
  }

  const handleStop = () => {
    setIsListening(false)
    try { stopFn && stopFn() } catch {}
  }

  const handleSubmit = () => {
    if (transcript.trim()) {
      try { onSubmit && onSubmit(transcript) } catch {}
      // Broadcast to AI Sahayak
      try { window.dispatchEvent(new CustomEvent('ai-ask', { detail: transcript })) } catch {}
      onClose && onClose()
    }
  }

  const getTitleText = () => (language === 'HI' ? 'आवाज से बात करें' : 'Talk with Voice')
  const getListeningText = () => (language === 'HI' ? 'सुन रहा हूं... बोलिए' : 'Listening... Please speak')
  const getPlaceholderText = () => (language === 'HI' ? 'अपना सवाल बोलें या टाइप करें...' : 'Speak or type your question...')
  const getSubmitText = () => (language === 'HI' ? 'भेजें' : 'Submit')
  const getCloseText = () => (language === 'HI' ? 'बंद करें' : 'Close')

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-end md:items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="voice-title">
      <div className={`w-full max-w-md rounded-2xl shadow-2xl overflow-hidden ${ theme === 'light' ? 'bg-white' : 'bg-gray-800 border border-gray-700' }`}>
        <div className="p-5">
          <div className="text-center mb-6">
            <h3 id="voice-title" className={`text-2xl font-bold mb-2 ${ theme === 'light' ? 'text-farmer-dark' : 'text-white' }`}>🎤 {getTitleText()}</h3>
            <p className={`${ theme === 'light' ? 'text-gray-600' : 'text-gray-300' }`}>{language === 'HI' ? 'माइक पर क्लिक करके बोलें' : 'Click the mic and speak'}</p>
          </div>

          <div className="text-center mb-6">
            <button 
              onClick={isListening ? handleStop : handleStart} 
              className={`farmer-touch-target farmer-icon-xl rounded-full transition-all duration-200 ${
                isListening 
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse farmer-outdoor-visible' 
                  : 'bg-farmer-green hover:bg-farmer-light-green farmer-outdoor-visible'
              } text-white shadow-lg hover:shadow-xl flex items-center justify-center farmer-focus-visible farmer-haptic`} 
              aria-label={isListening ? (language === 'HI' ? 'सुनना बंद करें' : 'Stop listening') : (language === 'HI' ? 'बोलना शुरू करें' : 'Start listening')}
              aria-describedby="voice-status"
            >
              <span className="farmer-icon-xl">{isListening ? '⏹️' : '🎤'}</span>
            </button>
            <p id="voice-status" className={`mt-4 text-base md:text-lg font-semibold ${ isListening ? 'text-red-600 dark:text-red-400' : theme === 'light' ? 'text-gray-600' : 'text-gray-300' }`}>
              {isListening ? getListeningText() : getPlaceholderText()}
            </p>
            
            {/* Visual feedback indicator */}
            {isListening && (
              <div className="mt-3 flex justify-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
            )}
          </div>

          {(unsupported || transcript) && (
            <div className="mb-4">
              {unsupported && (
                <div className="mb-3 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-700 rounded-lg text-sm text-red-700 dark:text-red-300 farmer-outdoor-visible">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="farmer-icon">⚠️</span>
                    <span className="font-semibold">{language === 'HI' ? 'स्पीच सपोर्ट नहीं' : 'Speech Not Supported'}</span>
                  </div>
                  <p>{language === 'HI' ? 'यह ब्राउज़र स्पीच रिकॉग्निशन सपोर्ट नहीं करता। कृपया Chrome/Edge का उपयोग करें या सिस्टम वॉइस टाइपिंग (Windows: Win+H) का उपयोग करें।' : 'This browser does not support SpeechRecognition. Please use Chrome/Edge or your OS voice typing (Windows: Win+H).'}</p>
                </div>
              )}
              <textarea 
                ref={textareaRef} 
                value={transcript} 
                onChange={(e) => setTranscript(e.target.value)} 
                className={`w-full p-4 rounded-lg border-2 resize-none farmer-input ${ theme === 'light' ? 'border-gray-200 bg-gray-50' : 'border-gray-600 bg-gray-700 text-white' }`} 
                rows="3" 
                placeholder={getPlaceholderText()} 
                aria-label={language === 'HI' ? 'आवाज का टेक्स्ट' : 'Voice transcript'}
                aria-describedby="transcript-help"
              />
              <p id="transcript-help" className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {language === 'HI' ? 'टेक्स्ट को संपादित कर सकते हैं या सीधे भेज सकते हैं' : 'You can edit the text or send it directly'}
              </p>
            </div>
          )}

          {error && !unsupported && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-700 rounded-lg farmer-outdoor-visible">
              <div className="flex items-center space-x-2 mb-2">
                <span className="farmer-icon">❌</span>
                <span className="font-semibold">{language === 'HI' ? 'त्रुटि' : 'Error'}</span>
              </div>
              <p className="text-red-600 dark:text-red-400 text-sm md:text-base">{error}</p>
            </div>
          )}

          <div className="flex space-x-3">
            <button 
              onClick={onClose} 
              className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg font-medium transition-colors duration-200 hover:border-gray-400 dark:hover:border-gray-500 farmer-touch-target farmer-focus-visible" 
              aria-label={getCloseText()}
            >
              {getCloseText()}
            </button>
            <button 
              onClick={handleSubmit} 
              disabled={!transcript.trim()} 
              className="flex-1 px-4 py-3 bg-farmer-green hover:bg-farmer-light-green text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed farmer-touch-target farmer-focus-visible farmer-haptic" 
              aria-label={getSubmitText()}
              aria-describedby={!transcript.trim() ? 'submit-disabled' : undefined}
            >
              {getSubmitText()}
            </button>
          </div>
          
          {!transcript.trim() && (
            <p id="submit-disabled" className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">
              {language === 'HI' ? 'पहले कुछ टेक्स्ट लिखें या बोलें' : 'Please type or speak some text first'}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default VoiceInput
