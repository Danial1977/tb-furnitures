'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/providers/Providers';
import { formatGBP, calculateDeliveryFee } from '@/lib/utils';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, Lock, CheckCircle2, ArrowRight } from 'lucide-react';

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { items, subtotal, hasLargeItem, clearCart } = useCart();

  // Step 1: Authentication Guard
  // Redirect unauthenticated customers to login with callback
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/checkout');
    }
  }, [status, router]);

  // Form states for delivery
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    county: '',
    postcode: '',
    deliveryMethod: 'STANDARD',
    customerNotes: '',
  });

  const [deliveryMethod, setDeliveryMethod] = useState<'STANDARD' | 'TWO_MAN' | 'EXPRESS'>('STANDARD');
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState<any | null>(null);

  // Auto-fill user name if logged in
  useEffect(() => {
    if (session?.user?.name && !formData.fullName) {
      setFormData((prev) => ({ ...prev, fullName: session.user?.name || '' }));
    }
  }, [session, formData.fullName]);

  // Calculate pricing
  const baseDelivery = calculateDeliveryFee(subtotal, hasLargeItem);
  const deliverySurcharge = deliveryMethod === 'EXPRESS' ? 25.0 : deliveryMethod === 'TWO_MAN' ? 49.99 : baseDelivery;
  const total = subtotal + deliverySurcharge;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.addressLine1 || !formData.city || !formData.postcode) {
      alert('Please fill out all required address fields.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          deliveryAddress: formData,
          deliveryMethod,
          subtotal,
          deliveryFee: deliverySurcharge,
          totalAmount: total,
        }),
      });

      const data = await res.json();

      if (data.success) {
        clearCart();
        setOrderComplete(data.order);
      } else {
        alert(data.error || 'Failed to place order.');
      }
    } catch (err: any) {
      alert('Network error placing order: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="max-w-4xl mx-auto py-24 text-center">
        <p className="text-sm text-gray-500">Checking secure customer session...</p>
      </div>
    );
  }

  // Mandatory Authentication Banner if not signed in
  if (!session) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-12 h-12 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6" />
        </div>
        <h1 className="font-editorial text-2xl font-bold text-charcoal-900">
          Customer Authentication Required
        </h1>
        <p className="text-sm text-charcoal-700/80">
          To ensure accurate order tracking, UK delivery scheduling, and guarantee verification, please sign in or register an account before checkout.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/login?callbackUrl=/checkout"
            className="w-full bg-charcoal-900 hover:bg-brand-900 text-white text-sm font-semibold py-3 rounded-full transition-colors"
          >
            Sign In with Email
          </Link>
          <Link
            href="/register?callbackUrl=/checkout"
            className="w-full bg-brand-100 hover:bg-brand-200 text-charcoal-900 text-sm font-semibold py-3 rounded-full transition-colors"
          >
            Create New Account
          </Link>
        </div>
      </div>
    );
  }

  // Order Confirmed Screen
  if (orderComplete) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-sage-100 text-sage-700 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h1 className="font-editorial text-3xl font-bold text-charcoal-900">
          Thank You! Your Order is Confirmed
        </h1>
        <p className="text-sm text-charcoal-700/80">
          Order reference: <span className="font-mono font-bold text-brand-700">{orderComplete.orderNumber}</span>
        </p>
        <div className="bg-white border border-brand-100 rounded-2xl p-6 text-left space-y-3 max-w-lg mx-auto text-xs text-charcoal-800">
          <p><strong>Deliver to:</strong> {orderComplete.deliveryFullName}</p>
          <p><strong>Address:</strong> {orderComplete.deliveryAddress1}, {orderComplete.deliveryCity}, {orderComplete.deliveryPostcode}</p>
          <p><strong>Delivery Method:</strong> {orderComplete.deliveryMethod}</p>
          <p><strong>Total Paid:</strong> {formatGBP(orderComplete.totalAmount)}</p>
          <p className="text-[11px] text-gray-500 pt-2 border-t border-brand-50">
            A confirmation email has been dispatched to <strong>{session.user?.email}</strong>. Our logistics concierge will contact you 24 hours prior to dispatch with your 2-hour delivery window.
          </p>
        </div>
        <div className="flex justify-center gap-4 pt-4">
          <Link
            href="/account/orders"
            className="bg-charcoal-900 hover:bg-brand-900 text-white text-xs font-semibold px-6 py-3 rounded-full transition-colors"
          >
            View Order Status
          </Link>
          <Link
            href="/products"
            className="bg-brand-100 hover:bg-brand-200 text-charcoal-900 text-xs font-semibold px-6 py-3 rounded-full transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">
          Logged in as {session.user?.email}
        </span>
        <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-charcoal-900 mt-1">
          Secure UK Delivery & Checkout
        </h1>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Delivery Address & Method */}
        <div className="lg:col-span-7 space-y-8">
          {/* Section 1: Address */}
          <div className="bg-white border border-brand-100 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="font-editorial text-xl font-bold text-charcoal-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-brand-600" />
              1. UK Delivery Address
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                  Full Recipient Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="e.g. Eleanor Vance"
                  className="w-full bg-brand-50 border border-brand-200 rounded-lg px-3 py-2 text-sm text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-brand-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                  Mobile Phone (for delivery driver SMS) *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="e.g. 07700 900077"
                  className="w-full bg-brand-50 border border-brand-200 rounded-lg px-3 py-2 text-sm text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-brand-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                  UK Postcode *
                </label>
                <input
                  type="text"
                  name="postcode"
                  required
                  value={formData.postcode}
                  onChange={handleInputChange}
                  placeholder="e.g. SW1A 1AA"
                  className="w-full bg-brand-50 border border-brand-200 rounded-lg px-3 py-2 text-sm text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-brand-400 uppercase font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                  Address Line 1 (Street & House Name/Number) *
                </label>
                <input
                  type="text"
                  name="addressLine1"
                  required
                  value={formData.addressLine1}
                  onChange={handleInputChange}
                  placeholder="e.g. 14 Highfield Manor, Kensington"
                  className="w-full bg-brand-50 border border-brand-200 rounded-lg px-3 py-2 text-sm text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-brand-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                  Address Line 2 (Apartment, Suite, Unit - Optional)
                </label>
                <input
                  type="text"
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleInputChange}
                  placeholder="e.g. Flat 3B"
                  className="w-full bg-brand-50 border border-brand-200 rounded-lg px-3 py-2 text-sm text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-brand-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                  Town / City *
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="e.g. London"
                  className="w-full bg-brand-50 border border-brand-200 rounded-lg px-3 py-2 text-sm text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-brand-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                  County (Optional)
                </label>
                <input
                  type="text"
                  name="county"
                  value={formData.county}
                  onChange={handleInputChange}
                  placeholder="e.g. Greater London"
                  className="w-full bg-brand-50 border border-brand-200 rounded-lg px-3 py-2 text-sm text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-brand-400"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Delivery Method */}
          <div className="bg-white border border-brand-100 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="font-editorial text-xl font-bold text-charcoal-900">
              2. Select Delivery Service
            </h2>

            <div className="space-y-3">
              <label
                className={`flex items-start justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                  deliveryMethod === 'STANDARD'
                    ? 'border-brand-500 bg-brand-50/50 ring-1 ring-brand-400'
                    : 'border-brand-200 hover:border-brand-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="deliveryMethod"
                    checked={deliveryMethod === 'STANDARD'}
                    onChange={() => setDeliveryMethod('STANDARD')}
                    className="mt-1 text-brand-600 focus:ring-brand-400"
                  />
                  <div>
                    <p className="text-sm font-semibold text-charcoal-900">Standard UK Mainland Courier</p>
                    <p className="text-xs text-gray-500">Delivered within 3–5 working days with GPS tracking.</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-charcoal-900">
                  {baseDelivery === 0 ? 'FREE' : formatGBP(baseDelivery)}
                </span>
              </label>

              <label
                className={`flex items-start justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                  deliveryMethod === 'TWO_MAN'
                    ? 'border-brand-500 bg-brand-50/50 ring-1 ring-brand-400'
                    : 'border-brand-200 hover:border-brand-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="deliveryMethod"
                    checked={deliveryMethod === 'TWO_MAN'}
                    onChange={() => setDeliveryMethod('TWO_MAN')}
                    className="mt-1 text-brand-600 focus:ring-brand-400"
                  />
                  <div>
                    <p className="text-sm font-semibold text-charcoal-900">Specialist Two-Man White Glove Service</p>
                    <p className="text-xs text-gray-500">Delivered to room of choice, unboxed, assembled, and packaging recycled.</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-charcoal-900">{formatGBP(49.99)}</span>
              </label>
            </div>
          </div>

          {/* Section 3: Payment Method */}
          <div className="bg-white border border-brand-100 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="font-editorial text-xl font-bold text-charcoal-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-brand-600" />
              3. Payment Information
            </h2>
            <div className="p-4 rounded-xl bg-brand-50 border border-brand-200 text-xs text-charcoal-800 space-y-2">
              <p className="font-semibold text-charcoal-900">Stripe Test Mode Enabled</p>
              <p>
                This order will be processed safely via verified Stripe backend simulation. No real funds will be charged.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Order Review */}
        <div className="lg:col-span-5 bg-white border border-brand-100 rounded-2xl p-6 shadow-sm space-y-6">
          <h2 className="font-editorial text-xl font-bold text-charcoal-900 pb-3 border-b border-brand-100">
            Order Review ({items.length} items)
          </h2>

          <div className="divide-y divide-brand-100 max-h-80 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.id} className="py-3 flex items-center gap-4">
                <img src={item.imageUrl} alt={item.name} className="w-14 h-14 rounded-lg object-cover bg-brand-100 shrink-0" />
                <div className="flex-1 text-xs space-y-0.5">
                  <p className="font-semibold text-charcoal-900 line-clamp-1">{item.name}</p>
                  <p className="text-gray-500">Qty: {item.quantity}</p>
                  <p className="font-bold text-charcoal-900">{formatGBP(item.price * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2.5 text-xs text-charcoal-800 border-t border-brand-100 pt-4">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-semibold">{formatGBP(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Delivery Fee</span>
              <span className="font-semibold">
                {deliverySurcharge === 0 ? <span className="text-sage-700">FREE</span> : formatGBP(deliverySurcharge)}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold text-charcoal-900 border-t border-brand-100 pt-3">
              <span>Total Payable</span>
              <span>{formatGBP(total)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || items.length === 0}
            className="w-full flex items-center justify-center gap-2 bg-charcoal-900 hover:bg-brand-900 disabled:opacity-60 text-white font-semibold py-4 rounded-full transition-all shadow-md text-sm"
          >
            {loading ? 'Processing Order...' : `Confirm & Pay ${formatGBP(total)}`}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
