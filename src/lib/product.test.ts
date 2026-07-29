import { describe, it, expect } from 'vitest';
import { productAttributes } from './product';

describe('productAttributes', () => {
  it('lowercases the flavour into a tag', () => {
    expect(productAttributes('Red Bean')).toContain('red bean flavor');
  });

  it('omits the flavour tag when there is no flavour', () => {
    expect(productAttributes(null)).toEqual([
      'hand-made today',
      'no preservatives',
      'serves 1',
    ]);
  });

  it('always ends with serves 1', () => {
    expect(productAttributes('Matcha').at(-1)).toBe('serves 1');
  });
});
