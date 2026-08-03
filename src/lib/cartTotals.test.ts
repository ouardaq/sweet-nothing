import { describe, it, expect } from 'vitest';
import { itemCount, subtotalCents } from './cartTotals';

import { mergedQuantity } from './cartTotals';

describe('mergedQuantity', () => {
  it('sums both quantities when stock allows', () => {
    expect(mergedQuantity(2, 3, 10)).toBe(5);
  });

  it('clamps to available stock', () => {
    expect(mergedQuantity(4, 5, 6)).toBe(6);
  });

  it('handles a line that does not exist yet', () => {
    expect(mergedQuantity(0, 2, 10)).toBe(2);
  });

  it('returns zero when nothing is in stock', () => {
    expect(mergedQuantity(2, 2, 0)).toBe(0);
  });
});

describe('subtotalCents', () => {
  it('is zero for an empty cart', () => {
    expect(subtotalCents([])).toBe(0);
  });

  it('multiplies quantity by price', () => {
    expect(subtotalCents([{ quantity: 3, priceCents: 450 }])).toBe(1350);
  });

  it('sums multiple lines', () => {
    expect(
      subtotalCents([
        { quantity: 2, priceCents: 400 },
        { quantity: 1, priceCents: 325 },
      ]),
    ).toBe(1125);
  });
});

describe('itemCount', () => {
  it('counts quantities, not lines', () => {
    expect(itemCount([{ quantity: 2 }, { quantity: 3 }])).toBe(5);
  });

  it('is zero for an empty cart', () => {
    expect(itemCount([])).toBe(0);
  });
});
