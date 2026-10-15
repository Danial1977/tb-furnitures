import { MapPin, Phone, Clock, Mail, Calendar, Compass, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'UK Showrooms & Studios | TB Furnitures',
  description: 'Visit our flagship London showroom in Marylebone. Experience handcrafted oak, walnut, luxury mattresses, and tactile fabric swatches.',
};

export default function StoresPage() {
  return (
    <div className="bg-sand-50/50 min-h-screen py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">
            Physical Experience
          </span>
          <h1 className="font-editorial text-3xl md:text-5xl font-bold text-charcoal-900">
            Our UK Showrooms
          </h1>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Touch our sustainably harvested European hardwoods, test our pocket sprung mattresses, and explore custom linen upholstery in natural daylight.
          </p>
        </div>

        {/* Showrooms Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Marylebone Flagship */}
          <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm flex flex-col justify-between">
            <div className="relative h-64 bg-gray-100">
              <img
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80"
                alt="Marylebone London Showroom"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-4 left-4 bg-charcoal-900 text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full shadow-sm">
                Flagship Studio
              </span>
            </div>

            <div className="p-6 md:p-8 space-y-6 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <h2 className="font-editorial text-2xl font-bold text-charcoal-900">
                  London • Marylebone
                </h2>
                <div className="space-y-2.5 text-xs text-gray-600">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                    <span>45 Regent Mews, Marylebone, London, W1B 3HH</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-brand-600 shrink-0" />
                    <span>+44 (0) 800 123 4567</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                    <div>
                      <p>Mon – Fri: 09:00 – 18:00</p>
                      <p>Saturday: 10:00 – 17:00</p>
                      <p className="text-gray-400">Sunday: Private VIP appointments only</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:text-brand-900 hover:underline"
                >
                  <span>Book Private Consultation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <span className="text-[11px] text-sage-700 bg-sage-50 px-2.5 py-1 rounded-full font-semibold">
                  Open Today
                </span>
              </div>
            </div>
          </div>

          {/* Cotswolds Design Barn */}
          <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm flex flex-col justify-between">
            <div className="relative h-64 bg-gray-100">
              <img
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80"
                alt="Cotswolds Design Barn"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-4 left-4 bg-brand-900 text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full shadow-sm">
                Artisan Barn
              </span>
            </div>

            <div className="p-6 md:p-8 space-y-6 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <h2 className="font-editorial text-2xl font-bold text-charcoal-900">
                  Cotswolds • Chipping Norton
                </h2>
                <div className="space-y-2.5 text-xs text-gray-600">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                    <span>The Old Timber Mill, Banbury Road, Chipping Norton, OX7 5LJ</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-brand-600 shrink-0" />
                    <span>+44 (0) 1608 642 981</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                    <div>
                      <p>Tue – Sat: 10:00 – 17:00</p>
                      <p className="text-gray-400">Sun – Mon: Closed for workshops</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:text-brand-900 hover:underline"
                >
                  <span>Directions & Appointments</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <span className="text-[11px] text-sage-700 bg-sage-50 px-2.5 py-1 rounded-full font-semibold">
                  Free Onsite Parking
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
