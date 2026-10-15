'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Percent, Plus, X, Tag } from 'lucide-react';
import { formatGBP } from '@/lib/utils';

export default function AdminCouponsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'PERCENTAGE',
    discountValue: '10',
    minSpend: '500',
  });

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login?callbackUrl=/admin/coupons');
  }, [status, router]);

  const loadCoupons = () => {
    setLoading(true);
    fetch('/api/admin/coupons')
      .then((r) => r.json())
      .then((res) => {
        setCoupons(res.coupons || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    if (session) loadCoupons();
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/admin/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    setModalOpen(false);
    loadCoupons();
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">
            Promotions & Marketing
          </span>
          <h1 className="font-editorial text-3xl font-bold text-charcoal-900 mt-1">
            Voucher Codes & Discount Rules
          </h1>
          <p className="text-xs text-gray-500">
            Configure UK checkout coupons, minimum spend requirements, and percentage discounts.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 bg-charcoal-900 hover:bg-brand-900 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" /> Create Coupon Code
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((c) => (
          <div key={c.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-base font-bold text-brand-700 bg-brand-50 border border-brand-200 px-3 py-1 rounded-lg">
                {c.code}
              </span>
              <span className="text-[11px] font-semibold text-sage-800 bg-sage-100 px-2.5 py-0.5 rounded-full">
                Active
              </span>
            </div>
            <p className="text-xs font-medium text-charcoal-900">{c.description || 'Promotional coupon'}</p>
            <div className="pt-2 border-t border-gray-100 text-xs text-gray-500 flex justify-between">
              <span>
                Discount: <strong>{c.discountType === 'PERCENTAGE' ? `${c.discountValue}%` : formatGBP(c.discountValue)}</strong>
              </span>
              <span>Min Spend: <strong>{c.minSpend ? formatGBP(c.minSpend) : 'None'}</strong></span>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-editorial text-lg font-bold text-charcoal-900">Create Voucher Code</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-charcoal-800 mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g. SPRING20"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-charcoal-900 font-mono uppercase"
                />
              </div>

              <div>
                <label className="block font-semibold text-charcoal-800 mb-1">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. 20% off all dining room collections"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-charcoal-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-charcoal-800 mb-1">Type</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-charcoal-900"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED_AMOUNT">Fixed Amount (£)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-charcoal-800 mb-1">Discount Value *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-charcoal-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-charcoal-800 mb-1">Min Order Spend (£)</label>
                <input
                  type="number"
                  value={formData.minSpend}
                  onChange={(e) => setFormData({ ...formData, minSpend: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-charcoal-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-500 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-charcoal-900 hover:bg-brand-900 text-white font-semibold"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
