'use client';

import { useState, useTransition } from 'react';
import { saveProduct } from '@/app/admin/actions';
import { flavorWash } from '@/lib/flavors';
import { formatPrice } from '@/lib/format';
import { SPRITES, type SpriteSwap } from '@/lib/sprites';
import { Field } from './Field';
import { PixelButton } from './PixelButton';
import { PixelSprite } from './PixelSprite';
import { Tag } from './Tag';

const SPRITE_KEYS = Object.keys(SPRITES);
const CATEGORIES = ['mochi', 'pancake', 'pastry'] as const;
const FLAVOR_SUGGESTIONS = [
  'Strawberry',
  'Matcha',
  'Soda',
  'Lavender',
  'Red Bean',
  'Custard',
  'Chocolate',
  'Sakura',
  'Peach',
];

export type ProductFormInitial = {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  stock: number;
  category: string | null;
  flavor: string | null;
  tag: string | null;
  spriteKey: string;
  spriteSwap: unknown;
} | null;

const selectStyle = {
  fontFamily: 'var(--body)',
  fontWeight: 700,
  fontSize: 14,
  padding: '10px 12px',
  border: '3px solid var(--line)',
  borderRadius: 2,
  background: 'var(--cream)',
  color: 'var(--ink)',
  boxShadow: '3px 3px 0 0 var(--line)',
  cursor: 'pointer',
} as const;

