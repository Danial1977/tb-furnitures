'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, Sparkles, Award, Compass, CheckCircle } from 'lucide-react';
import { ProductCard } from '@/components/storefront/ProductCard';
import { ProductSummary } from '@/types';


// Curated high-resolution demo products
const FEATURED_PRODUCTS: ProductSummary[] = [
  {
    id: 'prod-sofa-1',
    name: 'Kensington 3-Seater Velvet Sofa in Forest Olive',
    slug: 'kensington-3-seater-velvet-sofa',
    sku: 'TB-SOF-001',
    price: 1295.0,
    compareAtPrice: 1450.0,
    primaryImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80',
    brandName: 'Mayfair Atelier',
    categoryName: 'Living Room',
    isFeatured: true,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 38,
  },
  {
    id: 'prod-table-1',
    name: 'Cotswold Solid European Oak Extending Dining Table',
    slug: 'cotswold-solid-oak-extending-dining-table',
    sku: 'TB-DIN-001',
    price: 980.0,
    compareAtPrice: 1150.0,
    primaryImage: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1000&q=80',
    brandName: 'Heritage Timber',
    categoryName: 'Dining Room',
    isFeatured: true,
    rating: 5.0,
    reviewCount: 24,
  },
  {
    id: 'prod-bed-1',
    name: 'Somerset Upholstered King Bed Frame with Fluted Headboard',
    slug: 'somerset-upholstered-king-bed-frame',
    sku: 'TB-BED-001',
    price: 1120.0,
    primaryImage: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=80',
    brandName: 'Nocturne British Sleep',
    categoryName: 'Bedroom',
    isNewArrival: true,
    rating: 4.8,
    reviewCount: 19,
  },
  {
    id: 'prod-chair-1',
    name: 'Belgrave Bouclé Reading Armchair with Walnut Legs',
    slug: 'belgrave-boucle-reading-armchair',
    sku: 'TB-ARM-001',
    price: 540.0,
    compareAtPrice: 620.0,
    primaryImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80',
    brandName: 'Mayfair Atelier',
    categoryName: 'Living Room',
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 42,
  },
  {
    id: 'prod-desk-1',
    name: 'Edinburgh Solid Walnut Executive Desk with Brass Inlays',
    slug: 'edinburgh-solid-walnut-executive-desk',
    sku: 'TB-OFC-001',
    price: 890.0,
    primaryImage: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1000&q=80',
    brandName: 'Heritage Timber',
    categoryName: 'Home Office',
    rating: 4.7,
    reviewCount: 15,
  },
  {
    id: 'prod-sideboard-1',
    name: 'St. James Fluted Wood Sideboard & Media Credenza',
    slug: 'st-james-fluted-wood-sideboard',
    sku: 'TB-STO-001',
    price: 760.0,
    compareAtPrice: 850.0,
    primaryImage: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1000&q=80',
    brandName: 'Heritage Timber',
    categoryName: 'Living Room',
    isFeatured: true,
    rating: 4.9,
    reviewCount: 31,
  },
  {
    id: 'prod-lamp-1',
    name: 'Piccadilly Ceramic & Fluted Linen Table Lamp',
    slug: 'piccadilly-ceramic-fluted-linen-table-lamp',
    sku: 'TB-LGT-001',
    price: 185.0,
    primaryImage: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=80',
    brandName: 'Lumina Studio',
    categoryName: 'Lighting & Decor',
    isNewArrival: true,
    rating: 5.0,
    reviewCount: 8,
  },
  {
    id: 'prod-garden-1',
    name: 'Hampshire Teak 6-Seat Outdoor Dining Set with Weatherproof Cushions',
    slug: 'hampshire-teak-6-seat-outdoor-dining-set',
    sku: 'TB-GAR-001',
    price: 1650.0,
    compareAtPrice: 1890.0,
    primaryImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
    brandName: 'Verdant Living',
    categoryName: 'Garden & Outdoor',
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 27,
  },
];

