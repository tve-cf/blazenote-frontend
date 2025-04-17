import { Note } from '../../types';
import { createContentPreview } from '../../utils/textUtils';

interface NoteCardProps {
  note: Note;
  isSelected: boolean;
  onClick: () => void;
}

export function NoteCard({ note, isSelected, onClick }: NoteCardProps) {
  const contentPreview = createContentPreview(note.description);

  return (
    <div
      onClick={onClick}
      className={`p-3 rounded-lg cursor-pointer transition-colors ${
        isSelected ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
      }`}
    >
      <h3 className="font-medium text-gray-900 truncate">
        {note.title || 'Untitled'}
      </h3>
      <p className="text-sm text-gray-500 truncate">
        {contentPreview || 'No content'}
      </p>
      <p className="text-xs text-gray-400 mt-1">
        {note?.updatedAt?.toLocaleDateString()}
      </p>
    </div>
  );
}
