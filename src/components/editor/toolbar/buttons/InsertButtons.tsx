import { useState } from 'react';
import { Editor } from '@tiptap/react';
import {
  Image as ImageIcon,
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
import { ImageUploadDialog } from './ImageUploadDialog';

interface InsertButtonsProps {
  editor: Editor;
}

interface ImageTransformations {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  rotate: number;
  quality: number;
}

// Helper function to transform image using Canvas API
const transformImage = async (file: File, transformations: ImageTransformations): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    img.onload = () => {
      // Set canvas dimensions
      canvas.width = img.width;
      canvas.height = img.height;

      // Apply transformations
      ctx.save();
      
      // Move to center for rotation
      ctx.translate(canvas.width / 2, canvas.height / 2);
      
      // Apply rotation
      ctx.rotate((transformations.rotate * Math.PI) / 180);
      
      // Apply filters
      ctx.filter = `
        brightness(${transformations.brightness})
        contrast(${transformations.contrast})
        saturate(${transformations.saturation})
        blur(${transformations.blur}px)
      `;
      
      // Draw image (centered due to translation)
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      
      ctx.restore();

      // Convert canvas to blob with quality setting
      canvas.toBlob(
        (blob) => {
          if (blob) {
            // Create new file with transformed image
            const transformedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(transformedFile);
          } else {
            reject(new Error('Failed to create blob from canvas'));
          }
        },
        file.type,
        transformations.quality / 100
      );
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    // Load the image
    img.src = URL.createObjectURL(file);
  });
};

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

  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

  const handleImageUpload = async (
    file: File, 
    size: string, 
    transformations: ImageTransformations
  ) => {
    try {
      // Transform the image before uploading
      const transformedFile = await transformImage(file, transformations);
      
      // Create FormData to send the transformed file
      const formData = new FormData();
      formData.append('file', transformedFile);

      // Upload image to the server
      const response = await fetch(`${BASE_URL}/images/upload`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      const imageUrl = data.url || data.imageUrl; // Handle different response formats
      
      // Apply the selected size
      const sizeMap: { [key: string]: string } = {
        small: '25%',
        medium: '50%',
        large: '75%',
        original: '100%'
      };
      
      // Insert the image into the editor
      editor
        .chain()
        .focus()
        .setImage({ 
          src: imageUrl,
          alt: file.name,
        })
        .run();

      // Apply size styling after insertion
      const imageElement = editor.view.dom.querySelector(`img[src="${imageUrl}"]`) as HTMLImageElement;
      if (imageElement) {
        imageElement.style.width = sizeMap[size];
        imageElement.style.height = 'auto';
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
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
        onClick={() => setIsImageDialogOpen(true)}
        icon={<ImageIcon className="w-4 h-4" />}
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
        icon={<Sparkles className="w-4 h-4 text-pink-500" />}
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
      
      <ImageUploadDialog
        isOpen={isImageDialogOpen}
        onClose={() => setIsImageDialogOpen(false)}
        onImageUpload={handleImageUpload}
      />
    </>
  );
}
