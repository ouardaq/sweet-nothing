import { describe, it, expect } from 'vitest';
import { isAdminRole } from './authz';

describe('isAdminRole', () => {
  it('accepts the admin role', () => {
    expect(isAdminRole('admin')).toBe(true);
  });

  it('rejects customers', () => {
    expect(isAdminRole('customer')).toBe(false);
  });

  it('rejects missing roles', () => {
    expect(isAdminRole(null)).toBe(false);
    expect(isAdminRole(undefined)).toBe(false);
  });

  it('is not fooled by case', () => {
    expect(isAdminRole('Admin')).toBe(false);
  });
});
