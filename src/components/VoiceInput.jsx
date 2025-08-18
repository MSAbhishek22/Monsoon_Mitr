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
    <div className="fixed inset-0 z-50 bg-black/30 flex items-end md:items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className={`w-full max-w-md rounded-2xl shadow-2xl overflow-hidden ${ theme === 'light' ? 'bg-white' : 'bg-gray-800 border border-gray-700' }`}>
        <div className="p-5">
          <div className="text-center mb-6">
            <h3 className={`text-2xl font-bold mb-2 ${ theme === 'light' ? 'text-farmer-dark' : 'text-white' }`}>🎤 {getTitleText()}</h3>
            <p className={`${ theme === 'light' ? 'text-gray-600' : 'text-gray-300' }`}>{language === 'HI' ? 'माइक पर क्लिक करके बोलें' : 'Click the mic and speak'}</p>
          </div>

          <div className="text-center mb-6">
            <button onClick={isListening ? handleStop : handleStart} className={`w-32 h-32 md:w-28 md:h-28 rounded-full transition-all duration-200 touch-target ${ isListening ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-farmer-green hover:bg-farmer-light-green' } text-white shadow-lg hover:shadow-xl flex items-center justify-center`} aria-label={isListening ? 'Stop listening' : 'Start listening'}>
              <span className="text-5xl md:text-4xl">{isListening ? '⏹️' : '🎤'}</span>
            </button>
            <p className={`mt-4 text-base md:text-lg ${ isListening ? 'text-red-600 dark:text-red-400' : theme === 'light' ? 'text-gray-600' : 'text-gray-300' }`}>{isListening ? getListeningText() : getPlaceholderText()}</p>
          </div>

          {(unsupported || transcript) && (
            <div className="mb-4">
              {unsupported && (
                <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg text-sm text-red-700 dark:text-red-300">
                  {language === 'HI' ? 'यह ब्राउज़र स्पीच रिकॉग्निशन सपोर्ट नहीं करता। कृपया Chrome/Edge का उपयोग करें या सिस्टम वॉइस टाइपिंग (Windows: Win+H) का उपयोग करें।' : 'This browser does not support SpeechRecognition. Please use Chrome/Edge or your OS voice typing (Windows: Win+H).'}
                </div>
              )}
              <textarea ref={textareaRef} value={transcript} onChange={(e) => setTranscript(e.target.value)} className={`w-full p-4 rounded-lg border-2 resize-none ${ theme === 'light' ? 'border-gray-200 bg-gray-50' : 'border-gray-600 bg-gray-700 text-white' }`} rows="3" placeholder={getPlaceholderText()} aria-label="Voice transcript" />
            </div>
          )}

          {error && !unsupported && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm md:text-base">{error}</p>
            </div>
          )}

          <div className="flex space-x-3">
            <button onClick={onClose} className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg font-medium transition-colors duration-200 hover:border-gray-400 dark:hover:border-gray-500 touch-target" aria-label={getCloseText()}>{getCloseText()}</button>
            <button onClick={handleSubmit} disabled={!transcript.trim()} className="flex-1 px-4 py-3 bg-farmer-green hover:bg-farmer-light-green text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed touch-target" aria-label={getSubmitText()}>{getSubmitText()}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VoiceInput
