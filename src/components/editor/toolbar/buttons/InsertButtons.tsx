import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import { Image, Link } from 'lucide-react';
import { ToolbarButton } from '../ToolbarButton';
import { ImageUploadDialog } from './ImageUploadDialog';

interface InsertButtonsProps {
  editor: Editor;
}

export function InsertButtons({ editor }: InsertButtonsProps) {
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

  const handleImageUpload = async (file: File, size: string) => {
    // Here you would typically upload the file to your server
    // For now, we'll use a local URL
    const url = URL.createObjectURL(file);
    
    // Apply the selected size
    const sizeMap: { [key: string]: string } = {
      small: '25%',
      medium: '50%',
      large: '75%',
      original: '100%'
    };
    
    editor
      .chain()
      .focus()
      .setImage({ 
        src: url,
        alt: file.name,
      })
      .run();

    // Set the width after inserting the image
    const imageElement = editor.view.dom.querySelector(`img[src="${url}"]`) as HTMLImageElement;
    if (imageElement) {
      imageElement.style.width = sizeMap[size];
      imageElement.style.height = 'auto';
    }
  };

  const addLink = () => {
    const url = window.prompt('Enter URL');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <>
      <ToolbarButton
        onClick={() => setIsImageDialogOpen(true)}
        icon={<Image className="w-4 h-4" />}
        tooltip="Insert Image (⌘+Shift+I)"
      />
      <ToolbarButton
        onClick={addLink}
        active={editor.isActive('link')}
        icon={<Link className="w-4 h-4" />}
        tooltip="Insert Link (⌘+K)"
      />
      
      <ImageUploadDialog
        isOpen={isImageDialogOpen}
        onClose={() => setIsImageDialogOpen(false)}
        onImageUpload={handleImageUpload}
      />
    </>
  );
}