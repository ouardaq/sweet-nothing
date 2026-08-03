'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { db } from '@/lib/db';
import { getOrCreateCart, readCart } from '@/lib/cart';

import { cookies } from 'next/headers';
import { auth } from '@/auth';
import { CART_COOKIE, CART_COOKIE_OPTIONS } from '@/lib/cart';
import { mergedQuantity } from '@/lib/cartTotals';

const AddSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(99),
});

export async function addToCart(input: {
  productId: string;
  quantity: number;
}) {
  const parsed = AddSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: 'Something went wrong' };
  }

  const { productId, quantity } = parsed.data;

  const product = await db.product.findUnique({ where: { id: productId } });
  if (!product) return { ok: false as const, error: 'That treat is gone' };
  if (product.stock < 1)
    return { ok: false as const, error: 'Sold out for today' };

  const cart = await getOrCreateCart();
  const key = { cartId_productId: { cartId: cart.id, productId } };

  const existing = await db.cartItem.findUnique({ where: key });
  const nextQuantity = Math.min(
    (existing?.quantity ?? 0) + quantity,
    product.stock,
  );

  await db.cartItem.upsert({
    where: key,
    create: { cartId: cart.id, productId, quantity: nextQuantity },
    update: { quantity: nextQuantity },
  });

  revalidatePath('/', 'layout');
  return { ok: true as const, name: product.name };
}

const UpdateSchema = z.object({
  itemId: z.string().min(1),
  quantity: z.number().int().min(0).max(99),
});

export async function updateCartItem(input: {
  itemId: string;
  quantity: number;
}) {
  const parsed = UpdateSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: 'Something went wrong' };
  }

  const { itemId, quantity } = parsed.data;

  // Only ever touch items that belong to THIS session's cart.
  const cart = await readCart();
  if (!cart) return { ok: false as const, error: 'Your basket expired' };

  const item = cart.items.find((i) => i.id === itemId);
  if (!item)
    return {
      ok: false as const,
      error: 'That treat is no longer in your basket',
    };

  if (quantity === 0) {
    await db.cartItem.delete({ where: { id: itemId } });
  } else {
    await db.cartItem.update({
      where: { id: itemId },
      data: { quantity: Math.min(quantity, item.product.stock) },
    });
  }

  revalidatePath('/', 'layout');
  revalidatePath('/cart');
  return { ok: true as const };
}

/**
 * Called right after a successful sign-in.
 * Merges a guest basket onto the account when there is one, and - either way -
 * points the cart cookie at the account's cart so a returning user gets their
 * basket back.
 */
export async function mergeGuestCart() {
  const session = await auth();
  if (!session?.user?.email) return 'no-session';

  const user = await db.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });
  if (!user) return 'no-user';

  const cookieCart = await readCart();

  // Only an unowned cart may be absorbed. A cookie pointing at someone
  // else's cart is discarded rather than handed over.
  const guestCart = cookieCart && !cookieCart.userId ? cookieCart : null;

  const userCart = await db.cart.findFirst({ where: { userId: user.id } });

  // No account cart yet - claim the guest one if there is one.
  if (!userCart) {
    if (!guestCart) {
      if (cookieCart) (await cookies()).delete(CART_COOKIE);
      revalidatePath('/', 'layout');
      return 'nothing-to-restore';
    }

    await db.cart.update({
      where: { id: guestCart.id },
      data: { userId: user.id },
    });
    revalidatePath('/', 'layout');
    return 'claimed';
  }

  // Fold any guest lines into the account cart.
  if (guestCart && guestCart.id !== userCart.id) {
    const userItems = await db.cartItem.findMany({
      where: { cartId: userCart.id },
    });

    await db.$transaction(async (tx) => {
      for (const item of guestCart.items) {
        const existing = userItems.find((i) => i.productId === item.productId);
        const quantity = mergedQuantity(
          existing?.quantity ?? 0,
          item.quantity,
          item.product.stock,
        );

        await tx.cartItem.upsert({
          where: {
            cartId_productId: {
              cartId: userCart.id,
              productId: item.productId,
            },
          },
          create: { cartId: userCart.id, productId: item.productId, quantity },
          update: { quantity },
        });
      }

      await tx.cart.delete({ where: { id: guestCart.id } });
    });
  }

  // Always end up on the account cart - this is what restores a returning basket.
  (await cookies()).set(CART_COOKIE, userCart.token, CART_COOKIE_OPTIONS);
  revalidatePath('/', 'layout');
  return guestCart ? 'merged' : 'restored';
}

/** Called on logout so the next person on this browser doesn't inherit the basket. */
export async function forgetCart() {
  (await cookies()).delete(CART_COOKIE);
  revalidatePath('/', 'layout');
}
