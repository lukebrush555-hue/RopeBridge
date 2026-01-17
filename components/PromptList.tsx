'use client';

import { useState, useEffect } from 'react';
import { SecretPrompt } from '@/types';

interface PromptListProps {
  onCreateNew: () => void;
  onEdit: (id: string) => void;
}

export default function PromptList({ onCreateNew, onEdit }: PromptListProps) {
  const [prompts, setPrompts] = useState<SecretPrompt[]>([]);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Load prompts from localStorage
    const stored = localStorage.getItem('monstermaker-prompts');
    if (stored) {
      setPrompts(JSON.parse(stored));
    }
  }, []);

  const filteredPrompts = prompts.filter(prompt => {
    const matchesFilter = filter === 'all' || prompt.settings.status === filter;
    const matchesSearch = prompt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prompt.displayTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published': return '🟢';
      case 'draft': return '🟡';
      case 'archived': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">MonsterMaker Dashboard</h1>
            <p className="text-gray-600 mt-1">Create and manage your secret prompts</p>
          </div>
          <button
            onClick={onCreateNew}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <span className="text-xl">+</span> Create New Prompt
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search prompts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            {(['all', 'published', 'draft', 'archived'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === f
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Prompts List */}
      {filteredPrompts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="text-6xl mb-4">🎨</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No prompts yet</h2>
          <p className="text-gray-600 mb-6">Create your first secret prompt to get started!</p>
          <button
            onClick={onCreateNew}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Create New Prompt
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPrompts.map((prompt) => (
            <div
              key={prompt.id}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{getStatusIcon(prompt.settings.status)}</span>
                    <h3 className="text-xl font-bold text-gray-900">{prompt.displayTitle}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(prompt.settings.status)}`}>
                      {prompt.settings.status}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                    <span>Views: <strong>{prompt.analytics.views.toLocaleString()}</strong></span>
                    <span>•</span>
                    <span>Generations: <strong>{prompt.analytics.generations.toLocaleString()}</strong></span>
                    <span>•</span>
                    <span>Conv: <strong>{prompt.analytics.conversionRate}%</strong></span>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                    <span>URL: <code className="bg-gray-100 px-2 py-1 rounded">ropebridge.com/monster/{prompt.urlSlug}</code></span>
                  </div>
                  
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span>Categories: {prompt.categories.length}</span>
                    <span>•</span>
                    <span>Example Images: {prompt.exampleImages.length}</span>
                    <span>•</span>
                    <span>Price: ${prompt.pricing.base.toFixed(2)}/gen</span>
                  </div>
                  
                  <div className="text-sm text-gray-500 mt-2">
                    Last modified: {new Date(prompt.updatedAt).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(prompt.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
