import { ChangeEvent, useRef } from 'react';
import { Paperclip } from 'lucide-react';
import { Note } from '../types';
import { AttachmentList } from './ui/AttachmentList';
import { TiptapEditor } from './editor/TiptapEditor';
import { EditorHeader } from './editor/EditorHeader';
import { useNotes } from '../contexts/NotesContext';

interface NoteEditorProps {
  note: Note | null;
  onBackClick: () => void;
}

export function NoteEditor({ note, onBackClick }: NoteEditorProps) {
  const { updateNote, deleteNote, handleFileUpload } = useNotes();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<{ getHTML: () => string } | null>(null);

  if (!note) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Select a note or create a new one</p>
      </div>
    );
  }

  const handleFileUploadChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileUpload(e.target.files);
    }
  };

  const handleTitleChange = (title: string) => {
    updateNote({ ...note, title, updatedAt: new Date() });
  };

  const handleContentChange = (description: string) => {
    updateNote({ ...note, description, updatedAt: new Date() });
  };

  const handleTranscript = (text: string) => {
    if (editorRef.current) {
      const currentContent = editorRef.current.getHTML();
      const newContent = currentContent + (currentContent ? ' ' : '') + text;
      handleContentChange(newContent);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-white">
      <EditorHeader
        title={note.title}
        onTitleChange={handleTitleChange}
        onBackClick={onBackClick}
        onDelete={() => deleteNote(note.id)}
        onTranscript={handleTranscript}
      />

      <TiptapEditor
        ref={editorRef}
        content={note.description}
        onChange={handleContentChange}
      />
      {/* TODO: Buggy */}
      {/* <AttachmentList noteId={note.id} /> */}

      <div className="p-4 border-t border-gray-200">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileUploadChange}
          multiple
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100"
        >
          <Paperclip className="h-4 w-4" />
          Attach files
        </button>
      </div>
    </div>
  );
}
