import { Editor } from '@tiptap/react';
import { ToolbarDivider } from './ToolbarDivider';
import { TextFormatButtons } from './buttons/TextFormatButtons';
import { ListButtons } from './buttons/ListButtons';
import { BlockButtons } from './buttons/BlockButtons';
import { InsertButtons } from './buttons/InsertButtons';

interface EditorToolbarProps {
  editor: Editor;
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  return (
    <div className="border-b border-gray-200 bg-white p-2 flex flex-wrap gap-1">
      <TextFormatButtons editor={editor} />
      <ToolbarDivider />
      <ListButtons editor={editor} />
      <ToolbarDivider />
      <BlockButtons editor={editor} />
      <ToolbarDivider />
      <InsertButtons editor={editor} />
    </div>
  );
}