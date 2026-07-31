import { describe, it, expect } from 'vitest';
import { itemCount, subtotalCents } from './cartTotals';

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
