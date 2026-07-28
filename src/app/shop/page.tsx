import Link from 'next/link';
import { db } from '@/lib/db';
import { ProductCard } from '@/components/ProductCard';
import { PixelSprite } from '@/components/PixelSprite';
import { SortSelect } from '@/components/SortSelect';
import {
  CATEGORY_FILTERS,
  parseCategory,
  parseSort,
  shopHref,
  sortToOrderBy,
} from '@/lib/shop';

export const dynamic = 'force-dynamic';

const CATEGORY_LABELS: Record<string, string> = {
  all: 'All',
  mochi: 'Mochi',
  pancake: 'Pancakes',
  pastry: 'Pastries',
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const category = parseCategory(sp.category);
  const sort = parseSort(sp.sort);

  const products = await db.product.findMany({
    where: category === 'all' ? undefined : { category },
    orderBy: sortToOrderBy(sort),
  });

  return (
    <>
      {/* header band */}
      <div className="relative overflow-hidden border-b-4 border-ink bg-bg-2">
        <div className="mx-auto flex w-full max-w-[1180px] flex-wrap items-center justify-between gap-5 px-6 py-[34px]">
          <div>
            <div className="pixel-text mb-3 text-[9px] text-primary-d">
              the whole case
            </div>
            <h1 className="pixel-text text-[26px]">Treat Shop</h1>
          </div>
          <div className="flex gap-3">
            <span className="float">
              <PixelSprite name="cupcake" size={56} />
            </span>
            <span className="float" style={{ animationDelay: '.8s' }}>
              <PixelSprite name="macaron" size={56} />
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1180px] px-6 pt-[26px]">
        {/* filter bar */}
        <div className="mb-[26px] flex flex-wrap items-center justify-between gap-3.5">
          <div className="flex flex-wrap gap-2.5">
            {CATEGORY_FILTERS.map((c) => (
              <Link
                key={c}
                href={shopHref(c, sort)}
                className={`chip inline-block${c === category ? ' active' : ''}`}
                aria-current={c === category ? 'page' : undefined}
              >
                {CATEGORY_LABELS[c]}
              </Link>
            ))}
          </div>

          <SortSelect category={category} sort={sort} />
        </div>

        <p className="mb-[18px] text-[13px] font-semibold text-ink-soft">
          {products.length} delicious{' '}
          {products.length === 1 ? 'thing' : 'things'}
        </p>

        {products.length === 0 ? (
          <div className="frame p-8 text-center">
            <PixelSprite name="dango" size={72} className="mx-auto" />
            <p className="mt-4 text-[15px] font-semibold">
              Nothing in this case yet — try another craving.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