export function ProductForm({ initial }: { initial: ProductFormInitial }) {
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [price, setPrice] = useState(
    initial ? (initial.priceCents / 100).toFixed(2) : '',
  );
  const [stock, setStock] = useState(String(initial?.stock ?? 10));
  const [category, setCategory] = useState(initial?.category ?? 'pastry');
  const [flavor, setFlavor] = useState(initial?.flavor ?? '');
  const [tag, setTag] = useState(initial?.tag ?? '');
  const [spriteKey, setSpriteKey] = useState(initial?.spriteKey ?? 'mochi');
  const [swapText, setSwapText] = useState(
    initial?.spriteSwap ? JSON.stringify(initial.spriteSwap) : '',
  );

  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [pending, startTransition] = useTransition();

  let swap: SpriteSwap | null = null;
  let swapError = '';
  if (swapText.trim()) {
    try {
      const parsed = JSON.parse(swapText);
      if (
        parsed &&
        typeof parsed === 'object' &&
        !Array.isArray(parsed) &&
        Object.entries(parsed).every(
          ([k, v]) =>
            k.length === 1 &&
            typeof v === 'string' &&
            /^#[0-9a-fA-F]{3,8}$/.test(v),
        )
      ) {
        swap = parsed as SpriteSwap;
      } else {
        swapError = 'Swap must map single characters to hex colours';
      }
    } catch {
      swapError = 'Not valid JSON';
    }
  }

  const priceCents = Math.round(parseFloat(price || '0') * 100);

  async function generateDescription() {
    setGenerating(true);
    setError('');
    try {
      const res = await fetch('/api/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          keywords: [flavor, category, 'bakery treat']
            .filter(Boolean)
            .join(', '),
        }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error ?? 'Generation failed');
      else setDescription(data.description);
    } catch {
      setError('Network error');
    } finally {
      setGenerating(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSaved(false);

    startTransition(async () => {
      const result = await saveProduct({
        id: initial?.id,
        name,
        description,
        priceCents,
        stock: parseInt(stock || '0', 10),
        category: category as (typeof CATEGORIES)[number],
        flavor,
        tag: tag as '' | 'bestseller' | 'new',
        spriteKey,
        spriteSwap: swap,
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      if (!initial) {
        window.location.href = `/admin/products/${result.id}`;
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 1900);
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-wrap items-start gap-7"
    >
      {/* left — fields */}
      <div className="flex-[1_1_420px]">
        <Field
          label="name"
          icon="🧁"
          value={name}
          onChange={setName}
          placeholder="Ube Mochi"
        />

        <div className="mb-4">
          <label
            htmlFor="pf-description"
            className="pixel-text mb-2 block text-[9px] text-ink-soft"
          >
            description
          </label>
          <textarea
            id="pf-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full rounded-[2px] border-[3px] border-line px-3.5 py-3 text-[16px] font-semibold"
            style={{
              fontFamily: 'var(--body)',
              background: 'var(--cream)',
              color: 'var(--ink)',
              boxShadow: '3px 3px 0 0 var(--line)',
              outline: 'none',
              resize: 'vertical',
            }}
          />
          <div className="mt-2">
            <PixelButton
              size="sm"
              variant="blue"
              onClick={generateDescription}
              disabled={generating || !name}
            >
              {generating ? 'Asking Gemini…' : '✨ Generate with Gemini'}
            </PixelButton>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="min-w-[120px] flex-1">
            <Field
              label="price ($)"
              icon="💰"
              value={price}
              onChange={setPrice}
              placeholder="4.50"
            />
          </div>
          <div className="min-w-[120px] flex-1">
            <Field
              label="stock"
              icon="📦"
              value={stock}
              onChange={setStock}
              placeholder="10"
            />
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-4">
          <label className="flex flex-col gap-2">
            <span className="pixel-text text-[9px] text-ink-soft">
              category
            </span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={selectStyle}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="pixel-text text-[9px] text-ink-soft">tag</span>
            <select
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              style={selectStyle}
            >
              <option value="">none</option>
              <option value="bestseller">★ TOP</option>
              <option value="new">NEW</option>
            </select>
          </label>
        </div>

        <Field
          label="flavour"
          icon="🍓"
          value={flavor}
          onChange={setFlavor}
          placeholder="Matcha"
          hint={`known washes: ${FLAVOR_SUGGESTIONS.join(', ')}`}
        />
      </div>

      {/* right — sprite picker + preview */}
      <div className="flex-[1_1_320px]">
        <span className="pixel-text mb-2 block text-[9px] text-ink-soft">
          sprite
        </span>
        <div
          className="mb-4 grid grid-cols-4 gap-2"
          role="radiogroup"
          aria-label="Sprite"
        >
          {SPRITE_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              role="radio"
              aria-checked={spriteKey === key}
              aria-label={key}
              onClick={() => setSpriteKey(key)}
              className="flex items-center justify-center rounded-[2px] border-[3px] p-2"
              style={{
                background: 'var(--cream)',
                borderColor:
                  spriteKey === key ? 'var(--primary-d)' : 'var(--line)',
                boxShadow: `2px 2px 0 0 ${spriteKey === key ? 'var(--primary-d)' : 'var(--line)'}`,
              }}
            >
              <PixelSprite name={key} size={44} />
            </button>
          ))}
        </div>

        <div className="mb-4">
          <label
            htmlFor="pf-swap"
            className="pixel-text mb-2 block text-[9px] text-ink-soft"
          >
            colour swap (advanced, JSON)
          </label>
          <input
            id="pf-swap"
            value={swapText}
            onChange={(e) => setSwapText(e.target.value)}
            placeholder='{"w":"#dff0b8","p":"#5db272"}'
            aria-invalid={swapError ? true : undefined}
            className="w-full rounded-[2px] border-[3px] px-3 py-2.5 text-[13px] font-bold"
            style={{
              fontFamily: 'var(--body)',
              background: 'var(--bg-2)',
              color: 'var(--ink)',
              borderColor: swapError ? '#e8788c' : 'var(--line)',
              outline: 'none',
            }}
          />
          {swapError && (
            <p
              className="mt-1.5 text-[12px] font-bold"
              style={{ color: '#d05a6e' }}
            >
              {swapError}
            </p>
          )}
        </div>

        <span className="pixel-text mb-2 block text-[9px] text-ink-soft">
          card preview
        </span>
        <div className="frame max-w-[240px] p-3">
          <div className="relative">
            <div
              className="flex aspect-square items-center justify-center rounded-[2px]"
              style={{ backgroundColor: flavorWash(flavor) }}
            >
              <PixelSprite
                name={spriteKey}
                size={120}
                swap={swap}
                className="bob"
              />
            </div>
            <span className="absolute top-2 right-2">
              <Tag kind={tag || null} />
            </span>
          </div>
          <div className="pixel-text mt-3 text-[11px]">
            {name || 'New treat'}
          </div>
          <div className="mt-1 text-[13px] font-semibold text-ink-soft">
            {flavor || 'treat'}
          </div>
          <div className="pixel-text mt-2 text-[11px] text-primary-d">
            {Number.isFinite(priceCents) && priceCents > 0
              ? formatPrice(priceCents)
              : '$—'}
          </div>
        </div>

        <div className="mt-6">
          {error && (
            <p
              className="mb-3 text-[13px] font-bold"
              style={{ color: '#d05a6e' }}
              role="alert"
            >
              {error}
            </p>
          )}
          <PixelButton
            type="submit"
            size="lg"
            full
            disabled={pending || !!swapError || !name}
          >
            {pending
              ? 'Saving…'
              : saved
                ? 'Saved ♡'
                : initial
                  ? 'Save changes'
                  : 'Add to the case'}
          </PixelButton>
        </div>
      </div>
    </form>
  );
}
