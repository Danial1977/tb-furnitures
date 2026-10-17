import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatGBP(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined || amount === '') return '£0.00';
  const val = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
  }).format(val);
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

export function calculateDeliveryFee(
  itemsSubtotal: number,
  hasLargeItem: boolean,
  freeThreshold: number = 500,
  standardFee: number = 19.99,
  twoManFee: number = 49.99,
  twoManThreshold: number = 1000
): number {
  if (hasLargeItem) {
    return itemsSubtotal >= twoManThreshold ? 0 : twoManFee;
  }
  if (itemsSubtotal >= freeThreshold) {
    return 0;
  }
  return standardFee;
}
