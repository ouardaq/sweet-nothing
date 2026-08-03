'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { mergeGuestCart } from '@/app/cart/actions';
import { Field } from './Field';
import { PixelButton } from './PixelButton';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('That email and password do not match');
        return;
      }

      // Best effort: a basket merge must never block signing in.
      try {
        await mergeGuestCart();
      } catch (mergeError) {
        console.error('cart merge failed', mergeError);
      }

      window.location.href = '/';
    } catch (err) {
      console.error('login failed', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
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
        autoComplete="current-password"
        error={error}
      />
      <PixelButton
        type="submit"
        size="lg"
        full
        disabled={loading || !email || !password}
      >
        {loading ? 'Checking…' : 'Log in ♡'}
      </PixelButton>
    </form>
  );
}
