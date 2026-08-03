import { auth } from '@/auth';
import { db } from './db';
import { isAdminRole } from './authz';

export async function currentUser() {
  const session = await auth();
  if (!session?.user?.email) return null;

  return db.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, name: true, email: true, role: true },
  });
}

export async function requireAdmin() {
  const user = await currentUser();
  return user && isAdminRole(user.role) ? user : null;
}
