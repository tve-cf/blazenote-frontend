import React from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Bold, Italic, List, Link, Image as ImageIcon } from 'lucide-react';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
}

const customCommands = {
  bold: {
    icon: <Bold className="w-4 h-4" />,
    title: 'Bold',
    hotkey: 'Ctrl+B',
  },
  italic: {
    icon: <Italic className="w-4 h-4" />,
    title: 'Italic',
    hotkey: 'Ctrl+I',
  },
  list: {
    icon: <List className="w-4 h-4" />,
    title: 'List',
    hotkey: 'Ctrl+L',
  },
  link: {
    icon: <Link className="w-4 h-4" />,
    title: 'Link',
    hotkey: 'Ctrl+K',
  },
  image: {
    icon: <ImageIcon className="w-4 h-4" />,
    title: 'Image',
    hotkey: 'Ctrl+Shift+I',
  },
};

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  return (
    <div className="flex-1 overflow-hidden" data-color-mode="light">
      <MDEditor
        value={value}
        onChange={onChange}
        preview="edit"
        height="100%"
        visibleDragbar={false}
        commands={[
          'bold',
          'italic',
          'strikethrough',
          'hr',
          'divider',
          'link',
          'quote',
          'code',
          'image',
          'divider',
          'unordered-list',
          'ordered-list',
          'task-list',
          'divider',
          'preview',
          'fullscreen',
        ]}
        commandsFilter={(cmd) => {
          const customCmd = customCommands[cmd.name as keyof typeof customCommands];
          if (customCmd) {
            return { ...cmd, ...customCmd };
          }
          return cmd;
        }}
      />
    </div>
  );
}