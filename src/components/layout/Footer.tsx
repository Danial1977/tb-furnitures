import Link from 'next/link';
import { Mail, Phone, MapPin, Shield, RotateCcw, Clock } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-charcoal-950 text-brand-100 pt-16 pb-12 border-t border-brand-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Core Guarantees Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-charcoal-800 text-center md:text-left">
          <div className="flex items-start justify-center md:justify-start gap-4">
            <div className="w-10 h-10 rounded-full bg-brand-900/50 flex items-center justify-center shrink-0 text-brand-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-editorial text-base text-white font-semibold">10-Year Frame Guarantee</h4>
              <p className="text-xs text-brand-200/70 mt-1">Bespoke British craftsmanship designed to last generations.</p>
            </div>
          </div>

          <div className="flex items-start justify-center md:justify-start gap-4">
            <div className="w-10 h-10 rounded-full bg-brand-900/50 flex items-center justify-center shrink-0 text-brand-400">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-editorial text-base text-white font-semibold">30-Day In-Home Trial</h4>
              <p className="text-xs text-brand-200/70 mt-1">Hassle-free returns throughout mainland United Kingdom.</p>
            </div>
          </div>

          <div className="flex items-start justify-center md:justify-start gap-4">
            <div className="w-10 h-10 rounded-full bg-brand-900/50 flex items-center justify-center shrink-0 text-brand-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-editorial text-base text-white font-semibold">White Glove Room Delivery</h4>
              <p className="text-xs text-brand-200/70 mt-1">Carried to room of choice, assembled, and packaging removed.</p>
            </div>
          </div>
        </div>

        {/* Navigation Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 py-12">
          {/* Brand info */}
          <div className="col-span-2">
            <span className="font-editorial text-2xl font-bold tracking-tight text-white block">
              TB FURNITURES
            </span>
            <p className="text-xs text-brand-200/70 mt-3 max-w-sm leading-relaxed">
              Curating contemporary and timeless interior spaces across the UK. Crafted from sustainably harvested European oak, American walnut, and premium natural upholstery fabrics.
            </p>
            <div className="mt-5 space-y-2 text-xs text-brand-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-400" />
                <span>Showroom: 45 Regent Mews, Marylebone, London, W1B 3HH</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-400" />
                <span>Customer Care: +44 (0) 800 123 4567 (Mon-Sat 9am-6pm)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-400" />
                <span>Enquiries: concierge@tbfurnitures.co.uk</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">Collections</h5>
            <ul className="space-y-2.5 text-xs text-brand-200/80">
              <li><Link href="/categories/living-room" className="hover:text-white transition-colors">Living Room</Link></li>
              <li><Link href="/categories/bedroom" className="hover:text-white transition-colors">Bedroom & Mattresses</Link></li>
              <li><Link href="/categories/dining-room" className="hover:text-white transition-colors">Dining Furniture</Link></li>
              <li><Link href="/categories/home-office" className="hover:text-white transition-colors">Home Office</Link></li>
              <li><Link href="/categories/garden-outdoor" className="hover:text-white transition-colors">Garden & Outdoor</Link></li>
              <li><Link href="/categories/lighting-decor" className="hover:text-white transition-colors">Lighting & Accessories</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">Customer Care</h5>
            <ul className="space-y-2.5 text-xs text-brand-200/80">
              <li><Link href="/delivery" className="hover:text-white transition-colors">UK Delivery Information</Link></li>
              <li><Link href="/returns" className="hover:text-white transition-colors">Returns & 30-Day Guarantee</Link></li>
              <li><Link href="/care-guide" className="hover:text-white transition-colors">Timber & Leather Care</Link></li>
              <li><Link href="/swatches" className="hover:text-white transition-colors">Order Free Fabric Swatches</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">Frequently Asked Questions</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Concierge</Link></li>
            </ul>
          </div>

          {/* Legal & Portals */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">Account & Legal</h5>
            <ul className="space-y-2.5 text-xs text-brand-200/80">
              <li><Link href="/account" className="hover:text-white transition-colors">My Customer Account</Link></li>
              <li><Link href="/account/orders" className="hover:text-white transition-colors">Track Order Status</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Notice & Cookies</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Sale</Link></li>
              <li><Link href="/admin" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">Admin Portal &rarr;</Link></li>
              <li><Link href="/docs" target="_blank" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">System Blueprint (PDF) &rarr;</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 mt-4 border-t border-charcoal-800 flex flex-col md:flex-row items-center justify-between text-xs text-brand-300/60 gap-4">
          <p>© {new Date().getFullYear()} TB Furnitures Ltd. All rights reserved. Registered in England & Wales.</p>
          <div className="flex items-center gap-6">
            <span>Prices displayed in GBP (£) inclusive of 20% UK VAT</span>
            <span className="hidden sm:inline">|</span>
            <span>Secured via Stripe 256-Bit SSL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
