'use client';

import { useState, useTransition } from 'react';
import { placeOrder } from '@/app/checkout/actions';
import { formatPrice } from '@/lib/format';
import { isPromoValid, orderTotals, type Fulfilment } from '@/lib/orderTotals';
import { Field } from './Field';
import { PixelButton } from './PixelButton';
import { Price } from './Price';

export function CheckoutForm({
  subtotalCents,
  itemCount,
  initialName,
  initialEmail,
}: {
  subtotalCents: number;
  itemCount: number;
  initialName: string;
  initialEmail: string;
}) {
  const [customerName, setCustomerName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [fulfilment, setFulfilment] = useState<Fulfilment>('pickup');
  const [address, setAddress] = useState('');
  const [timing, setTiming] = useState('ASAP (today)');
  const [promo, setPromo] = useState('');
  const [appliedPromo, setAppliedPromo] = useState('');
  const [error, setError] = useState('');
  const [pending, startTransition] = useTransition();

  const totals = orderTotals(subtotalCents, fulfilment, appliedPromo);
  const promoRejected =
    promo !== '' && appliedPromo === '' && !isPromoValid(promo);

  function applyPromo() {
    setAppliedPromo(isPromoValid(promo) ? promo : '');
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    startTransition(async () => {
      const result = await placeOrder({
        customerName,
        email,
        fulfilment,
        address,
        timing,
        promoCode: appliedPromo,
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      window.location.href = `/checkout/done?order=${encodeURIComponent(result.orderNumber)}`;
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-wrap items-start gap-7"
    >
      {/* left column — details */}
      <div className="frame flex-[1_1_440px]" style={{ padding: 24 }}>
        <h2 className="pixel-text mb-5 text-[13px]">How would you like it?</h2>

        <div
          className="mb-[22px] flex gap-3"
          role="radiogroup"
          aria-label="Fulfilment"
        >
          {(
            [
              ['pickup', '🧺 Pickup', 'free · ~20 min'],
              [
                'delivery',
                '🚲 Delivery',
                subtotalCents >= 2500 ? 'free over $25' : formatPrice(350),
              ],
            ] as const
          ).map(([id, label, sub]) => (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={fulfilment === id}
              onClick={() => setFulfilment(id)}
              className="pixel-text flex-1 rounded-[2px] border-[3px] px-3 py-3 text-left text-[10px]"
              style={{
                background:
                  fulfilment === id ? 'var(--primary)' : 'var(--cream)',
                color: fulfilment === id ? '#fff' : 'var(--ink)',
                borderColor:
                  fulfilment === id ? 'var(--primary-d)' : 'var(--line)',
                boxShadow: `3px 3px 0 0 ${fulfilment === id ? 'var(--primary-d)' : 'var(--line)'}`,
              }}
            >
              {label}
              <span
                className="mt-2 block text-[9px]"
                style={{
                  opacity: 0.85,
                  fontFamily: 'var(--body)',
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {sub}
              </span>
            </button>
          ))}
        </div>

        <Field
          label="your name"
          icon="🍓"
          value={customerName}
          onChange={setCustomerName}
          autoComplete="name"
        />
        <Field
          label="email (for your receipt)"
          type="email"
          icon="✉️"
          value={email}
          onChange={setEmail}
          autoComplete="email"
        />
        {fulfilment === 'delivery' && (
          <Field
            label="delivery address"
            icon="🚲"
            value={address}
            onChange={setAddress}
            autoComplete="street-address"
          />
        )}
        <Field
          label="when"
          icon="⏰"
          value={timing}
          onChange={setTiming}
          hint="e.g. ASAP (today), tomorrow morning"
        />
      </div>

      {/* right column — summary */}
      <div className="flex-[1_1_280px] lg:sticky lg:top-[92px]">
        <div className="frame" style={{ padding: 22 }}>
          <h2 className="pixel-text mb-[18px] text-[12px]">Order summary</h2>

          <div className="flex justify-between py-1.5 text-[14px] font-semibold">
            <span className="text-ink-soft">
              Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
            </span>
            <span>{formatPrice(totals.subtotalCents)}</span>
          </div>

          {totals.discountCents > 0 && (
            <div
              className="flex justify-between py-1.5 text-[14px] font-semibold"
              style={{ color: 'var(--good)' }}
            >
              <span>Promo PIXEL15 (–15%)</span>
              <span>–{formatPrice(totals.discountCents)}</span>
            </div>
          )}

          <div className="flex justify-between py-1.5 text-[14px] font-semibold">
            <span className="text-ink-soft">
              {fulfilment === 'delivery' ? 'Delivery' : 'Pickup'}
            </span>
            <span
              style={
                totals.deliveryCents === 0
                  ? { color: 'var(--good)' }
                  : undefined
              }
            >
              {totals.deliveryCents === 0
                ? 'free'
                : formatPrice(totals.deliveryCents)}
            </span>
          </div>

          <div
            style={{ borderTop: '3px dashed var(--line)', margin: '14px 0' }}
          />

          <div className="mb-[18px] flex items-center justify-between">
            <span className="pixel-text text-[11px]">Total</span>
            <Price cents={totals.totalCents} size={22} />
          </div>

          <div className="mb-2 flex gap-2">
            <input
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
              placeholder="promo code"
              aria-label="Promo code"
              className="min-w-0 flex-1 rounded-[2px] border-[3px] border-line px-3 py-2.5 text-[14px] font-bold"
              style={{
                fontFamily: 'var(--body)',
                background: 'var(--bg-2)',
                color: 'var(--ink)',
                outline: 'none',
              }}
            />
            <PixelButton size="sm" variant="cream" onClick={applyPromo}>
              Apply
            </PixelButton>
          </div>
          {promoRejected && (
            <p
              className="mb-3 text-[12px] font-bold"
              style={{ color: '#d05a6e' }}
            >
              Hmm, try <b>PIXEL15</b> 🤫
            </p>
          )}

          {error && (
            <p
              className="mb-3 text-[13px] font-bold"
              style={{ color: '#d05a6e' }}
              role="alert"
            >
              {error}
            </p>
          )}

          <PixelButton
            type="submit"
            size="lg"
            full
            disabled={pending || !customerName}
          >
            {pending ? 'Placing…' : 'Place order ♡'}
          </PixelButton>

          <p className="mt-3.5 text-center text-[12px] text-ink-soft">
            🔒 cozy &amp; secure checkout
          </p>
        </div>
      </div>
    </form>
  );
}
