'use client';

import { useTransition } from 'react';
import { setProductAvailability } from '@/app/admin/actions';
import { PixelButton } from './PixelButton';

export function AvailabilityToggle({
  id,
  discontinued,
}: {
  id: string;
  discontinued: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <PixelButton
      size="sm"
      variant={discontinued ? 'blue' : 'ghost'}
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await setProductAvailability({ id, discontinued: !discontinued });
        })
      }
    >
      {pending ? '…' : discontinued ? 'Revive' : 'Discontinue'}
    </PixelButton>
  );
}
