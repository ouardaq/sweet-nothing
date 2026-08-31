import { describe, it, expect } from 'vitest';
import { slugify } from './slug';

describe('slugify', () => {
  it('lowercases and hyphenates', () => {
    expect(slugify('Matcha Mochi')).toBe('matcha-mochi');
  });

  it('collapses punctuation and repeated separators', () => {
    expect(slugify("Grandma's  Best -- Dorayaki!")).toBe(
      'grandma-s-best-dorayaki',
    );
  });

  it('strips accents', () => {
    expect(slugify('Crème Brûlée Taiyaki')).toBe('creme-brulee-taiyaki');
  });

  it('trims leading and trailing hyphens', () => {
    expect(slugify('  ✨ Sakura Donut ✨ ')).toBe('sakura-donut');
  });

  it('returns an empty string for name with no usable characters', () => {
    expect(slugify('✨🍓✨')).toBe('');
  });
});
