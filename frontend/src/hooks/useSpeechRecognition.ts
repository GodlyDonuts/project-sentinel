import { useState, useEffect, useCallback, useRef } from 'react';

interface UseSpeechRecognitionProps {
  onResult: (text: string) => void;
}

export const useSpeechRecognition = ({ onResult }: UseSpeechRecognitionProps) => {
  const [isListening, setIsListening] = useState(false);
  const isListeningRef = useRef(false); // Track state without re-running effect
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();

      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          onResult(finalTranscript);
        }
      };

      recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error', event.error);
        // If error is 'not-allowed' or 'service-not-allowed', stop trying
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setIsListening(false);
          isListeningRef.current = false;
        }
      };

      recognitionInstance.onend = () => {
        // Auto-restart if supposed to be listening
        if (isListeningRef.current) {
          try {
            recognitionInstance.start();
          } catch (e) {
            // Ignore
          }
        } else {
          setIsListening(false);
        }
      };

      recognitionRef.current = recognitionInstance;
    } else {
      console.error('Web Speech API not supported');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onResult]); // Removed isListening dependency

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListeningRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        isListeningRef.current = true;
      } catch (e) {
        console.error("Error starting recognition:", e);
      }
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListeningRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      isListeningRef.current = false;
    }
  }, []);

  return { isListening, startListening, stopListening };
};
