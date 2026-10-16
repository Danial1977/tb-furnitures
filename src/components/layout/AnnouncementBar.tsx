import Link from 'next/link';
import { Truck, MapPin, PhoneCall, Smartphone } from 'lucide-react';

export function AnnouncementBar() {
  return (
    <div className="bg-charcoal-900 text-brand-100 text-xs py-2 px-4 border-b border-charcoal-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-brand-400" />
            <span>Complimentary UK Delivery on orders over £500</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-brand-300">
            <MapPin className="w-3.5 h-3.5 text-brand-400" />
            <span>Showroom: 236 Easterly Road, Leeds LS8 3ES</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-brand-300">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-3 h-3 text-brand-400" />
            <a href="tel:01138085120" className="hover:text-white transition-colors">
              0113 808 5120
            </a>
            <span className="text-charcoal-600">/</span>
            <Smartphone className="w-3 h-3 text-brand-400" />
            <a href="tel:07467279653" className="hover:text-white transition-colors">
              07467 279653
            </a>
          </div>
          <span className="hidden sm:inline text-charcoal-600">|</span>
          <Link href="/contact" className="hover:text-white transition-colors font-medium">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}

