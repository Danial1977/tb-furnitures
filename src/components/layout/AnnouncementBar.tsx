import Link from 'next/link';
import { Truck, ShieldCheck, PhoneCall } from 'lucide-react';

export function AnnouncementBar() {
  return (
    <div className="bg-charcoal-900 text-brand-100 text-xs py-2 px-4 border-b border-charcoal-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-brand-400" />
            <span>Complimentary UK Delivery on orders over £500</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-sage-500" />
            <span>10-Year Frame Guarantee on Sofas & Beds</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-brand-300">
          <div className="flex items-center gap-1.5">
            <PhoneCall className="w-3 h-3 text-brand-400" />
            <span>UK Showroom Support: 0800 123 4567</span>
          </div>
          <span className="hidden sm:inline">|</span>
          <Link href="/help" className="hover:text-white transition-colors">
            Help & Delivery FAQ
          </Link>
        </div>
      </div>
    </div>
  );
}
