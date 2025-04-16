import { useState } from 'react';
import { Editor } from '@tiptap/react';
import {
  Image,
  Link,
  Sparkles,
  FileText,
  RefreshCw,
  Languages,
  Tag
} from 'lucide-react';
import { ToolbarButton } from '../ToolbarButton';
import { AiDialog } from '../../../ui/AiDialog';
import { useNotes } from '../../../../contexts/NotesContext';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface InsertButtonsProps {
  editor: Editor;
}

export function InsertButtons({ editor }: InsertButtonsProps) {
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<
    'summarize' | 'paraphrase' | 'translate' | 'title' | null
  >(null);
  const [fromLanguage, setFromLanguage] = useState('english');
  const [toLanguage, setToLanguage] = useState('spanish');
  const { createNote, updateNote, selectedNote } = useNotes();

  const addImage = () => {
    const url = window.prompt('Enter image URL');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addLink = () => {
    const url = window.prompt('Enter URL');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const handleAIAction = async (
    action: 'summarize' | 'paraphrase' | 'translate' | 'title'
  ) => {
    const noteContent = editor.getHTML();
    if (!noteContent) {
      alert('Please add some content to your note first');
      return;
    }

    if (action === 'translate') {
      setSelectedAction('translate');
      return;
    }

    setIsLoading(true);
    setAiResult(null);
    setSelectedAction(action);

    try {
      const response = await fetch(`${BASE_URL}/ai/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: noteContent })
      });

      if (!response.ok) {
        throw new Error('Failed to process text');
      }

      const data = await response.json();
      setAiResult(data.response);
    } catch (error) {
      alert('Failed to process text. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTranslate = async () => {
    const noteContent = editor.getHTML();
    if (!noteContent) {
      alert('Please add some content to your note first');
      return;
    }

    if (fromLanguage === toLanguage) {
      alert('From and to languages cannot be the same');
      return;
    }

    setIsLoading(true);
    setAiResult(null);

    try {
      const response = await fetch(`${BASE_URL}/ai/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: noteContent,
          fromLanguage: fromLanguage,
          toLanguage: toLanguage
        })
      });

      if (!response.ok) {
        throw new Error('Failed to process text');
      }

      const data = await response.json();
      setAiResult(data.response);
    } catch (error) {
      alert('Failed to process text. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (aiResult) {
      navigator.clipboard.writeText(aiResult);
    }
  };

  const handleInsert = () => {
    if (aiResult) {
      editor.chain().focus().insertContent(aiResult).run();
      setIsAIDialogOpen(false);
    }
  };

  const handleCreateNew = async () => {
    if (aiResult) {
      try {
        // Create a new note with the AI result as content
        await createNote(`AI generated note: ${selectedAction}`, aiResult);

        // Close dialog and reset state
        setIsAIDialogOpen(false);
        setSelectedAction(null);
        setAiResult(null);
      } catch (error) {
        console.error('Failed to create new note:', error);
        alert('Failed to create new note. Please try again.');
      }
    }
  };

  const handleApplyTitle = () => {
    if (!selectedNote) {
      alert('No note selected. Please select a note first.');
      return;
    }

    if (aiResult) {
      // Clean the title text by removing HTML tags and any extra whitespace
      const cleanTitle = aiResult
        .replace(/<\/?[^>]+(>|$)/g, '') // Remove HTML tags
        .replace(/\s+/g, ' ') // Normalize whitespace
        .replace(/assistant<|header_end|>/g, '')
        .replace(/<p>&nbsp;<\/p>/g, '')
        .replace(/\n/g, '')
        .replace(/<\|.*?\|>/g, '')
        .replace(/^.*?\|>/, '')
        .trim(); // Trim leading/trailing whitespace

      // Update the current note's title with the generated title
      updateNote({
        ...selectedNote,
        title: cleanTitle,
        updatedAt: new Date()
      });

      // Close dialog and reset state
      setIsAIDialogOpen(false);
      setSelectedAction(null);
      setAiResult(null);
    }
  };

  return (
    <>
      <ToolbarButton
        onClick={addImage}
        icon={<Image className="w-4 h-4" />}
        tooltip="Insert Image (⌘+Shift+I)"
      />
      <ToolbarButton
        onClick={addLink}
        active={editor.isActive('link')}
        icon={<Link className="w-4 h-4" />}
        tooltip="Insert Link (⌘+K)"
      />
      <ToolbarButton
        onClick={() => {
          setIsAIDialogOpen(true);
          setAiResult(null);
          setSelectedAction(null);
        }}
        icon={<Sparkles className="w-4 h-4" />}
        tooltip="AI Tools (⌘+L)"
      />

      <AiDialog
        isOpen={isAIDialogOpen}
        onClose={() => {
          setIsAIDialogOpen(false);
          setAiResult(null);
          setSelectedAction(null);
        }}
        title="AI Tools"
        isLoading={isLoading}
        result={aiResult || undefined}
        onCopy={handleCopy}
        onInsert={handleInsert}
        onCreateNew={handleCreateNew}
        onApplyTitle={handleApplyTitle}
        selectedAction={selectedAction}
        fromLanguage={fromLanguage}
        toLanguage={toLanguage}
        onFromLanguageChange={setFromLanguage}
        onToLanguageChange={setToLanguage}
        onTranslate={handleTranslate}
      >
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleAIAction('summarize')}
            className="flex flex-col items-center justify-center p-4 text-gray-700 bg-white border border-gray-100 rounded-lg shadow-sm hover:bg-blue-50 hover:border-blue-200 transition-all"
          >
            <div className="bg-blue-100 p-3 rounded-full mb-3">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <span className="font-medium">Summarize</span>
          </button>

          <button
            onClick={() => handleAIAction('paraphrase')}
            className="flex flex-col items-center justify-center p-4 text-gray-700 bg-white border border-gray-100 rounded-lg shadow-sm hover:bg-blue-50 hover:border-blue-200 transition-all"
          >
            <div className="bg-blue-100 p-3 rounded-full mb-3">
              <RefreshCw className="h-5 w-5 text-blue-600" />
            </div>
            <span className="font-medium">Paraphrase</span>
          </button>

          <button
            onClick={() => handleAIAction('translate')}
            className="flex flex-col items-center justify-center p-4 text-gray-700 bg-white border border-gray-100 rounded-lg shadow-sm hover:bg-blue-50 hover:border-blue-200 transition-all"
          >
            <div className="bg-blue-100 p-3 rounded-full mb-3">
              <Languages className="h-5 w-5 text-blue-600" />
            </div>
            <span className="font-medium">Translate</span>
          </button>

          <button
            onClick={() => handleAIAction('title')}
            className="flex flex-col items-center justify-center p-4 text-gray-700 bg-white border border-gray-100 rounded-lg shadow-sm hover:bg-blue-50 hover:border-blue-200 transition-all"
          >
            <div className="bg-blue-100 p-3 rounded-full mb-3">
              <Tag className="h-5 w-5 text-blue-600" />
            </div>
            <span className="font-medium">Generate Title</span>
          </button>
        </div>
      </AiDialog>
    </>
  );
}
