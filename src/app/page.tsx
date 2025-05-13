'use client';

import { useState } from 'react';

export default function Home() {
  const [topic, setTopic] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setAnswer('');

    const res = await fetch('/api/learn', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic }),
    });

    const data = await res.json();
    setAnswer(data.answer);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700">
            Learn80/20
          </h1>
          <p className="text-gray-600 text-lg md:text-xl">
            Discover the 20% of effort that gives 80% of results.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center">
          <input
            type="text"
            placeholder="e.g., JavaScript, German, Fitness"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition w-full max-w-md"
          >
            {loading ? 'Analyzing...' : 'Get My 80/20 Breakdown'}
          </button>
        </form>

        {loading && (
          <p className="text-sm text-blue-600 animate-pulse mt-4">
            Generating focused insights...
          </p>
        )}

        {answer && (
          <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl text-left shadow-sm text-gray-800 whitespace-pre-wrap text-sm leading-relaxed max-h-[400px] overflow-auto transition-all">
            <h2 className="font-semibold text-lg text-blue-700 mb-2">💡 Insights:</h2>
            {answer}
          </div>
        )}
      </div>
    </main>
  );
}
