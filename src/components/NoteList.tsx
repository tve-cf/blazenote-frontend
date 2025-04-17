import { Plus, Menu } from 'lucide-react';
import { Note } from '../types';
import { SearchBar } from './ui/SearchBar';
import { NoteCard } from './ui/NoteCard';

interface NoteListProps {
  notes: Note[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNoteSelect: (note: Note) => void;
  onNewNote: () => void;
  selectedNoteId: string | null;
  onMenuClick: () => void;
  isVisible: boolean;
}

export function NoteList({
  notes,
  searchQuery,
  onSearchChange,
  onNoteSelect,
  onNewNote,
  selectedNoteId,
  onMenuClick,
  isVisible
}: NoteListProps) {
  return (
    <div
      className={`
      fixed md:relative
      w-full md:w-72
      bg-white border-r border-gray-200
      h-screen z-10
      transition-transform duration-300
      ${isVisible ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
    `}
    >
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="h-5 w-5" />
          </button>
          <SearchBar value={searchQuery} onChange={onSearchChange} />
          <button
            onClick={() => onNewNote()}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-2">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              isSelected={selectedNoteId === note.id}
              onClick={() => onNoteSelect(note)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
