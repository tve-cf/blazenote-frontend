import React from 'react';
import { Editor } from '@tiptap/react';
import { Image, Link } from 'lucide-react';
import { ToolbarButton } from '../ToolbarButton';

interface InsertButtonsProps {
  editor: Editor;
}

export function InsertButtons({ editor }: InsertButtonsProps) {
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
    </>
  );
}