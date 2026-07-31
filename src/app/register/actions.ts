'use server';

import { hash } from 'bcryptjs';
import { z } from 'zod';
import { db } from '@/lib/db';
import { MIN_PASSWORD_LENGTH } from '@/lib/password';

const RegisterSchema = z.object({
  name: z.string().trim().min(1, 'Tell us your name'),
  email: z.email('That email looks a little off'),
  password: z
    .string()
    .min(MIN_PASSWORD_LENGTH, `At least ${MIN_PASSWORD_LENGTH} characters`),
});

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
}) {
  const parsed = RegisterSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0].message };
  }

  const email = parsed.data.email.toLowerCase();

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return { ok: false as const, error: 'That email is already in the club' };
  }

  await db.user.create({
    data: {
      name: parsed.data.name,
      email,
      passwordHash: await hash(parsed.data.password, 12),
    },
  });

  return { ok: true as const };
}
