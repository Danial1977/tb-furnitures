'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MapPin, Plus, Edit2, Trash2, CheckCircle2, X, RefreshCw, AlertCircle } from 'lucide-react';
import { AccountNav } from '@/components/account/AccountNav';

export default function AccountAddressesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    id: '',
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    county: '',
    postcode: '',
    phone: '',
    isDefault: false,
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/account/addresses');
    }
  }, [status, router]);

  const loadAddresses = () => {
    setLoading(true);
    fetch('/api/account/addresses')
      .then((r) => r.json())
      .then((res) => {
        setAddresses(res.addresses || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    if (session) loadAddresses();
  }, [session]);

  const handleOpenAdd = () => {
    setEditingAddress(null);
    setError('');
    setFormData({
      id: '',
      fullName: session?.user?.name || '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      county: '',
      postcode: '',
      phone: '',
      isDefault: addresses.length === 0,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (addr: any) => {
    setEditingAddress(addr);
    setError('');
    setFormData({
      id: addr.id,
      fullName: addr.fullName,
      addressLine1: addr.addressLine1,
      addressLine2: addr.addressLine2 || '',
      city: addr.city,
      county: addr.county || '',
      postcode: addr.postcode,
      phone: addr.phone || '',
      isDefault: addr.isDefault,
    });
    setModalOpen(true);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const method = editingAddress ? 'PUT' : 'POST';
      const res = await fetch('/api/account/addresses', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to save address');

      setModalOpen(false);
      loadAddresses();
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAddress = async (addrId: string) => {
    if (!window.confirm('Are you sure you want to delete this delivery address?')) return;

    try {
      const res = await fetch(`/api/account/addresses?id=${addrId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setAddresses((prev) => prev.filter((a) => a.id !== addrId));
      } else {
        alert('Could not delete address: ' + data.error);
      }
    } catch (err: any) {
      alert('Delete failed: ' + err.message);
    }
  };

  const handleSetDefault = async (addrId: string) => {
    try {
      const addr = addresses.find((a) => a.id === addrId);
      if (!addr) return;

      const res = await fetch('/api/account/addresses', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...addr, isDefault: true }),
      });
      const data = await res.json();
      if (data.success) {
        loadAddresses();
      }
    } catch (err: any) {
      alert('Error updating default address: ' + err.message);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="max-w-6xl mx-auto py-24 text-center px-4">
        <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-gray-500">Loading delivery addresses...</p>
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
            Saved UK Delivery Addresses
          </h1>
          <p className="text-xs text-gray-500">
            Manage room-of-choice delivery destinations and default shipping details for your furniture orders.
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

          {/* Addresses Content */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-editorial text-xl font-bold text-charcoal-900">
                Your Saved Addresses ({addresses.length})
              </h2>
              <button
                onClick={handleOpenAdd}
                className="inline-flex items-center gap-2 bg-charcoal-900 hover:bg-brand-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" /> Add New Address
              </button>
            </div>

            {addresses.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center space-y-4 shadow-sm">
                <MapPin className="w-12 h-12 text-gray-300 mx-auto" />
                <h3 className="font-editorial text-lg font-bold text-charcoal-900">
                  No Saved Addresses
                </h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                  You have not saved any UK delivery addresses yet. Add your home or office address to expedite checkout on future orders.
                </p>
                <button
                  onClick={handleOpenAdd}
                  className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold px-6 py-2.5 rounded-xl transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Add Delivery Address
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`bg-white rounded-2xl border p-5 shadow-sm space-y-3 relative transition-all ${
                      addr.isDefault
                        ? 'border-brand-400 ring-2 ring-brand-200 bg-brand-50/20'
                        : 'border-gray-200 hover:border-brand-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-bold text-sm text-charcoal-900 block">
                          {addr.fullName}
                        </span>
                        {addr.isDefault && (
                          <span className="inline-block px-2 py-0.5 rounded-full bg-brand-100 text-brand-800 text-[10px] font-bold mt-1">
                            Default UK Delivery
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(addr)}
                          className="p-1.5 text-gray-400 hover:text-charcoal-900 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit Address"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Address"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="text-xs text-gray-600 space-y-0.5 leading-relaxed">
                      <p>{addr.addressLine1}</p>
                      {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                      <p>{addr.city}{addr.county ? `, ${addr.county}` : ''}</p>
                      <p className="font-mono font-bold text-charcoal-900">{addr.postcode}</p>
                      <p className="text-gray-400 text-[11px] pt-1">United Kingdom</p>
                      {addr.phone && (
                        <p className="text-gray-500 text-[11px] pt-1">Phone: {addr.phone}</p>
                      )}
                    </div>

                    {!addr.isDefault && (
                      <div className="pt-2 border-t border-gray-100">
                        <button
                          onClick={() => handleSetDefault(addr.id)}
                          className="text-[11px] font-semibold text-brand-600 hover:underline"
                        >
                          Set as Default Address
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ADDRESS MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <div>
                <h3 className="font-editorial text-lg font-bold text-charcoal-900">
                  {editingAddress ? 'Edit UK Delivery Address' : 'Add New UK Delivery Address'}
                </h3>
                <p className="text-xs text-gray-500">
                  Used for two-man white glove delivery and courier dispatch.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="p-6 space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                  Recipient Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Lady Sarah Cavendish"
                  className="w-full text-xs border border-gray-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-brand-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                  Address Line 1 (Street & House/Flat #) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.addressLine1}
                  onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                  placeholder="e.g. 14 Highfield Manor, Apt 2B"
                  className="w-full text-xs border border-gray-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-brand-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                  Address Line 2 (Optional)
                </label>
                <input
                  type="text"
                  value={formData.addressLine2}
                  onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                  placeholder="e.g. Kensington Gardens"
                  className="w-full text-xs border border-gray-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-brand-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                    Town / City *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="London"
                    className="w-full text-xs border border-gray-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-brand-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                    County (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.county}
                    onChange={(e) => setFormData({ ...formData, county: e.target.value })}
                    placeholder="Greater London"
                    className="w-full text-xs border border-gray-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-brand-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                    UK Postcode *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.postcode}
                    onChange={(e) => setFormData({ ...formData, postcode: e.target.value.toUpperCase() })}
                    placeholder="W8 4PT"
                    className="w-full text-xs font-mono font-bold border border-gray-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-brand-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                    Contact Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="07700 900077"
                    className="w-full text-xs border border-gray-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-brand-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs text-charcoal-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                    className="rounded text-brand-600 focus:ring-brand-400 w-4 h-4"
                  />
                  <span>Set as my default UK delivery address</span>
                </label>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
                >
                  {submitting ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                  {submitting ? 'Saving Address...' : editingAddress ? 'Save Changes' : 'Add Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
