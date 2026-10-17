'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  Heart,
  ShoppingBag,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useWishlist } from '@/components/providers/WishlistProvider';
import { useCart } from '@/components/providers/CartProvider';
import { formatGBP } from '@/lib/utils';

export default function WishlistPage() {
  const { data: session } = useSession();
  const { items, itemCount, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});
  const [movingAll, setMovingAll] = useState(false);

  const handleMoveToCart = (product: any) => {
    addToCart({
      id: `${product.id}-default`,
      productId: product.id,
      name: product.name,
      sku: product.sku || '',
      price: product.price,
      quantity: 1,
      imageUrl: product.primaryImage,
      isLargeItem: Boolean(product.isLargeItem || product.price > 400),
    });

    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  const handleMoveAllToCart = () => {
    setMovingAll(true);
    items.forEach((product) => {
      addToCart({
        id: `${product.id}-default`,
        productId: product.id,
        name: product.name,
        sku: product.sku || '',
        price: product.price,
        quantity: 1,
        imageUrl: product.primaryImage,
        isLargeItem: Boolean(product.isLargeItem || product.price > 400),
      });
    });

    setTimeout(() => {
      setMovingAll(false);
    }, 1500);
  };

  return (
    <div className="bg-sand-50/50 min-h-screen py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-charcoal-900 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <Link href="/products" className="hover:text-charcoal-900 transition-colors">Catalogue</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-charcoal-900 font-semibold">My Wishlist</span>
        </nav>

        {/* Header */}
        <div className="pb-6 border-b border-gray-200 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-brand-600 mb-1">
              <Heart className="w-4 h-4 fill-brand-600" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                Saved Favourites & Design Boards
              </span>
            </div>
            <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-charcoal-900">
              Your Curated Wishlist
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1.5">
              Handcrafted solid oak, luxury upholstery, and architectural pieces saved for your home.
            </p>
          </div>

          {/* Database Sync Status Badge */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {session ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-full px-4 py-2 flex items-center gap-2 text-xs text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Synchronised to account: <strong>{session.user?.email}</strong>
                </span>
              </div>
            ) : (
              <div className="bg-brand-50 border border-brand-200 rounded-full px-4 py-2 flex items-center gap-2 text-xs text-charcoal-800">
                <Sparkles className="w-4 h-4 text-brand-600 shrink-0" />
                <span>
                  Saved locally.{' '}
                  <Link href="/login?callbackUrl=/wishlist" className="text-brand-700 underline font-semibold">
                    Sign In
                  </Link>{' '}
                  to save permanently to database.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        {items.length > 0 ? (
          <div className="space-y-6">
            {/* Action Bar */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-brand-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs text-charcoal-800">
                Showing <strong className="text-brand-900">{items.length}</strong> saved item
                {items.length !== 1 ? 's' : ''} in your collection
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={handleMoveAllToCart}
                  disabled={movingAll}
                  className="bg-brand-900 hover:bg-brand-800 text-white text-xs font-semibold px-4 py-2.5 rounded-full transition-all shadow-sm hover:shadow flex items-center gap-1.5"
                >
                  <ShoppingBag className="w-4 h-4" />
                  {movingAll ? 'Adding All...' : 'Move All to Basket'}
                </button>

                <button
                  onClick={clearWishlist}
                  className="bg-brand-50 hover:bg-red-50 text-gray-600 hover:text-red-700 text-xs font-semibold px-4 py-2.5 rounded-full transition-colors border border-brand-200 flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear Wishlist
                </button>
              </div>
            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((product) => {
                const discount =
                  product.compareAtPrice && product.compareAtPrice > product.price
                    ? Math.round(
                        ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100
                      )
                    : null;
                const isAdded = addedIds[product.id];

                return (
                  <div
                    key={product.id}
                    className="group relative flex flex-col bg-white border border-brand-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-brand-300 transition-all duration-300"
                  >
                    {/* Image with badges and remove button */}
                    <div className="relative aspect-[4/3] w-full bg-brand-50 overflow-hidden">
                      <Link href={`/products/${product.slug}`} className="block w-full h-full">
                        <img
                          src={product.primaryImage}
                          alt={product.name}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        />
                      </Link>

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
                        {discount && (
                          <span className="bg-red-700 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-sm">
                            Save {discount}%
                          </span>
                        )}
                        {product.isBestSeller && (
                          <span className="bg-brand-900 text-brand-100 text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-sm">
                            Best Seller
                          </span>
                        )}
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromWishlist(product.id)}
                        className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm text-gray-500 hover:text-red-600 hover:bg-white shadow-md transition-all z-10"
                        title="Remove from Wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                      <div>
                        {product.brandName && (
                          <span className="text-[10px] uppercase font-bold tracking-wider text-brand-500 block mb-1">
                            {product.brandName}
                          </span>
                        )}
                        <Link
                          href={`/products/${product.slug}`}
                          className="font-editorial text-lg font-bold text-charcoal-900 hover:text-brand-700 transition-colors line-clamp-1"
                        >
                          {product.name}
                        </Link>
                        {product.sku && (
                          <p className="text-[11px] font-mono text-gray-400 mt-0.5">
                            SKU: {product.sku}
                          </p>
                        )}

                        {/* Price */}
                        <div className="flex items-baseline gap-2 mt-3">
                          <span className="text-lg font-bold text-charcoal-900">
                            {formatGBP(product.price)}
                          </span>
                          {product.compareAtPrice && product.compareAtPrice > product.price && (
                            <span className="text-xs text-gray-400 line-through">
                              {formatGBP(product.compareAtPrice)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* CTA Button */}
                      <button
                        onClick={() => handleMoveToCart(product)}
                        className={`w-full py-3 px-4 rounded-xl font-semibold text-xs transition-all shadow-sm flex items-center justify-center gap-2 ${
                          isAdded
                            ? 'bg-emerald-700 text-white'
                            : 'bg-charcoal-900 hover:bg-brand-900 text-white'
                        }`}
                      >
                        <ShoppingBag className="w-4 h-4" />
                        {isAdded ? '✓ Added to Basket' : 'Move to Basket'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-3xl p-12 sm:p-16 text-center border border-brand-100 shadow-sm max-w-2xl mx-auto space-y-6">
            <div className="w-20 h-20 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto shadow-inner">
              <Heart className="w-10 h-10" />
            </div>

            <div>
              <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-charcoal-900">
                Your Wishlist is Waiting
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-2 max-w-md mx-auto leading-relaxed">
                You haven&apos;t saved any furniture pieces yet. Browse our handcrafted solid oak, luxury sofas, and architectural dining collections and click the heart icon on any piece you love.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/products"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-900 hover:bg-brand-800 text-white text-xs font-semibold px-6 py-3.5 rounded-full transition-all shadow-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                Explore All Furniture
              </Link>
              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-50 hover:bg-brand-100 text-charcoal-900 text-xs font-semibold px-6 py-3.5 rounded-full transition-colors border border-brand-200"
              >
                Return to Homepage
              </Link>
            </div>

            {/* Quick Room Links */}
            <div className="pt-8 border-t border-gray-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-3">
                Or Browse by Living Space
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {[
                  { name: 'Living Room', href: '/categories/living-room' },
                  { name: 'Bedroom', href: '/categories/bedroom' },
                  { name: 'Dining Room', href: '/categories/dining-room' },
                  { name: 'Home Office', href: '/categories/home-office' },
                ].map((cat) => (
                  <Link
                    key={cat.name}
                    href={cat.href}
                    className="text-xs bg-brand-50/70 hover:bg-brand-100 text-brand-800 px-3.5 py-1.5 rounded-lg border border-brand-200/80 transition-colors font-medium"
                  >
                    {cat.name} &rarr;
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
