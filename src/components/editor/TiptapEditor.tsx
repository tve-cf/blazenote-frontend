import { useEditor, EditorContent } from '@tiptap/react';
import { useEffect, forwardRef, useImperativeHandle } from 'react';
import { EditorToolbar } from './toolbar/EditorToolbar';
import { useTiptapExtensions } from '../../hooks/useTiptapExtensions';
import { useEditorKeyboardShortcuts } from '../../hooks/useEditorKeyboardShortcuts';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export const TiptapEditor = forwardRef<
  { getHTML: () => string },
  TiptapEditorProps
>(function TiptapEditor({ content, onChange }, ref) {
  const extensions = useTiptapExtensions();
  const editor = useEditor({
    extensions,
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose max-w-none focus:outline-none'
      }
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    }
  });

  useEditorKeyboardShortcuts(editor);

  useImperativeHandle(ref, () => ({
    getHTML: () => editor?.getHTML() || ''
  }));

  // Update editor content when the content prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <EditorToolbar editor={editor} />
      <div className="flex-1 overflow-y-auto px-4 py-2">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
});
