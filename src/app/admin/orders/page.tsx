'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  ArrowLeft,
  Truck,
  CheckCircle2,
  Search,
  Filter,
  RefreshCw,
  Trash2,
  Edit3,
  X,
  AlertTriangle,
  Clock,
  Package,
  MapPin,
  CreditCard,
  User,
  ExternalLink,
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

function AdminOrdersListContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  useEffect(() => {
    const q = searchParams.get('search');
    if (q) setSearch(q);
  }, [searchParams]);

  // Status update modal state
  const [updatingOrder, setUpdatingOrder] = useState<any | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Deleting state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login?callbackUrl=/admin/orders');
  }, [status, router]);

  const loadOrders = () => {
    setLoading(true);
    fetch(`/api/admin/orders?search=${encodeURIComponent(search)}&status=${selectedStatus}`)
      .then((r) => r.json())
      .then((res) => {
        setOrders(res.orders || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    if (session) {
      const delay = setTimeout(() => {
        loadOrders();
      }, 200);
      return () => clearTimeout(delay);
    }
  }, [session, search, selectedStatus]);

  // Open Update Modal
  const handleOpenUpdate = (ord: any) => {
    setUpdatingOrder(ord);
    setNewStatus(ord.status);
    setTrackingNumber(ord.trackingNumber || '');
    setAdminNotes(ord.adminNotes || '');
  };

  // Submit Status Update
  const handleSaveStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updatingOrder) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: updatingOrder.id,
          status: newStatus,
          trackingNumber,
          adminNotes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setUpdatingOrder(null);
        loadOrders();
      } else {
        alert('Failed to update status: ' + data.error);
      }
    } catch (err: any) {
      alert('Error updating order: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Order
  const handleDeleteOrder = async (ord: any) => {
    const confirmText = `Are you sure you want to permanently delete order "${ord.orderNumber}" for customer "${ord.deliveryFullName}"?\n\nThis will remove all items and payment records permanently.`;
    if (!window.confirm(confirmText)) return;

    setDeletingId(ord.id);
    try {
      const res = await fetch(`/api/admin/orders?id=${ord.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) => prev.filter((o) => o.id !== ord.id));
      } else {
        alert('Failed to delete order: ' + data.error);
      }
    } catch (err: any) {
      alert('Error deleting order: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  // Calculate order stats
  const totalValue = orders.reduce((sum, o) => sum + parseFloat(o.totalAmount || 0), 0);

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Title & Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">
            Fulfillment & Operations
          </span>
          <h1 className="font-editorial text-3xl font-bold text-charcoal-900 mt-1">
            Order Management
          </h1>
          <p className="text-xs text-gray-500">
            Search orders, manage live delivery tracking, update fulfillment status, and handle cancellations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadOrders}
            className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-charcoal-900 border border-gray-300 text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-colors"
          >
            <RefreshCw className={`w-4 h-4 text-brand-600 ${loading ? 'animate-spin' : ''}`} />
            Refresh Orders
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-1">
          <span className="text-xs text-gray-500 font-medium">Total Orders</span>
          <p className="font-editorial text-2xl font-bold text-charcoal-900">{orders.length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-1">
          <span className="text-xs text-gray-500 font-medium">Total Value (GBP)</span>
          <p className="font-editorial text-2xl font-bold text-charcoal-900">{formatGBP(totalValue)}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-1">
          <span className="text-xs text-gray-500 font-medium">In Transit / Dispatched</span>
          <p className="font-editorial text-2xl font-bold text-purple-700">
            {orders.filter((o) => ['IN_TRANSIT', 'DISPATCHED'].includes(o.status)).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-1">
          <span className="text-xs text-gray-500 font-medium">Delivered</span>
          <p className="font-editorial text-2xl font-bold text-emerald-700">
            {orders.filter((o) => o.status === 'DELIVERED').length}
          </p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 w-full md:w-96">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order #, customer name, postcode, tracking..."
            className="bg-transparent text-xs text-charcoal-900 focus:outline-none w-full"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-gray-400 hover:text-gray-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Dropdown Filter */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-xs text-gray-500 font-medium">Status Filter:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-charcoal-900 font-medium focus:outline-none focus:ring-1 focus:ring-brand-400"
          >
            <option value="ALL">All Statuses ({orders.length})</option>
            {ORDER_STATUSES.map((st) => (
              <option key={st} value={st}>
                {st.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders List / Cards */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-400 space-y-2">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-brand-600" />
            <p className="text-xs">Loading orders from database...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-400 space-y-2">
            <ShoppingBag className="w-8 h-8 mx-auto text-gray-300" />
            <h3 className="font-editorial text-base font-bold text-charcoal-900">No Orders Found</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              {search
                ? `No orders matching "${search}". Try searching by customer name, order number, or postcode.`
                : 'No orders have been placed in this status category yet.'}
            </p>
          </div>
        ) : (
          orders.map((ord) => {
            const stColor = STATUS_COLORS[ord.status] || {
              bg: 'bg-gray-100',
              text: 'text-gray-700',
              border: 'border-gray-200',
            };

            return (
              <div
                key={ord.id}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-5 hover:border-brand-300 transition-colors"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      href={`/admin/orders/${ord.id}`}
                      className="font-mono font-bold text-sm text-brand-700 bg-brand-50 hover:bg-brand-100 hover:text-brand-950 px-2.5 py-1 rounded-lg border border-brand-200 transition-colors inline-flex items-center gap-1.5 group"
                      title="Click to view full order details"
                    >
                      <span>{ord.orderNumber}</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                    </Link>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-600">
                      Placed on <strong>{new Date(ord.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</strong> at{' '}
                      {new Date(ord.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Actions & Status Pill */}
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${stColor.bg} ${stColor.text} ${stColor.border}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {ord.status.replace(/_/g, ' ')}
                    </span>

                    <Link
                      href={`/admin/orders/${ord.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-charcoal-900 rounded-xl text-xs font-semibold shadow-sm transition-colors"
                      title="View Full Order Details"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
                      View Details
                    </Link>

                    <button
                      onClick={() => handleOpenUpdate(ord)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
                      title="Update Status and Tracking"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Update Status
                    </button>

                    <button
                      onClick={() => handleDeleteOrder(ord)}
                      disabled={deletingId === ord.id}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                      title="Delete Entire Order"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  {/* Customer Info */}
                  <div className="space-y-1">
                    <span className="text-gray-400 uppercase tracking-wider text-[10px] font-semibold flex items-center gap-1">
                      <User className="w-3 h-3" /> Customer & Contact
                    </span>
                    <p className="font-semibold text-charcoal-900">{ord.deliveryFullName}</p>
                    <p className="text-gray-500 text-[11px]">{ord.user?.email || 'Guest Checkout'}</p>
                    <p className="text-gray-500 text-[11px]">{ord.deliveryPhone || 'No phone provided'}</p>
                  </div>

                  {/* Delivery Details */}
                  <div className="space-y-1">
                    <span className="text-gray-400 uppercase tracking-wider text-[10px] font-semibold flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> UK Delivery Address
                    </span>
                    <p className="font-semibold text-charcoal-900">
                      {ord.deliveryAddress1}
                      {ord.deliveryAddress2 ? `, ${ord.deliveryAddress2}` : ''}
                    </p>
                    <p className="text-gray-500 text-[11px]">
                      {ord.deliveryCity}, <span className="font-mono font-bold">{ord.deliveryPostcode}</span>
                    </p>
                    <p className="text-[11px] text-brand-600 font-medium">{ord.deliveryMethod}</p>
                  </div>

                  {/* Tracking & Courier */}
                  <div className="space-y-1">
                    <span className="text-gray-400 uppercase tracking-wider text-[10px] font-semibold flex items-center gap-1">
                      <Truck className="w-3 h-3" /> Logistics & Tracking
                    </span>
                    <p className="font-semibold text-charcoal-900">
                      {ord.trackingNumber ? (
                        <span className="font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                          {ord.trackingNumber}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">No tracking assigned</span>
                      )}
                    </p>
                    {ord.adminNotes && (
                      <p className="text-[11px] text-gray-500 italic mt-1 line-clamp-1">
                        Note: &quot;{ord.adminNotes}&quot;
                      </p>
                    )}
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="space-y-1">
                    <span className="text-gray-400 uppercase tracking-wider text-[10px] font-semibold flex items-center gap-1">
                      <CreditCard className="w-3 h-3" /> Payment & Total
                    </span>
                    <p className="font-bold text-base text-charcoal-900">
                      {formatGBP(ord.totalAmount)}
                    </p>
                    <p className="text-[11px] text-emerald-700 font-medium">
                      Status: {ord.paymentStatus} (Stripe UK)
                    </p>
                    {ord.couponCode && (
                      <p className="text-[11px] text-brand-600">
                        Coupon: <span className="font-mono font-bold">{ord.couponCode}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Items Ordered List */}
                <div className="pt-3 border-t border-gray-100">
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block mb-2">
                    Order Items ({ord.items?.length || 0})
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {ord.items?.map((item: any) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-2.5 p-2 bg-gray-50 rounded-xl border border-gray-100 text-xs"
                      >
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.productName}
                            className="w-9 h-9 rounded-lg object-cover bg-white shrink-0 border border-gray-200"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-gray-200 flex items-center justify-center shrink-0">
                            <Package className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                        <div className="overflow-hidden">
                          <p className="font-semibold text-charcoal-900 truncate">{item.productName}</p>
                          <p className="text-[10px] text-gray-500">
                            Qty: {item.quantity} • {formatGBP(item.totalPrice)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* UPDATE STATUS MODAL */}
      {updatingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <div>
                <h3 className="font-editorial text-lg font-bold text-charcoal-900">
                  Update Fulfillment Status
                </h3>
                <p className="text-xs text-gray-500">Order: {updatingOrder.orderNumber}</p>
              </div>
              <button
                onClick={() => setUpdatingOrder(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStatus} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                  Order Status *
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full text-xs font-semibold border border-gray-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-brand-400 focus:outline-none"
                >
                  {ORDER_STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {st.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                  Courier Tracking Number
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. TBF-LOGISTICS-78219"
                  className="w-full text-xs font-mono border border-gray-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-brand-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                  Internal Admin Note (Optional)
                </label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="e.g. Two-man crew dispatched from Midlands warehouse. Delivery scheduled for Friday."
                  className="w-full text-xs border border-gray-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-brand-400 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setUpdatingOrder(null)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                  {isSubmitting ? 'Saving...' : 'Save Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-gray-500">Loading order management...</div>}>
      <AdminOrdersListContent />
    </Suspense>
  );
}

