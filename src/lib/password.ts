export type Strength = 'soft' | 'chewy' | 'sturdy';

export const MIN_PASSWORD_LENGTH = 8;

/** Bakery-language strength meter. Returns null for an empty password. */
export function passwordStrength(password: string): Strength | null {
  if (!password) return null;

  let score = 0;
  if (password.length >= MIN_PASSWORD_LENGTH) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return 'soft';
  if (score <= 3) return 'chewy';
  return 'sturdy';
}
