import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { formatPrice } from '@/lib/format';
import { flavorWash } from '@/lib/flavors';
import { PixelSprite } from '@/components/PixelSprite';
import type { SpriteSwap } from '@/lib/sprites';

export const dynamic = 'force-dynamic';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await db.product.findUnique({ where: { slug } });

  if (!product) notFound();

  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-12">
      <div
        className="frame flex aspect-square max-w-[420px] items-center justify-center"
        style={{ backgroundColor: flavorWash(product.flavor) }}
      >
        <PixelSprite
          name={product.spriteKey}
          size={260}
          swap={product.spriteSwap as SpriteSwap | null}
          className="float"
        />
      </div>

      <h1 className="pixel-text mt-6 text-[22px]">{product.name}</h1>
      <p className="pixel-text mt-2 text-[14px] text-primary-d">
        {formatPrice(product.priceCents)}
      </p>
      <p className="mt-4 max-w-[560px] text-[16px] font-semibold leading-[1.7]">
        {product.description}
      </p>
      <p className="mt-2 text-[13px] text-ink-soft">
        {product.stock > 0
          ? `${product.stock} left today`
          : 'Sold out for today'}
      </p>
    </main>
  );
}
