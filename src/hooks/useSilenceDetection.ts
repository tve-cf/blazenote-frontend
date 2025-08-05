import { useEffect, useRef } from 'react';

const SILENCE_THRESHOLD = 2000; // 2 seconds of silence

export function useSilenceDetection(
  isListening: boolean,
  lastActivity: number,
  onSilence: () => void
) {
  const timeoutRef = useRef<number>();

  useEffect(() => {
    if (isListening) {
      const checkSilence = () => {
        const timeSinceLastActivity = Date.now() - lastActivity;
        if (timeSinceLastActivity >= SILENCE_THRESHOLD) {
          onSilence();
        }
      };

      timeoutRef.current = setInterval(checkSilence, 500);
      return () => clearInterval(timeoutRef.current);
    }
  }, [isListening, lastActivity, onSilence]);
}
