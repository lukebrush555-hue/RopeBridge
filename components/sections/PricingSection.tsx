'use client';

import { SecretPrompt } from '@/types';

interface PricingSectionProps {
  prompt: SecretPrompt;
  updatePrompt: (updates: Partial<SecretPrompt>) => void;
}

export default function PricingSection({ prompt, updatePrompt }: PricingSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Pricing & Settings</h2>
        <p className="text-gray-600">Configure pricing and prompt behavior</p>
      </div>

      <div className="h-px bg-gray-200" />

      {/* Pricing */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Base Price (preset tags only) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={prompt.pricing.base}
              onChange={(e) => updatePrompt({
                pricing: { ...prompt.pricing, base: parseFloat(e.target.value) || 0 }
              })}
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <p className="text-sm text-gray-500 mt-1">Price per generation with preset tags</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            With Upload Price
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={prompt.pricing.withUpload}
              onChange={(e) => updatePrompt({
                pricing: { ...prompt.pricing, withUpload: parseFloat(e.target.value) || 0 }
              })}
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <p className="text-sm text-gray-500 mt-1">Price when user uploads reference images</p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <h3 className="font-bold text-blue-900 mb-1">Pricing Suggestions</h3>
            <p className="text-sm text-blue-800">
              • Base: $0.50 is standard for preset-only generations<br />
              • With Upload: $0.75-$1.00 to cover additional processing<br />
              • Test pricing with real users to optimize conversion
            </p>
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-200" />

      {/* Feature Toggles */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-3">Features</h3>
        
        <div className="space-y-3">
          <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="checkbox"
              checked={prompt.settings.allowRandomizer}
              onChange={(e) => updatePrompt({
                settings: { ...prompt.settings, allowRandomizer: e.target.checked }
              })}
              className="w-5 h-5"
            />
            <div>
              <div className="font-medium">Allow "Surprise Me" randomizer</div>
              <div className="text-sm text-gray-600">
                Enable button that auto-selects random tags from each category
              </div>
            </div>
          </label>

          <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="checkbox"
              checked={prompt.settings.allowTextDescription}
              onChange={(e) => updatePrompt({
                settings: { ...prompt.settings, allowTextDescription: e.target.checked }
              })}
              className="w-5 h-5"
            />
            <div>
              <div className="font-medium">Optional text description box</div>
              <div className="text-sm text-gray-600">
                Show optional description field for users to add custom details
              </div>
            </div>
          </label>

          <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="checkbox"
              checked={prompt.settings.showOnBrowsePage}
              onChange={(e) => updatePrompt({
                settings: { ...prompt.settings, showOnBrowsePage: e.target.checked }
              })}
              className="w-5 h-5"
            />
            <div>
              <div className="font-medium">Show on browse page</div>
              <div className="text-sm text-gray-600">
                Feature this prompt on ropebridge.com/monster
              </div>
            </div>
          </label>
        </div>
      </div>

      <div className="h-px bg-gray-200" />

      {/* Status */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-3">
          Status <span className="text-red-500">*</span>
        </h3>
        
        <div className="space-y-3">
          <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              checked={prompt.settings.status === 'draft'}
              onChange={() => updatePrompt({
                settings: { ...prompt.settings, status: 'draft' }
              })}
              className="w-5 h-5 mt-0.5"
            />
            <div>
              <div className="font-medium flex items-center gap-2">
                <span>🟡</span> Draft
              </div>
              <div className="text-sm text-gray-600">
                Not visible to users, you can preview it
              </div>
            </div>
          </label>

          <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              checked={prompt.settings.status === 'published'}
              onChange={() => updatePrompt({
                settings: { ...prompt.settings, status: 'published' }
              })}
              className="w-5 h-5 mt-0.5"
            />
            <div>
              <div className="font-medium flex items-center gap-2">
                <span>🟢</span> Published
              </div>
              <div className="text-sm text-gray-600">
                Live on ropebridge.com/monster/{prompt.urlSlug || 'your-slug'}
              </div>
            </div>
          </label>

          <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              checked={prompt.settings.status === 'archived'}
              onChange={() => updatePrompt({
                settings: { ...prompt.settings, status: 'archived' }
              })}
              className="w-5 h-5 mt-0.5"
            />
            <div>
              <div className="font-medium flex items-center gap-2">
                <span>🔴</span> Archived
              </div>
              <div className="text-sm text-gray-600">
                Hidden from browse page, URL still works
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
