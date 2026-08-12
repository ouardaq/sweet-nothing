'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { CART_COOKIE, readCart } from '@/lib/cart';
import { subtotalCents } from '@/lib/cartTotals';
import { currentUser } from '@/lib/currentUser';
import {
  orderNumberFrom,
  orderTotals,
  parseFulfilment,
} from '@/lib/orderTotals';

const PlaceOrderSchema = z.object({
  customerName: z.string().trim().min(1, 'Tell us your name'),
  email: z.email('That email looks a little off').optional().or(z.literal('')),
  fulfilment: z.enum(['pickup', 'delivery']),
  address: z.string().trim().optional().or(z.literal('')),
  timing: z.string().trim().min(1),
  promoCode: z.string().trim().optional().or(z.literal('')),
});

export type PlaceOrderInput = z.infer<typeof PlaceOrderSchema>;

export async function placeOrder(input: PlaceOrderInput) {
  const parsed = PlaceOrderSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0].message };
  }

  const data = parsed.data;

  if (data.fulfilment === 'delivery' && !data.address) {
    return { ok: false as const, error: 'Where should we bring it? 🚲' };
  }

  const cart = await readCart();
  if (!cart || cart.items.length === 0) {
    return {
      ok: false as const,
      error: 'Your basket is empty — let’s fix that',
    };
  }

  const user = await currentUser();

  try {
    const order = await db.$transaction(async (tx) => {
      // 1. Take the stock first — atomically, one conditional update per line.
      for (const item of cart.items) {
        const taken = await tx.product.updateMany({
          where: { id: item.productId, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });

        if (taken.count === 0) {
          throw new Error(`SOLD_OUT:${item.product.name}`);
        }
      }

      // 2. Price the order from the database rows, never from the client.
      const lines = cart.items.map((i) => ({
        productId: i.productId,
        name: i.product.name,
        unitPriceCents: i.product.priceCents,
        quantity: i.quantity,
      }));

      const subtotal = subtotalCents(
        lines.map((l) => ({
          quantity: l.quantity,
          priceCents: l.unitPriceCents,
        })),
      );
      const totals = orderTotals(
        subtotal,
        parseFulfilment(data.fulfilment),
        data.promoCode,
      );

      // 3. Write the snapshot.
      const created = await tx.order.create({
        data: {
          number: '',
          userId: user?.id ?? null,
          email: data.email || user?.email || null,
          customerName: data.customerName,
          fulfilment: data.fulfilment,
          address: data.fulfilment === 'delivery' ? data.address || null : null,
          timing: data.timing,
          promoCode: totals.discountCents > 0 ? 'PIXEL15' : null,
          ...totals,
          items: { create: lines },
        },
      });

      // 4. Derive the human-facing number from the id we now have.
      return tx.order.update({
        where: { id: created.id },
        data: { number: orderNumberFrom(created.id) },
      });
    });

    // The basket is spent — retire it.
    await db.cart.delete({ where: { id: cart.id } }).catch(() => {});
    (await cookies()).delete(CART_COOKIE);

    revalidatePath('/', 'layout');
    return { ok: true as const, orderNumber: order.number };
  } catch (e) {
    const message = e instanceof Error ? e.message : '';
    if (message.startsWith('SOLD_OUT:')) {
      return {
        ok: false as const,
        error: `${message.slice('SOLD_OUT:'.length)} just sold out — we’ve kept the rest of your basket`,
      };
    }
    console.error('placeOrder failed', e);
    return {
      ok: false as const,
      error: 'Something went wrong placing your order',
    };
  }
}
