import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';

export function useTiptapExtensions() {
  return [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3]
      }
    }),
    Placeholder.configure({
      placeholder: 'Write something...'
    }),
    TaskList,
    TaskItem.configure({
      nested: true
    }),
    Image,
    Link.configure({
      openOnClick: false
    })
  ];
}
