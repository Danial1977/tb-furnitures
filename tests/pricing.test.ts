import { describe, it, expect } from 'vitest';
import { formatGBP, calculateDeliveryFee, slugify } from '../src/lib/utils';

describe('UK Commerce Utilities & Pricing Logic', () => {
  it('formats GBP currency correctly with two decimals and pound sign', () => {
    expect(formatGBP(1295)).toBe('£1,295.00');
    expect(formatGBP(49.99)).toBe('£49.99');
    expect(formatGBP(0)).toBe('£0.00');
    expect(formatGBP(null)).toBe('£0.00');
  });

  it('calculates UK delivery fees based on order threshold and large items', () => {
    // Orders below £500 without large item charge standard delivery
    expect(calculateDeliveryFee(185, false)).toBe(19.99);

    // Orders over £500 without large item qualify for free standard UK delivery
    expect(calculateDeliveryFee(540, false)).toBe(0);

    // Orders with large furniture below £1,000 require two-man white-glove surcharge
    expect(calculateDeliveryFee(760, true)).toBe(49.99);

    // Premium orders over £1,000 get free two-man delivery
    expect(calculateDeliveryFee(1295, true)).toBe(0);
  });

  it('slugifies category and product titles cleanly', () => {
    expect(slugify('Kensington 3-Seater Velvet Sofa!')).toBe('kensington-3-seater-velvet-sofa');
    expect(slugify('Living Room & Lounge')).toBe('living-room-lounge');
  });
});
