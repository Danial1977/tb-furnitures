import { Sparkles, ArrowRight, Eye } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Room Inspirations & Interior Editorial | TB Furnitures',
  description: 'Curated design concepts, bespoke dining arrangements, bedroom sleep sanctuaries, and contemporary living spaces.',
};

const INSPIRATION_GALLERY = [
  {
    title: 'The Georgian Townhouse Dining Room',
    subtitle: 'Featuring our Solid European Oak Extending Table & Scandi Weave Chairs',
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80',
    link: '/categories/dining-room',
    tag: 'Dining Aesthetic',
  },
  {
    title: 'Modern Cotswolds Sleep Sanctuary',
    subtitle: 'Featuring the Belgravia Natural Linen Bed with Pocket Sprung King Mattress',
    image: 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?auto=format&fit=crop&w=1200&q=80',
    link: '/categories/bedroom',
    tag: 'Sleep & Relaxation',
  },
  {
    title: 'Marylebone Architectural Lounge',
    subtitle: 'Warm walnut consoles, bouclé accent seating, and solid timber sideboards',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
    link: '/categories/living-room',
    tag: 'Living Space',
  },
  {
    title: 'Highland Retreat Garden Pavilion',
    subtitle: 'Weatherproof Grade-A teak dining set and outdoor modular deep loungers',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
    link: '/categories/garden-outdoor',
    tag: 'Outdoor Living',
  },
];

export default function InspirationsPage() {
  return (
    <div className="bg-sand-50/50 min-h-screen py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">
            Interior Editorial
          </span>
          <h1 className="font-editorial text-3xl md:text-5xl font-bold text-charcoal-900">
            Room Inspirations
          </h1>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Explore curated living spaces designed to bring harmony, warmth, and enduring natural materials into modern British homes.
          </p>
        </div>

        {/* Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {INSPIRATION_GALLERY.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
                <span className="absolute top-4 left-4 bg-charcoal-900/80 backdrop-blur-sm text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full">
                  {item.tag}
                </span>
              </div>

              <div className="p-6 md:p-8 space-y-4">
                <div>
                  <h2 className="font-editorial text-2xl font-bold text-charcoal-900">
                    {item.title}
                  </h2>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>

                <div className="pt-2">
                  <Link
                    href={item.link}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:text-brand-900 hover:underline"
                  >
                    <span>Shop This Look</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Free Swatches Banner */}
        <div className="bg-charcoal-900 text-white rounded-3xl p-8 md:p-12 text-center space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-400">
            Tactile Consultation
          </span>
          <h3 className="font-editorial text-2xl md:text-3xl font-bold">
            Curate Your Own Fabric & Timber Palette
          </h3>
          <p className="text-xs md:text-sm text-brand-200/80 max-w-xl mx-auto leading-relaxed">
            Order up to 6 complimentary fabric swatches and timber samples to test texture and color under your room&apos;s natural lighting.
          </p>
          <div className="pt-2">
            <Link
              href="/swatches"
              className="inline-block bg-brand-500 hover:bg-brand-400 text-white text-xs font-semibold px-6 py-3 rounded-xl transition-colors shadow-sm"
            >
              Order Free Swatch Pack
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
