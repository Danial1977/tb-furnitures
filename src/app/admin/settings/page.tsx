'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Settings, ShieldCheck, Save, Truck, CreditCard, Building2, Phone, CheckCircle2, AlertCircle } from 'lucide-react';
import { useSettings } from '@/components/providers/Providers';

export default function AdminSettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { refreshSettings } = useSettings();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [settings, setSettings] = useState({
    freeDeliveryThreshold: 500,
    standardDeliveryFee: 19.99,
    twoManDeliveryFee: 49.99,
    twoManFreeThreshold: 1000,
    currency: 'GBP',
    vatRate: 20,
    showroomAddress: '236 Easterly Road, Leeds LS8 3ES',
    supportPhone: '0113 808 5120',
  });

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login?callbackUrl=/admin/settings');
  }, [status, router]);

  // Load live settings from master database
  useEffect(() => {
    if (session) {
      setLoading(true);
      fetch('/api/admin/settings')
        .then((r) => r.json())
        .then((res) => {
          if (res.success && res.settings) {
            setSettings({
              freeDeliveryThreshold: Number(res.settings.freeDeliveryThreshold ?? 500),
              standardDeliveryFee: Number(res.settings.standardDeliveryFee ?? 19.99),
              twoManDeliveryFee: Number(res.settings.twoManDeliveryFee ?? 49.99),
              twoManFreeThreshold: Number(res.settings.twoManFreeThreshold ?? 1000),
              currency: res.settings.currency || 'GBP',
              vatRate: Number(res.settings.vatRate ?? 20),
              showroomAddress: res.settings.showroomAddress || '236 Easterly Road, Leeds LS8 3ES',
              supportPhone: res.settings.supportPhone || '0113 808 5120',
            });
          }
        })
        .catch((err) => {
          console.error('Error loading settings:', err);
        })
        .finally(() => setLoading(false));
    }
  }, [session]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const data = await res.json();

      if (data.success) {
        setSuccessMessage('✓ Site & UK Delivery rules successfully saved to master database. Changes are now live across the storefront!');
        await refreshSettings();
        setTimeout(() => setSuccessMessage(null), 5000);
      } else {
        setErrorMessage(data.error || 'Failed to save configuration to database.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error saving settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">Site Configuration</span>
          <h1 className="font-editorial text-3xl font-bold text-charcoal-900 mt-1">Site & Delivery Rules</h1>
          <p className="text-xs text-gray-500">
            Configure UK delivery rules, free delivery minimum thresholds, VAT rates, and business showroom contacts.
          </p>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2.5 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-800 flex items-center gap-2.5 shadow-sm">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      {loading ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
          <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-gray-500">Loading master settings from database...</p>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          {/* UK Delivery Config */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-editorial text-lg font-bold text-charcoal-900 flex items-center gap-2">
                <Truck className="w-5 h-5 text-brand-600" />
                UK Delivery Rates & Free Spend Thresholds
              </h3>
              <span className="text-[10px] bg-brand-50 text-brand-700 px-2.5 py-1 rounded-full font-semibold border border-brand-200">
                Live Storefront Rules
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Free Standard Delivery Minimum Spend (£) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={settings.freeDeliveryThreshold}
                  onChange={(e) => setSettings({ ...settings, freeDeliveryThreshold: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-charcoal-900 font-semibold focus:ring-2 focus:ring-brand-400 focus:outline-none"
                  required
                />
                <span className="text-[10px] text-gray-400 mt-1 block">
                  Orders over this amount receive complimentary standard UK delivery (e.g. £300 or £500).
                </span>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Standard Courier Delivery Fee (£) *</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={settings.standardDeliveryFee}
                  onChange={(e) => setSettings({ ...settings, standardDeliveryFee: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-charcoal-900 font-semibold focus:ring-2 focus:ring-brand-400 focus:outline-none"
                  required
                />
                <span className="text-[10px] text-gray-400 mt-1 block">
                  Standard courier fee charged when order total is below the free threshold.
                </span>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Free Two-Man Spend Threshold (£)</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={settings.twoManFreeThreshold}
                  onChange={(e) => setSettings({ ...settings, twoManFreeThreshold: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-charcoal-900 font-semibold focus:ring-2 focus:ring-brand-400 focus:outline-none"
                />
                <span className="text-[10px] text-gray-400 mt-1 block">
                  Orders with large furniture over this spend qualify for free room-of-choice placement.
                </span>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Specialist Two-Man White Glove Fee (£)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={settings.twoManDeliveryFee}
                  onChange={(e) => setSettings({ ...settings, twoManDeliveryFee: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-charcoal-900 font-semibold focus:ring-2 focus:ring-brand-400 focus:outline-none"
                />
                <span className="text-[10px] text-gray-400 mt-1 block">
                  Base rate for 2-man room delivery, unboxing, assembly, and debris removal.
                </span>
              </div>
            </div>
          </div>

          {/* Showroom & Business Contacts */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-editorial text-lg font-bold text-charcoal-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-brand-600" />
              Showroom & Support Contacts
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Showroom Address</label>
                <input
                  type="text"
                  value={settings.showroomAddress}
                  onChange={(e) => setSettings({ ...settings, showroomAddress: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-charcoal-900 focus:ring-2 focus:ring-brand-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Customer Support Phone</label>
                <input
                  type="text"
                  value={settings.supportPhone}
                  onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-charcoal-900 focus:ring-2 focus:ring-brand-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* VAT & Currency */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-editorial text-lg font-bold text-charcoal-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-brand-600" />
              Taxation & Currency
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Operating Currency</label>
                <input
                  type="text"
                  disabled
                  value="GBP (£) - British Pounds Sterling"
                  className="w-full bg-gray-100 border border-gray-200 rounded-xl px-3.5 py-2.5 text-gray-600 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Standard UK VAT Rate (%)</label>
                <input
                  type="number"
                  value={settings.vatRate}
                  onChange={(e) => setSettings({ ...settings, vatRate: parseInt(e.target.value) || 20 })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-charcoal-900 focus:ring-2 focus:ring-brand-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-charcoal-900 hover:bg-brand-900 text-white text-xs font-semibold px-7 py-3.5 rounded-full transition-all shadow-md disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving to Database...' : 'Save Configuration'}
          </button>
        </form>
      )}
    </div>
  );
}

