export type TotalsItem = { quantity: number; priceCents: number };

export function subtotalCents(items: TotalsItem[]): number {
  return items.reduce((sum, i) => sum + i.quantity * i.priceCents, 0);
}

export function itemCount(items: { quantity: number }[]): number {
  return items.reduce((n, i) => n + i.quantity, 0);
}
