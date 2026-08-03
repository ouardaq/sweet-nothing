export const ADMIN_ROLE = 'admin';

export function isAdminRole(role: string | null | undefined): boolean {
  return role === ADMIN_ROLE;
}
