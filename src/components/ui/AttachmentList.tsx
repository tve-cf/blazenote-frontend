import React from 'react';
import { Image, Paperclip } from 'lucide-react';
import { Attachment } from '../../types';

interface AttachmentListProps {
  attachments: Attachment[];
}

export function AttachmentList({ attachments }: AttachmentListProps) {
  if (attachments.length === 0) return null;

  return (
    <div className="p-4 border-t border-gray-200">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Attachments</h3>
      <div className="flex flex-wrap gap-2">
        {attachments.map((attachment) => (
          <a
            key={attachment.id}
            href={attachment.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
          >
            {attachment.type.startsWith('image/') ? (
              <Image className="h-4 w-4" />
            ) : (
              <Paperclip className="h-4 w-4" />
            )}
            <span className="truncate max-w-[150px]">{attachment.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}