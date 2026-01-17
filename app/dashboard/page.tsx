// app/dashboard/page.tsx - Creator Dashboard
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function Dashboard() {
  const [prompts, setPrompts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setPrompts(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Creator Dashboard</h1>
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold">
            + New Prompt
          </button>
        </div>

        {loading ? (
          <p>Loading your prompts...</p>
        ) : prompts.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-gray-600 mb-4">
              No prompts yet
            </h2>
            <p className="text-gray-500">Create your first prompt to get started!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prompts.map((prompt) => (
              <div key={prompt.id} className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-bold mb-2">{prompt.name}</h3>
                <p className="text-gray-600 mb-4">{prompt.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-green-600 font-semibold">
                    ${prompt.price_per_use}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    prompt.status === 'published' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {prompt.status}
                  </span>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    {prompt.total_uses} uses · ${prompt.total_revenue} revenue
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
