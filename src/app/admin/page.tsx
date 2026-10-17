'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Package,
  ShoppingBag,
  Users,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { formatGBP } from '@/lib/utils';

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/admin');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetch('/api/admin/stats')
        .then((r) => r.json())
        .then((res) => {
          setData(res);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [session]);

  if (status === 'loading' || loading) {
    return (
      <div className="max-w-7xl mx-auto py-24 text-center">
        <p className="text-sm text-gray-500">Authenticating Administrator Session...</p>
      </div>
    );
  }

  // Role Gate
  if (!session || !['SUPER_ADMIN', 'ADMIN'].includes((session.user as any)?.role)) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-amber-600 mx-auto" />
        <h1 className="font-editorial text-2xl font-bold text-charcoal-900">
          Administrator Access Required
        </h1>
        <p className="text-xs text-charcoal-700">
          You are signed in as <strong>{session?.user?.email}</strong> (Role: {(session?.user as any)?.role || 'CUSTOMER'}).
          Please sign in with the Super Admin credentials:
        </p>
        <div className="bg-brand-50 border border-brand-200 rounded-xl p-3 text-xs text-left font-mono">
          <p>Email: admin@tbfurnitures.co.uk</p>
          <p>Password: AdminPassword2026!</p>
        </div>
        <Link
          href="/login?callbackUrl=/admin"
          className="inline-block bg-charcoal-900 text-white text-xs font-semibold px-6 py-2.5 rounded-full"
        >
          Switch to Admin Account &rarr;
        </Link>
      </div>
    );
  }

  const { stats, recentOrders } = data || {};

  return (
    <div className="p-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-800 text-[11px] font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>TB Furnitures Operations Portal</span>
          </div>
          <h1 className="font-editorial text-3xl font-bold text-charcoal-900 mt-1">
            Executive Admin Dashboard
          </h1>
          <p className="text-xs text-charcoal-700">
            Welcome back, {session.user?.name} (Administrator)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/products"
            className="text-xs font-semibold px-4 py-2 rounded-lg bg-charcoal-900 text-white hover:bg-brand-900 transition-colors shadow-sm"
          >
            Manage Products & Inventory &rarr;
          </Link>
          <Link
            href="/admin/orders"
            className="text-xs font-semibold px-4 py-2 rounded-lg bg-brand-100 text-brand-900 hover:bg-brand-200 transition-colors"
          >
            Manage Orders & Shipments &rarr;
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-brand-100 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-medium uppercase tracking-wider">Gross Sales (GBP)</span>
            <TrendingUp className="w-4 h-4 text-sage-600" />
          </div>
          <p className="font-editorial text-3xl font-bold text-charcoal-900">
            {formatGBP(stats?.totalRevenue || 0)}
          </p>
          <p className="text-[11px] text-sage-700 font-medium">Verified Stripe Payments</p>
        </div>

        <div className="bg-white border border-brand-100 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-medium uppercase tracking-wider">Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-brand-600" />
          </div>
          <p className="font-editorial text-3xl font-bold text-charcoal-900">
            {stats?.totalOrders || 0}
          </p>
          <p className="text-[11px] text-gray-500">Across mainland United Kingdom</p>
        </div>

        <div className="bg-white border border-brand-100 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-medium uppercase tracking-wider">Furniture Pieces</span>
            <Package className="w-4 h-4 text-brand-600" />
          </div>
          <p className="font-editorial text-3xl font-bold text-charcoal-900">
            {stats?.totalProducts || 0}
          </p>
          <p className="text-[11px] text-gray-500">Live in catalogue with variants</p>
        </div>

        <div className="bg-white border border-brand-100 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-medium uppercase tracking-wider">Registered Customers</span>
            <Users className="w-4 h-4 text-brand-600" />
          </div>
          <p className="font-editorial text-3xl font-bold text-charcoal-900">
            {stats?.totalCustomers || 0}
          </p>
          <p className="text-[11px] text-gray-500">Verified UK buyer profiles</p>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white border border-brand-100 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-editorial text-xl font-bold text-charcoal-900">
            Recent Customer Orders
          </h2>
          <span className="text-xs text-gray-500">Live Database Feed</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-brand-100 text-gray-400 uppercase font-semibold">
                <th className="py-3 px-2">Order #</th>
                <th className="py-3 px-2">Customer</th>
                <th className="py-3 px-2">Date</th>
                <th className="py-3 px-2">Service</th>
                <th className="py-3 px-2">Payment</th>
                <th className="py-3 px-2">Fulfillment</th>
                <th className="py-3 px-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-50">
              {recentOrders?.map((ord: any) => (
                <tr key={ord.id} className="hover:bg-brand-50/50 transition-colors">
                  <td className="py-3 px-2">
                    <Link
                      href={`/admin/orders/${ord.id}`}
                      className="font-mono font-bold text-brand-700 hover:text-brand-950 hover:underline inline-flex items-center gap-1 group"
                      title="View Full Order Details"
                    >
                      <span>{ord.orderNumber}</span>
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </td>
                  <td className="py-3 px-2 font-medium text-charcoal-900">
                    {ord.deliveryFullName || ord.user?.email}
                  </td>
                  <td className="py-3 px-2 text-gray-500">
                    {new Date(ord.createdAt).toLocaleDateString('en-GB')}
                  </td>
                  <td className="py-3 px-2 text-gray-600">{ord.deliveryMethod}</td>
                  <td className="py-3 px-2">
                    <span className="inline-block px-2 py-0.5 rounded-full bg-green-100 text-green-800 font-semibold text-[10px]">
                      {ord.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <span className="inline-block px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold text-[10px]">
                      {ord.status}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right font-bold text-charcoal-900">
                    {formatGBP(ord.totalAmount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