const ROOM_CATEGORIES = [
  {
    title: 'The Living Room',
    subtitle: 'Deep-seat sofas, bouclé armchairs & walnut tables',
    imageUrl: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80',
    href: '/categories/living-room',
  },
  {
    title: 'The Bedroom Retreat',
    subtitle: 'Fluted headboards, natural mattresses & timber bedside chests',
    imageUrl: 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef7?auto=format&fit=crop&w=800&q=80',
    href: '/categories/bedroom',
  },
  {
    title: 'The Dining Sanctuary',
    subtitle: 'Extending solid oak tables & upholstered dining chairs',
    imageUrl: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80',
    href: '/categories/dining-room',
  },
  {
    title: 'Home Office & Study',
    subtitle: 'Executive walnut desks & ergonomic leather chairs',
    imageUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
    href: '/categories/home-office',
  },
];

export default function HomePage() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterMessage, setNewsletterMessage] = useState<string | null>(null);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterLoading(true);
    setNewsletterMessage(null);
    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'NEWSLETTER',
          email: newsletterEmail,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNewsletterMessage(data.message || "Thank you for subscribing! We've registered your £50 welcome discount.");
        setNewsletterEmail('');
      } else {
        setNewsletterMessage(data.error || 'Failed to subscribe. Please try again.');
      }
    } catch (err) {
      setNewsletterMessage('An error occurred. Please try again shortly.');
    } finally {
      setNewsletterLoading(false);
    }
  };

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO CAROUSEL / EDITORIAL SHOWCASE */}
      <section className="relative bg-brand-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-200/60 text-brand-800 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>Autumn / Winter British Collection</span>
            </div>

            <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-charcoal-900 font-bold leading-[1.1]">
              Timeless British furniture for the soulful home.
            </h1>

            <p className="text-base sm:text-lg text-charcoal-800/80 max-w-lg leading-relaxed">
              Hand-built in the UK using sustainable European solid oak, deep walnut veneers, and Belgian linen. Designed for longevity, warmth, and modern family living.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-charcoal-900 hover:bg-brand-900 text-white font-medium px-7 py-3.5 rounded-full transition-all shadow-md hover:shadow-lg"
              >
                Explore Catalogue
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/categories/living-room"
                className="inline-flex items-center gap-2 bg-white hover:bg-brand-50 text-charcoal-900 font-medium px-7 py-3.5 rounded-full border border-brand-200 transition-all shadow-sm"
              >
                Living Room Sofas
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="pt-6 grid grid-cols-3 gap-6 border-t border-brand-200/60 max-w-md">
              <div>
                <p className="font-editorial text-2xl font-bold text-charcoal-900">10-Yr</p>
                <p className="text-xs text-charcoal-700/70">Frame Guarantee</p>
              </div>
              <div>
                <p className="font-editorial text-2xl font-bold text-charcoal-900">100%</p>
                <p className="text-xs text-charcoal-700/70">FSC® Timber</p>
              </div>
              <div>
                <p className="font-editorial text-2xl font-bold text-charcoal-900">4.9 ★</p>
                <p className="text-xs text-charcoal-700/70">Over 3,000 UK Homes</p>
              </div>
            </div>
          </div>

          {/* Right Hero Image Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85"
                alt="TB Furnitures Living Room Showcase"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/40 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-white/90 backdrop-blur-md border border-white/50 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider font-semibold text-brand-600">Featured Interior</p>
                  <p className="font-editorial text-sm font-bold text-charcoal-900">The Marylebone Penthouse Collection</p>
                </div>
                <Link
                  href="/products/kensington-3-seater-velvet-sofa"
                  className="text-xs font-semibold text-charcoal-900 hover:text-brand-600 flex items-center gap-1"
                >
                  Shop Room &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ROOM COLLECTIONS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-500">Discover By Room</span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-charcoal-900 font-bold mt-1">
              Curated Spaces for Living
            </h2>
          </div>
          <Link href="/products" className="text-sm font-semibold text-brand-700 hover:text-brand-800 flex items-center gap-1.5 mt-2 sm:mt-0">
            View All Categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ROOM_CATEGORIES.map((room) => (
            <Link
              key={room.title}
              href={room.href}
              className="group relative rounded-2xl overflow-hidden aspect-[3/4] bg-brand-100 shadow-sm hover:shadow-xl transition-all duration-300 block"
            >
              <img
                src={room.imageUrl}
                alt={room.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-charcoal-950/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h3 className="font-editorial text-xl font-bold">{room.title}</h3>
                <p className="text-xs text-brand-200/80 mt-1 line-clamp-2">{room.subtitle}</p>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-300 group-hover:text-white mt-3 transition-colors">
                  Shop Collection &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. BEST SELLERS & NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-500">Most Loved Furniture</span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-charcoal-900 font-bold mt-1">
              Best Sellers & New Arrivals
            </h2>
          </div>
          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            <span className="text-xs font-medium text-gray-500">Fast UK Delivery Available</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. EDITORIAL STORY SECTION: CRAFTSMANSHIP */}
      <section className="bg-brand-900 text-brand-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs uppercase tracking-widest font-semibold text-brand-400">The Oakland Standard</span>
            <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl !text-white font-bold leading-tight" style={{ color: '#FFFFFF' }}>
              Honest materials. Master joinery. Unhurried design.
            </h2>
            <p className="text-sm text-brand-200/80 leading-relaxed">
              We reject throwaway flatpack culture. Each Oakland Furniture &amp; Flooring piece is engineered with mortise-and-tenon joints, sustainably harvested European hardwoods, and durable high-resilience fillings.
            </p>
            <ul className="space-y-3 text-xs text-brand-200/90 pt-2">
              <li className="flex items-center gap-2">
                <Award className="w-4 h-4 text-brand-400" />
                <span>Independently tested for 100,000 rub-count commercial upholstery endurance</span>
              </li>
              <li className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-brand-400" />
                <span>Zero plastic packaging — Delivered with protective reusable quilted blankets</span>
              </li>
            </ul>
            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 bg-brand-400 hover:bg-brand-300 text-charcoal-950 font-semibold px-6 py-3 rounded-full transition-colors text-xs"
              >
                Read Our Craftsmanship Story &rarr;
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=600&q=80"
              alt="Timber workshop"
              className="rounded-2xl shadow-lg w-full aspect-square object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&w=600&q=80"
              alt="Wood joinery craftsmanship"
              className="rounded-2xl shadow-lg w-full aspect-square object-cover mt-8"
            />
          </div>
        </div>
      </section>

      {/* 5. NEWSLETTER / BESPOKE CONCIERGE */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
        <h2 className="font-editorial text-3xl sm:text-4xl text-charcoal-900 font-bold">
          Join the Oakland Living Circle
        </h2>
        <p className="text-sm text-charcoal-700/80 max-w-lg mx-auto">
          Receive private invitations to seasonal sample sales, new collection drops, and £50 off your first furniture or flooring order over £500.
        </p>

        {newsletterMessage ? (
          <div className="inline-flex items-center gap-2 p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl text-xs font-medium">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{newsletterMessage}</span>
          </div>
        ) : (
          <form
            onSubmit={handleNewsletterSubmit}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto pt-2"
          >
            <input
              type="email"
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email address..."
              className="w-full bg-white border border-brand-200 rounded-full px-5 py-3 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
            <button
              type="submit"
              disabled={newsletterLoading}
              className="w-full sm:w-auto bg-charcoal-900 hover:bg-brand-900 text-white text-xs font-semibold px-7 py-3.5 rounded-full transition-colors shrink-0 disabled:opacity-50"
            >
              {newsletterLoading ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        )}
        <p className="text-[11px] text-gray-400">We respect your privacy. Unsubscribe at any time.</p>
      </section>
    </div>
  );
}
