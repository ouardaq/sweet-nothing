'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

export function LogoutButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      className="nav-link"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await signOut({ redirect: false });
          router.push('/');
          router.refresh();
        })
      }
    >
      Log out
    </button>
  );
}
