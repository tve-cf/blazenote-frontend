import React from 'react';
import MDEditor from '@uiw/react-md-editor';

interface MarkdownPreviewProps {
  content: string;
}

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  return (
    <div className="flex-1 overflow-auto p-4 prose max-w-none" data-color-mode="light">
      <MDEditor.Markdown source={content} />
    </div>
  );
}