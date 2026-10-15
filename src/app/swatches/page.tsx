'use client';

import { useState } from 'react';
import { Check, CheckCircle2, Sparkles, Send, Layers } from 'lucide-react';

const SWATCH_OPTIONS = [
  { id: 'linen-oatmeal', name: 'Oatmeal Belgian Linen', type: 'Fabric', color: '#E4DDD3' },
  { id: 'linen-charcoal', name: 'Charcoal Slub Linen', type: 'Fabric', color: '#3A3937' },
  { id: 'boucle-cream', name: 'Ivory Textured Bouclé', type: 'Fabric', color: '#F5F2EB' },
  { id: 'velvet-olive', name: 'Botanical Olive Cotton Velvet', type: 'Fabric', color: '#525B44' },
  { id: 'velvet-navy', name: 'Midnight Navy Velvet', type: 'Fabric', color: '#1E293B' },
  { id: 'leather-cognac', name: 'Cognac Vintage Italian Leather', type: 'Leather', color: '#8D5B4C' },
  { id: 'wood-natural-oak', name: 'Natural Solid European Oak', type: 'Timber', color: '#D4B996' },
  { id: 'wood-smoked-oak', name: 'Smoked Oak Finish', type: 'Timber', color: '#7E6349' },
  { id: 'wood-walnut', name: 'American Black Walnut', type: 'Timber', color: '#4A3728' },
];

export default function SwatchesPage() {
  const [selectedSwatches, setSelectedSwatches] = useState<string[]>([
    'linen-oatmeal',
    'wood-natural-oak',
  ]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    name: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    postcode: '',
  });

  const toggleSwatch = (id: string) => {
    if (selectedSwatches.includes(id)) {
      setSelectedSwatches(selectedSwatches.filter((s) => s !== id));
    } else {
      if (selectedSwatches.length >= 6) {
        alert('You can select a maximum of 6 free swatches per household.');
        return;
      }
      setSelectedSwatches([...selectedSwatches, id]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSwatches.length === 0) {
      alert('Please select at least 1 swatch.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="bg-sand-50/50 min-h-screen py-12 md:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">
            Touch & Feel in Your Light
          </span>
          <h1 className="font-editorial text-3xl md:text-5xl font-bold text-charcoal-900">
            Order Free Fabric & Timber Swatches
          </h1>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            See how our rich weaves and hand-finished European timbers look inside your living space. Select up to 6 complimentary swatches, delivered free across the UK via Royal Mail First Class.
          </p>
        </div>

        {submitted ? (
          <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center max-w-lg mx-auto shadow-sm space-y-4">
            <div className="w-14 h-14 bg-sage-50 text-sage-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="font-editorial text-2xl font-bold text-charcoal-900">
              Swatch Pack Dispatched!
            </h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              We have received your sample order for {selectedSwatches.length} finishes. Your bespoke swatch folder will be packed and delivered to <strong>{address.postcode}</strong> within 2 to 3 working days.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setSelectedSwatches(['linen-oatmeal']);
              }}
              className="mt-4 px-6 py-2.5 bg-charcoal-900 hover:bg-brand-900 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              Order Additional Samples
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Swatch Selection Grid */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-editorial text-xl font-bold text-charcoal-900">
                    1. Choose Up to 6 Finishes
                  </h3>
                  <p className="text-xs text-gray-500">
                    Click each swatch card to select or deselect.
                  </p>
                </div>
                <span className="text-xs font-semibold px-3 py-1 bg-brand-50 text-brand-700 rounded-full border border-brand-200">
                  {selectedSwatches.length} / 6 Selected
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
                {SWATCH_OPTIONS.map((swatch) => {
                  const isSelected = selectedSwatches.includes(swatch.id);

                  return (
                    <button
                      key={swatch.id}
                      type="button"
                      onClick={() => toggleSwatch(swatch.id)}
                      className={`relative p-4 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-brand-600 bg-brand-50/40 ring-2 ring-brand-400'
                          : 'border-gray-200 hover:border-brand-300 bg-white'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-3 right-3 w-5 h-5 bg-brand-600 text-white rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3" />
                        </div>
                      )}

                      <div
                        className="w-12 h-12 rounded-lg border border-black/10 shadow-inner mb-3"
                        style={{ backgroundColor: swatch.color }}
                      />
                      <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                        {swatch.type}
                      </span>
                      <p className="font-semibold text-xs text-charcoal-900 mt-0.5">
                        {swatch.name}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Delivery Address Form */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <h3 className="font-editorial text-xl font-bold text-charcoal-900">
                2. Where Should We Send Your Swatch Pack?
              </h3>
              <p className="text-xs text-gray-500">
                UK Mainland delivery via Royal Mail First Class — 100% Free.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={address.name}
                    onChange={(e) => setAddress({ ...address, name: e.target.value })}
                    className="w-full text-xs border border-gray-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-brand-400 focus:outline-none"
                    placeholder="e.g. Arabella Croft"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={address.email}
                    onChange={(e) => setAddress({ ...address, email: e.target.value })}
                    className="w-full text-xs border border-gray-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-brand-400 focus:outline-none"
                    placeholder="arabella@example.co.uk"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                    Address Line 1 *
                  </label>
                  <input
                    type="text"
                    required
                    value={address.addressLine1}
                    onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                    className="w-full text-xs border border-gray-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-brand-400 focus:outline-none"
                    placeholder="e.g. 14 Kensington Park Gardens"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                    Town / City *
                  </label>
                  <input
                    type="text"
                    required
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full text-xs border border-gray-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-brand-400 focus:outline-none"
                    placeholder="London"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal-800 mb-1">
                    UK Postcode *
                  </label>
                  <input
                    type="text"
                    required
                    value={address.postcode}
                    onChange={(e) => setAddress({ ...address, postcode: e.target.value.toUpperCase() })}
                    className="w-full text-xs font-mono border border-gray-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-brand-400 focus:outline-none"
                    placeholder="W11 3EP"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={loading || selectedSwatches.length === 0}
                  className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold px-8 py-3.5 rounded-xl transition-colors shadow-sm disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {loading ? 'Processing Order...' : 'Dispatch My Free Swatch Pack'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
