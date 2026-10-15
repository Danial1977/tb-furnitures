'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ShoppingBag,
  Truck,
  CheckCircle2,
  Package,
  MapPin,
  CreditCard,
  User,
  ExternalLink,
  Printer,
  Trash2,
  Clock,
  Save,
  AlertCircle,
  FileText,
  Phone,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import { formatGBP } from '@/lib/utils';

const ORDER_STATUSES = [
  'PENDING_PAYMENT',
  'CONFIRMED',
  'PROCESSING',
  'IN_TRANSIT',
  'DISPATCHED',
  'DELIVERED',
  'CANCELLED',
  'REFUNDED',
];

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  PENDING_PAYMENT: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  CONFIRMED: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
  PROCESSING: { bg: 'bg-indigo-50', text: 'text-indigo-800', border: 'border-indigo-200' },
  IN_TRANSIT: { bg: 'bg-cyan-50', text: 'text-cyan-800', border: 'border-cyan-200' },
  DISPATCHED: { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200' },
  DELIVERED: { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
  CANCELLED: { bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-200' },
  REFUNDED: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' },
};

export default function AdminOrderDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Status & tracking update state
  const [editStatus, setEditStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingUrl, setTrackingUrl] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/admin/orders');
    }
  }, [status, router]);

  const loadOrder = async () => {
    if (!orderId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`);
      const data = await res.json();
      if (data.success && data.order) {
        setOrder(data.order);
        setEditStatus(data.order.status);
        setTrackingNumber(data.order.trackingNumber || '');
        setTrackingUrl(data.order.trackingUrl || '');
        setAdminNotes(data.order.adminNotes || '');
      } else {
        setError(data.error || 'Order could not be located in database');
      }
    } catch (err: any) {
      setError(err.message || 'Error communicating with server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session && orderId) {
      loadOrder();
    }
  }, [session, orderId]);

  const handleSaveStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: editStatus,
          trackingNumber,
          trackingUrl,
          adminNotes,
        }),
      });
      const data = await res.json();
      if (data.success && data.order) {
        setOrder(data.order);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert(data.error || 'Failed to update order');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update order');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to permanently delete order ${order?.orderNumber}? This will remove all items and payment logs.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        router.push('/admin/orders');
      } else {
        alert(data.error || 'Failed to delete order');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete order');
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-6xl mx-auto text-center space-y-4">
        <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-gray-500">Retrieving order details from database...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="p-8 max-w-4xl mx-auto space-y-6 text-center">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 space-y-4">
          <AlertCircle className="w-10 h-10 text-red-600 mx-auto" />
          <h2 className="text-lg font-bold text-red-900">Order Not Found</h2>
          <p className="text-xs text-red-700">{error || `Could not find order ${orderId}`}</p>
          <div>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-2 px-4 py-2 bg-charcoal-900 text-white rounded-xl text-xs font-semibold hover:bg-charcoal-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Orders List
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const stColor = STATUS_COLORS[order.status] || {
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    border: 'border-gray-200',
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Top Bar Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="p-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl text-gray-600 transition-colors"
            title="Back to Orders"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-mono font-bold text-xl text-brand-800">
                {order.orderNumber}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${stColor.bg} ${stColor.text} ${stColor.border}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {order.status.replace(/_/g, ' ')}
              </span>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold">
                Payment: {order.paymentStatus}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} at{' '}
              {new Date(order.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} • Order ID: {order.id}
            </p>
          </div>
        </div>

        {/* Top Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-charcoal-900 rounded-xl text-xs font-semibold shadow-sm transition-colors"
          >
            <Printer className="w-4 h-4 text-gray-500" />
            Print Packing Slip & Invoice
          </button>
          <button
            onClick={handleDelete}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 rounded-xl text-xs font-semibold transition-colors"
            title="Delete this order"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      {/* Quick Status & Courier Management Banner */}
      <form
        onSubmit={handleSaveStatus}
        className="bg-brand-50/60 border border-brand-200 rounded-2xl p-5 shadow-sm space-y-4"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 flex-1">
            {/* Status Select */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal-900 block">
                Update Order Status
              </label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                className="bg-white border border-brand-300 rounded-xl px-3 py-2 text-xs font-semibold text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {ORDER_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>

            {/* Tracking Reference */}
            <div className="space-y-1 flex-1 min-w-[200px]">
              <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal-900 block">
                Courier Tracking Reference
              </label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="e.g. DPD-UK-88492019"
                className="w-full bg-white border border-brand-300 rounded-xl px-3 py-2 text-xs font-mono text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Tracking Link URL */}
            <div className="space-y-1 flex-1 min-w-[220px]">
              <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal-900 block">
                Tracking URL (Optional)
              </label>
              <input
                type="url"
                value={trackingUrl}
                onChange={(e) => setTrackingUrl(e.target.value)}
                placeholder="https://track.dpd.co.uk/..."
                className="w-full bg-white border border-brand-300 rounded-xl px-3 py-2 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 self-end lg:self-center">
            {saveSuccess && (
              <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Updated!
              </span>
            )}
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-800 hover:bg-brand-900 text-white rounded-xl text-xs font-bold shadow-md transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Apply Status Change'}
            </button>
          </div>
        </div>

        {/* Admin Notes Field */}
        <div className="pt-2 border-t border-brand-200/60">
          <input
            type="text"
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="Internal admin dispatch / packaging note (e.g. 'Allocated to Marylebone delivery depot van 4')..."
            className="w-full bg-white/80 border border-brand-200 rounded-xl px-3 py-1.5 text-xs text-charcoal-900 placeholder:text-gray-400 focus:outline-none focus:bg-white"
          />
        </div>
      </form>

      {/* Main Grid: Order Details & Customer Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols): Items & Pricing */}
        <div className="lg:col-span-8 space-y-6">
          {/* Items Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="font-editorial text-lg font-bold text-charcoal-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-brand-600" />
                Purchased Furniture Items ({order.items?.length || 0})
              </h3>
              <span className="text-xs text-gray-400">All prices in GBP (£)</span>
            </div>

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
                          target="_blank"
                          className="font-bold text-sm text-charcoal-900 hover:text-brand-600 transition-colors inline-flex items-center gap-1.5"
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

                  <div className="flex items-center justify-between sm:justify-end gap-6 text-right">
                    <div>
                      <span className="text-xs text-gray-400 block">Unit Price</span>
                      <span className="text-xs font-semibold text-charcoal-800">
                        {formatGBP(item.unitPrice)}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block">Qty</span>
                      <span className="text-xs font-bold text-charcoal-900 font-mono bg-gray-50 px-2 py-1 rounded border border-gray-200">
                        × {item.quantity}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block">Total</span>
                      <span className="text-sm font-bold text-charcoal-900">
                        {formatGBP(item.totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="pt-4 border-t border-gray-200 flex flex-col items-end space-y-2 text-xs">
              <div className="w-full sm:w-64 space-y-1.5">
                <div className="flex justify-between text-gray-600">
                  <span>Items Subtotal:</span>
                  <span className="font-semibold text-charcoal-900">{formatGBP(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>UK White Glove Delivery:</span>
                  <span className="font-semibold text-charcoal-900">{formatGBP(order.deliveryFee)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>UK VAT (20% included):</span>
                  <span className="font-semibold text-charcoal-900">{formatGBP(order.vatAmount)}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-green-700 font-medium">
                    <span>Discount Applied:</span>
                    <span>-{formatGBP(order.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-charcoal-900 pt-2 border-t border-gray-200">
                  <span>Grand Total:</span>
                  <span className="text-base text-brand-800 font-mono">{formatGBP(order.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status History & Audit Log */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-editorial text-lg font-bold text-charcoal-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-brand-600" />
              Order Status History & Logistics Audit
            </h3>
            {order.statusHistory && order.statusHistory.length > 0 ? (
              <div className="relative pl-6 border-l-2 border-brand-200 space-y-4 text-xs">
                {order.statusHistory.map((h: any, idx: number) => (
                  <div key={h.id || idx} className="relative">
                    <span className="absolute -left-[31px] top-0.5 w-3 h-3 rounded-full bg-brand-600 ring-4 ring-white" />
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-charcoal-900">{h.status.replace(/_/g, ' ')}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-500 font-mono text-[11px]">
                        {new Date(h.createdAt).toLocaleString('en-GB')}
                      </span>
                    </div>
                    {h.note && <p className="text-gray-600 mt-1 italic">{h.note}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">No historical status modifications recorded.</p>
            )}
          </div>
        </div>

        {/* Right Column (4 cols): Customer, Addresses & Courier */}
        <div className="lg:col-span-4 space-y-6 text-xs">
          {/* Customer Profile */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-brand-600" /> Customer Account
            </span>
            <div className="space-y-1.5 pt-1">
              <p className="font-bold text-sm text-charcoal-900">{order.deliveryFullName}</p>
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="w-3.5 h-3.5 text-gray-400" />
                <a href={`mailto:${order.user?.email}`} className="text-brand-700 hover:underline">
                  {order.user?.email || 'Guest Checkout'}
                </a>
              </div>
              {order.deliveryPhone && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  <a href={`tel:${order.deliveryPhone}`} className="hover:underline">
                    {order.deliveryPhone}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-brand-600" /> UK Delivery Address
            </span>
            <div className="space-y-1 pt-1 leading-relaxed text-charcoal-800">
              <p className="font-bold text-charcoal-900">{order.deliveryFullName}</p>
              <p>{order.deliveryAddress1}</p>
              {order.deliveryAddress2 && <p>{order.deliveryAddress2}</p>}
              <p>{order.deliveryCity}</p>
              {order.deliveryCounty && <p>{order.deliveryCounty}</p>}
              <p className="font-mono font-bold text-brand-800">{order.deliveryPostcode}</p>
              <p className="text-gray-500">{order.deliveryCountry}</p>
            </div>
            <div className="pt-2 border-t border-gray-100 flex items-center gap-1.5 text-sage-800 font-medium text-[11px]">
              <Truck className="w-3.5 h-3.5 text-sage-600" />
              <span>{order.deliveryMethod}</span>
            </div>
          </div>

          {/* Billing Address */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-brand-600" /> Billing Address
            </span>
            <div className="text-gray-600 space-y-0.5 pt-1 text-[11px]">
              <p className="font-semibold text-charcoal-900">{order.billingFullName}</p>
              <p>{order.billingAddress1}</p>
              {order.billingAddress2 && <p>{order.billingAddress2}</p>}
              <p>{order.billingCity}, {order.billingPostcode}</p>
              <p>{order.billingCountry}</p>
            </div>
          </div>

          {/* Live Courier / Dispatch Box */}
          <div className="bg-brand-50/70 border border-brand-200 rounded-2xl p-5 shadow-sm space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-800 flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-brand-600" /> Courier & Fulfillment
            </span>
            <div className="space-y-2">
              <div>
                <span className="text-[11px] text-gray-500 block">Courier Tracking Code:</span>
                <span className="font-mono font-bold text-xs text-charcoal-900 block mt-0.5">
                  {order.trackingNumber || 'Awaiting Hub Allocation'}
                </span>
              </div>
              {order.trackingUrl && (
                <div>
                  <a
                    href={order.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-brand-700 hover:text-brand-900 font-semibold text-xs hover:underline"
                  >
                    Track via Carrier Portal <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
