'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  Package,
} from 'lucide-react';
import { useCart } from '@/components/providers/CartProvider';
import { useTheme } from '@/components/providers/ThemeProvider';
import { useSession } from 'next-auth/react';
import { formatGBP } from '@/lib/utils';

const CATEGORIES = [
  { name: 'Living Room', slug: 'living-room', sub: ['Sofas & Armchairs', 'Coffee Tables', 'TV Units', 'Sideboards'] },
  { name: 'Bedroom', slug: 'bedroom', sub: ['Solid Oak Beds', 'Pocket Sprung Mattresses', 'Bedside Tables', 'Wardrobes'] },
  { name: 'Dining Room', slug: 'dining-room', sub: ['Extending Dining Tables', 'Dining Chairs', 'Benches', 'Bar Stools'] },
  { name: 'Home Office', slug: 'home-office', sub: ['Writing Desks', 'Ergonomic Chairs', 'Bookcases', 'Filing Cabinets'] },
  { name: 'Garden & Outdoor', slug: 'garden-outdoor', sub: ['Teak Dining Sets', 'Rattan Lounge Sets', 'Parasols', 'Firepits'] },
  { name: 'Lighting & Decor', slug: 'lighting-decor', sub: ['Pendant Lights', 'Table Lamps', 'Hand-Knotted Rugs', 'Mirrors'] },
  { name: 'Clearance & Outlet', slug: 'clearance', isHighlight: true },
];

