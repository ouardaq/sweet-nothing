'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { Prisma } from '@/generated/prisma/client';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/currentUser';
import { slugify } from '@/lib/slug';
import { SPRITES } from '@/lib/sprites';

const SaveProductSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(1, 'Every treat needs a name'),
  description: z.string().trim().min(1, 'Give it a little description'),
  priceCents: z.number().int().min(1, 'Price must be at least 1¢'),
  stock: z.number().int().min(0),
  category: z.enum(['mochi', 'pancake', 'pastry']),
  flavor: z.string().trim().max(40).optional().or(z.literal('')),
  tag: z.enum(['', 'bestseller', 'new']),
  spriteKey: z.string().refine((k) => k in SPRITES, 'Unknown sprite'),
  spriteSwap: z
    .record(z.string().length(1), z.string().regex(/^#[0-9a-fA-F]{3,8}$/))
    .nullable(),
});

export type SaveProductInput = z.infer<typeof SaveProductSchema>;

async function uniqueSlug(name: string): Promise<string> {
  const base = slugify(name) || 'treat';
  let candidate = base;
  for (let n = 2; ; n++) {
    const existing = await db.product.findUnique({
      where: { slug: candidate },
    });
    if (!existing) return candidate;
    candidate = `${base}-${n}`;
  }
}

export async function saveProduct(input: SaveProductInput) {
  const admin = await requireAdmin();
  if (!admin) return { ok: false as const, error: 'Not authorised' };

  const parsed = SaveProductSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0].message };
  }

  const d = parsed.data;
  const data = {
    name: d.name,
    description: d.description,
    priceCents: d.priceCents,
    stock: d.stock,
    category: d.category,
    flavor: d.flavor || null,
    tag: d.tag || null,
    spriteKey: d.spriteKey,
    spriteSwap: d.spriteSwap ?? Prisma.DbNull,
  };

  let id = d.id;
  if (id) {
    const existing = await db.product.findUnique({ where: { id } });
    if (!existing)
      return { ok: false as const, error: 'That treat no longer exists' };
    await db.product.update({ where: { id }, data });
  } else {
    const created = await db.product.create({
      data: { ...data, slug: await uniqueSlug(d.name) },
    });
    id = created.id;
  }

  revalidatePath('/', 'layout');
  return { ok: true as const, id };
}

export async function setProductAvailability(input: {
  id: string;
  discontinued: boolean;
}) {
  const admin = await requireAdmin();
  if (!admin) return { ok: false as const, error: 'Not authorised' };

  const parsed = z
    .object({ id: z.string().min(1), discontinued: z.boolean() })
    .safeParse(input);
  if (!parsed.success)
    return { ok: false as const, error: 'Something went wrong' };

  await db.product.update({
    where: { id: parsed.data.id },
    data: { discontinuedAt: parsed.data.discontinued ? new Date() : null },
  });

  revalidatePath('/', 'layout');
  return { ok: true as const };
}
