import Link from 'next/link';
import { readCart } from '@/lib/cart';
import { itemCount, subtotalCents } from '@/lib/cartTotals';
import { flavorWash } from '@/lib/flavors';
import { formatPrice } from '@/lib/format';
import type { SpriteSwap } from '@/lib/sprites';
import { CartLineControls } from '@/components/CartLineControls';
import { PixelButton } from '@/components/PixelButton';
import { PixelLink } from '@/components/PixelLink';
import { PixelSprite } from '@/components/PixelSprite';
import { Price } from '@/components/Price';

export const dynamic = 'force-dynamic';

const STEPS = ['1 Basket', '2 Details', '3 Done'];

function CartHeader() {
  return (
    <div className="border-b-4 border-ink bg-bg-2">
      <div className="mx-auto flex w-full max-w-[1080px] flex-wrap items-center justify-between gap-4 px-6 py-[26px]">
        <h1 className="pixel-text text-[22px]">Your Basket</h1>
        <ol className="flex list-none gap-2 p-0">
          {STEPS.map((label, i) => (
            <li
              key={label}
              className="pixel-text rounded-[2px] border-[3px] px-2.5 py-2 text-[9px]"
              style={
                i === 0
                  ? {
                      background: 'var(--primary)',
                      color: '#fff',
                      borderColor: 'var(--primary-d)',
                    }
                  : {
                      background: 'var(--cream)',
                      color: 'var(--ink-soft)',
                      borderColor: 'var(--line)',
                    }
              }
              aria-current={i === 0 ? 'step' : undefined}
            >
              {label}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default async function CartPage() {
  const cart = await readCart();
  const items = cart?.items ?? [];

  if (items.length === 0) {
    return (
      <>
        <CartHeader />
        <div className="mx-auto w-full max-w-[600px] px-6 py-[60px] text-center">
          <span className="float inline-block opacity-85">
            <PixelSprite name="taiyaki" size={120} />
          </span>
          <h2 className="pixel-text mt-5 mb-3 text-[18px]">
            Your basket is empty
          </h2>
          <p className="mb-[26px] text-[16px] text-ink-soft">
            Let&apos;s fix that — the case is full of warm things.
          </p>
          <PixelLink href="/shop" size="lg">
            Browse treats →
          </PixelLink>
        </div>
      </>
    );
  }

  const lines = items.map((i) => ({
    quantity: i.quantity,
    priceCents: i.product.priceCents,
  }));
  const subtotal = subtotalCents(lines);
  const count = itemCount(lines);

  return (
    <>
      <CartHeader />

      <div className="mx-auto flex w-full max-w-[1080px] flex-wrap items-start gap-7 px-6 pt-7">
        {/* line items */}
        <ul className="flex flex-[1_1_440px] list-none flex-col gap-3.5 p-0">
          {items.map((item) => (
            <li
              key={item.id}
              className="frame flex items-center gap-3.5"
              style={{ padding: 14 }}
            >
              <span
                className="shrink-0 rounded-[2px] border-[3px] border-ink"
                style={{ background: flavorWash(item.product.flavor) }}
              >
                <PixelSprite
                  name={item.product.spriteKey}
                  size={72}
                  swap={item.product.spriteSwap as SpriteSwap | null}
                />
              </span>

              <div className="min-w-0 flex-1">
                <Link
                  href={`/products/${item.product.slug}`}
                  className="pixel-text text-[11px]"
                >
                  {item.product.name}
                </Link>
                <p className="mt-2 text-[13px] text-ink-soft">
                  {item.product.flavor ?? 'treat'} ·{' '}
                  <Price cents={item.product.priceCents} size={13} />
                </p>
              </div>

              <CartLineControls
                itemId={item.id}
                quantity={item.quantity}
                priceCents={item.product.priceCents}
                stock={item.product.stock}
              />
            </li>
          ))}
        </ul>

        {/* summary rail */}
        <div className="flex-[1_1_280px] lg:sticky lg:top-[92px]">
          <div className="frame" style={{ padding: 22 }}>
            <h2 className="pixel-text mb-[18px] text-[12px]">Order summary</h2>

            <div className="flex justify-between py-1.5 text-[14px] font-semibold">
              <span className="text-ink-soft">
                Subtotal ({count} {count === 1 ? 'item' : 'items'})
              </span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            <div className="flex justify-between py-1.5 text-[14px] font-semibold">
              <span className="text-ink-soft">Pickup</span>
              <span style={{ color: 'var(--good)' }}>free</span>
            </div>

            <div
              style={{ borderTop: '3px dashed var(--line)', margin: '14px 0' }}
            />

            <div className="mb-[18px] flex items-center justify-between">
              <span className="pixel-text text-[11px]">Total</span>
              <Price cents={subtotal} size={22} />
            </div>

            <PixelButton size="lg" full disabled>
              Checkout →
            </PixelButton>

            <p className="mt-3.5 text-center text-[12px] text-ink-soft">
              checkout opens in the next step
            </p>
          </div>

          <p className="mt-3.5 text-center">
            <Link href="/shop" className="text-[14px] font-bold text-primary-d">
              + keep shopping
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
