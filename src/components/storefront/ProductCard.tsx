'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import { formatGBP } from '@/lib/utils';
import { useCart } from '@/components/providers/Providers';
import { ProductSummary } from '@/types';
import { useState } from 'react';

interface ProductCardProps {
  product: ProductSummary;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      id: `${product.id}-default`,
      productId: product.id,
      name: product.name,
      sku: product.sku,
      price: product.price,
      quantity: 1,
      imageUrl: product.primaryImage,
      isLargeItem: product.price > 400, // Reasonable heuristic for large furniture
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  return (
    <div className="group relative flex flex-col bg-white border border-brand-100 rounded-2xl overflow-hidden hover:shadow-xl hover:border-brand-200 transition-all duration-300">
      {/* Image Container */}
      <Link href={`/products/${product.slug}`} className="relative aspect-[4/3] w-full bg-brand-100/50 overflow-hidden block">
        <img
          src={product.primaryImage}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {discountPercent && (
            <span className="bg-red-700 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-sm">
              Save {discountPercent}%
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-brand-900 text-brand-100 text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-sm">
              Best Seller
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-sage-700 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-sm">
              New In
            </span>
          )}
        </div>

        {/* Floating Quick Action Overlay */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <button
            onClick={handleQuickAdd}
            className="p-2.5 rounded-full bg-white text-charcoal-900 hover:bg-brand-900 hover:text-white shadow-md transition-colors"
            title="Quick Add to Basket"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              alert(`Added ${product.name} to your Wishlist!`);
            }}
            className="p-2.5 rounded-full bg-white text-charcoal-900 hover:text-red-600 shadow-md transition-colors"
            title="Save to Wishlist"
          >
            <Heart className="w-4 h-4" />
          </button>
        </div>
      </Link>

      {/* Product Details */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        {product.brandName && (
          <span className="text-[11px] uppercase tracking-wider text-brand-500 font-semibold mb-1">
            {product.brandName}
          </span>
        )}

        <Link href={`/products/${product.slug}`} className="group-hover:text-brand-600 transition-colors">
          <h3 className="font-editorial text-base sm:text-lg text-charcoal-900 font-medium line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {/* Rating preview */}
        <div className="flex items-center gap-1.5 mt-1.5 mb-3 text-xs text-brand-600">
          <div className="flex items-center text-amber-500">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="font-semibold ml-1 text-charcoal-800">{product.rating || 4.9}</span>
          </div>
          <span className="text-gray-400">({product.reviewCount || 12} reviews)</span>
        </div>

        {/* Price & Add button */}
        <div className="mt-auto pt-3 border-t border-brand-50 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-bold text-charcoal-900">
              {formatGBP(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-xs text-gray-400 line-through">
                {formatGBP(product.compareAtPrice)}
              </span>
            )}
          </div>

          <button
            onClick={handleQuickAdd}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
              added
                ? 'bg-sage-700 text-white'
                : 'bg-brand-100 text-brand-900 hover:bg-brand-900 hover:text-white'
            }`}
          >
            {added ? '✓ Added' : 'Add +'}
          </button>
        </div>
      </div>
    </div>
  );
}
