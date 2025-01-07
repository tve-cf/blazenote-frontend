import { useState, useCallback, useEffect } from 'react';
import { Note, Attachment } from '../types';

const BASE_URL = "https://blazenote-api.tve-e20.workers.dev" // TODO: Add prod url

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedNote = notes.find((note) => note.id === selectedNoteId);

  useEffect(() => {
    const getNotes = async() => {
      const response = await fetch(`${BASE_URL}/notes`)
      const notes = await response.json()
      setNotes(notes.length == 0 ? [] : notes);
    }
    // Load notes from DB
    getNotes()    
  }, []);

  const createNote = () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: '',
      description: '',
      attachments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setNotes([newNote, ...notes]);
    setSelectedNoteId(newNote.id);

    // Save new note into DB
    const saveNoteIntoDB = async() => { await fetch(`${BASE_URL}/notes`, {
          method: "POST",
          body: JSON.stringify(newNote),
          headers: {
              "Content-type": "application/json; charset=UTF-8"
          }
        })
    }
    saveNoteIntoDB()
  };

  const updateNote = (updatedNote: Note) => {
    setNotes(notes.map((note) => (note.id === updatedNote.id ? updatedNote : note)));
     
    // Save updated note into DB
    const saveUpdatedNoteIntoDB = async() => { await fetch(`${BASE_URL}/notes/${updatedNote.id}`, {
        method: "PUT",
        body: JSON.stringify(updatedNote),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
      })
    }
    saveUpdatedNoteIntoDB()
  };

  const deleteNote = (noteId: string) => {
    setNotes(notes.filter((note) => note.id !== noteId));
    setSelectedNoteId(notes.find(note => note.id !== noteId)?.id || null);
    // Delete note from DB
    const deleteNoteFromDB = async() => { await fetch(`${BASE_URL}/notes/${noteId}`, {
        method: "DELETE",
      })
    }
    deleteNoteFromDB()
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