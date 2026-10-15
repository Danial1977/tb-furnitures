'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Printer,
  MapPin,
  ShieldCheck,
  PhoneCall,
  Mail,
  ChevronRight,
  ExternalLink,
  ShoppingBag,
} from 'lucide-react';
import { formatGBP } from '@/lib/utils';
import { AccountNav } from '@/components/account/AccountNav';

const TRACKING_STEPS = [
  { key: 'PENDING_PAYMENT', label: 'Order Received', desc: 'Awaiting payment verification' },
  { key: 'CONFIRMED', label: 'Order Confirmed', desc: 'Payment approved & scheduled for workshop' },
  { key: 'PROCESSING', label: 'Crafting & Preparation', desc: 'Handcrafted inspection & packaging' },
  { key: 'DISPATCHED', label: 'Dispatched to Hub', desc: 'In transit with UK logistics carrier' },
  { key: 'DELIVERED', label: 'Delivered', desc: 'Assembled in room of choice' },
];

export default function ClientOrderDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/login?callbackUrl=/account/orders/${orderId}`);
    }
  }, [status, router, orderId]);

  useEffect(() => {
    if (session && orderId) {
      setLoading(true);
      fetch(`/api/orders/${orderId}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.success && data.order) {
            setOrder(data.order);
          } else {
            setError(data.error || 'Order could not be found');
          }
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message || 'Error fetching order');
          setLoading(false);
        });
    }
  }, [session, orderId]);

  if (status === 'loading' || loading) {
    return (
      <div className="bg-sand-50/50 min-h-screen py-24 text-center px-4">
        <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-gray-500">Loading your furniture order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-sand-50/50 min-h-screen py-16 px-4">
        <div className="max-w-xl mx-auto bg-white border border-gray-200 rounded-2xl p-8 text-center space-y-4 shadow-sm">
          <Package className="w-12 h-12 text-gray-300 mx-auto" />
          <h2 className="font-editorial text-xl font-bold text-charcoal-900">Order Not Located</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            {error || 'This order could not be retrieved from your client account.'}
          </p>
          <div className="pt-2">
            <Link
              href="/account"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-charcoal-900 hover:bg-brand-900 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Return to My Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Calculate current progress index
  const statusOrder = ['PENDING_PAYMENT', 'CONFIRMED', 'PROCESSING', 'DISPATCHED', 'DELIVERED'];
  let currentStepIdx = statusOrder.indexOf(order.status);
  if (order.status === 'IN_TRANSIT') currentStepIdx = 3;
  if (currentStepIdx === -1) currentStepIdx = 1;

  return (
    <div className="bg-sand-50/50 min-h-screen py-10 md:py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Link href="/account" className="hover:text-brand-700">Account</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <Link href="/account" className="hover:text-brand-700">Orders</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="font-mono font-bold text-charcoal-900">{order.orderNumber}</span>
        </div>

        {/* Header with Print Receipt Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-charcoal-900">
                Order {order.orderNumber}
              </h1>
              <span className="inline-block px-3 py-1 rounded-full bg-sage-100 text-sage-800 font-semibold text-xs border border-sage-200">
                {order.status.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} at{' '}
              {new Date(order.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} • Payment: {order.paymentStatus}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-charcoal-900 rounded-xl text-xs font-semibold shadow-sm transition-colors"
            >
              <Printer className="w-4 h-4 text-gray-500" />
              Print VAT Receipt
            </button>
            <Link
              href="/account"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-charcoal-900 hover:bg-brand-900 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" /> All Orders
            </Link>
          </div>
        </div>

        {/* Delivery Progress Bar */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal-900 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-brand-600" /> White Glove Delivery Progress
            </span>
            <span className="text-xs text-brand-700 font-semibold">
              Carrier: {order.deliveryMethod}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
            {TRACKING_STEPS.map((st, i) => {
              const isDone = i <= currentStepIdx;
              const isCurrent = i === currentStepIdx;
              return (
                <div
                  key={st.key}
                  className={`p-3 rounded-xl border text-left transition-colors ${
                    isCurrent
                      ? 'border-brand-600 bg-brand-50/60 ring-1 ring-brand-500'
                      : isDone
                      ? 'border-emerald-200 bg-emerald-50/40'
                      : 'border-gray-100 bg-gray-50/60 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    {isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    )}
                    <span className="font-bold text-xs text-charcoal-900 truncate">
                      {st.label}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 leading-tight">{st.desc}</p>
                </div>
              );
            })}
          </div>

          {order.trackingNumber && (
            <div className="p-3 bg-brand-50/50 rounded-xl border border-brand-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Logistics Tracking Reference:</span>
                <span className="font-mono font-bold text-charcoal-900 bg-white px-2 py-0.5 rounded border border-gray-200">
                  {order.trackingNumber}
                </span>
              </div>
              {order.trackingUrl && (
                <a
                  href={order.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-700 hover:text-brand-900 font-bold inline-flex items-center gap-1 hover:underline"
                >
                  Live Courier Tracking Portal <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Ordered Furniture Pieces */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="font-editorial text-lg font-bold text-charcoal-900">
                Ordered Furniture Items ({order.items?.length || 0})
              </h2>

              <div className="divide-y divide-gray-100">
                {order.items?.map((item: any) => (
                  <div key={item.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          className="w-16 h-16 rounded-xl object-cover border border-gray-200 bg-gray-50 shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0">
                          <ShoppingBag className="w-6 h-6 text-brand-400" />
                        </div>
                      )}
                      <div>
                        {item.product?.slug ? (
                          <Link
                            href={`/products/${item.product.slug}`}
                            className="font-bold text-sm text-charcoal-900 hover:text-brand-600 transition-colors inline-flex items-center gap-1"
                          >
                            {item.productName}
                            <ExternalLink className="w-3.5 h-3.5 opacity-50" />
                          </Link>
                        ) : (
                          <p className="font-bold text-sm text-charcoal-900">{item.productName}</p>
                        )}
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-500">
                          <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-[11px]">
                            SKU: {item.sku}
                          </span>
                          {item.variantTitle && (
                            <span className="text-brand-700 font-medium">
                              • Option: {item.variantTitle}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 text-right text-xs">
                      <div>
                        <span className="text-gray-400 block">Unit Price</span>
                        <span className="font-semibold text-charcoal-900">{formatGBP(item.unitPrice)}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block">Qty</span>
                        <span className="font-mono font-bold text-charcoal-900 bg-gray-50 px-2 py-1 rounded border border-gray-200">
                          × {item.quantity}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400 block">Line Total</span>
                        <span className="font-bold text-sm text-charcoal-900">{formatGBP(item.totalPrice)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Financials */}
              <div className="pt-4 border-t border-gray-200 flex flex-col items-end space-y-2 text-xs">
                <div className="w-full sm:w-64 space-y-1.5">
                  <div className="flex justify-between text-gray-600">
                    <span>Items Subtotal:</span>
                    <span className="font-semibold text-charcoal-900">{formatGBP(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>White Glove Delivery:</span>
                    <span className="font-semibold text-charcoal-900">{formatGBP(order.deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>UK VAT (20% included):</span>
                    <span className="font-semibold text-charcoal-900">{formatGBP(order.vatAmount)}</span>
                  </div>
                  {order.discountAmount > 0 && (
                    <div className="flex justify-between text-green-700 font-medium">
                      <span>Discount:</span>
                      <span>-{formatGBP(order.discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold text-charcoal-900 pt-2 border-t border-gray-200">
                    <span>Paid in Full:</span>
                    <span className="text-base text-brand-800 font-mono">{formatGBP(order.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Guarantees Box */}
            <div className="bg-sage-50/60 border border-sage-200 rounded-2xl p-5 shadow-sm space-y-2 text-xs">
              <span className="text-[11px] uppercase font-bold text-sage-900 tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-sage-600" /> TB Furnitures Manufacturer Guarantees
              </span>
              <p className="text-sage-900/80 leading-relaxed">
                All timber frames and extending dining tables are backed by our 10-Year Structural Guarantee. Upholstery fabrics and pocket sprung mattresses include a 5-Year Craftsmanship Guarantee.
              </p>
            </div>
          </div>

          {/* Right Column: Delivery Address & Customer Care */}
          <div className="lg:col-span-4 space-y-6 text-xs">
            {/* Delivery Destination */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand-600" /> Delivery Address
              </span>
              <div className="space-y-1 text-charcoal-800 leading-relaxed">
                <p className="font-bold text-charcoal-900">{order.deliveryFullName}</p>
                <p>{order.deliveryAddress1}</p>
                {order.deliveryAddress2 && <p>{order.deliveryAddress2}</p>}
                <p>{order.deliveryCity}</p>
                {order.deliveryCounty && <p>{order.deliveryCounty}</p>}
                <p className="font-mono font-bold text-brand-800">{order.deliveryPostcode}</p>
                <p className="text-gray-500">{order.deliveryCountry}</p>
              </div>
              <div className="pt-2 border-t border-gray-100 text-[11px] text-gray-500 space-y-1">
                <p>Service: <strong>{order.deliveryMethod}</strong></p>
                {order.deliveryPhone && <p>Contact: {order.deliveryPhone}</p>}
              </div>
            </div>

            {/* Customer Care Contact */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-brand-600" /> Need Help with this Order?
              </span>
              <p className="text-gray-600 leading-relaxed text-[11px]">
                Our London Marylebone team is here to assist with room delivery rescheduling, access checks, or finish queries.
              </p>
              <div className="space-y-2 pt-1 font-semibold text-charcoal-900">
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-3.5 h-3.5 text-brand-600" />
                  <a href="tel:08001234567" className="hover:text-brand-600">0800 123 4567 (Mon-Sat 9am-6pm)</a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-brand-600" />
                  <a href="mailto:support@tbfurnitures.co.uk" className="hover:text-brand-600">support@tbfurnitures.co.uk</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
