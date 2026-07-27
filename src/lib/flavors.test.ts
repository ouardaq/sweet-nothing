import { describe, it, expect } from 'vitest';
import { flavorWash } from './flavors';

describe('flavorWash', () => {
  it('returns the wash for a known flavor', () => {
    expect(flavorWash('matcha')).toBe('#eef6dc');
  });

  it('falls back to the default for an unknown flavor', () => {
    expect(flavorWash('durian')).toBe('#fdeaf1');
  });

  it('falls back to the default when flavor is null', () => {
    expect(flavorWash(null)).toBe('#fdeaf1');
  });
});
