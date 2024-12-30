import { useState, useCallback } from 'react';
import { Note, Attachment } from '../types';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedNote = notes.find((note) => note.id === selectedNoteId);

  const createNote = () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: '',
      content: '',
      attachments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setNotes([newNote, ...notes]);
    setSelectedNoteId(newNote.id);
  };

  const updateNote = (updatedNote: Note) => {
    setNotes(notes.map((note) => (note.id === updatedNote.id ? updatedNote : note)));
  };

  const deleteNote = (noteId: string) => {
    setNotes(notes.filter((note) => note.id !== noteId));
    setSelectedNoteId(notes.find(note => note.id !== noteId)?.id || null);
  };

  const handleFileUpload = useCallback(
    (files: FileList) => {
      if (!selectedNote) return;

      const newAttachments: Attachment[] = Array.from(files).map((file) => ({
        id: crypto.randomUUID(),
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type,
      }));

      const updatedNote: Note = {
        ...selectedNote,
        attachments: [...selectedNote.attachments, ...newAttachments],
        updatedAt: new Date(),
      };

      updateNote(updatedNote);
    },
    [selectedNote]
  );

  return {
    notes: filteredNotes,
    selectedNote,
    selectedNoteId,
    searchQuery,
    setSearchQuery,
    setSelectedNoteId,
    createNote,
    updateNote,
    deleteNote,
    handleFileUpload,
  };
}