import { useState, useCallback, useEffect } from 'react';
import { useTranscriptionState } from './useTranscriptionState';
import { useSilenceDetection } from './useSilenceDetection';

interface UseSpeechRecognitionProps {
  onTranscript: (text: string) => void;
  language?: string;
}

export function useSpeechRecognition({
  onTranscript,
  language = 'en-US'
}: UseSpeechRecognitionProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { currentText, lastActivity, updateTranscription, setFinalTranscript } =
    useTranscriptionState();

  // Handle silence detection
  useSilenceDetection(isListening, lastActivity, () => {
    if (currentText) {
      const newText = currentText.trim();
      if (newText) {
        onTranscript(newText + (newText.endsWith('.') ? ' ' : '. '));
      }
      updateTranscription('');
    }
  });

  useEffect(() => {
    setIsSupported(
      'webkitSpeechRecognition' in window || 'SpeechRecognition' in window
    );
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError('Speech recognition is not supported in your browser');
      return;
    }

    setError(null);
    updateTranscription('');

    const SpeechRecognition =
      window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .slice(event.resultIndex)
        .map((result) => result[0].transcript)
        .join(' ')
        .trim();

      const isFinal = event.results[event.resultIndex].isFinal;

      if (isFinal) {
        const cleanText = transcript.replace(/\s+/g, ' ').trim();

        setFinalTranscript(cleanText, () => {
          onTranscript(cleanText + ' ');
        });
        updateTranscription('');
      } else {
        updateTranscription(transcript);
      }
    };

    recognition.onerror = (event) => {
      setError(event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      if (currentText) {
        const newText = currentText.trim();
        if (newText && newText !== '.') {
          onTranscript(newText + (newText.endsWith('.') ? ' ' : '. '));
        }
      }
      setIsListening(false);
      setFinalTranscript('');
    };

    try {
      recognition.start();
      setIsListening(true);
    } catch (err) {
      setError('Failed to start speech recognition');
      setIsListening(false);
    }

    return () => {
      recognition.stop();
    };
  }, [isSupported, language, onTranscript, currentText, updateTranscription]);

  const stopListening = useCallback(() => {
    setIsListening(false);
    setFinalTranscript('');
  }, []);

  return {
    isListening,
    isSupported,
    error,
    currentText,
    startListening,
    stopListening
  };
}
