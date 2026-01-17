'use client';

import { useState } from 'react';
import { SecretPrompt, ExampleImage } from '@/types';

interface ExampleImagesSectionProps {
  prompt: SecretPrompt;
  updatePrompt: (updates: Partial<SecretPrompt>) => void;
}

export default function ExampleImagesSection({ prompt, updatePrompt }: ExampleImagesSectionProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: ExampleImage[] = [];
    
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newImage: ExampleImage = {
          id: crypto.randomUUID(),
          url: event.target?.result as string,
          order: prompt.exampleImages.length + newImages.length,
          isHero: prompt.exampleImages.length + newImages.length < 6,
        };
        newImages.push(newImage);
        
        // Update after all files are read
        if (newImages.length === files.length) {
          updatePrompt({ exampleImages: [...prompt.exampleImages, ...newImages] });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const deleteImage = (id: string) => {
    const images = prompt.exampleImages
      .filter(img => img.id !== id)
      .map((img, index) => ({
        ...img,
        order: index,
        isHero: index < 6,
      }));
    updatePrompt({ exampleImages: images });
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const images = [...prompt.exampleImages];
    const draggedImage = images[draggedIndex];
    images.splice(draggedIndex, 1);
    images.splice(index, 0, draggedImage);
    
    // Update orders and hero status
    images.forEach((img, i) => {
      img.order = i;
      img.isHero = i < 6;
    });

    updatePrompt({ exampleImages: images });
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const sortedImages = [...prompt.exampleImages].sort((a, b) => a.order - b.order);
  const heroImages = sortedImages.slice(0, 6);
  const remainingImages = sortedImages.slice(6);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Example Images</h2>
        <p className="text-gray-600">Upload example images to show users what this prompt produces</p>
      </div>

      <div className="h-px bg-gray-200" />

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <span className="text-2xl">🖼️</span>
          <div>
            <h3 className="font-bold text-blue-900 mb-1">About Example Images</h3>
            <p className="text-sm text-blue-800">
              The first 6 images are "hero images" shown prominently in the gallery. 
              Drag to reorder. Aim for 8-12 images total to showcase variety.
            </p>
          </div>
        </div>
      </div>

      {/* Upload Button */}
      <div>
        <label className="block w-full">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <div className="border-2 border-dashed border-gray-300 hover:border-blue-500 rounded-lg p-8 text-center cursor-pointer transition-colors hover:bg-blue-50">
            <div className="text-4xl mb-3">📁</div>
            <div className="text-lg font-medium text-gray-900 mb-1">
              Click to upload images
            </div>
            <div className="text-sm text-gray-600">
              or drag and drop • JPG, PNG, WebP • Max 10MB each
            </div>
          </div>
        </label>
      </div>

      {/* Hero Images */}
      {heroImages.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-3">
            ⭐ Hero Images (First 6 - shown prominently)
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {heroImages.map((image, index) => (
              <div
                key={image.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`relative group cursor-move rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-all ${
                  draggedIndex === index ? 'opacity-50' : ''
                }`}
              >
                <img
                  src={image.url}
                  alt={`Example ${index + 1}`}
                  className="w-full aspect-square object-cover"
                />
                <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-bold">
                  #{index + 1}
                </div>
                <button
                  onClick={() => deleteImage(image.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ✕
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="text-white text-xs">Drag to reorder</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Remaining Images */}
      {remainingImages.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-3">
            Additional Images
          </h3>
          <div className="grid grid-cols-4 gap-3">
            {remainingImages.map((image, index) => {
              const actualIndex = index + 6;
              return (
                <div
                  key={image.id}
                  draggable
                  onDragStart={() => handleDragStart(actualIndex)}
                  onDragOver={(e) => handleDragOver(e, actualIndex)}
                  onDragEnd={handleDragEnd}
                  className={`relative group cursor-move rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-all ${
                    draggedIndex === actualIndex ? 'opacity-50' : ''
                  }`}
                >
                  <img
                    src={image.url}
                    alt={`Example ${actualIndex + 1}`}
                    className="w-full aspect-square object-cover"
                  />
                  <div className="absolute top-1 left-1 bg-black/70 text-white px-1.5 py-0.5 rounded text-xs font-bold">
                    #{actualIndex + 1}
                  </div>
                  <button
                    onClick={() => deleteImage(image.id)}
                    className="absolute top-1 right-1 bg-red-500 text-white w-5 h-5 rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {prompt.exampleImages.length === 0 && (
        <div className="text-center py-12 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
          <div className="text-4xl mb-3">🖼️</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No images yet</h3>
          <p className="text-gray-600 mb-4">Upload your first example image to get started</p>
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center justify-between text-sm">
        <div className="text-gray-600">
          Total Images: <strong>{prompt.exampleImages.length}</strong>
          {prompt.exampleImages.length < 3 && (
            <span className="text-red-500 ml-2">(minimum 3 required)</span>
          )}
        </div>
        <div className="text-gray-600">
          Recommended: 8-12 images
        </div>
      </div>

      {/* Tips */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="font-bold text-gray-900 mb-2">📸 Image Tips</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Use high-quality images that showcase the prompt's capabilities</li>
          <li>• Show variety in the first 6 hero images (different styles, poses, colors)</li>
          <li>• Keep images consistent with the prompt's theme and quality</li>
          <li>• First image is most important - make it your best example</li>
          <li>• Drag images to reorder them</li>
        </ul>
      </div>
    </div>
  );
}
