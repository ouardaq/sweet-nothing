'use client';

import { useTransition } from 'react';
import { updateCartItem } from '@/app/cart/actions';
import { Price } from './Price';
import { QtyStepper } from './QtyStepper';

export function CartLineControls({
  itemId,
  quantity,
  priceCents,
  stock,
}: {
  itemId: string;
  quantity: number;
  priceCents: number;
  stock: number;
}) {
  const [pending, startTransition] = useTransition();

  function setQuantity(next: number) {
    startTransition(async () => {
      await updateCartItem({ itemId, quantity: next });
    });
  }

  return (
    <div
      className="flex flex-col items-end gap-2.5"
      style={{ opacity: pending ? 0.5 : 1, transition: 'opacity .15s' }}
    >
      <QtyStepper
        value={quantity}
        onChange={setQuantity}
        max={Math.max(1, stock)}
      />
      <Price cents={priceCents * quantity} size={15} />
      <button
        type="button"
        onClick={() => setQuantity(0)}
        disabled={pending}
        className="text-[12px] font-bold"
        style={{ color: '#d05a6e' }}
      >
        ✕ remove
      </button>
    </div>
  );
}
