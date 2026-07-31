'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { registerUser } from '@/app/register/actions';

import { passwordStrength } from '@/lib/password';
import { Field } from './Field';
import { PixelButton } from './PixelButton';

const STRENGTH_HINT = {
  soft: 'soft — add a few more characters',
  chewy: 'chewy — not bad!',
  sturdy: 'sturdy — lovely',
} as const;

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [pending, startTransition] = useTransition();

  const strength = passwordStrength(password);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    startTransition(async () => {
      const created = await registerUser({ name, email, password });
      if (!created.ok) {
        setError(created.error);
        return;
      }

      await signIn('credentials', { email, password, redirect: false });
      router.push('/');
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Field
        label="your name"
        icon="🍓"
        value={name}
        onChange={setName}
        placeholder="Ouarda"
        autoComplete="name"
      />
      <Field
        label="email"
        type="email"
        icon="✉️"
        value={email}
        onChange={setEmail}
        placeholder="you@example.com"
        autoComplete="email"
      />
      <Field
        label="password"
        type="password"
        icon="🔒"
        value={password}
        onChange={setPassword}
        placeholder="••••••••"
        autoComplete="new-password"
        hint={strength ? STRENGTH_HINT[strength] : 'at least 8 characters'}
        error={error}
      />
      <PixelButton
        type="submit"
        variant="blue"
        size="lg"
        full
        disabled={pending || !name || !email || !password}
      >
        {pending ? 'Joining…' : 'Create account ♡'}
      </PixelButton>
    </form>
  );
}