export function Navbar() {
  const { itemCount } = useCart();
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Live Autocomplete Search State
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  // Debounced search fetching
  useEffect(() => {
    const q = searchQuery.trim();
    if (!q) {
      setSearchResults([]);
      setIsDropdownOpen(false);
      return;
    }

    setIsSearching(true);
    setIsDropdownOpen(true);

    const timer = setTimeout(() => {
      fetch(`/api/products?search=${encodeURIComponent(q)}&limit=5`)
        .then((r) => r.json())
        .then((res) => {
          setSearchResults(res.products || []);
          setIsSearching(false);
        })
        .catch(() => setIsSearching(false));
    }, 150);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node) &&
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsDropdownOpen(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSelectProduct = (slug: string) => {
    setIsDropdownOpen(false);
    setSearchQuery('');
    router.push(`/products/${slug}`);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-brand-100 transition-all">
      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 min-h-[84px] sm:min-h-[96px] flex items-center justify-between gap-4 sm:gap-6">
        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-charcoal-800 hover:text-brand-600 focus:outline-none"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group shrink-0 py-1">
          <img
            src="/images/oakland-logo.jpg"
            alt="Oakland Furniture & Flooring"
            className="h-[60px] sm:h-[76px] md:h-[82px] w-auto max-w-[220px] object-contain rounded-lg shadow-sm border border-brand-200/60 transition-transform group-hover:scale-[1.02]"
          />
        </Link>

        {/* Global Live Search Bar (Desktop) with Live Dropdown */}
        <div ref={searchContainerRef} className="hidden md:flex flex-1 max-w-md relative">
          <form onSubmit={handleSearchSubmit} className="w-full relative">
            <input
              type="text"
              value={searchQuery}
              onFocus={() => {
                if (searchQuery.trim()) setIsDropdownOpen(true);
              }}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search solid oak, linen sofas, dining tables, SKU..."
              className="w-full bg-brand-50 border border-brand-200 rounded-full py-2.5 pl-11 pr-4 text-sm text-charcoal-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition-all shadow-inner"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-500" />
          </form>

          {/* Autocomplete Dropdown */}
          {isDropdownOpen && searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              {isSearching ? (
                <div className="p-6 text-center text-xs text-gray-500 space-y-2">
                  <div className="w-5 h-5 border-2 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p>Searching TB master catalogue...</p>
                </div>
              ) : searchResults.length > 0 ? (
                <div>
                  <div className="p-2.5 bg-gray-50/80 border-b border-gray-100 flex items-center justify-between text-[11px] text-gray-500 px-4">
                    <span>Matching Furniture</span>
                    <span className="font-semibold text-brand-700">{searchResults.length} Results</span>
                  </div>

                  <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                    {searchResults.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleSelectProduct(item.slug)}
                        className="flex items-center gap-3 p-3 hover:bg-brand-50/60 cursor-pointer transition-colors"
                      >
                        <img
                          src={item.primaryImage}
                          alt={item.name}
                          className="w-12 h-12 rounded-lg object-cover bg-gray-100 shrink-0 border border-gray-200"
                        />
                        <div className="flex-1 overflow-hidden">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-brand-600 block">
                            {item.categoryName || 'Furniture'}
                          </span>
                          <p className="text-xs font-bold text-charcoal-900 truncate">{item.name}</p>
                          <span className="text-[10px] text-gray-400 font-mono">SKU: {item.sku}</span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-bold text-charcoal-900 block">
                            {formatGBP(item.price)}
                          </span>
                          {item.compareAtPrice && (
                            <span className="text-[10px] text-gray-400 line-through">
                              {formatGBP(item.compareAtPrice)}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-brand-50 border-t border-brand-100 text-center">
                    <button
                      onClick={handleSearchSubmit}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-800 hover:text-brand-950 hover:underline"
                    >
                      <span>View all results for &quot;{searchQuery}&quot;</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center space-y-3">
                  <Package className="w-8 h-8 text-gray-300 mx-auto" />
                  <p className="text-xs font-bold text-charcoal-900">
                    No furniture found matching &quot;{searchQuery}&quot;
                  </p>
                  <p className="text-[11px] text-gray-500 max-w-xs mx-auto">
                    Try searching: Oak, Walnut, Mattress, Velvet, Dining, or Desk.
                  </p>
                  <div className="pt-1">
                    <button
                      onClick={handleSearchSubmit}
                      className="text-xs font-semibold text-brand-600 hover:underline"
                    >
                      Press Enter to view all catalogue items &rarr;
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Icons & Theme Swatches */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* 4 Theme Color Swatches */}
          <div className="flex items-center gap-1.5 px-2 py-1 bg-brand-100/70 rounded-full border border-brand-200" title="Select Theme Palette">
            <span className="hidden xl:inline text-[10px] uppercase font-bold tracking-wider text-charcoal-700 mr-0.5">
              Theme:
            </span>
            <button
              onClick={() => setTheme('heritage')}
              className={`w-5 h-5 rounded-full transition-all border border-black/10 ${
                theme === 'heritage'
                  ? 'ring-2 ring-offset-1 ring-[#8C5E2D] scale-110 shadow-sm'
                  : 'opacity-75 hover:opacity-100 hover:scale-105'
              }`}
              style={{ backgroundColor: '#8C5E2D' }}
              title="Heritage Walnut (Default - Warm Ivory & Espresso)"
            />
            <button
              onClick={() => setTheme('nordic')}
              className={`w-5 h-5 rounded-full transition-all border border-black/10 ${
                theme === 'nordic'
                  ? 'ring-2 ring-offset-1 ring-[#1E3A8A] scale-110 shadow-sm'
                  : 'opacity-75 hover:opacity-100 hover:scale-105'
              }`}
              style={{ backgroundColor: '#0A192F' }}
              title="British Navy Blue (Midnight Navy & Ice White)"
            />
            <button
              onClick={() => setTheme('botanical')}
              className={`w-5 h-5 rounded-full transition-all border border-black/10 ${
                theme === 'botanical'
                  ? 'ring-2 ring-offset-1 ring-[#1E6637] scale-110 shadow-sm'
                  : 'opacity-75 hover:opacity-100 hover:scale-105'
              }`}
              style={{ backgroundColor: '#2E563B' }}
              title="Botanical Olive (Victorian Evergreen & Sage)"
            />
            <button
              onClick={() => setTheme('noir')}
              className={`w-5 h-5 rounded-full transition-all border border-white/20 ${
                theme === 'noir'
                  ? 'ring-2 ring-offset-1 ring-[#F59E0B] scale-110 shadow-sm'
                  : 'opacity-75 hover:opacity-100 hover:scale-105'
              }`}
              style={{ backgroundColor: '#0D0E11' }}
              title="Luxe Noir (Obsidian Black & Champagne Gold)"
            />
          </div>

          {/* Account */}
          <Link
            href={session ? (session.user as any)?.role !== 'CUSTOMER' ? '/admin' : '/account' : '/login'}
            className="flex items-center gap-2 p-2 text-charcoal-800 hover:text-brand-600 transition-colors group"
            title={session ? 'My Account' : 'Sign In'}
          >
            <User className="w-5 h-5" />
            <span className="hidden sm:inline text-xs font-medium">
              {session ? session.user?.name?.split(' ')[0] || 'Account' : 'Sign In'}
            </span>
          </Link>

          {/* Wishlist */}
          <Link
            href="/wishlist"
            className="p-2 text-charcoal-800 hover:text-brand-600 transition-colors relative"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
          </Link>

          {/* Shopping Basket */}
          <Link
            href="/cart"
            className="flex items-center gap-2.5 bg-brand-900 hover:bg-brand-800 text-white px-4 py-2.5 rounded-full transition-all shadow-sm hover:shadow"
            title="View Basket"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="text-xs font-semibold">{itemCount}</span>
          </Link>
        </div>
      </div>

      {/* Category Navigation Bar (Desktop) */}
      <nav className="hidden lg:block border-t border-brand-100 bg-brand-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <ul className="flex items-center space-x-8 text-sm font-medium">
            {CATEGORIES.map((cat) => (
              <li
                key={cat.slug}
                className="relative py-3 group"
                onMouseEnter={() => setActiveDropdown(cat.slug)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={`/categories/${cat.slug}`}
                  className={`flex items-center gap-1 transition-colors ${
                    cat.isHighlight
                      ? 'text-red-700 hover:text-red-800 font-semibold'
                      : 'text-charcoal-800 hover:text-brand-600'
                  }`}
                >
                  {cat.name}
                  {cat.sub && <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:rotate-180 transition-transform" />}
                </Link>

                {/* Subcategory Dropdown Mega Menu */}
                {cat.sub && activeDropdown === cat.slug && (
                  <div className="absolute top-full left-0 w-56 bg-white border border-brand-200 rounded-xl shadow-xl py-3 px-2 z-50 animate-in fade-in-50 duration-150">
                    {cat.sub.map((subName) => (
                      <Link
                        key={subName}
                        href={`/categories/${cat.slug}?sub=${encodeURIComponent(subName)}`}
                        className="block px-3 py-2 text-xs text-charcoal-800 hover:bg-brand-50 hover:text-brand-700 rounded-lg transition-colors"
                      >
                        {subName}
                      </Link>
                    ))}
                    <div className="mt-2 pt-2 border-t border-brand-100 px-3">
                      <Link
                        href={`/categories/${cat.slug}`}
                        className="text-xs font-semibold text-brand-600 hover:underline block"
                      >
                        View all in {cat.name} &rarr;
                      </Link>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <Link href="/stores" className="text-charcoal-700 hover:text-brand-600 transition-colors">
              UK Showrooms
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer with Live Search */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-brand-200 px-4 pt-3 pb-6 space-y-4">
          <div ref={mobileSearchRef} className="relative">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onFocus={() => {
                  if (searchQuery.trim()) setIsDropdownOpen(true);
                }}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search furniture..."
                className="w-full bg-brand-50 border border-brand-200 rounded-lg py-2.5 pl-10 pr-4 text-sm text-charcoal-900"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </form>

            {isDropdownOpen && searchQuery.trim() && (
              <div className="mt-2 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden divide-y divide-gray-100">
                {isSearching ? (
                  <div className="p-4 text-center text-xs text-gray-500">Searching...</div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        handleSelectProduct(item.slug);
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-2.5 p-2.5 hover:bg-gray-50 cursor-pointer"
                    >
                      <img
                        src={item.primaryImage}
                        alt={item.name}
                        className="w-10 h-10 rounded object-cover"
                      />
                      <div className="flex-1 truncate">
                        <p className="text-xs font-bold text-charcoal-900 truncate">{item.name}</p>
                        <p className="text-[11px] text-brand-700 font-semibold">{formatGBP(item.price)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-gray-500">No items found</div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-1">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-charcoal-900 hover:text-brand-600 border-b border-brand-50"
              >
                {cat.name}
              </Link>
            ))}
            <Link
              href="/account"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-brand-700"
            >
              My Account / Orders
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
