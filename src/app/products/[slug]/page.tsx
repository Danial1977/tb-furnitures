'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useCart } from '@/components/providers/Providers';
import { formatGBP } from '@/lib/utils';
import Link from 'next/link';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  Check,
  ShoppingBag,
  Heart,
  ChevronRight,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedVariant, setSelectedVariant] = useState<any | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const { addToCart } = useCart();

  useEffect(() => {
    if (slug) {
      setLoading(true);
      fetch(`/api/products/${slug}`)
        .then((r) => r.json())
        .then((res) => {
          if (res.product) {
            setProduct(res.product);
            setSelectedImage(res.product.primaryImage);
            if (res.product.variants?.length > 0) {
              setSelectedVariant(res.product.variants[0]);
            }
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: `${product.id}-${selectedVariant?.id || 'default'}`,
      productId: product.id,
      variantId: selectedVariant?.id,
      name: product.name,
      sku: selectedVariant?.sku || product.sku,
      variantTitle: selectedVariant?.title,
      price: selectedVariant?.priceOverride || product.price,
      quantity,
      imageUrl: selectedImage || product.primaryImage,
      isLargeItem: product.isLargeItem,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-500">Retrieving handcrafted furniture specifications...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <h1 className="font-editorial text-3xl font-bold text-charcoal-900">Piece Not Found</h1>
        <p className="text-sm text-charcoal-700">
          The requested furniture item may have been archived or is temporarily out of season.
        </p>
        <Link
          href="/products"
          className="inline-block bg-charcoal-900 hover:bg-brand-900 text-white text-xs font-semibold px-6 py-3 rounded-full transition-colors"
        >
          &larr; Return to Catalogue
        </Link>
      </div>
    );
  }

  const currentPrice = selectedVariant?.priceOverride || product.price;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-gray-500">
        <Link href="/" className="hover:text-charcoal-900">Home</Link>
        <ChevronRight className="w-3 h-3 text-gray-400" />
        <Link href="/products" className="hover:text-charcoal-900">Catalogue</Link>
        <ChevronRight className="w-3 h-3 text-gray-400" />
        <Link href={`/categories/${product.categorySlug}`} className="hover:text-charcoal-900">
          {product.categoryName}
        </Link>
        <ChevronRight className="w-3 h-3 text-gray-400" />
        <span className="text-charcoal-900 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Gallery & Purchase Action */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Product Images Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden bg-brand-100/40 border border-brand-200/60 shadow-lg">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {product.isLargeItem && (
              <div className="absolute top-4 left-4 bg-charcoal-900/90 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-brand-400" />
                <span>Specialist Two-Man Room Delivery</span>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images?.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img.url)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImage === img.url ? 'border-brand-600 ring-2 ring-brand-300' : 'border-brand-200 hover:border-brand-400'
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Specifications & Add to Basket */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <span className="text-xs uppercase tracking-widest font-semibold text-brand-600 block mb-1">
              {product.brandName}
            </span>
            <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-charcoal-900 leading-tight">
              {product.name}
            </h1>
            <p className="text-xs text-gray-500 font-mono mt-1">SKU: {selectedVariant?.sku || product.sku}</p>
          </div>

          {/* Reviews Star Preview */}
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <span className="font-semibold text-charcoal-800">4.9 / 5.0</span>
            <span className="text-gray-400">(24 verified British homeowner reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 pb-4 border-b border-brand-100">
            <span className="text-3xl font-bold text-charcoal-900">{formatGBP(currentPrice)}</span>
            {product.compareAtPrice && product.compareAtPrice > currentPrice && (
              <span className="text-base text-gray-400 line-through">
                {formatGBP(product.compareAtPrice)}
              </span>
            )}
            <span className="text-xs text-sage-700 font-semibold ml-auto">
              ✓ In Stock — UK Dispatch in 48h
            </span>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed">
            {product.description}
          </p>

          {/* Variants */}
          {product.variants?.length > 0 && (
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-charcoal-800">
                Finish & Size Configuration
              </label>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v: any) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      selectedVariant?.id === v.id
                        ? 'border-charcoal-900 bg-charcoal-900 text-white'
                        : 'border-brand-200 bg-brand-50 text-charcoal-800 hover:border-brand-400'
                    }`}
                  >
                    {v.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & CTA */}
          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center border border-brand-200 rounded-full bg-brand-50 p-1">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-full flex items-center justify-center text-charcoal-800 hover:bg-brand-200 transition-colors font-semibold"
              >
                -
              </button>
              <span className="px-3 text-xs font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-charcoal-800 hover:bg-brand-200 transition-colors font-semibold"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-full font-semibold text-xs transition-all shadow-md ${
                added
                  ? 'bg-sage-700 text-white'
                  : 'bg-charcoal-900 hover:bg-brand-900 text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              {added ? '✓ Added to Basket' : `Add to Basket — ${formatGBP(currentPrice * quantity)}`}
            </button>
          </div>

          {/* Guarantees Box */}
          <div className="bg-brand-50/70 border border-brand-200/60 rounded-2xl p-4 space-y-3 text-xs text-charcoal-800">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0" />
              <span><strong>10-Year Frame Guarantee</strong> included automatically</span>
            </div>
            <div className="flex items-center gap-2.5">
              <RotateCcw className="w-4 h-4 text-brand-600 shrink-0" />
              <span><strong>30-Day In-Home Trial</strong> — Free returns across mainland UK</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-brand-600 shrink-0" />
              <span>Complimentary standard delivery on orders over £500</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
