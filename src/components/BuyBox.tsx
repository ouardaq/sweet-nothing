'use client';

import { useState, useTransition } from 'react';
import { addToCart } from '@/app/cart/actions';
import { formatPrice } from '@/lib/format';
import { Price } from './Price';
import { PixelButton } from './PixelButton';
import { QtyStepper } from './QtyStepper';
import { Toast } from './Toast';

export function BuyBox({
  productId,
  priceCents,
  stock,
}: {
  productId: string;
  priceCents: number;
  stock: number;
}) {
  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState('');
  const [pending, startTransition] = useTransition();
  const soldOut = stock <= 0;

  function handleAdd() {
    startTransition(async () => {
      const result = await addToCart({ productId, quantity: qty });
      setMessage(result.ok ? `Added ${qty} × ${result.name}` : result.error);
      setTimeout(() => setMessage(''), 1900);
    });
  }

  return (
    <div className="frame-soft" style={{ padding: 18 }}>
      <div className="mb-4 flex items-center justify-between">
        <Price cents={priceCents} size={26} />
        <QtyStepper value={qty} onChange={setQty} max={Math.max(1, stock)} />
      </div>

      <PixelButton
        size="lg"
        full
        disabled={soldOut || pending}
        onClick={handleAdd}
      >
        {soldOut
          ? 'Sold out for today'
          : pending
            ? 'Adding…'
            : `Add ${qty} to basket · ${formatPrice(priceCents * qty)}`}
      </PixelButton>

      {soldOut && (
        <p className="mt-2.5 text-center text-[12px] text-ink-soft">
          Back tomorrow morning 🌸
        </p>
      )}

      <Toast message={message} />
    </div>
  );
}
