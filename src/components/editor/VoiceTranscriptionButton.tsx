import { Mic, MicOff } from 'lucide-react';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';

interface TranscriptionStatusProps {
  text: string;
  isError?: boolean;
}

function TranscriptionStatus({ text, isError }: TranscriptionStatusProps) {
  if (!text) return null;

  return (
    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-blue-50 text-blue-600 text-sm px-2 py-1 rounded max-w-xs truncate">
      {text}
    </div>
  );
}

interface VoiceTranscriptionButtonProps {
  onTranscript: (text: string) => void;
}

export function VoiceTranscriptionButton({
  onTranscript
}: VoiceTranscriptionButtonProps) {
  const {
    isListening,
    isSupported,
    error,
    currentText,
    startListening,
    stopListening
  } = useSpeechRecognition({
    onTranscript
  });

  if (!isSupported) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={isListening ? stopListening : startListening}
        className={`p-2 rounded-lg transition-colors ${
          isListening
            ? 'bg-red-50 text-red-600 hover:bg-red-100'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
        title={isListening ? 'Stop recording' : 'Start voice recording'}
      >
        {isListening ? (
          <MicOff className="h-5 w-5" />
        ) : (
          <Mic className="h-5 w-5" />
        )}
      </button>

      {error && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-red-50 text-red-600 text-sm px-2 py-1 rounded">
          {error}
        </div>
      )}
      {isListening && currentText && <TranscriptionStatus text={currentText} />}
    </div>
  );
}
