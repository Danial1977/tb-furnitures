'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/storefront/ProductCard';
import { ProductSummary } from '@/types';
import Link from 'next/link';
import { ArrowLeft, SlidersHorizontal } from 'lucide-react';

export default function CategoryDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params?.slug as string;
  const sub = searchParams.get('sub');

  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    setLoading(true);
    const categoryTitle = slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) : 'Collection';
    setCategoryName(categoryTitle);

    fetch(`/api/products?category=${slug}&sort=${sortBy}`)
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link href="/products" className="inline-flex items-center gap-1.5 text-xs text-brand-600 hover:underline">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to All Collections
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-brand-100">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-500">
            TB UK Living
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-charcoal-900 mt-1">
            {sub ? `${categoryName} — ${sub}` : `${categoryName} Collection`}
          </h1>
          <p className="text-xs text-charcoal-700/80 mt-1 max-w-xl">
            Sustainably handcrafted British furniture pieces designed specifically for your {categoryName.toLowerCase()}.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <SlidersHorizontal className="w-4 h-4 text-gray-500" />
          <span className="text-gray-500">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-brand-50 border border-brand-200 rounded-lg px-3 py-1.5 text-xs text-charcoal-900 font-medium focus:outline-none"
          >
            <option value="featured">Featured Pieces</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-12">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white border border-brand-100 rounded-2xl h-80 animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-white border border-brand-100 rounded-3xl p-8 space-y-4">
          <h3 className="font-editorial text-2xl font-bold text-charcoal-900">
            More {categoryName} Arrivals Coming Soon
          </h3>
          <p className="text-xs text-charcoal-700 max-w-md mx-auto">
            Our master carpenters are handcrafting new seasonal arrivals for this collection.
          </p>
          <Link
            href="/products"
            className="inline-block bg-charcoal-900 hover:bg-brand-900 text-white text-xs font-semibold px-6 py-3 rounded-full transition-colors"
          >
            Explore All Available Furniture &rarr;
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
