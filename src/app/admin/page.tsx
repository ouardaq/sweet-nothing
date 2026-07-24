'use client';

import { useState } from 'react';

export default function AdminPage() {
  const [name, setName] = useState('');
  const [keywords, setKeywords] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleGenerate() {
    setLoading(true);
    setError('');
    setResult('');
    try {
      const res = await fetch('/api/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, keywords }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong');
      } else {
        setResult(data.description);
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-bold">AI Description Generator</h1>
      <p className="mt-2 text-neutral-500">
        Draft a product description with Gemini.
      </p>

      <div className="mt-8 space-y-4">
        <input
          className="w-full rounded-lg border border-neutral-300 px-4 py-2"
          placeholder="Product name (e.g. Matcha Donuts)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="w-full rounded-lg border border-neutral-300 px-4 py-2"
          placeholder="Keywords (e.g. vanilla, glazed, white chocolate)"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
        />
        <button
          onClick={handleGenerate}
          disabled={loading || !name || !keywords}
          className="rounded-lg bg-rose-500 px-5 py-2 font-medium text-white transition hover:bg-rose-600 disabled:opacity-50"
        >
          {loading ? 'Generating…' : 'Generate description'}
        </button>
      </div>

      {error && <p className="mt-4 text-red-600">{error}</p>}
      {result && (
        <div className="mt-6 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
          <p className="text-neutral-800">{result}</p>
        </div>
      )}
    </main>
  );
}
