'use client';

import { useState } from 'react';
import { SecretPrompt } from '@/types';

interface SecretPromptSectionProps {
  prompt: SecretPrompt;
  updatePrompt: (updates: Partial<SecretPrompt>) => void;
}

export default function SecretPromptSection({ prompt, updatePrompt }: SecretPromptSectionProps) {
  const [showPreview, setShowPreview] = useState(false);

  const assembleFullPrompt = () => {
    let full = prompt.baseSystemPrompt;
    
    if (prompt.categories.length > 0) {
      full += '\n\n--- USER SELECTIONS WILL BE INJECTED HERE ---\n';
      prompt.categories.forEach(cat => {
        full += `\n${cat.name}: [User's selected tags]`;
      });
    }
    
    return full;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Secret System Prompt</h2>
        <p className="text-gray-600">The hidden magic that makes your prompt unique</p>
      </div>

      <div className="h-px bg-gray-200" />

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <span className="text-2xl">ℹ️</span>
          <div>
            <h3 className="font-bold text-blue-900 mb-1">About Secret Prompts</h3>
            <p className="text-sm text-blue-800">
              This is the hidden system prompt that will be combined with user selections. 
              Users will <strong>NEVER</strong> see this text. This is your secret sauce that 
              makes your monsters unique.
            </p>
          </div>
        </div>
      </div>

      {/* Base System Prompt */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Base System Prompt <span className="text-red-500">*</span>
        </label>
        <textarea
          value={prompt.baseSystemPrompt}
          onChange={(e) => updatePrompt({ baseSystemPrompt: e.target.value })}
          maxLength={2000}
          rows={12}
          placeholder={`Create a highly detailed, adorable monster character in the style of Pixar's Monsters Inc. The monster should have:
- Soft, friendly features with oversized expressive eyes
- Rounded, huggable body proportions
- Warm, inviting color palette
- Plush toy-like texture and appearance
- Family-friendly, non-threatening design

Render in 3D CGI animation style with:
- Soft studio lighting
- Subtle subsurface scattering on fuzzy areas
- Professional animation-quality details
- Clean, uncluttered composition`}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm resize-none"
        />
        <div className="flex justify-between items-center mt-1">
          <p className={`text-sm ${
            prompt.baseSystemPrompt.length < 100 
              ? 'text-red-500 font-medium' 
              : 'text-gray-500'
          }`}>
            {prompt.baseSystemPrompt.length}/2000 characters
            {prompt.baseSystemPrompt.length < 100 && ' (minimum 100)'}
          </p>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {showPreview ? 'Hide' : 'Show'} Preview
          </button>
        </div>
      </div>

      {/* Preview */}
      {showPreview && (
        <div className="animate-slide-in">
          <h3 className="font-bold text-gray-900 mb-2">📋 Full Prompt Preview</h3>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
              {assembleFullPrompt()}
            </pre>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            This shows how the prompt will look after user selections are added
          </p>
        </div>
      )}

      {/* Tips */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="font-bold text-gray-900 mb-2">💡 Writing Tips</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Be specific about visual style, lighting, and composition</li>
          <li>• Include technical details (render style, camera angles, etc.)</li>
          <li>• Define what to avoid (e.g., "no scary features" for cute monsters)</li>
          <li>• Use consistent formatting (bullet points work well)</li>
          <li>• Test your prompt before publishing to verify quality</li>
        </ul>
      </div>
    </div>
  );
}
