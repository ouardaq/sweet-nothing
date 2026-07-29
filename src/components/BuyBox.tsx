'use client';

import { useState } from 'react';
import { formatPrice } from '@/lib/format';
import { Price } from './Price';
import { PixelButton } from './PixelButton';
import { QtyStepper } from './QtyStepper';

export function BuyBox({
  priceCents,
  stock,
}: {
  priceCents: number;
  stock: number;
}) {
  const [qty, setQty] = useState(1);
  const soldOut = stock <= 0;

  return (
    <div className="frame-soft" style={{ padding: 18 }}>
      <div className="mb-4 flex items-center justify-between">
        <Price cents={priceCents} size={26} />
        <QtyStepper value={qty} onChange={setQty} max={Math.max(1, stock)} />
      </div>

      <PixelButton size="lg" full disabled>
        {soldOut
          ? 'Sold out for today'
          : `Add ${qty} to basket · ${formatPrice(priceCents * qty)}`}
      </PixelButton>

      <p className="mt-2.5 text-center text-[12px] text-ink-soft">
        {soldOut ? 'Back tomorrow morning 🌸' : 'basket opens in the next step'}
      </p>
    </div>
  );
}
