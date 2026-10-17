import { Truck, ShieldCheck, Clock, MapPin, CheckCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { DEFAULT_SITE_SETTINGS } from '@/lib/settings';
import { formatGBP } from '@/lib/utils';

export const metadata = {
  title: 'UK Delivery Information | TB Furnitures',
  description: 'Specialist Two-Man White Glove delivery throughout the United Kingdom. Room of choice placement, assembly, and packaging removal.',
};

export const dynamic = 'force-dynamic';

async function getDeliverySettings() {
  try {
    const record = await prisma.siteSetting.findUnique({
      where: { key: 'delivery_rules' },
    });
    if (record?.value) {
      return { ...DEFAULT_SITE_SETTINGS, ...(record.value as any) };
    }
  } catch (e) {
    console.error('Failed to load delivery settings in delivery page:', e);
  }
  return DEFAULT_SITE_SETTINGS;
}

export default async function DeliveryPage() {
  const settings = await getDeliverySettings();

  return (
    <div className="bg-sand-50/50 min-h-screen py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">
            Logistics & White Glove Service
          </span>
          <h1 className="font-editorial text-3xl md:text-5xl font-bold text-charcoal-900">
            UK Delivery Information
          </h1>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Every piece of TB Furnitures is handled with meticulous care. We partner with specialist British two-man furniture logistics teams to ensure an effortless delivery directly into your room of choice.
          </p>
        </div>

        {/* Highlight Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="font-editorial text-lg font-bold text-charcoal-900">Room of Choice</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Our two-man delivery crew will carefully navigate stairs and hallways to place your furniture exactly where you desire.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sage-50 flex items-center justify-center text-sage-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-editorial text-lg font-bold text-charcoal-900">Assembly & Unpacking</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Full unboxing, basic leg attachment, positioning, and 100% removal of all cardboard, foam, and protective crates for recycling.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-editorial text-lg font-bold text-charcoal-900">3-Hour Delivery Window</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              You will receive an SMS and email notification 48 hours prior with your allocated 3-hour window, followed by a driver call 30 mins before arrival.
            </p>
          </div>
        </div>

        {/* Pricing & Timeframes Table */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-6">
          <h2 className="font-editorial text-2xl font-bold text-charcoal-900">
            Delivery Tiers & Postcode Zones
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-gray-400 uppercase font-semibold">
                  <th className="py-3 px-4">Service Tier</th>
                  <th className="py-3 px-4">Coverage</th>
                  <th className="py-3 px-4">Lead Time</th>
                  <th className="py-3 px-4 text-right">Cost (GBP)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-charcoal-900">
                    Standard Orders Over {formatGBP(settings.freeDeliveryThreshold)}
                  </td>
                  <td className="py-3.5 px-4 text-gray-600">Mainland UK (England, Wales, Scotland Lowlands)</td>
                  <td className="py-3.5 px-4 text-gray-600">3 – 5 Business Days</td>
                  <td className="py-3.5 px-4 font-bold text-sage-600 text-right">FREE</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-charcoal-900">
                    Standard Orders Under {formatGBP(settings.freeDeliveryThreshold)}
                  </td>
                  <td className="py-3.5 px-4 text-gray-600">Mainland UK</td>
                  <td className="py-3.5 px-4 text-gray-600">3 – 5 Business Days</td>
                  <td className="py-3.5 px-4 font-bold text-charcoal-900 text-right">
                    {formatGBP(settings.standardDeliveryFee)}
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-charcoal-900">
                    Two-Man White Glove (Under {formatGBP(settings.twoManFreeThreshold)})
                  </td>
                  <td className="py-3.5 px-4 text-gray-600">Mainland UK Room of Choice</td>
                  <td className="py-3.5 px-4 text-gray-600">5 – 10 Business Days</td>
                  <td className="py-3.5 px-4 font-bold text-charcoal-900 text-right">
                    {formatGBP(settings.twoManDeliveryFee)}
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-charcoal-900">
                    Two-Man White Glove (Over {formatGBP(settings.twoManFreeThreshold)})
                  </td>
                  <td className="py-3.5 px-4 text-gray-600">Mainland UK Room of Choice</td>
                  <td className="py-3.5 px-4 text-gray-600">5 – 10 Business Days</td>
                  <td className="py-3.5 px-4 font-bold text-sage-600 text-right">FREE</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-charcoal-900">Scottish Highlands & Islands</td>
                  <td className="py-3.5 px-4 text-gray-600">IV, KW, HS, ZE, PA, PH postcodes, Isle of Wight</td>
                  <td className="py-3.5 px-4 text-gray-600">10 – 16 Business Days</td>
                  <td className="py-3.5 px-4 font-bold text-charcoal-900 text-right">£79.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Measuring Guide & Access */}
        <div className="bg-brand-50/60 rounded-2xl border border-brand-200 p-6 md:p-8 space-y-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-brand-700 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-editorial text-lg font-bold text-brand-900">
                Access & Measuring Responsibility
              </h3>
              <p className="text-xs text-brand-900/80 mt-1 leading-relaxed">
                Before placing your order, please verify that your chosen furniture pieces can navigate building entrances, stairwells, internal doorways, and lifts. Dimensions (Width, Height, Depth) are listed on every product page. If a bespoke item cannot fit into the property, re-delivery or return haulage fees may apply as per the UK Consumer Rights Act 2015.
              </p>
            </div>
          </div>
        </div>

        {/* Still have questions */}
        <div className="text-center py-6 border-t border-gray-200 space-y-3">
          <p className="text-xs text-gray-500">Need a dedicated delivery date or Saturday delivery?</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-charcoal-900 hover:bg-brand-900 text-white text-xs font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Speak to our Logistics Concierge
          </Link>
        </div>
      </div>
    </div>
  );
}
