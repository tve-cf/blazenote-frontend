import { useEffect, useState } from 'react';
import { Image, Paperclip } from 'lucide-react';
import { Attachment } from '../../types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface AttachmentListProps {
  noteId: string;
}

export function AttachmentList({ noteId }: AttachmentListProps) {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPreSignedUrl = async (
    fileName: string
  ): Promise<string | null> => {
    try {
      // Encode the fileName to ensure special characters are safely included in the URL
      const encodedFileName = encodeURIComponent(fileName);
      const response = await fetch(
        `${BASE_URL}/files/pre-signed-url/${encodedFileName}`,
        {
          method: 'GET'
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch pre-signed URL for ${fileName}`);
      }
      const data = await response.json();
      return data.url || null;
    } catch (err) {
      console.error(`Error fetching pre-signed URL for ${fileName}:`, err);
      return null;
    }
  };

  useEffect(() => {
    const fetchAttachments = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${BASE_URL}/files/list/${noteId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch attachments for note ID ${noteId}`);
        }

        const data = await response.json();
        if (data.success) {
          const fetchedAttachments: Attachment[] = await Promise.all(
            data.names.map(async (file: { id: string; name: string }) => {
              const url = await fetchPreSignedUrl(file.name);
              return {
                id: file.id,
                name: file.name,
                url: url || '',
                type: 'application/octet-stream' // Might need to adjust this based on file
              };
            })
          );

          setAttachments(fetchedAttachments);
        } else {
          console.log('No attachment found');
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAttachments();
  }, [noteId]);

  if (loading) return <p>Loading attachments...</p>;
  if (error) return <p>Error: {error}</p>;
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
