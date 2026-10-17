'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Package,
  Truck,
  MapPin,
  Clock,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Search,
  AlertCircle,
  ArrowRight,
  ShoppingBag,
  CheckCircle2,
} from 'lucide-react';
import { formatGBP } from '@/lib/utils';
import { AccountNav } from '@/components/account/AccountNav';

const STATUS_BADGES: Record<string, { label: string; bg: string; text: string; step: number }> = {
  PENDING_PAYMENT: { label: 'Payment Pending', bg: 'bg-amber-100', text: 'text-amber-800', step: 1 },
  CONFIRMED: { label: 'Order Confirmed', bg: 'bg-blue-100', text: 'text-blue-800', step: 2 },
  PROCESSING: { label: 'Crafting & Quality Check', bg: 'bg-indigo-100', text: 'text-indigo-800', step: 3 },
  DISPATCHED: { label: 'Dispatched / In Transit', bg: 'bg-purple-100', text: 'text-purple-800', step: 4 },
  DELIVERED: { label: 'Delivered', bg: 'bg-emerald-100', text: 'text-emerald-800', step: 5 },
  CANCELLED: { label: 'Cancelled', bg: 'bg-red-100', text: 'text-red-800', step: 0 },
};

export default function OrderStatusPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Quick Tracking Lookup state
  const [lookupOrderNumber, setLookupOrderNumber] = useState('');
  const [lookupPostcode, setLookupPostcode] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      fetch('/api/orders')
        .then((r) => r.json())
        .then((data) => {
          setOrders(data.orders || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [session, status]);

  const handleLookupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError(null);

    const ref = lookupOrderNumber.trim();
    const post = lookupPostcode.trim();

    if (!ref) {
      setLookupError('Please enter your Oakland Order Reference (e.g. TB-84920)');
      return;
    }

    setLookupLoading(true);

    try {
      const res = await fetch('/api/orders/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber: ref, postcode: post }),
      });
      const data = await res.json();

      if (data.success && data.orderId) {
        router.push(`/account/orders/${data.orderId}`);
      } else {
        setLookupError(data.error || 'No matching order found for this reference and delivery postcode.');
      }
    } catch (err: any) {
      setLookupError('Unable to check order status at this time. Please try again.');
    } finally {
      setLookupLoading(false);
    }
  };

  return (
    <div className="bg-sand-50/50 min-h-screen py-10 md:py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-charcoal-900 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <Link href="/account" className="hover:text-charcoal-900 transition-colors">Client Account</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-charcoal-900 font-semibold">Order Status & Dispatch</span>
        </nav>

        {/* Header */}
        <div className="pb-6 border-b border-gray-200 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-600 block mb-1">
              Oakland Logistics & White-Glove Dispatch
            </span>
            <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-charcoal-900">
              Order Status & Tracking
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1.5">
              Live updates on your handcrafted furniture, workshop scheduling, and two-man room delivery.
            </p>
          </div>

          {!session && (
            <Link
              href="/login?callbackUrl=/account/orders"
              className="inline-flex items-center gap-2 bg-charcoal-900 hover:bg-brand-900 text-white text-xs font-semibold px-4 py-2.5 rounded-full transition-colors shadow-sm shrink-0"
            >
              Sign In to View All Orders &rarr;
            </Link>
          )}
        </div>

        {/* Direct Order Reference Lookup Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-200/80 shadow-md">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-brand-700 mb-2">
              <Search className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Fast Order Lookup</span>
            </div>
            <h2 className="font-editorial text-xl sm:text-2xl font-bold text-charcoal-900">
              Track Any Delivery in Real-Time
            </h2>
            <p className="text-xs text-gray-600 mt-1 mb-6">
              Enter your Oakland order reference and UK destination postcode to view workshop progress, dispatched carrier tracking, and ETA.
            </p>

            <form onSubmit={handleLookupSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-6">
                <label className="block text-[11px] font-semibold text-charcoal-800 uppercase tracking-wider mb-1">
                  Order Reference *
                </label>
                <input
                  type="text"
                  placeholder="e.g. TB-84920 or UUID"
                  value={lookupOrderNumber}
                  onChange={(e) => setLookupOrderNumber(e.target.value)}
                  className="w-full bg-brand-50 border border-brand-200 rounded-xl px-3.5 py-2.5 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>

              <div className="sm:col-span-4">
                <label className="block text-[11px] font-semibold text-charcoal-800 uppercase tracking-wider mb-1">
                  Delivery Postcode
                </label>
                <input
                  type="text"
                  placeholder="e.g. LS1 4DY"
                  value={lookupPostcode}
                  onChange={(e) => setLookupPostcode(e.target.value)}
                  className="w-full bg-brand-50 border border-brand-200 rounded-xl px-3.5 py-2.5 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-500 uppercase font-mono"
                />
              </div>

              <div className="sm:col-span-2 flex items-end">
                <button
                  type="submit"
                  disabled={lookupLoading}
                  className="w-full bg-brand-900 hover:bg-brand-800 text-white font-semibold text-xs py-2.5 px-4 rounded-xl transition-all shadow-sm hover:shadow flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {lookupLoading ? 'Locating...' : 'Track'}
                </button>
              </div>
            </form>

            {lookupError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{lookupError}</span>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <AccountNav userEmail={session?.user?.email} userName={session?.user?.name} />
          </div>

          {/* Orders Stream */}
          <div className="lg:col-span-3 space-y-6">
            {loading ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 shadow-sm">
                <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs text-gray-500">Checking your Oakland orders...</p>
              </div>
            ) : orders.length > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-charcoal-900 uppercase tracking-wider">
                    Recent Orders ({orders.length})
                  </h3>
                  <span className="text-xs text-gray-500">All prices include 20% UK VAT</span>
                </div>

                {orders.map((order) => {
                  const badge = STATUS_BADGES[order.status] || {
                    label: order.status,
                    bg: 'bg-gray-100',
                    text: 'text-gray-800',
                    step: 1,
                  };

                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-3xl p-6 sm:p-7 border border-brand-100 shadow-sm hover:shadow-md transition-all space-y-6"
                    >
                      {/* Top Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/account/orders/${order.id}`}
                            className="font-mono font-bold text-sm text-brand-700 bg-brand-50 hover:bg-brand-100 hover:text-brand-950 px-3 py-1.5 rounded-lg border border-brand-200 transition-colors inline-flex items-center gap-1.5"
                            title="View full order tracking & invoice"
                          >
                            <span>{order.orderNumber}</span>
                            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                          </Link>
                          <span className="text-gray-300">•</span>
                          <span className="text-xs text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className={`inline-block ${badge.bg} ${badge.text} px-3 py-1 rounded-full font-semibold text-[11px] shadow-sm`}
                          >
                            {badge.label}
                          </span>
                          <Link
                            href={`/account/orders/${order.id}`}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:text-brand-900 ml-1"
                          >
                            Track Logistics &rarr;
                          </Link>
                        </div>
                      </div>

                      {/* Timeline Preview (5 steps) */}
                      <div className="pt-1">
                        <div className="grid grid-cols-5 gap-1.5 text-center">
                          {[
                            { name: 'Received', step: 1 },
                            { name: 'Confirmed', step: 2 },
                            { name: 'Crafting', step: 3 },
                            { name: 'In Transit', step: 4 },
                            { name: 'Delivered', step: 5 },
                          ].map((s) => {
                            const isCompleted = badge.step >= s.step;
                            const isCurrent = badge.step === s.step;

                            return (
                              <div key={s.name} className="flex flex-col items-center gap-1">
                                <div
                                  className={`w-full h-1.5 rounded-full transition-all ${
                                    isCompleted
                                      ? 'bg-brand-700'
                                      : 'bg-gray-100'
                                  }`}
                                />
                                <span
                                  className={`text-[10px] font-medium truncate w-full ${
                                    isCurrent
                                      ? 'text-brand-800 font-bold'
                                      : isCompleted
                                      ? 'text-charcoal-800'
                                      : 'text-gray-400'
                                  }`}
                                >
                                  {s.name}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Order Details Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-2">
                        <div>
                          <p className="text-gray-400">Total Amount</p>
                          <p className="font-bold text-charcoal-900 mt-0.5 text-sm">
                            {formatGBP(order.totalAmount)}
                          </p>
                          <p className="text-[10px] text-emerald-700 font-medium">Payment Paid</p>
                        </div>

                        <div>
                          <p className="text-gray-400">Delivery Tier</p>
                          <p className="font-semibold text-charcoal-800 mt-0.5">
                            {order.deliveryMethod || 'Standard Delivery'}
                          </p>
                          <p className="text-[10px] text-gray-500">Room of choice placement</p>
                        </div>

                        <div>
                          <p className="text-gray-400">Tracking Code</p>
                          <p className="font-mono text-purple-700 mt-0.5 font-bold">
                            {order.trackingNumber || 'Awaiting Hub Allocation'}
                          </p>
                        </div>

                        <div>
                          <p className="text-gray-400">Destination Postcode</p>
                          <p className="font-semibold text-charcoal-900 mt-0.5 font-mono">
                            {order.deliveryPostcode || 'UK Mainland'}
                          </p>
                          <p className="text-[10px] text-gray-500">{order.deliveryCity}</p>
                        </div>
                      </div>

                      {/* Items Snapshot */}
                      <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xs text-gray-600">
                          {order.items?.length || 0} items in package
                        </span>
                        <Link
                          href={`/account/orders/${order.id}`}
                          className="text-xs font-semibold text-brand-700 hover:text-brand-900 flex items-center gap-1"
                        >
                          View Full Invoice & Item List <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 shadow-sm space-y-4">
                <div className="w-16 h-16 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
                  <Package className="w-8 h-8" />
                </div>
                <h3 className="font-editorial text-2xl font-bold text-charcoal-900">
                  {session ? 'No Orders on Record Yet' : 'Track Your Oakland Order'}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
                  {session
                    ? 'When you place an order with Oakland Furniture & Flooring, live tracking and white-glove logistics will appear right here.'
                    : 'Use the order lookup box above with your order reference number, or sign in to your customer account to view past deliveries.'}
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 bg-brand-900 hover:bg-brand-800 text-white text-xs font-semibold px-6 py-3 rounded-full transition-colors shadow-sm"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Browse Furniture Collections
                  </Link>
                  {!session && (
                    <Link
                      href="/login?callbackUrl=/account/orders"
                      className="inline-flex items-center gap-2 bg-brand-50 hover:bg-brand-100 text-charcoal-900 text-xs font-semibold px-6 py-3 rounded-full transition-colors border border-brand-200"
                    >
                      Sign In to Account
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
