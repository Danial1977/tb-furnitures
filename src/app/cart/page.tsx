'use client';

import Link from 'next/link';
import { useCart, useSettings } from '@/components/providers/Providers';
import { formatGBP } from '@/lib/utils';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export default function CartPage() {
  const { items, subtotal, hasLargeItem, updateQuantity, removeFromCart, clearCart } = useCart();
  const { settings, calculateDeliveryFee } = useSettings();
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  const deliveryFee = calculateDeliveryFee(subtotal, hasLargeItem);
  const finalTotal = Math.max(0, subtotal - discount + deliveryFee);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const code = promoCode.trim().toUpperCase();

    if (code === 'WELCOME50') {
      if (subtotal >= 500) {
        setDiscount(50);
        setPromoApplied(true);
      } else {
        setPromoError('Promo code WELCOME50 requires a minimum order value of £500.');
      }
    } else if (code === 'AUTUMN10') {
      setDiscount(subtotal * 0.1);
      setPromoApplied(true);
    } else {
      setPromoError('Invalid or expired coupon code. Try WELCOME50 or AUTUMN10.');
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center mx-auto text-brand-600">
          <Truck className="w-8 h-8" />
        </div>
        <h1 className="font-editorial text-3xl font-bold text-charcoal-900">Your Basket is Empty</h1>
        <p className="text-sm text-charcoal-700/80 max-w-md mx-auto">
          Explore our handcrafted collections of sofas, solid oak dining sets, and bedroom retreats.
        </p>
        <div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-charcoal-900 hover:bg-brand-900 text-white text-sm font-semibold px-8 py-3.5 rounded-full transition-all"
          >
            Start Shopping &rarr;
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-charcoal-900 mb-8">
        Your Shopping Basket
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Items List */}
        <div className="lg:col-span-8 bg-white border border-brand-100 rounded-2xl p-6 shadow-sm divide-y divide-brand-100">
          {items.map((item) => (
            <div key={item.id} className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-6 items-start">
              {/* Thumbnail */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-brand-100 shrink-0">
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
              </div>

              {/* Info */}
              <div className="flex-1 space-y-1">
                <h3 className="font-editorial text-lg text-charcoal-900 font-semibold">{item.name}</h3>
                <p className="text-xs text-gray-500 font-mono">SKU: {item.sku}</p>
                {item.isLargeItem && (
                  <span className="inline-block bg-brand-100 text-brand-800 text-[10px] font-semibold px-2 py-0.5 rounded">
                    Two-Man Delivery Required
                  </span>
                )}
                <p className="text-sm font-bold text-charcoal-900 pt-1">{formatGBP(item.price)}</p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-brand-200 rounded-lg overflow-hidden bg-brand-50">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-2 hover:bg-brand-200 transition-colors text-charcoal-700"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-2 hover:bg-brand-200 transition-colors text-charcoal-700"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="Remove Item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <div className="pt-4 flex justify-between items-center text-xs">
            <button onClick={clearCart} className="text-gray-400 hover:text-red-600 underline">
              Clear entire basket
            </button>
            <Link href="/products" className="text-brand-600 font-semibold hover:underline">
              &larr; Continue shopping
            </Link>
          </div>
        </div>

        {/* Right Column: Order Summary & Checkout Action */}
        <div className="lg:col-span-4 bg-white border border-brand-100 rounded-2xl p-6 shadow-sm space-y-6">
          <h2 className="font-editorial text-xl font-bold text-charcoal-900 pb-3 border-b border-brand-100">
            Order Summary
          </h2>

          {/* Dynamic Free Delivery Notification & Progress Bar */}
          <div className="p-3.5 rounded-xl border text-xs transition-all bg-brand-50/70 border-brand-200">
            {subtotal >= settings.freeDeliveryThreshold ? (
              <div className="flex items-center gap-2 text-emerald-800 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>You qualify for <strong>FREE Standard Delivery</strong>! (Orders over {formatGBP(settings.freeDeliveryThreshold)})</span>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-charcoal-800">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-brand-600" />
                    <span>Add <strong>{formatGBP(settings.freeDeliveryThreshold - subtotal)}</strong> for FREE delivery</span>
                  </span>
                  <span className="text-[10px] font-bold text-brand-600">
                    {Math.round((subtotal / settings.freeDeliveryThreshold) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-brand-200/60 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-brand-600 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.round((subtotal / settings.freeDeliveryThreshold) * 100))}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Promo code */}
          <form onSubmit={handleApplyPromo} className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Discount Code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                disabled={promoApplied}
                className="flex-1 bg-brand-50 border border-brand-200 rounded-lg px-3 py-2 text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-brand-400"
              />
              <button
                type="submit"
                disabled={promoApplied}
                className="bg-brand-200 hover:bg-brand-300 text-charcoal-900 text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                {promoApplied ? 'Applied' : 'Apply'}
              </button>
            </div>
            {promoError && <p className="text-[11px] text-red-600">{promoError}</p>}
            {promoApplied && <p className="text-[11px] text-sage-700">✓ Discount applied successfully!</p>}
          </form>

          {/* Cost breakdown */}
          <div className="space-y-3 text-xs text-charcoal-800 border-t border-brand-100 pt-4">
            <div className="flex justify-between">
              <span className="text-gray-500">Items Subtotal</span>
              <span className="font-semibold">{formatGBP(subtotal)}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-red-700">
                <span>Promotional Discount</span>
                <span>-{formatGBP(discount)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-gray-500">
                UK Delivery {hasLargeItem ? '(Specialist Two-Man)' : '(Standard)'}
              </span>
              <span className="font-semibold">
                {deliveryFee === 0 ? <span className="text-sage-700">FREE</span> : formatGBP(deliveryFee)}
              </span>
            </div>

            <div className="flex justify-between text-[11px] text-gray-400">
              <span>Included UK VAT (20%)</span>
              <span>{formatGBP(finalTotal * (20 / 120))}</span>
            </div>

            <div className="flex justify-between text-base font-bold text-charcoal-900 border-t border-brand-100 pt-3">
              <span>Estimated Total (GBP)</span>
              <span>{formatGBP(finalTotal)}</span>
            </div>
          </div>

          {/* Checkout CTA */}
          <Link
            href="/checkout"
            className="w-full flex items-center justify-center gap-2 bg-charcoal-900 hover:bg-brand-900 text-white font-semibold py-3.5 rounded-full transition-all shadow-md text-sm"
          >
            Proceed to Checkout
            <ArrowRight className="w-4 h-4" />
          </Link>

          <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-gray-500 text-center">
            <ShieldCheck className="w-4 h-4 text-brand-500" />
            <span>Guaranteed Secure 256-bit Encrypted Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
}
