'use client';

import Link from 'next/link';
import { Truck, MapPin, PhoneCall, Smartphone } from 'lucide-react';
import { useSettings } from '@/components/providers/SettingsProvider';

export function AnnouncementBar() {
  const { settings } = useSettings();

  return (
    <div className="bg-charcoal-900 text-brand-100 text-[11px] sm:text-xs py-1.5 sm:py-2 px-2 sm:px-4 border-b border-charcoal-800 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-1.5 md:gap-2 text-center">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-0.5">
          <div className="flex items-center gap-1.5 shrink-0">
            <Truck className="w-3.5 h-3.5 text-brand-400 shrink-0" />
            <span className="font-medium">Complimentary UK Delivery on orders over £{settings.freeDeliveryThreshold}</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-brand-300 shrink-0">
            <MapPin className="w-3.5 h-3.5 text-brand-400 shrink-0" />
            <span>Showroom: {settings.showroomAddress || '236 Easterly Road, Leeds LS8 3ES'}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-0.5 text-brand-300">
          <div className="flex items-center gap-2 shrink-0">
            <PhoneCall className="w-3 h-3 text-brand-400 shrink-0" />
            <a href="tel:01138085120" className="hover:text-white transition-colors">
              {settings.supportPhone || '0113 808 5120'}
            </a>
            <span className="text-charcoal-600">/</span>
            <Smartphone className="w-3 h-3 text-brand-400 shrink-0" />
            <a href="tel:07467279653" className="hover:text-white transition-colors">
              07467 279653
            </a>
          </div>
          <span className="hidden sm:inline text-charcoal-600">|</span>
          <Link href="/contact" className="hover:text-white transition-colors font-medium shrink-0">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
