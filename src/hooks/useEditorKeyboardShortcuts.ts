import { Editor } from '@tiptap/react';
import { useEffect } from 'react';

export function useEditorKeyboardShortcuts(editor: Editor | null) {
  useEffect(() => {
    if (!editor) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!e.metaKey && !e.ctrlKey) return;

      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          editor.chain().focus().toggleBold().run();
          break;
        case 'i':
          e.preventDefault();
          editor.chain().focus().toggleItalic().run();
          break;
        case 'k':
          e.preventDefault();
          const url = window.prompt('Enter URL');
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [editor]);
}
