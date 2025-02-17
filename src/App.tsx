import { useState } from 'react';
import { NoteList } from './components/NoteList';
import { NoteEditor } from './components/NoteEditor';
import { useNotes } from './hooks/useNotes';

function App() {
  const {
    notes,
    selectedNote,
    selectedNoteId,
    searchQuery,
    setSearchQuery,
    setSelectedNoteId,
    createNote,
    updateNote,
    deleteNote,
    handleFileUpload,
  } = useNotes();

  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const toggleSidebar = () => setIsSidebarVisible(!isSidebarVisible);

  return (
    <div className="flex h-screen bg-gray-50">
      <NoteList
        notes={notes}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNoteSelect={(note) => {
          setSelectedNoteId(note.id);
          setIsSidebarVisible(false);
        }}
        onNewNote={createNote}
        selectedNoteId={selectedNoteId}
        onMenuClick={toggleSidebar}
        isVisible={isSidebarVisible}
      />
      <NoteEditor
        note={selectedNote!}
        onNoteChange={updateNote}
        onFileUpload={handleFileUpload}
        onBackClick={() => setIsSidebarVisible(true)}
        onDeleteNote={deleteNote}
      />
    </div>
  );
}

export default App;