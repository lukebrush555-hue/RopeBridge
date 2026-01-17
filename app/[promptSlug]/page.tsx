// app/[promptSlug]/page.tsx - Dynamic End-User Prompt Pages
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function PromptPage({ params }: { params: { promptSlug: string } }) {
  const [prompt, setPrompt] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrompt();
  }, [params.promptSlug]);

  const fetchPrompt = async () => {
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('slug', params.promptSlug)
      .eq('status', 'published')
      .single();

    if (data) setPrompt(data);
    setLoading(false);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!prompt) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Prompt Not Found</h1>
          <a href="/" className="text-blue-600 hover:underline">
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-4xl font-bold mb-4">{prompt.name}</h1>
          <p className="text-xl text-gray-600 mb-8">{prompt.description}</p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Price per use</p>
                <p className="text-3xl font-bold text-blue-600">
                  ${prompt.price_per_use}
                </p>
              </div>
              <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition">
                Try Now
              </button>
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-2xl font-bold mb-4">How it works</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Click "Try Now" to get started</li>
              <li>Provide your input</li>
              <li>Get instant AI-powered results</li>
              <li>Pay only ${prompt.price_per_use} per use</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
