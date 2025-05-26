import React from 'react';
import { Editor } from '@tiptap/react';
import { Quote, Code2, Minus } from 'lucide-react';
import { ToolbarButton } from '../ToolbarButton';

interface BlockButtonsProps {
  editor: Editor;
}

export function BlockButtons({ editor }: BlockButtonsProps) {
  return (
    <>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive('blockquote')}
        icon={<Quote className="w-4 h-4" />}
        tooltip="Blockquote (⌘+Shift+B)"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        active={editor.isActive('codeBlock')}
        icon={<Code2 className="w-4 h-4" />}
        tooltip="Code Block (⌘+Alt+C)"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        icon={<Minus className="w-4 h-4" />}
        tooltip="Horizontal Rule (⌘+Alt+-)"
      />
    </>
  );
}
