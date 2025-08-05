import { useState } from 'react';

interface TranscriptionState {
  currentText: string;
  lastActivity: number;
  finalText: string;
}

export function useTranscriptionState() {
  const [state, setState] = useState<TranscriptionState>({
    currentText: '',
    lastActivity: Date.now(),
    finalText: ''
  });

  const updateTranscription = (text: string) => {
    setState((prev) => ({
      ...prev,
      currentText: text,
      lastActivity: Date.now()
    }));
  };

  const setFinalTranscript = (text: string, callback?: () => void) => {
    setState(() => {
      const newState = {
        currentText: '',
        lastActivity: Date.now(),
        finalText: text
      };
      if (callback) {
        setTimeout(callback, 0);
      }
      return newState;
    });
  };

  const appendPeriod = () => {
    if (!state.currentText.trim().endsWith('.')) {
      setState((prev) => ({
        ...prev,
        currentText: prev.currentText.trim() + '.'
      }));
    }
  };

  return {
    currentText: state.currentText,
    lastActivity: state.lastActivity,
    finalText: state.finalText,
    updateTranscription,
    appendPeriod,
    setFinalTranscript
  };
}
