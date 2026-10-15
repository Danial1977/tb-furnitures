'use client';

import { useState, useEffect } from 'react';
import { ProductCard } from '@/components/storefront/ProductCard';
import { ProductSummary } from '@/types';
import { Filter, SlidersHorizontal } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('featured');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    setLoading(true);
    const url = `/api/products?sort=${sortBy}${selectedCategory !== 'all' ? `&category=${selectedCategory}` : ''}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [sortBy, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Category Header */}
      <div className="mb-10 text-center sm:text-left">
        <span className="text-xs font-semibold uppercase tracking-widest text-brand-600">
          The Complete Catalogue
        </span>
        <h1 className="font-editorial text-4xl sm:text-5xl font-bold text-charcoal-900 mt-1">
          British Designed Furniture
        </h1>
        <p className="text-sm text-charcoal-700/80 max-w-2xl mt-2">
          Browse our full selection of sustainably made European oak dining tables, luxurious deep-seat sofas, and handcrafted storage solutions.
        </p>
      </div>

      {/* Filter and Sorting Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 mb-8 border-y border-brand-100 bg-white/60 px-4 rounded-xl">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none text-xs">
          {['all', 'living-room', 'bedroom', 'dining-room', 'home-office', 'garden-outdoor', 'lighting-decor'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full capitalize whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-charcoal-900 text-white font-semibold'
                  : 'bg-brand-50 text-charcoal-700 hover:bg-brand-100'
              }`}
            >
              {cat.replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 text-xs shrink-0 self-end sm:self-auto">
          <SlidersHorizontal className="w-4 h-4 text-gray-500" />
          <span className="text-gray-500">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-brand-50 border border-brand-200 rounded-lg px-3 py-1.5 text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-brand-400 font-medium"
          >
            <option value="featured">Featured Collections</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Product Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-12">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white border border-brand-100 rounded-2xl h-80 animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-24 space-y-4">
          <p className="font-editorial text-2xl font-bold text-charcoal-900">No products found</p>
          <p className="text-sm text-charcoal-700">Try selecting another collection or clearing filters.</p>
          <button
            onClick={() => setSelectedCategory('all')}
            className="text-xs font-semibold text-brand-600 underline"
          >
            View all furniture &rarr;
          </button>
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
