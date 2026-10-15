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

export function calculateDeliveryFee(itemsSubtotal: number, hasLargeItem: boolean): number {
  // Free delivery for orders over £500 unless specialist two-man furniture delivery required
  if (hasLargeItem) {
    return itemsSubtotal >= 1000 ? 0 : 49.99; // Two-man white glove delivery
  }
  if (itemsSubtotal >= 500) {
    return 0; // Free standard UK delivery threshold
  }
  return 19.99; // Standard UK furniture courier delivery
}
