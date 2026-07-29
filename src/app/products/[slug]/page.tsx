import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { flavorWash } from '@/lib/flavors';
import { productAttributes } from '@/lib/product';
import type { SpriteSwap } from '@/lib/sprites';
import { BuyBox } from '@/components/BuyBox';

import { PixelSprite } from '@/components/PixelSprite';
import { ProductCard } from '@/components/ProductCard';
import { SectionTitle } from '@/components/SectionTitle';
import { Stars } from '@/components/Stars';
import { Tag } from '@/components/Tag';

export const dynamic = 'force-dynamic';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await db.product.findUnique({ where: { slug } });

  if (!product) notFound();

  const related = await db.product.findMany({
    where: { category: product.category, NOT: { id: product.id } },
    orderBy: { createdAt: 'desc' },
    take: 4,
  });

  const attributes = productAttributes(product.flavor);

  return (
    <>
      <div className="mx-auto w-full max-w-[1100px] px-6 pt-[22px]">
        <Link href="/shop" className="pixel-text text-[9px] text-ink-soft">
          ← back to shop
        </Link>
      </div>

      <div className="mx-auto flex w-full max-w-[1100px] flex-wrap items-start gap-9 px-6 pt-5">
        <div
          className="frame relative flex min-h-[360px] flex-[1_1_360px] items-center justify-center"
          style={{ background: flavorWash(product.flavor), padding: 40 }}
        >
          <span className="absolute top-4 left-4">
            <Tag kind={product.tag} />
          </span>
          <span className="float">
            <PixelSprite
              name={product.spriteKey}
              size={240}
              swap={product.spriteSwap as SpriteSwap | null}
            />
          </span>
        </div>

        <div className="flex-[1_1_320px]">
          <div className="pixel-text mb-3 text-[9px] text-primary-d">
            {product.flavor ?? 'treat'} · {product.category ?? 'bakery'}
          </div>

          <h1 className="pixel-text mb-3.5 text-[26px] leading-[1.4]">
            {product.name}
          </h1>

          <div className="mb-[18px] flex items-center gap-3">
            <Stars value={5} />
            <span className="text-[13px] text-ink-soft">(128 happy bites)</span>
          </div>

          <p className="mb-[22px] text-[17px] leading-[1.8] font-semibold">
            {product.description}
          </p>

          <ul className="mb-[26px] flex list-none flex-wrap gap-2 p-0">
            {attributes.map((a) => (
              <li
                key={a}
                className="rounded-[2px] border-2 border-line px-2.5 py-1.5 text-[12px] font-bold text-ink-soft"
                style={{ background: 'var(--bg-2)' }}
              >
                {a}
              </li>
            ))}
          </ul>

          <BuyBox priceCents={product.priceCents} stock={product.stock} />
        </div>
      </div>

      {related.length > 0 && (
        <section className="mx-auto mt-[50px] w-full max-w-[1100px] px-6">
          <SectionTitle eyebrow="you might also love" title="More like this" />
          <div className="mt-6 grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
            {related.map((r) => (
              <ProductCard key={r.id} product={r} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
