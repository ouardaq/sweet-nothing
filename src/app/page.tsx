import Link from 'next/link';
import { db } from '@/lib/db';
import { formatPrice } from '@/lib/format';
import { flavorWash } from '@/lib/flavors';
import { PixelSprite } from '@/components/PixelSprite';
import type { SpriteSwap } from '@/lib/sprites';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const products = await db.product.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main className="mx-auto w-full max-w-[1180px] px-6 py-12">
      <h1 className="pixel-text text-[22px]">Sweet Nothing</h1>
      <p className="mt-3 text-[15px] font-semibold text-ink-soft">
        Hand-made treats baked fresh in our little pixel kitchen.
      </p>

      <div className="mt-11 grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            className="frame treat-card block p-3"
          >
            <div
              className="flex aspect-square items-center justify-center rounded-[2px]"
              style={{ backgroundColor: flavorWash(product.flavor) }}
            >
              <PixelSprite
                name={product.spriteKey}
                size={130}
                swap={product.spriteSwap as SpriteSwap | null}
                className="bob"
              />
            </div>

            <h2 className="pixel-text mt-4 text-[11px]">{product.name}</h2>
            <p className="mt-1 text-[13px] font-semibold text-ink-soft">
              {product.flavor ?? 'treat'}
            </p>
            <p className="pixel-text mt-2 text-[11px] text-primary-d">
              {formatPrice(product.priceCents)}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
