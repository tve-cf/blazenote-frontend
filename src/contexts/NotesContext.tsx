import React, {
  createContext,
  useState,
  useCallback,
  useEffect,
  useContext
} from 'react';
import { Note } from '../types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface NotesContextType {
  notes: Note[];
  selectedNote: Note | undefined;
  selectedNoteId: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setSelectedNoteId: (id: string | null) => void;
  createNote: (title?: string, description?: string) => Promise<void>;
  updateNote: (updatedNote: Note) => void;
  deleteNote: (noteId: string) => void;
  handleFileUpload: (files: FileList) => Promise<void>;
  refreshNotes: () => Promise<void>;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotes = notes.filter(
    (note) =>
      note?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note?.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedNote = notes.find((note) => note.id === selectedNoteId);

  useEffect(() => {
    const getNotes = async () => {
      const response = await fetch(`${BASE_URL}/notes`);
      const notes = await response.json();
      setNotes(notes.length == 0 ? [] : notes);
    };
    console.log('[Info] API base url: ', BASE_URL);
    // Load notes from DB
    getNotes();
  }, []);

  // Force reload notes from DB
  const refreshNotes = async () => {
    const response = await fetch(`${BASE_URL}/notes`);
    const notes = await response.json();
    setNotes(notes.length == 0 ? [] : notes);
  };

  const createNote = async (title?: string, description?: string) => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: title || '',
      description: description || '',
      attachments: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setNotes([newNote, ...notes]);
    setSelectedNoteId(newNote.id);

    // Save new note into DB
    await fetch(`${BASE_URL}/notes`, {
      method: 'POST',
      body: JSON.stringify(newNote),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    });
  };

  const updateNote = (updatedNote: Note) => {
    setNotes(
      notes.map((note) => (note.id === updatedNote.id ? updatedNote : note))
    );

    // Save updated note into DB
    const saveUpdatedNoteIntoDB = async () => {
      await fetch(`${BASE_URL}/notes/${updatedNote.id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedNote),
        headers: {
          'Content-type': 'application/json; charset=UTF-8'
        }
      });
    };
    saveUpdatedNoteIntoDB();
  };

  const deleteNote = (noteId: string) => {
    setNotes(notes.filter((note) => note.id !== noteId));
    setSelectedNoteId(notes.find((note) => note.id !== noteId)?.id || null);

    // Delete attachment from bucket
    const deleteNoteAttachment = async () => {
      await fetch(`${BASE_URL}/files/${noteId}`, {
        method: 'DELETE'
      });
    };
    deleteNoteAttachment();

    // Delete note from DB
    const deleteNoteFromDB = async () => {
      await fetch(`${BASE_URL}/notes/${noteId}`, {
        method: 'DELETE'
      });
    };
    deleteNoteFromDB();
  };

  // File upload handled in front end
  const handleFileUpload = useCallback(
    async (files: FileList) => {
      if (!selectedNote) return;

      try {
        // Iterate over the files and process them
        const uploadTasks = Array.from(files).map(async (file) => {
          try {
            // Handle the upload process
            await handleFileUploadProcess(file, selectedNote.id);
          } catch (fileError) {
            console.error(`Error processing file "${file.name}":`, fileError);
          }
        });

        // Wait for all files to complete
        await Promise.all(uploadTasks);

        // Update the note after successful uploads
        const updatedNote: Note = {
          ...selectedNote,
          updatedAt: new Date()
        };

        updateNote(updatedNote);
      } catch (error) {
        console.error('Error during file upload process:', error);
      }
    },
    [selectedNote]
  );

  // Get pre-signed url
  const getPreSignedUrl = async (file: File) => {
    const response = await fetch(`${BASE_URL}/files/pre-signed-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to get pre-signed URL for ${file.name}`);
    }

    return await response.json();
  };

  // Handle the upload process
  const handleFileUploadProcess = async (
    file: File,
    noteId: string
  ): Promise<void> => {
    // Get pre-signed URL
    const { key, url } = await getPreSignedUrl(file);

    if (!url || !key) {
      throw new Error(`Invalid response for file: ${file.name}`);
    }

    // Upload file to the pre-signed URL
    await uploadFileToUrl(url, file);

    // Save file metadata to the database
    await saveFileMetadata(noteId, key);
  };

  // Upload file using pre-signed URL
  const uploadFileToUrl = async (url: string, file: File): Promise<void> => {
    const uploadResponse = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: file
    });

    if (!uploadResponse.ok) {
      throw new Error(`Failed to upload file: ${file.name}`);
    }
  };

  // Save file metadata to the db
  const saveFileMetadata = async (
    noteId: string,
    key: string
  ): Promise<void> => {
    const metadataResponse = await fetch(`${BASE_URL}/files/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        noteId,
        objectKey: key
      })
    });

    if (!metadataResponse.ok) {
      throw new Error(`Failed to save metadata for file`);
    }
  };

  const value = {
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
    refreshNotes
  };

  return (
    <NotesContext.Provider value={value}>{children}</NotesContext.Provider>
  );
}

// Custom hook to use the notes context
export function useNotes() {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
}
