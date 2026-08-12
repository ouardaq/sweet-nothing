export const PROMO_CODE = 'PIXEL15';
export const PROMO_RATE = 0.15;
export const FREE_DELIVERY_THRESHOLD_CENTS = 2500;
export const DELIVERY_FEE_CENTS = 350;

export const FULFILMENTS = ['pickup', 'delivery'] as const;
export type Fulfilment = (typeof FULFILMENTS)[number];

export function parseFulfilment(
  raw: string | string[] | undefined,
): Fulfilment {
  const v = Array.isArray(raw) ? raw[0] : raw;
  return v === 'delivery' ? 'delivery' : 'pickup';
}

export function isPromoValid(code: string | null | undefined): boolean {
  return (code ?? '').trim().toUpperCase() === PROMO_CODE;
}

export function discountCents(
  subtotalCents: number,
  code: string | null | undefined,
): number {
  return isPromoValid(code) ? Math.round(subtotalCents * PROMO_RATE) : 0;
}

export function deliveryCents(
  subtotalCents: number,
  fulfilment: Fulfilment,
): number {
  if (fulfilment !== 'delivery') return 0;
  return subtotalCents >= FREE_DELIVERY_THRESHOLD_CENTS
    ? 0
    : DELIVERY_FEE_CENTS;
}

export function orderTotals(
  subtotalCents: number,
  fulfilment: Fulfilment,
  code?: string | null,
) {
  const discount = discountCents(subtotalCents, code);
  const delivery = deliveryCents(subtotalCents, fulfilment);

  return {
    subtotalCents,
    discountCents: discount,
    deliveryCents: delivery,
    totalCents: Math.max(0, subtotalCents - discount + delivery),
  };
}

/** Human-friendly order reference derived from the id — deterministic, no randomness. */
export function orderNumberFrom(id: string): string {
  return `SN-${id.slice(-6).toUpperCase()}`;
}
