'use client';

import { SecretPrompt } from '@/types';

interface BasicInfoSectionProps {
  prompt: SecretPrompt;
  updatePrompt: (updates: Partial<SecretPrompt>) => void;
}

export default function BasicInfoSection({ prompt, updatePrompt }: BasicInfoSectionProps) {
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleNameChange = (name: string) => {
    updatePrompt({ name });
    if (!prompt.urlSlug || prompt.urlSlug === generateSlug(prompt.name)) {
      updatePrompt({ urlSlug: generateSlug(name) });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Information</h2>
        <p className="text-gray-600">Set up the fundamental details of your secret prompt</p>
      </div>

      <div className="h-px bg-gray-200" />

      {/* Prompt Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Prompt Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={prompt.name}
          onChange={(e) => handleNameChange(e.target.value)}
          maxLength={50}
          placeholder="e.g., CuddlyMonster"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-sm text-gray-500 mt-1">
          This is the internal name (not shown to users) • {prompt.name.length}/50
        </p>
      </div>

      {/* Display Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Display Title (shown to users) <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={prompt.displayTitle}
          onChange={(e) => updatePrompt({ displayTitle: e.target.value })}
          maxLength={100}
          placeholder="e.g., Cuddly Monster Creator"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-sm text-gray-500 mt-1">{prompt.displayTitle.length}/100</p>
      </div>

      {/* URL Slug */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          URL Slug <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={prompt.urlSlug}
          onChange={(e) => updatePrompt({ urlSlug: generateSlug(e.target.value) })}
          maxLength={50}
          placeholder="e.g., cuddly"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
        />
        <p className="text-sm text-gray-500 mt-1">
          Your prompt will be at: <code className="bg-gray-100 px-2 py-1 rounded">ropebridge.com/monster/{prompt.urlSlug || 'your-slug'}</code>
        </p>
      </div>

      {/* Tagline */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tagline (appears below title)
        </label>
        <textarea
          value={prompt.tagline}
          onChange={(e) => updatePrompt({ tagline: e.target.value })}
          maxLength={200}
          rows={2}
          placeholder="e.g., Create adorable, huggable monsters inspired by Pixar's Monsters Inc."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
        <p className="text-sm text-gray-500 mt-1">{prompt.tagline.length}/200</p>
      </div>
    </div>
  );
}
