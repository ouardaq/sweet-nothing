import { describe, it, expect } from 'vitest';
import { formatPrice } from './format';

describe('formatPrice', () => {
  it('formats whole-dollar cents as USD', () => {
    expect(formatPrice(2400)).toBe('$24.00');
  });

  it('formats zero', () => {
    expect(formatPrice(0)).toBe('$0.00');
  });

  it('formats non-round cents without float errors', () => {
    expect(formatPrice(1999)).toBe('$19.99');
  });
});
