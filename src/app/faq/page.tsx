'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle, Search } from 'lucide-react';
import Link from 'next/link';

const FAQS = [
  {
    category: 'Ordering & Delivery',
    items: [
      {
        q: 'How does your Two-Man White Glove delivery work?',
        a: 'For all large furniture items, our specialist two-man courier will contact you 48 hours prior to arrange a convenient 3-hour window. On the day, they will carry your furniture up stairs and into your room of choice, assemble basic components (e.g. table legs or bed frames), position the item, and take away all packaging materials for recycling.',
      },
      {
        q: 'Do you deliver across all UK postcodes?',
        a: 'We deliver to all addresses across mainland England, Wales, and lowland Scotland. Deliveries to the Scottish Highlands, Isle of Wight, Isle of Man, and Northern Ireland are available with an additional logistics surcharge calculated automatically at checkout.',
      },
      {
        q: 'Can I choose a specific delivery date or weekend delivery?',
        a: 'Yes, once your furniture has been dispatched to your regional logistics hub, you will receive a tracking link allowing you to pick your preferred weekday slot. Saturday delivery is available in selected postcode zones for a £25 surcharge.',
      },
    ],
  },
  {
    category: 'Returns & Guarantees',
    items: [
      {
        q: 'What is your 30-Day In-Home Trial policy?',
        a: 'We want you to love your furniture in your home. You have 30 calendar days from the day of delivery to test the piece. If you wish to return it, simply email returns@tbfurnitures.co.uk. We will arrange collection from your room of choice. A £49 collection fee is deducted from the refund.',
      },
      {
        q: 'What is covered under the 10-Year Frame Guarantee?',
        a: 'Our 10-year guarantee covers all solid European oak, American walnut, and kiln-dried internal hardwood sofa frames against timber warping, structural joint loosening, and material defects. It excludes normal wear and tear of upholstery fabrics or surface scratches from daily domestic use.',
      },
      {
        q: 'Are your items compliant with UK Fire Safety Regulations?',
        a: 'Yes, 100% of our upholstered chairs, sofas, and pocket sprung mattresses comply with the Furniture and Furnishings (Fire) (Safety) Regulations 1988 (as amended), passing British Standards BS 5852 tests.',
      },
    ],
  },
  {
    category: 'Timber, Fabrics & Customization',
    items: [
      {
        q: 'How do I care for solid oak and walnut furniture?',
        a: 'Clean regularly using a soft, dry microfiber cloth. Avoid placing hot mugs or pans directly on unprotected timber surfaces; always use coasters. Re-apply natural beeswax or Osmo wood oil once or twice a year to preserve moisture and luster. See our dedicated Timber Care Guide for detailed step-by-step instructions.',
      },
      {
        q: 'Can I order free fabric and wood swatches?',
        a: 'Yes! We offer up to 6 complimentary fabric swatches and timber sample blocks sent via Royal Mail First Class. Visit our Free Swatches page to request your sample pack.',
      },
      {
        q: 'Can I view the furniture in person before purchasing?',
        a: 'Our London showroom is located at 45 Regent Mews, Marylebone, London, W1B 3HH. We showcase our best-selling dining tables, bespoke sofas, and luxury pocket sprung mattresses with experienced interior design advisors on hand.',
      },
    ],
  },
];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    '0-0': true,
    '1-0': true,
  });
  const [searchTerm, setSearchTerm] = useState('');

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-sand-50/50 min-h-screen py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">
            Frequently Asked Questions
          </span>
          <h1 className="font-editorial text-3xl md:text-5xl font-bold text-charcoal-900">
            Everything You Need to Know
          </h1>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Find immediate answers regarding delivery timescales, room assembly, 30-day trials, timber care, and UK fire regulations.
          </p>

          {/* Search box */}
          <div className="max-w-md mx-auto pt-4">
            <div className="flex items-center gap-2.5 bg-white border border-gray-300 rounded-xl px-4 py-2.5 shadow-sm">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search delivery, returns, oak, guarantee..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent text-xs text-charcoal-900 focus:outline-none w-full"
              />
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-8">
          {FAQS.map((category, catIdx) => {
            const filteredItems = category.items.filter(
              (item) =>
                item.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.a.toLowerCase().includes(searchTerm.toLowerCase())
            );

            if (filteredItems.length === 0) return null;

            return (
              <div key={category.category} className="space-y-4">
                <h2 className="font-editorial text-xl font-bold text-charcoal-900 border-b border-gray-200 pb-2">
                  {category.category}
                </h2>

                <div className="space-y-3">
                  {filteredItems.map((item, itemIdx) => {
                    const key = `${catIdx}-${itemIdx}`;
                    const isOpen = openItems[key];

                    return (
                      <div
                        key={item.q}
                        className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm transition-all"
                      >
                        <button
                          onClick={() => toggleItem(key)}
                          className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors"
                        >
                          <span className="font-editorial text-base font-bold text-charcoal-900">
                            {item.q}
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${
                              isOpen ? 'rotate-180 text-brand-600' : ''
                            }`}
                          />
                        </button>

                        {isOpen && (
                          <div className="px-6 pb-5 pt-1 text-xs text-gray-600 leading-relaxed border-t border-gray-100">
                            {item.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Still stuck */}
        <div className="bg-brand-50/80 rounded-2xl border border-brand-200 p-8 text-center space-y-3">
          <h3 className="font-editorial text-xl font-bold text-brand-900">
            Cannot find the answer you are looking for?
          </h3>
          <p className="text-xs text-brand-900/80 max-w-lg mx-auto">
            Our UK customer support team is available Monday to Saturday to guide you through dimensions, delivery, or custom finishes.
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold px-6 py-3 rounded-xl transition-colors shadow-sm"
            >
              Contact Our Concierge
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
