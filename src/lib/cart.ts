import { cookies } from 'next/headers';
import { db } from './db';

export const CART_COOKIE = 'sn_cart';

export const CART_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 30,
  secure: process.env.NODE_ENV === 'production',
};

/** Read-only. Safe to call while rendering a Server Component. */
export async function readCart() {
  const token = (await cookies()).get(CART_COOKIE)?.value;
  if (!token) return null;

  return db.cart.findUnique({
    where: { token },
    include: {
      items: { include: { product: true }, orderBy: { createdAt: 'asc' } },
    },
  });
}

/** Writes a cookie — ONLY valid inside a Server Action or Route Handler. */
export async function getOrCreateCart() {
  const store = await cookies();
  const existing = store.get(CART_COOKIE)?.value;

  if (existing) {
    const cart = await db.cart.findUnique({ where: { token: existing } });
    if (cart) return cart;
  }

  const token = crypto.randomUUID();
  const cart = await db.cart.create({ data: { token } });
  store.set(CART_COOKIE, token, CART_COOKIE_OPTIONS);
  return cart;
}

export async function cartCount(): Promise<number> {
  const cart = await readCart();
  return cart?.items.reduce((n, i) => n + i.quantity, 0) ?? 0;
}
