import { describe, it, expect } from 'vitest';
import { pixelSurface } from './pixelStyles';

describe('pixelSurface', () => {
  it('uses the pink palette for primary', () => {
    expect(pixelSurface('primary').background).toBe('var(--primary)');
  });

  it('scales padding and font size with size', () => {
    expect(pixelSurface('primary', 'lg').fontSize).toBe(13);
    expect(pixelSurface('primary', 'sm').fontSize).toBe(9);
  });

  it('drops the hard shadow when disabled', () => {
    expect(pixelSurface('primary', 'md', true).boxShadow).toBe('none');
  });
});
