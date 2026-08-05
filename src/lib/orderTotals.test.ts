import { describe, it, expect } from 'vitest';
import {
  deliveryCents,
  discountCents,
  isPromoValid,
  orderNumberFrom,
  orderTotals,
  parseFulfilment,
} from './orderTotals';

describe('isPromoValid', () => {
  it('accepts the code regardless of case or padding', () => {
    expect(isPromoValid('pixel15')).toBe(true);
    expect(isPromoValid('  PIXEL15 ')).toBe(true);
  });

  it('rejects anything else', () => {
    expect(isPromoValid('PIXEL16')).toBe(false);
    expect(isPromoValid('')).toBe(false);
    expect(isPromoValid(null)).toBe(false);
  });
});

describe('discountCents', () => {
  it('takes 15% off with the promo', () => {
    expect(discountCents(2000, 'PIXEL15')).toBe(300);
  });

  it('rounds to whole cents', () => {
    expect(discountCents(999, 'PIXEL15')).toBe(150);
  });

  it('is zero without a valid promo', () => {
    expect(discountCents(2000, 'NOPE')).toBe(0);
  });
});

describe('deliveryCents', () => {
  it('is free for pickup', () => {
    expect(deliveryCents(500, 'pickup')).toBe(0);
  });

  it('charges for small delivery orders', () => {
    expect(deliveryCents(1000, 'delivery')).toBe(350);
  });

  it('is free for delivery at or above the threshold', () => {
    expect(deliveryCents(2500, 'delivery')).toBe(0);
    expect(deliveryCents(9000, 'delivery')).toBe(0);
  });
});

describe('orderTotals', () => {
  it('sums subtotal minus discount plus delivery', () => {
    expect(orderTotals(1000, 'delivery', 'PIXEL15')).toEqual({
      subtotalCents: 1000,
      discountCents: 150,
      deliveryCents: 350,
      totalCents: 1200,
    });
  });

  it('judges free delivery on the pre-discount subtotal', () => {
    const totals = orderTotals(2600, 'delivery', 'PIXEL15');
    expect(totals.deliveryCents).toBe(0);
    expect(totals.totalCents).toBe(2210);
  });

  it('never goes below zero', () => {
    expect(orderTotals(0, 'pickup', 'PIXEL15').totalCents).toBe(0);
  });
});

describe('parseFulfilment', () => {
  it('accepts delivery', () => {
    expect(parseFulfilment('delivery')).toBe('delivery');
  });

  it('defaults to pickup for anything else', () => {
    expect(parseFulfilment('teleport')).toBe('pickup');
    expect(parseFulfilment(undefined)).toBe('pickup');
  });
});

describe('orderNumberFrom', () => {
  it('derives a stable reference from the id', () => {
    expect(orderNumberFrom('cms8z6w8t0000fluf4oowddgr')).toBe('SN-OWDDGR');
  });
});
