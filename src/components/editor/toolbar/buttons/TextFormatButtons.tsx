import React from 'react';
import { Editor } from '@tiptap/react';
import { Bold, Italic, Strikethrough, Code } from 'lucide-react';
import { ToolbarButton } from '../ToolbarButton';

interface TextFormatButtonsProps {
  editor: Editor;
}

export function TextFormatButtons({ editor }: TextFormatButtonsProps) {
  return (
    <>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive('bold')}
        icon={<Bold className="w-4 h-4" />}
        tooltip="Bold (⌘+B)"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive('italic')}
        icon={<Italic className="w-4 h-4" />}
        tooltip="Italic (⌘+I)"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        active={editor.isActive('strike')}
        icon={<Strikethrough className="w-4 h-4" />}
        tooltip="Strikethrough (⌘+Shift+X)"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        active={editor.isActive('code')}
        icon={<Code className="w-4 h-4" />}
        tooltip="Inline Code (⌘+E)"
      />
    </>
  );
}
