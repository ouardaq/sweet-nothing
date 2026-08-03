'use client';

import { useState } from 'react';
import { Field } from '@/components/Field';
import { PixelButton } from '@/components/PixelButton';

export function AdminForm() {
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
    <div className="mt-8">
      <Field
        label="product name"
        icon="🧁"
        value={name}
        onChange={setName}
        placeholder="Matcha Donuts"
      />
      <Field
        label="keywords"
        icon="🍓"
        value={keywords}
        onChange={setKeywords}
        placeholder="vanilla, glazed, white chocolate"
        error={error}
      />

      <PixelButton
        size="lg"
        full
        onClick={handleGenerate}
        disabled={loading || !name || !keywords}
      >
        {loading ? 'Generating…' : 'Generate description'}
      </PixelButton>

      {result && (
        <div className="frame-soft mt-6" style={{ padding: 18 }}>
          <p className="text-[16px] leading-[1.7] font-semibold">{result}</p>
        </div>
      )}
    </div>
  );
}
