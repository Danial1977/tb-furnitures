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
          <div className="col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <img
                src="/images/oakland-logo.jpg"
                alt="Oakland Furniture & Flooring - Crafted for Living"
                className="h-14 sm:h-16 w-auto object-contain rounded-lg border border-charcoal-700/80 shadow-md"
              />
            </Link>
            <p className="text-xs text-brand-200/80 max-w-sm leading-relaxed">
              OAKLAND FURNITURE AND FLOORING LTD — Crafted for Living. Exceptional handcrafted furniture, solid hardwoods, luxury upholstery, and designer flooring solutions across the UK.
            </p>
            <div className="pt-2 space-y-2 text-xs text-brand-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <span>Showroom: 236 Easterly Road, Leeds LS8 3ES</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-400 shrink-0" />
                <span>
                  Tel: <a href="tel:01138085120" className="hover:text-white font-medium">0113 808 5120</a> / Mob: <a href="tel:07467279653" className="hover:text-white font-medium">07467 279653</a>
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-400 shrink-0" />
                <span>
                  Email:{' '}
                  <a href="mailto:Taj.TSO@gmail.com" className="hover:text-white font-medium underline">
                    Taj.TSO@gmail.com
                  </a>
                </span>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-2 flex items-center gap-3 text-xs text-brand-400">
              <span className="text-[11px] uppercase tracking-wider text-charcoal-400 font-semibold">Follow Us:</span>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                Facebook
              </a>
              <span>•</span>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                Instagram
              </a>
              <span>•</span>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                TikTok
              </a>
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
            </ul>
          </div>
        </div>

        {/* Bottom copyright & Company Incorporation */}
        <div className="pt-8 mt-4 border-t border-charcoal-800 flex flex-col md:flex-row items-center justify-between text-xs text-brand-300/70 gap-4">
          <div>
            <p className="font-medium text-white">
              © {new Date().getFullYear()} OAKLAND FURNITURE AND FLOORING LTD. All rights reserved.
            </p>
            <p className="text-[11px] text-charcoal-400 mt-0.5">
              Company No. 17396425 — Incorporated on 12 August 2026 • Private limited company registered in England & Wales.
            </p>
          </div>
          <div className="flex items-center gap-6 text-[11px] text-brand-300/60">
            <span>Prices displayed in GBP (£) inclusive of 20% UK VAT</span>
            <span className="hidden sm:inline">|</span>
            <span>Secured via Stripe 256-Bit SSL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

