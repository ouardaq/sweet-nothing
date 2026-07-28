import Link from 'next/link';
import { flavorWash } from '@/lib/flavors';
import type { SpriteSwap } from '@/lib/sprites';
import { PixelSprite } from './PixelSprite';
import { Tag } from './Tag';
import { Price } from './Price';

export type ProductCardData = {
  id: string;
  slug: string;
  name: string;
  priceCents: number;
  spriteKey: string;
  spriteSwap: unknown;
  flavor: string | null;
  tag: string | null;
};

export function ProductCard({ product }: { product: ProductCardData }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="frame treat-card block p-3"
    >
      <div className="relative">
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
        <span className="absolute top-2 right-2">
          <Tag kind={product.tag} />
        </span>
      </div>

      <h2 className="pixel-text mt-4 text-[11px]">{product.name}</h2>
      <p className="mt-1 text-[13px] font-semibold text-ink-soft">
        {product.flavor ?? 'treat'}
      </p>
      <p className="mt-2">
        <Price cents={product.priceCents} size={11} />
      </p>
    </Link>
  );
}
