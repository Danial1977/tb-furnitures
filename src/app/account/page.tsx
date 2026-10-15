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
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { formatGBP } from '@/lib/utils';
import { AccountNav } from '@/components/account/AccountNav';

export default function AccountOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/account');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetch('/api/orders')
        .then((r) => r.json())
        .then((data) => {
          setOrders(data.orders || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [session]);

  if (status === 'loading' || loading) {
    return (
      <div className="max-w-6xl mx-auto py-24 text-center px-4">
        <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-gray-500">Loading your TB Furnitures account...</p>
      </div>
    );
  }

  return (
    <div className="bg-sand-50/50 min-h-screen py-10 md:py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="pb-6 border-b border-gray-200">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">
            Client Portal
          </span>
          <h1 className="font-editorial text-3xl font-bold text-charcoal-900 mt-1">
            Order History & Dispatch
          </h1>
          <p className="text-xs text-gray-500">
            Track your white glove furniture deliveries, view order receipts, and download guarantees.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-4">
            <AccountNav
              userEmail={session?.user?.email}
              userName={session?.user?.name}
            />
          </div>

          {/* Orders Content */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-editorial text-xl font-bold text-charcoal-900">
                Your Orders ({orders.length})
              </h2>
              <span className="text-xs text-gray-500 font-mono">Currency: GBP (£)</span>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center space-y-4 shadow-sm">
                <Package className="w-12 h-12 text-gray-300 mx-auto" />
                <h3 className="font-editorial text-lg font-bold text-charcoal-900">
                  No Orders Placed Yet
                </h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                  You haven&apos;t placed any furniture orders yet. Once you order, live two-man delivery tracking, allocated 3-hour time slots, and dispatch notices will appear here.
                </p>
                <div className="pt-2">
                  <Link
                    href="/products"
                    className="inline-block bg-charcoal-900 hover:bg-brand-900 text-white text-xs font-semibold px-6 py-3 rounded-xl transition-colors shadow-sm"
                  >
                    Browse Furniture Collections &rarr;
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-5 hover:border-brand-300 transition-colors"
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100 text-xs">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/account/orders/${order.id}`}
                          className="font-mono font-bold text-sm text-brand-700 bg-brand-50 hover:bg-brand-100 hover:text-brand-950 px-2.5 py-1 rounded-lg border border-brand-200 transition-colors inline-flex items-center gap-1.5 group"
                          title="Click to view full order details"
                        >
                          <span>{order.orderNumber}</span>
                          <ExternalLink className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                        </Link>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-600">
                          Placed on {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="inline-block bg-sage-100 text-sage-800 px-3 py-1 rounded-full font-semibold text-[11px]">
                          {order.status}
                        </span>
                        <Link
                          href={`/account/orders/${order.id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:text-brand-900 hover:underline ml-2"
                        >
                          View Details &rarr;
                        </Link>
                      </div>
                    </div>

                    {/* Summary row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                      <div>
                        <p className="text-gray-400">Total Price</p>
                        <p className="font-bold text-charcoal-900 mt-0.5 text-sm">
                          {formatGBP(order.totalAmount)}
                        </p>
                        <p className="text-[10px] text-green-700 font-medium">Incl. 20% UK VAT</p>
                      </div>

                      <div>
                        <p className="text-gray-400">Delivery Tier</p>
                        <p className="font-semibold text-charcoal-800 mt-0.5">
                          {order.deliveryMethod}
                        </p>
                        <p className="text-[10px] text-gray-500">Room of choice placement</p>
                      </div>

                      <div>
                        <p className="text-gray-400">Courier Tracking</p>
                        <p className="font-mono text-purple-700 mt-0.5 font-bold">
                          {order.trackingNumber || 'Awaiting Hub Allocation'}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-400">Destination Postcode</p>
                        <p className="font-semibold text-charcoal-900 mt-0.5 font-mono">
                          {order.deliveryPostcode}
                        </p>
                        <p className="text-[10px] text-gray-500">{order.deliveryCity}</p>
                      </div>
                    </div>

                    {/* Items Snapshot */}
                    <div className="pt-3 border-t border-gray-100">
                      <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block mb-2">
                        Items in this Order ({order.items?.length || 0})
                      </span>
                      <div className="space-y-2">
                        {order.items?.map((item: any) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs"
                          >
                            <div className="flex items-center gap-3">
                              {item.imageUrl ? (
                                <img
                                  src={item.imageUrl}
                                  alt={item.productName}
                                  className="w-12 h-12 rounded-lg object-cover bg-white shrink-0 border border-gray-200"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center shrink-0">
                                  <Package className="w-5 h-5 text-gray-400" />
                                </div>
                              )}
                              <div>
                                <p className="font-semibold text-charcoal-900">{item.productName}</p>
                                <p className="text-[11px] text-gray-500 font-mono">SKU: {item.sku}</p>
                              </div>
                            </div>

                            <div className="text-right">
                              <p className="font-bold text-charcoal-900">{formatGBP(item.totalPrice)}</p>
                              <p className="text-[11px] text-gray-500">Qty: {item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Guarantees footer */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-[11px] text-gray-500 border-t border-gray-100">
                      <span className="flex items-center gap-1.5 text-sage-700 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        10-Year Structural Frame Guarantee Active
                      </span>
                      <span className="flex items-center gap-1.5 text-brand-700 font-medium">
                        <RotateCcw className="w-3.5 h-3.5" />
                        30-Day In-Home Return Trial
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
