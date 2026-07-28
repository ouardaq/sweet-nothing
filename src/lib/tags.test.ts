import { describe, it, expect } from 'vitest';
import { tagStyle } from './tags';

describe('tagStyle', () => {
  it('maps bestseller to the ★ TOP badge', () => {
    expect(tagStyle('bestseller')?.label).toBe('★ TOP');
  });

  it('maps new to the NEW badge on mint', () => {
    expect(tagStyle('new')?.bg).toBe('var(--mint)');
  });

  it('returns null when there is no tag', () => {
    expect(tagStyle(null)).toBeNull();
  });

  it('returns null for an unrecognised tag', () => {
    expect(tagStyle('clearance')).toBeNull();
  });
});
