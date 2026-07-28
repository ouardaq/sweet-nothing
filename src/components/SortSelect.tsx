'use client';

import { useRouter } from 'next/navigation';
import { SORTS, shopHref, type CategoryFilter, type Sort } from '@/lib/shop';

const LABELS: Record<Sort, string> = {
  featured: 'Featured',
  low: 'Price: low → high',
  high: 'Price: high → low',
  az: 'A → Z',
};

export function SortSelect({
  category,
  sort,
}: {
  category: CategoryFilter;
  sort: Sort;
}) {
  const router = useRouter();

  return (
    <label className="flex items-center gap-2.5">
      <span className="pixel-text text-[9px] text-ink-soft">sort</span>
      <select
        value={sort}
        onChange={(e) =>
          router.push(shopHref(category, e.target.value as Sort))
        }
        className="cursor-pointer rounded-[2px] border-[3px] border-line bg-cream px-3 py-2.5 text-[14px] font-bold text-ink"
        style={{
          fontFamily: 'var(--body)',
          boxShadow: '3px 3px 0 0 var(--line)',
        }}
      >
        {SORTS.map((s) => (
          <option key={s} value={s}>
            {LABELS[s]}
          </option>
        ))}
      </select>
    </label>
  );
}
