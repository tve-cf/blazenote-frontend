import { ChevronLeft, Trash2 } from 'lucide-react';
import { VoiceTranscriptionButton } from './VoiceTranscriptionButton';

interface EditorHeaderProps {
  title: string;
  onTitleChange: (title: string) => void;
  onBackClick: () => void;
  onDelete: () => void;
  onTranscript: (text: string) => void;
}

export function EditorHeader({
  title,
  onTitleChange,
  onBackClick,
  onDelete,
  onTranscript
}: EditorHeaderProps) {
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      onDelete();
    }
  };

  return (
    <div className="p-4 border-b border-gray-200 bg-white">
      <div className="flex items-center gap-4">
        <button
          onClick={onBackClick}
          className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <input
          type="text"
          placeholder="Note title"
          className="flex-1 text-xl font-semibold focus:outline-none"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
        />
        <VoiceTranscriptionButton onTranscript={onTranscript} />
        <button
          onClick={handleDelete}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete note"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
