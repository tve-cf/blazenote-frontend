import { useState } from 'react';
import { Editor } from '@tiptap/react';
import { Image, Link } from 'lucide-react';
import { ToolbarButton } from '../ToolbarButton';
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

export function InsertButtons({ editor }: InsertButtonsProps) {
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

  const handleImageUpload = async (
    file: File, 
    size: string, 
    transformations: ImageTransformations
  ) => {
    // Here you would typically:
    // 1. Upload the file to your server
    // 2. Send it through Cloudflare's image optimization
    // 3. Get back the optimized URL
    // For now, we'll use a local URL with CSS transforms
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

    // Apply transformations after insertion
    const imageElement = editor.view.dom.querySelector(`img[src="${url}"]`) as HTMLImageElement;
    if (imageElement) {
      imageElement.style.width = sizeMap[size];
      imageElement.style.height = 'auto';
      imageElement.style.filter = `
        brightness(${transformations.brightness})
        contrast(${transformations.contrast})
        saturate(${transformations.saturation})
        blur(${transformations.blur}px)
      `;
      imageElement.style.transform = `rotate(${transformations.rotate}deg)`;
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