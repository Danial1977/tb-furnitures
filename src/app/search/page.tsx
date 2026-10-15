'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import {
  Search,
  SlidersHorizontal,
  ChevronRight,
  ShoppingBag,
  Star,
  Check,
  ShieldCheck,
  Truck,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { formatGBP } from '@/lib/utils';
import { useCart } from '@/components/providers/CartProvider';

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || searchParams.get('search') || '';

  const { addItem } = useCart();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(query);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [sortBy, setSortBy] = useState('featured');
  const [addedItem, setAddedItem] = useState<string | null>(null);

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  useEffect(() => {
    setLoading(true);
    let url = `/api/products?search=${encodeURIComponent(query)}&sort=${sortBy}`;
    if (selectedCategory !== 'ALL') {
      url += `&category=${selectedCategory}`;
    }

    fetch(url)
      .then((r) => r.json())
      .then((res) => {
        setProducts(res.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [query, selectedCategory, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  const handleAddToCart = (p: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: p.id,
      name: p.name,
      price: p.price,
      image: p.primaryImage,
      quantity: 1,
      sku: p.sku,
    });
    setAddedItem(p.id);
    setTimeout(() => setAddedItem(null), 2000);
  };

  const popularSearches = [
    'Oak Dining Table',
    'Pocket Sprung Mattress',
    'Velvet Sofa',
    'Walnut Desk',
    'Bed Frame',
    'Garden Lounge',
  ];

  return (
    <div className="bg-sand-50/50 min-h-screen py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-charcoal-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/products" className="hover:text-charcoal-900 transition-colors">
            Catalogue
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-charcoal-900 font-semibold truncate max-w-xs">
            {query ? `Search: "${query}"` : 'All Search Results'}
          </span>
        </nav>

        {/* Search Input Banner */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">
                Catalogue Search
              </span>
              <h1 className="font-editorial text-2xl md:text-4xl font-bold text-charcoal-900 mt-1">
                {query ? (
                  <>
                    Results for <span className="italic text-brand-700">&quot;{query}&quot;</span>
                  </>
                ) : (
                  'Search TB Furnitures'
                )}
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                {loading ? 'Searching master database...' : `${products.length} furniture items found`}
              </p>
            </div>

            {/* In-page Search Form */}
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-md w-full">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Refine search by timber, material, SKU..."
                  className="w-full text-xs bg-gray-50 border border-gray-300 rounded-xl pl-9 pr-4 py-2.5 focus:ring-2 focus:ring-brand-400 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="bg-charcoal-900 hover:bg-brand-900 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-colors shrink-0 shadow-sm"
              >
                Search
              </button>
            </form>
          </div>

          {/* Popular Search Suggestions */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100 text-xs">
            <span className="text-gray-400 font-medium">Popular:</span>
            {popularSearches.map((term) => (
              <button
                key={term}
                onClick={() => {
                  setSearchInput(term);
                  router.push(`/search?q=${encodeURIComponent(term)}`);
                }}
                className="px-2.5 py-1 bg-gray-100 hover:bg-brand-100 hover:text-brand-800 text-charcoal-800 rounded-lg text-[11px] font-medium transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Filter and Sort Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {[
              { id: 'ALL', label: 'All Collections' },
              { id: 'living-room', label: 'Living Room' },
              { id: 'bedroom', label: 'Bedroom' },
              { id: 'dining-room', label: 'Dining Room' },
              { id: 'home-office', label: 'Home Office' },
              { id: 'garden-outdoor', label: 'Garden & Outdoor' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-charcoal-900 text-white shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
            <span className="text-gray-400 font-medium">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-xs font-semibold text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-brand-400"
            >
              <option value="featured">Featured Picks</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Product Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Product Results Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
                <div className="h-60 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center max-w-xl mx-auto shadow-sm space-y-4">
            <div className="w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center mx-auto text-brand-600">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="font-editorial text-2xl font-bold text-charcoal-900">
              No Furniture Matches Found
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              We couldn&apos;t find any active furniture items matching <strong className="text-charcoal-800">&quot;{query}&quot;</strong>. Try searching by wood finish (e.g. &quot;Oak&quot; or &quot;Walnut&quot;), category (&quot;Dining&quot;, &quot;Sofa&quot;), or browse our curated catalog.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => {
                  setSearchInput('');
                  router.push('/products');
                }}
                className="bg-charcoal-900 hover:bg-brand-900 text-white text-xs font-semibold px-6 py-3 rounded-xl transition-colors shadow-sm"
              >
                Browse Full Furniture Collection
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md hover:border-brand-300 transition-all flex flex-col justify-between"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                  <img
                    src={product.primaryImage}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.compareAtPrice && product.compareAtPrice > product.price && (
                    <span className="absolute top-3 left-3 bg-red-700 text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded shadow-sm">
                      Save {formatGBP(product.compareAtPrice - product.price)}
                    </span>
                  )}
                  {product.isFeatured && (
                    <span className="absolute top-3 right-3 bg-brand-900/80 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow-sm">
                      Featured
                    </span>
                  )}
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-brand-600 block">
                      {product.categoryName || 'Bespoke Furniture'}
                    </span>
                    <h3 className="font-editorial text-sm font-bold text-charcoal-900 group-hover:text-brand-600 transition-colors line-clamp-2 mt-0.5">
                      {product.name}
                    </h3>
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-sm font-bold text-charcoal-900 block">
                        {formatGBP(product.price)}
                      </span>
                      {product.compareAtPrice && (
                        <span className="text-[10px] text-gray-400 line-through">
                          {formatGBP(product.compareAtPrice)}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      className="inline-flex items-center gap-1.5 bg-brand-50 hover:bg-brand-600 text-brand-800 hover:text-white px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors border border-brand-200"
                    >
                      {addedItem === product.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-sage-600" />
                          <span>Added!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto py-24 text-center">
          <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-gray-500">Searching TB Furnitures catalogue...</p>
        </div>
      }
    >
      <SearchResultsContent />
    </Suspense>
  );
}
