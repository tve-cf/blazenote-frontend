import React, { useState, useRef } from 'react';
import { X } from 'lucide-react';

interface ImageUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImageUpload: (file: File, size: string) => void;
}

const IMAGE_SIZES = [
  { label: 'Small', value: 'small', width: '25%' },
  { label: 'Medium', value: 'medium', width: '50%' },
  { label: 'Large', value: 'large', width: '75%' },
  { label: 'Original', value: 'original', width: '100%' },
];

export function ImageUploadDialog({ isOpen, onClose, onImageUpload }: ImageUploadDialogProps) {
  const [selectedSize, setSelectedSize] = useState('medium');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    const file = fileInputRef.current?.files?.[0];
    if (file) {
      onImageUpload(file, selectedSize);
      onClose();
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Insert Image</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
          />

          {previewUrl && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Preview:</p>
              <img src={previewUrl} alt="Preview" className="max-h-48 object-contain" />
            </div>
          )}

          <div>
            <p className="text-sm font-medium mb-2">Image Size:</p>
            <div className="grid grid-cols-2 gap-2">
              {IMAGE_SIZES.map((size) => (
                <button
                  key={size.value}
                  onClick={() => setSelectedSize(size.value)}
                  className={`px-3 py-2 rounded ${
                    selectedSize === size.value
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={!previewUrl}
              className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Insert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 