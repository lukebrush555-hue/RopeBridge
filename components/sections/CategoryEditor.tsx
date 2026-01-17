'use client';

import { useState } from 'react';
import { Category, Tag } from '@/types';

interface CategoryEditorProps {
  category: Category;
  onSave: (category: Category) => void;
  onCancel: () => void;
}

export default function CategoryEditor({ category: initialCategory, onSave, onCancel }: CategoryEditorProps) {
  const [category, setCategory] = useState<Category>(initialCategory);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);

  const updateCategory = (updates: Partial<Category>) => {
    setCategory(prev => ({ ...prev, ...updates }));
  };

  const addTag = () => {
    const newTag: Tag = {
      id: crypto.randomUUID(),
      label: '',
      promptInjection: '',
      order: category.tags.length,
    };
    setEditingTag(newTag);
  };

  const saveTag = () => {
    if (!editingTag || !editingTag.label.trim()) return;
    
    const tags = [...category.tags];
    const existingIndex = tags.findIndex(t => t.id === editingTag.id);
    
    if (existingIndex >= 0) {
      tags[existingIndex] = editingTag;
    } else {
      tags.push(editingTag);
    }
    
    updateCategory({ tags });
    setEditingTag(null);
  };

  const deleteTag = (id: string) => {
    const tags = category.tags.filter(t => t.id !== id);
    updateCategory({ tags });
  };

  const moveTag = (index: number, direction: 'up' | 'down') => {
    const tags = [...category.tags];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex >= 0 && newIndex < tags.length) {
      [tags[index], tags[newIndex]] = [tags[newIndex], tags[index]];
      tags.forEach((tag, i) => tag.order = i);
      updateCategory({ tags });
    }
  };

  const colorOptions: Array<{value: Category['colorCode'], label: string, class: string}> = [
    { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
    { value: 'green', label: 'Green', class: 'bg-green-500' },
    { value: 'orange', label: 'Orange', class: 'bg-orange-500' },
    { value: 'purple', label: 'Purple', class: 'bg-purple-500' },
    { value: 'red', label: 'Red', class: 'bg-red-500' },
  ];

  const isValid = category.name.trim().length > 0 && category.tags.length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {initialCategory.name ? 'Edit' : 'Create'} Category
        </h2>
        <p className="text-gray-600">Define your category and its tag options</p>
      </div>

      <div className="h-px bg-gray-200" />

      {/* Category Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={category.name}
          onChange={(e) => updateCategory({ name: e.target.value })}
          maxLength={50}
          placeholder="e.g., Texture, Color, Size"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-sm text-gray-500 mt-1">
          Shown to users: "{category.name.toUpperCase()}" • {category.name.length}/50
        </p>
      </div>

      {/* Category Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category Description (optional)
        </label>
        <input
          type="text"
          value={category.description || ''}
          onChange={(e) => updateCategory({ description: e.target.value })}
          maxLength={100}
          placeholder="e.g., How does your monster feel to the touch?"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-sm text-gray-500 mt-1">Helper text shown below category name</p>
      </div>

      {/* Color Code */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Color Code (for tag styling)
        </label>
        <div className="flex gap-3">
          {colorOptions.map(option => (
            <button
              key={option.value}
              onClick={() => updateCategory({ colorCode: option.value })}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                category.colorCode === option.value
                  ? 'ring-2 ring-offset-2 ring-blue-500'
                  : ''
              }`}
            >
              <div className={`w-8 h-8 ${option.class} rounded`} />
              <span className="text-xs mt-1 block">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Selection Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Selection Type <span className="text-red-500">*</span>
        </label>
        <div className="space-y-2">
          <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              checked={category.selectionType === 'single'}
              onChange={() => updateCategory({ selectionType: 'single' })}
              className="w-4 h-4"
            />
            <div>
              <div className="font-medium">Single-select</div>
              <div className="text-sm text-gray-600">Only one tag per category</div>
            </div>
          </label>
          <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              checked={category.selectionType === 'multi'}
              onChange={() => updateCategory({ selectionType: 'multi' })}
              className="w-4 h-4"
            />
            <div>
              <div className="font-medium">Multi-select</div>
              <div className="text-sm text-gray-600">Up to 2-3 tags per category</div>
            </div>
          </label>
        </div>
      </div>

      {/* Allow Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Allow Custom Upload?
        </label>
        <div className="space-y-2">
          <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              checked={!category.allowUpload}
              onChange={() => updateCategory({ allowUpload: false })}
              className="w-4 h-4"
            />
            <div className="font-medium">No - Tags only</div>
          </label>
          <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              checked={category.allowUpload}
              onChange={() => updateCategory({ allowUpload: true })}
              className="w-4 h-4"
            />
            <div className="font-medium">Yes - Show upload button</div>
          </label>
        </div>
      </div>

      {/* Upload Placeholder */}
      {category.allowUpload && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Placeholder Text
          </label>
          <input
            type="text"
            value={category.uploadPlaceholder || ''}
            onChange={(e) => updateCategory({ uploadPlaceholder: e.target.value })}
            maxLength={100}
            placeholder="e.g., Upload custom background image"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}

      <div className="h-px bg-gray-200" />

      {/* Tags Section */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Tags</h3>
        <p className="text-sm text-gray-600 mb-4">
          Add tags that users can select. Order matters.
        </p>

        {/* Tag Editor */}
        {editingTag && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h4 className="font-bold text-blue-900 mb-3">
              {editingTag.label ? 'Edit' : 'New'} Tag
            </h4>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tag Label <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editingTag.label}
                  onChange={(e) => setEditingTag({ ...editingTag, label: e.target.value })}
                  maxLength={30}
                  placeholder="e.g., Fluffy, Blue, Large"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prompt Injection
                </label>
                <input
                  type="text"
                  value={editingTag.promptInjection}
                  onChange={(e) => setEditingTag({ ...editingTag, promptInjection: e.target.value })}
                  maxLength={200}
                  placeholder="e.g., with soft, fluffy fur texture"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Text added to prompt when this tag is selected
                </p>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={saveTag}
                  disabled={!editingTag.label.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
                >
                  Save Tag
                </button>
                <button
                  onClick={() => setEditingTag(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tags List */}
        {category.tags.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-600 mb-3">No tags yet</p>
            <button
              onClick={addTag}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              + Add First Tag
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {category.tags
              .sort((a, b) => a.order - b.order)
              .map((tag, index) => (
                <div
                  key={tag.id}
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-white"
                >
                  <div className="flex gap-1">
                    <button
                      onClick={() => moveTag(index, 'up')}
                      disabled={index === 0}
                      className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveTag(index, 'down')}
                      disabled={index === category.tags.length - 1}
                      className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                    >
                      ↓
                    </button>
                  </div>
                  
                  <div className="flex-1">
                    <div className="font-medium">{tag.label}</div>
                    {tag.promptInjection && (
                      <div className="text-sm text-gray-600">{tag.promptInjection}</div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => setEditingTag(tag)}
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTag(tag.id)}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              ))}
          </div>
        )}

        {category.tags.length > 0 && category.tags.length < 15 && !editingTag && (
          <button
            onClick={addTag}
            className="w-full mt-3 py-2 border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 rounded-lg text-gray-600 hover:text-blue-600 font-medium"
          >
            + Add Tag
          </button>
        )}

        <p className="text-sm text-gray-600 mt-2">
          Current Tags: {category.tags.length} / 15
        </p>
      </div>

      <div className="h-px bg-gray-200" />

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => onSave(category)}
          disabled={!isValid}
          className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save Category
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
        >
          Cancel
        </button>
      </div>

      {!isValid && (
        <p className="text-sm text-red-600">
          ⚠️ Category name and at least one tag are required
        </p>
      )}
    </div>
  );
}
