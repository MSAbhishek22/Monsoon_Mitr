export function startListening(onResult, onError) {
  try {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      onError && onError(new Error('SpeechRecognition not supported'))
      return () => {}
    }
    const recognition = new SpeechRecognition()
    recognition.lang = 'hi-IN'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onresult = (event) => {
      try {
        const transcript = event.results[0][0].transcript
        if (onResult) onResult(transcript)
      } catch (e) {
        onError && onError(e)
      }
    }
    recognition.onerror = (event) => {
      onError && onError(new Error(event.error || 'unknown'))
    }

    recognition.start()

    // Return a stop function
    return () => {
      try { recognition.stop() } catch {}
    }
  } catch (e) {
    onError && onError(e)
    return () => {}
  }
}
