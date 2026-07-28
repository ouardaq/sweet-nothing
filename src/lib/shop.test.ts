import { describe, it, expect } from 'vitest';
import { parseCategory, parseSort, shopHref, sortToOrderBy } from './shop';

describe('parseCategory', () => {
  it('accepts a known category', () => {
    expect(parseCategory('mochi')).toBe('mochi');
  });

  it('falls back to all for unknown input', () => {
    expect(parseCategory('sushi')).toBe('all');
  });

  it('falls back to all when missing', () => {
    expect(parseCategory(undefined)).toBe('all');
  });

  it('takes the first value when repeated', () => {
    expect(parseCategory(['pastry', 'mochi'])).toBe('pastry');
  });
});

describe('parseSort', () => {
  it('accepts a known sort', () => {
    expect(parseSort('low')).toBe('low');
  });

  it('falls back to featured', () => {
    expect(parseSort('cheapest')).toBe('featured');
  });
});

describe('sortToOrderBy', () => {
  it('sorts price ascending for low', () => {
    expect(sortToOrderBy('low')).toEqual({ priceCents: 'asc' });
  });

  it('sorts by name for az', () => {
    expect(sortToOrderBy('az')).toEqual({ name: 'asc' });
  });

  it('defaults to newest first', () => {
    expect(sortToOrderBy('featured')).toEqual({ createdAt: 'desc' });
  });
});

describe('shopHref', () => {
  it('omits defaults', () => {
    expect(shopHref('all', 'featured')).toBe('/shop');
  });

  it('includes only non-default params', () => {
    expect(shopHref('mochi', 'featured')).toBe('/shop?category=mochi');
    expect(shopHref('all', 'high')).toBe('/shop?sort=high');
  });

  it('includes both when both are set', () => {
    expect(shopHref('pastry', 'az')).toBe('/shop?category=pastry&sort=az');
  });
});
