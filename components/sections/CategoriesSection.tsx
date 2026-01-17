'use client';

import { useState } from 'react';
import { SecretPrompt, Category, Tag } from '@/types';
import CategoryEditor from './CategoryEditor';

interface CategoriesSectionProps {
  prompt: SecretPrompt;
  updatePrompt: (updates: Partial<SecretPrompt>) => void;
}

export default function CategoriesSection({ prompt, updatePrompt }: CategoriesSectionProps) {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  const addCategory = () => {
    const newCategory: Category = {
      id: crypto.randomUUID(),
      name: '',
      description: '',
      colorCode: 'blue',
      selectionType: 'single',
      allowUpload: false,
      order: prompt.categories.length,
      tags: [],
    };
    setEditingCategory(newCategory);
    setShowEditor(true);
  };

  const editCategory = (category: Category) => {
    setEditingCategory(category);
    setShowEditor(true);
  };

  const saveCategory = (category: Category) => {
    const categories = [...prompt.categories];
    const existingIndex = categories.findIndex(c => c.id === category.id);
    
    if (existingIndex >= 0) {
      categories[existingIndex] = category;
    } else {
      categories.push(category);
    }
    
    updatePrompt({ categories });
    setShowEditor(false);
    setEditingCategory(null);
  };

  const deleteCategory = (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      const categories = prompt.categories.filter(c => c.id !== id);
      updatePrompt({ categories });
    }
  };

  const moveCategory = (index: number, direction: 'up' | 'down') => {
    const categories = [...prompt.categories];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex >= 0 && newIndex < categories.length) {
      [categories[index], categories[newIndex]] = [categories[newIndex], categories[index]];
      categories.forEach((cat, i) => cat.order = i);
      updatePrompt({ categories });
    }
  };

  const getColorClass = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      green: 'bg-green-100 text-green-800 border-green-200',
      orange: 'bg-orange-100 text-orange-800 border-orange-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
      red: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  if (showEditor && editingCategory) {
    return (
      <CategoryEditor
        category={editingCategory}
        onSave={saveCategory}
        onCancel={() => {
          setShowEditor(false);
          setEditingCategory(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Categories & Tags</h2>
        <p className="text-gray-600">Define the categories users will select from</p>
      </div>

      <div className="h-px bg-gray-200" />

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <span className="text-2xl">📚</span>
          <div>
            <h3 className="font-bold text-blue-900 mb-1">How Categories Work</h3>
            <p className="text-sm text-blue-800">
              Add categories that users will select from. Each category has multiple tag options. 
              Order matters (top = shown first). Aim for 5-8 categories with 4-10 tags each.
            </p>
          </div>
        </div>
      </div>

      {/* Categories List */}
      {prompt.categories.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
          <div className="text-4xl mb-3">🏷️</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No categories yet</h3>
          <p className="text-gray-600 mb-4">Add your first category to get started</p>
          <button
            onClick={addCategory}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            + Add First Category
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {prompt.categories
            .sort((a, b) => a.order - b.order)
            .map((category, index) => (
              <div
                key={category.id}
                className={`border-2 rounded-lg p-4 ${getColorClass(category.colorCode)}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-lg">
                        Category {index + 1}: {category.name || 'Untitled'}
                      </h3>
                      <span className="text-xs px-2 py-1 bg-white rounded font-medium">
                        {category.selectionType}
                      </span>
                      {category.allowUpload && (
                        <span className="text-xs px-2 py-1 bg-white rounded font-medium">
                          📁 Upload
                        </span>
                      )}
                    </div>
                    {category.description && (
                      <p className="text-sm opacity-80">{category.description}</p>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => moveCategory(index, 'up')}
                      disabled={index === 0}
                      className="p-2 hover:bg-white/50 rounded disabled:opacity-30 transition-colors"
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveCategory(index, 'down')}
                      disabled={index === prompt.categories.length - 1}
                      className="p-2 hover:bg-white/50 rounded disabled:opacity-30 transition-colors"
                      title="Move down"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => editCategory(category)}
                      className="px-3 py-1 bg-white hover:bg-gray-50 rounded font-medium transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCategory(category.id)}
                      className="px-3 py-1 bg-red-500 text-white hover:bg-red-600 rounded font-medium transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {category.tags.length === 0 ? (
                    <span className="text-sm opacity-70">No tags yet</span>
                  ) : (
                    category.tags.map(tag => (
                      <span
                        key={tag.id}
                        className="px-3 py-1 bg-white rounded font-medium text-sm"
                      >
                        {tag.label}
                      </span>
                    ))
                  )}
                </div>

                <div className="text-sm mt-2 opacity-70">
                  {category.tags.length} tag{category.tags.length !== 1 ? 's' : ''}
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Add Category Button */}
      {prompt.categories.length > 0 && prompt.categories.length < 10 && (
        <button
          onClick={addCategory}
          className="w-full py-3 border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 rounded-lg text-gray-600 hover:text-blue-600 font-medium transition-colors"
        >
          + Add Category
        </button>
      )}

      {prompt.categories.length >= 10 && (
        <p className="text-sm text-gray-500 text-center">
          Maximum of 10 categories reached
        </p>
      )}

      <div className="text-sm text-gray-600">
        Current Categories: {prompt.categories.length} / 10
      </div>
    </div>
  );
}
