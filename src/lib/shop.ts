export const SORTS = ['featured', 'low', 'high', 'az'] as const;
export type Sort = (typeof SORTS)[number];

export const CATEGORY_FILTERS = ['all', 'mochi', 'pancake', 'pastry'] as const;
export type CategoryFilter = (typeof CATEGORY_FILTERS)[number];

function first(raw: string | string[] | undefined): string {
  return (Array.isArray(raw) ? raw[0] : raw) ?? '';
}

export function parseCategory(
  raw: string | string[] | undefined,
): CategoryFilter {
  const v = first(raw);
  return (CATEGORY_FILTERS as readonly string[]).includes(v)
    ? (v as CategoryFilter)
    : 'all';
}

export function parseSort(raw: string | string[] | undefined): Sort {
  const v = first(raw);
  return (SORTS as readonly string[]).includes(v) ? (v as Sort) : 'featured';
}

export function sortToOrderBy(sort: Sort) {
  switch (sort) {
    case 'low':
      return { priceCents: 'asc' as const };
    case 'high':
      return { priceCents: 'desc' as const };
    case 'az':
      return { name: 'asc' as const };
    default:
      return { createdAt: 'desc' as const };
  }
}

export function shopHref(category: CategoryFilter, sort: Sort): string {
  const params = new URLSearchParams();
  if (category !== 'all') params.set('category', category);
  if (sort !== 'featured') params.set('sort', sort);
  const qs = params.toString();
  return qs ? `/shop?${qs}` : '/shop';
}
