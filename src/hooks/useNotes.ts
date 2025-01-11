import { useState, useCallback, useEffect } from "react";
import { Note, Attachment } from "../types";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedNote = notes.find((note) => note.id === selectedNoteId);

  useEffect(() => {
    const getNotes = async () => {
      const response = await fetch(`${BASE_URL}/notes`);
      const notes = await response.json();
      setNotes(notes.length == 0 ? [] : notes);
    };
    // Load notes from DB
    getNotes();
  }, []);

  const createNote = () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: "",
      description: "",
      attachments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setNotes([newNote, ...notes]);
    setSelectedNoteId(newNote.id);

    // Save new note into DB
    const saveNoteIntoDB = async () => {
      await fetch(`${BASE_URL}/notes`, {
        method: "POST",
        body: JSON.stringify(newNote),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
    };
    saveNoteIntoDB();
  };

  const updateNote = (updatedNote: Note) => {
    setNotes(
      notes.map((note) => (note.id === updatedNote.id ? updatedNote : note))
    );

    // Save updated note into DB
    const saveUpdatedNoteIntoDB = async () => {
      await fetch(`${BASE_URL}/notes/${updatedNote.id}`, {
        method: "PUT",
        body: JSON.stringify(updatedNote),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
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
        method: "DELETE",
      });
    };
    deleteNoteAttachment();

    // Delete note from DB
    const deleteNoteFromDB = async () => {
      await fetch(`${BASE_URL}/notes/${noteId}`, {
        method: "DELETE",
      });
    };
    deleteNoteFromDB();
  };

  const handleFileUpload = useCallback(
    async (files: FileList) => {
      if (!selectedNote) return;

      try {
        const uploadTasks = Array.from(files).map((file) => {
          return handleFile(file, selectedNote.id);
        });

        await Promise.all(uploadTasks);

        const updatedNote: Note = {
          ...selectedNote,
          updatedAt: new Date(),
        };

        updateNote(updatedNote);
      } catch (error) {
        console.error("Error during file upload process:", error);
      }
    },
    [selectedNote]
  );

  const handleFile = async (file: File, noteId: string) => {
    try {
      // Get pre-signed URL
      const { key, url } = await getPreSignedUrl(file);
      if (!url) throw new Error(`No URL received for ${file.name}`);

      // Upload the file to the pre-signed URL
      await uploadFileToUrl(url, file);

      // Save file metadata to the database
      await saveFileMetadata(noteId, key);
    } catch (fileError) {
      console.error(`Error processing file ${file.name}:`, fileError);
    }
  };

  const getPreSignedUrl = async (file: File) => {
    const response = await fetch(`${BASE_URL}/files/pre-signed-url`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to get pre-signed URL for ${file.name}`);
    }

    return await response.json();
  };

  const uploadFileToUrl = async (url: string, file: File) => {
    const uploadResponse = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });

    if (!uploadResponse.ok) {
      throw new Error(`Failed to upload file ${file.name}`);
    }
  };

  const saveFileMetadata = async (noteId: string, key: string) => {
    const saveFileResponse = await fetch(`${BASE_URL}/files/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        noteId,
        objectKey: key,
      }),
    });

    if (!saveFileResponse.ok) {
      throw new Error(`Failed to save file data`);
    }
  };

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
