import { Sparkles, HeartHandshake, TreePine, Award, Shield } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Our Heritage & Craftsmanship | TB Furnitures',
  description: 'The story behind TB Furnitures. Hand-selected European oak, sustainable forest management, and British bespoke upholstery design.',
};

export default function AboutPage() {
  return (
    <div className="bg-sand-50/50 min-h-screen py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">
            British Craftsmanship
          </span>
          <h1 className="font-editorial text-3xl md:text-5xl font-bold text-charcoal-900">
            Furniture Built to Endure
          </h1>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Founded in London, TB Furnitures was born from a desire to reject throwaway fast-furniture in favor of timeless British proportion, hand-finished European hardwoods, and generational longevity.
          </p>
        </div>

        {/* Hero Image & Story */}
        <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
          <img
            src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1400&q=80"
            alt="Handcrafting furniture in workshop"
            className="w-full h-80 object-cover"
          />
          <div className="p-8 md:p-12 space-y-6">
            <h2 className="font-editorial text-2xl md:text-3xl font-bold text-charcoal-900">
              The Art of Modern British Living
            </h2>
            <div className="text-xs md:text-sm text-gray-600 space-y-4 leading-relaxed">
              <p>
                At TB Furnitures, we believe true luxury lives in the details you touch every day: the rounded bullnose edge of a solid oak dining table, the quiet glide of soft-close dovetail drawers, and the deep, pocket-sprung support of a hand-tufted mattress.
              </p>
              <p>
                Rather than mass-producing overseas, our pieces are conceived in our Marylebone studio and crafted in partnership with master joiners and artisan upholsterers across the United Kingdom and Europe. Every timber plank is kiln-dried to specific moisture tolerances to prevent seasonal warping in British homes.
              </p>
            </div>
          </div>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sage-50 text-sage-600 flex items-center justify-center">
              <TreePine className="w-5 h-5" />
            </div>
            <h3 className="font-editorial text-lg font-bold text-charcoal-900">FSC®-Certified Timber</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              100% of our solid oak and beech timbers are harvested from certified European forests where three saplings are planted for every tree harvested.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-editorial text-lg font-bold text-charcoal-900">10-Year Guarantee</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              We stand unreservedly behind our joinery. Every solid wood frame and table structure is backed by our decade-long manufacturer guarantee.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="font-editorial text-lg font-bold text-charcoal-900">White Glove Delivery</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Our respectful two-man delivery crew carries your furniture upstairs to your room of choice, assembles the piece, and removes all packaging.
            </p>
          </div>
        </div>

        {/* Visit Showroom Callout */}
        <div className="bg-charcoal-900 text-white rounded-3xl p-8 md:p-12 text-center space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-400">
            London Showroom
          </span>
          <h2 className="font-editorial text-2xl md:text-3xl font-bold">
            Experience TB Furnitures in Person
          </h2>
          <p className="text-xs md:text-sm text-brand-200/80 max-w-xl mx-auto leading-relaxed">
            Visit our Marylebone studio to view our core dining tables, lounge collections, and mattress sleep sanctuary. Walk-ins and private design appointments welcome.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="bg-brand-500 hover:bg-brand-400 text-white text-xs font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Book Showroom Consultation
            </Link>
            <Link
              href="/products"
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Explore Full Catalogue
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
