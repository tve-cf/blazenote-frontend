import { useState } from 'react';
import { NoteList } from './components/NoteList';
import { NoteEditor } from './components/NoteEditor';
import { NotesProvider, useNotes } from './contexts/NotesContext';

function AppContent() {
  const {
    notes,
    selectedNote,
    selectedNoteId,
    searchQuery,
    setSearchQuery,
    setSelectedNoteId,
    createNote
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
        onBackClick={() => setIsSidebarVisible(true)}
      />
    </div>
  );
}

function App() {
  return (
    <NotesProvider>
      <AppContent />
    </NotesProvider>
  );
}

export default App;
