import { describe, it, expect } from 'vitest';
import { MIN_PASSWORD_LENGTH, passwordStrength } from './password';

describe('passwordStrength', () => {
  it('returns null for an empty password', () => {
    expect(passwordStrength('')).toBeNull();
  });

  it('rates a short simple password as soft', () => {
    expect(passwordStrength('mochi')).toBe('soft');
  });

  it('rates a longer mixed password as chewy or better', () => {
    expect(['chewy', 'sturdy']).toContain(passwordStrength('MatchaMochi1'));
  });

  it('rates a long password with mixed case, digits and symbols as sturdy', () => {
    expect(passwordStrength('Matcha-Mochi-2026!')).toBe('sturdy');
  });

  it('exposes a minimum length of at least 8', () => {
    expect(MIN_PASSWORD_LENGTH).toBeGreaterThanOrEqual(8);
  });
});
