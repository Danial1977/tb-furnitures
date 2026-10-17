export interface SiteSettingsData {
  freeDeliveryThreshold: number;
  standardDeliveryFee: number;
  twoManDeliveryFee: number;
  twoManFreeThreshold: number;
  currency: string;
  vatRate: number;
  showroomAddress: string;
  supportPhone: string;
}

export const DEFAULT_SITE_SETTINGS: SiteSettingsData = {
  freeDeliveryThreshold: 500, // standard free delivery threshold in GBP
  standardDeliveryFee: 19.99,
  twoManDeliveryFee: 49.99,
  twoManFreeThreshold: 1000,
  currency: 'GBP',
  vatRate: 20,
  showroomAddress: '236 Easterly Road, Leeds LS8 3ES',
  supportPhone: '0113 808 5120',
};
