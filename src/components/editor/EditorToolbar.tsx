import { ChevronLeft, Eye, Edit2 } from 'lucide-react';

interface EditorToolbarProps {
  title: string;
  isPreview: boolean;
  onTitleChange: (title: string) => void;
  onBackClick: () => void;
  onTogglePreview: () => void;
}

export function EditorToolbar({
  title,
  isPreview,
  onTitleChange,
  onBackClick,
  onTogglePreview,
}: EditorToolbarProps) {
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
        <button
          onClick={onTogglePreview}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          title={isPreview ? 'Edit' : 'Preview'}
        >
          {isPreview ? (
            <Edit2 className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );
}