'use client';

import { SecretPrompt } from '@/types';

interface MarketingSectionProps {
  prompt: SecretPrompt;
  updatePrompt: (updates: Partial<SecretPrompt>) => void;
}

export default function MarketingSection({ prompt, updatePrompt }: MarketingSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Marketing & Social</h2>
        <p className="text-gray-600">Connect your social media accounts and optimize for SEO</p>
      </div>

      <div className="h-px bg-gray-200" />

      {/* Social Media Links */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-3">Social Media Accounts</h3>
        <p className="text-sm text-gray-600 mb-4">
          Link your social accounts to drive traffic to this prompt
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              TikTok Account (optional)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">@</span>
              <input
                type="text"
                value={prompt.marketing.tiktok || ''}
                onChange={(e) => updatePrompt({
                  marketing: { ...prompt.marketing, tiktok: e.target.value }
                })}
                placeholder="cuddlymonsters"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Your TikTok username (without @)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instagram Account (optional)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">@</span>
              <input
                type="text"
                value={prompt.marketing.instagram || ''}
                onChange={(e) => updatePrompt({
                  marketing: { ...prompt.marketing, instagram: e.target.value }
                })}
                placeholder="cuddlymonsters_ai"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Your Instagram username (without @)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Linktree URL (optional)
            </label>
            <input
              type="url"
              value={prompt.marketing.linktreeUrl || ''}
              onChange={(e) => updatePrompt({
                marketing: { ...prompt.marketing, linktreeUrl: e.target.value }
              })}
              placeholder="https://linktr.ee/cuddlymonsters"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">
              Full URL to your Linktree or link page
            </p>
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-200" />

      {/* SEO */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-3">SEO & Discovery</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meta Description (for search engines)
          </label>
          <textarea
            value={prompt.marketing.metaDescription}
            onChange={(e) => updatePrompt({
              marketing: { ...prompt.marketing, metaDescription: e.target.value }
            })}
            maxLength={160}
            rows={3}
            placeholder="Create adorable Pixar-style cuddly monsters perfect for children's books, plush toy designs, and family content."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <div className="flex justify-between items-center mt-1">
            <p className={`text-sm ${
              prompt.marketing.metaDescription.length > 160 
                ? 'text-red-500 font-medium' 
                : 'text-gray-500'
            }`}>
              {prompt.marketing.metaDescription.length}/160 characters
            </p>
            <div className="text-sm text-gray-500">
              {prompt.marketing.metaDescription.length < 120 && '✓ Good length'}
              {prompt.marketing.metaDescription.length >= 120 && prompt.marketing.metaDescription.length <= 160 && '✓ Optimal'}
              {prompt.marketing.metaDescription.length > 160 && '⚠️ Too long'}
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            This appears in Google search results. Make it compelling!
          </p>
        </div>
      </div>

      {/* Marketing Tips */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
        <div className="flex gap-3">
          <span className="text-2xl">📱</span>
          <div>
            <h3 className="font-bold text-purple-900 mb-2">Marketing Funnel Strategy</h3>
            <div className="text-sm text-purple-800 space-y-2">
              <p><strong>1. Post daily on TikTok/Instagram</strong></p>
              <p className="ml-4">→ Show amazing monsters generated by your prompt</p>
              
              <p><strong>2. Link to Linktree in bio</strong></p>
              <p className="ml-4">→ Linktree points to: ropebridge.com/monster/{prompt.urlSlug || 'your-slug'}</p>
              
              <p><strong>3. Users see your example gallery</strong></p>
              <p className="ml-4">→ Gallery proves quality before they pay</p>
              
              <p><strong>4. Tag interface makes it easy</strong></p>
              <p className="ml-4">→ No blank page paralysis, just clicks</p>
              
              <p><strong>5. $0.50 impulse purchase</strong></p>
              <p className="ml-4">→ Low friction = high conversion</p>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="font-bold text-gray-900 mb-3">🔍 Search Engine Preview</h3>
        <div className="space-y-1">
          <div className="text-blue-600 text-lg">
            {prompt.displayTitle || 'Your Prompt Title'}
          </div>
          <div className="text-green-700 text-sm">
            ropebridge.com/monster/{prompt.urlSlug || 'your-slug'}
          </div>
          <div className="text-gray-700 text-sm">
            {prompt.marketing.metaDescription || 'Your meta description will appear here...'}
          </div>
        </div>
      </div>
    </div>
  );
}
