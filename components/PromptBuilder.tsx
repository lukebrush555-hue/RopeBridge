'use client';

import { useState, useEffect } from 'react';
import { SecretPrompt, Category, ExampleImage } from '@/types';
import BasicInfoSection from './sections/BasicInfoSection';
import SecretPromptSection from './sections/SecretPromptSection';
import CategoriesSection from './sections/CategoriesSection';
import ExampleImagesSection from './sections/ExampleImagesSection';
import PricingSection from './sections/PricingSection';
import MarketingSection from './sections/MarketingSection';

interface PromptBuilderProps {
  promptId: string | null;
  onBack: () => void;
}

const createEmptyPrompt = (): SecretPrompt => ({
  id: crypto.randomUUID(),
  name: '',
  displayTitle: '',
  urlSlug: '',
  tagline: '',
  baseSystemPrompt: '',
  categories: [],
  exampleImages: [],
  pricing: {
    base: 0.50,
    withUpload: 0.75,
  },
  settings: {
    allowRandomizer: true,
    allowTextDescription: true,
    status: 'draft',
    showOnBrowsePage: true,
  },
  marketing: {
    tiktok: '',
    instagram: '',
    linktreeUrl: '',
    metaDescription: '',
  },
  analytics: {
    views: 0,
    generations: 0,
    revenue: 0,
    conversionRate: 0,
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export default function PromptBuilder({ promptId, onBack }: PromptBuilderProps) {
  const [prompt, setPrompt] = useState<SecretPrompt>(createEmptyPrompt());
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    if (promptId) {
      // Load existing prompt
      const stored = localStorage.getItem('monstermaker-prompts');
      if (stored) {
        const prompts: SecretPrompt[] = JSON.parse(stored);
        const existing = prompts.find(p => p.id === promptId);
        if (existing) {
          setPrompt(existing);
        }
      }
    }
  }, [promptId]);

  const updatePrompt = (updates: Partial<SecretPrompt>) => {
    setPrompt(prev => ({
      ...prev,
      ...updates,
      updatedAt: new Date().toISOString(),
    }));
  };

  const savePrompt = (status?: 'draft' | 'published') => {
    setIsSaving(true);
    
    // Update status if provided
    const updatedPrompt = status 
      ? { ...prompt, settings: { ...prompt.settings, status } }
      : prompt;

    // Save to localStorage
    const stored = localStorage.getItem('monstermaker-prompts');
    const prompts: SecretPrompt[] = stored ? JSON.parse(stored) : [];
    
    const existingIndex = prompts.findIndex(p => p.id === updatedPrompt.id);
    if (existingIndex >= 0) {
      prompts[existingIndex] = updatedPrompt;
    } else {
      prompts.push(updatedPrompt);
    }
    
    localStorage.setItem('monstermaker-prompts', JSON.stringify(prompts));
    
    setTimeout(() => {
      setIsSaving(false);
      if (status === 'published') {
        alert('Prompt published successfully!');
      } else {
        alert('Draft saved successfully!');
      }
    }, 500);
  };

  const sections = [
    { id: 0, title: 'Basic Information', icon: '📝' },
    { id: 1, title: 'Secret Prompt', icon: '🔒' },
    { id: 2, title: 'Categories & Tags', icon: '🏷️' },
    { id: 3, title: 'Example Images', icon: '🖼️' },
    { id: 4, title: 'Pricing & Settings', icon: '💰' },
    { id: 5, title: 'Marketing & Social', icon: '📱' },
  ];

  const isValid = () => {
    return (
      prompt.name.length > 0 &&
      prompt.displayTitle.length > 0 &&
      prompt.urlSlug.length > 0 &&
      prompt.baseSystemPrompt.length >= 100 &&
      prompt.categories.length >= 3 &&
      prompt.exampleImages.length >= 3
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
              >
                <span>←</span> Back to Prompts
              </button>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-xl font-bold text-gray-900">
                {promptId ? 'Edit' : 'Create New'} Secret Prompt
              </h1>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => savePrompt('draft')}
                disabled={isSaving}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Draft'}
              </button>
              <button
                onClick={() => savePrompt('published')}
                disabled={isSaving || !isValid()}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <span>🟢</span> Publish
              </button>
            </div>
          </div>
          
          {/* Section Navigation */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-colors ${
                  activeSection === section.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="mr-2">{section.icon}</span>
                {section.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          {activeSection === 0 && (
            <BasicInfoSection prompt={prompt} updatePrompt={updatePrompt} />
          )}
          {activeSection === 1 && (
            <SecretPromptSection prompt={prompt} updatePrompt={updatePrompt} />
          )}
          {activeSection === 2 && (
            <CategoriesSection prompt={prompt} updatePrompt={updatePrompt} />
          )}
          {activeSection === 3 && (
            <ExampleImagesSection prompt={prompt} updatePrompt={updatePrompt} />
          )}
          {activeSection === 4 && (
            <PricingSection prompt={prompt} updatePrompt={updatePrompt} />
          )}
          {activeSection === 5 && (
            <MarketingSection prompt={prompt} updatePrompt={updatePrompt} />
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
            disabled={activeSection === 0}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>
          <button
            onClick={() => setActiveSection(Math.min(5, activeSection + 1))}
            disabled={activeSection === 5}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>

        {/* Validation Warnings */}
        {!isValid() && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-bold text-yellow-800 mb-2">⚠️ Required to Publish:</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              {prompt.name.length === 0 && <li>• Prompt name is required</li>}
              {prompt.displayTitle.length === 0 && <li>• Display title is required</li>}
              {prompt.urlSlug.length === 0 && <li>• URL slug is required</li>}
              {prompt.baseSystemPrompt.length < 100 && <li>• Base system prompt must be at least 100 characters</li>}
              {prompt.categories.length < 3 && <li>• At least 3 categories required</li>}
              {prompt.exampleImages.length < 3 && <li>• At least 3 example images required</li>}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
