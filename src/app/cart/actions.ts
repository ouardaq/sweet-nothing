'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { db } from '@/lib/db';
import { getOrCreateCart, readCart } from '@/lib/cart';

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
