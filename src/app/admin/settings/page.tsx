'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Settings, ShieldCheck, Save, Truck, CreditCard } from 'lucide-react';

export default function AdminSettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login?callbackUrl=/admin/settings');
  }, [status, router]);

  const [settings, setSettings] = useState({
    freeDeliveryThreshold: 500,
    standardDeliveryFee: 19.99,
    twoManDeliveryFee: 49.99,
    twoManFreeThreshold: 1000,
    currency: 'GBP',
    vatRate: 20,
    showroomAddress: '45 Regent Mews, Marylebone, London, W1B 3HH',
    supportPhone: '0800 123 4567',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Site and UK Delivery settings saved successfully to master database.');
  };

  return (
    <div className="p-8 space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">Site Configuration</span>
          <h1 className="font-editorial text-3xl font-bold text-charcoal-900 mt-1">Site & Delivery Rules</h1>
          <p className="text-xs text-gray-500">Configure UK delivery rules, VAT rates, and business showroom contacts.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* UK Delivery Config */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-editorial text-lg font-bold text-charcoal-900 flex items-center gap-2">
            <Truck className="w-5 h-5 text-brand-600" />
            UK Delivery Rates & Surcharges
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Standard Courier Delivery Fee (£)</label>
              <input
                type="number"
                step="0.01"
                value={settings.standardDeliveryFee}
                onChange={(e) => setSettings({ ...settings, standardDeliveryFee: parseFloat(e.target.value) })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-charcoal-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Free Delivery Minimum Spend (£)</label>
              <input
                type="number"
                value={settings.freeDeliveryThreshold}
                onChange={(e) => setSettings({ ...settings, freeDeliveryThreshold: parseInt(e.target.value) })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-charcoal-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Specialist Two-Man White Glove Fee (£)</label>
              <input
                type="number"
                step="0.01"
                value={settings.twoManDeliveryFee}
                onChange={(e) => setSettings({ ...settings, twoManDeliveryFee: parseFloat(e.target.value) })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-charcoal-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Free Two-Man Spend Threshold (£)</label>
              <input
                type="number"
                value={settings.twoManFreeThreshold}
                onChange={(e) => setSettings({ ...settings, twoManFreeThreshold: parseInt(e.target.value) })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-charcoal-900"
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
                className="w-full bg-gray-100 border border-gray-200 rounded-xl px-3 py-2 text-gray-600 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Standard UK VAT Rate (%)</label>
              <input
                type="number"
                value={settings.vatRate}
                onChange={(e) => setSettings({ ...settings, vatRate: parseInt(e.target.value) })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-charcoal-900"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="inline-flex items-center gap-2 bg-charcoal-900 hover:bg-brand-900 text-white text-xs font-semibold px-6 py-3 rounded-full transition-colors shadow-sm"
        >
          <Save className="w-4 h-4" /> Save Configuration
        </button>
      </form>
    </div>
  );
}
