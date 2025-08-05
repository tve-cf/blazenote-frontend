import React, { useState, useRef } from 'react';
import { X, RotateCw } from 'lucide-react';

interface ImageUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImageUpload: (file: File, size: string, transformations: ImageTransformations) => void;
}

interface ImageTransformations {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  rotate: number;
  quality: number;
}

const IMAGE_SIZES = [
  { label: 'Small', value: 'small', width: '25%' },
  { label: 'Medium', value: 'medium', width: '50%' },
  { label: 'Large', value: 'large', width: '75%' },
  { label: 'Original', value: 'original', width: '100%' },
];

const DEFAULT_TRANSFORMATIONS: ImageTransformations = {
  brightness: 1,
  contrast: 1,
  saturation: 1,
  blur: 0,
  rotate: 0,
  quality: 85,
};

export function ImageUploadDialog({ isOpen, onClose, onImageUpload }: ImageUploadDialogProps) {
  const [selectedSize, setSelectedSize] = useState('medium');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [transformations, setTransformations] = useState<ImageTransformations>(DEFAULT_TRANSFORMATIONS);
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
      onImageUpload(file, selectedSize, transformations);
      onClose();
      setPreviewUrl(null);
      setTransformations(DEFAULT_TRANSFORMATIONS);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleTransformationChange = (key: keyof ImageTransformations, value: number) => {
    setTransformations(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const renderSlider = (
    label: string,
    key: keyof ImageTransformations,
    min: number,
    max: number,
    step: number,
    defaultValue: number
  ) => (
    <div className="space-y-1">
      <div className="flex justify-between">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-sm text-gray-500">{transformations[key]}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={transformations[key]}
        onChange={(e) => handleTransformationChange(key, parseFloat(e.target.value))}
        className="w-full"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Insert Image</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
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
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="max-h-48 object-contain border rounded"
                  style={{
                    filter: `
                      brightness(${transformations.brightness})
                      contrast(${transformations.contrast})
                      saturate(${transformations.saturation})
                      blur(${transformations.blur}px)
                    `,
                    transform: `rotate(${transformations.rotate}deg)`,
                  }}
                />
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
          </div>

          <div className="space-y-4 border-l pl-6">
            <h4 className="font-medium">Image Transformations</h4>
            {renderSlider('Brightness', 'brightness', 0.1, 2, 0.1, 1)}
            {renderSlider('Contrast', 'contrast', 0.1, 2, 0.1, 1)}
            {renderSlider('Saturation', 'saturation', 0, 2, 0.1, 1)}
            {renderSlider('Blur', 'blur', 0, 10, 0.5, 0)}
            {renderSlider('Rotate', 'rotate', 0, 360, 90, 0)}
            {renderSlider('Quality', 'quality', 1, 100, 1, 85)}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
          <button
            onClick={() => setTransformations(DEFAULT_TRANSFORMATIONS)}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 flex items-center gap-2"
          >
            <RotateCw className="w-4 h-4" />
            Reset
          </button>
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
  );
} 