import React from 'react';
import { Editor } from '@tiptap/react';
import { List, ListOrdered, CheckSquare } from 'lucide-react';
import { ToolbarButton } from '../ToolbarButton';

interface ListButtonsProps {
  editor: Editor;
}

export function ListButtons({ editor }: ListButtonsProps) {
  return (
    <>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive('bulletList')}
        icon={<List className="w-4 h-4" />}
        tooltip="Bullet List (⌘+Shift+8)"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive('orderedList')}
        icon={<ListOrdered className="w-4 h-4" />}
        tooltip="Numbered List (⌘+Shift+7)"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        active={editor.isActive('taskList')}
        icon={<CheckSquare className="w-4 h-4" />}
        tooltip="Task List (⌘+Shift+9)"
      />
    </>
  );
}
