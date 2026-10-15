import { RotateCcw, ShieldCheck, CheckCircle2, Clock, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Returns & 30-Day In-Home Guarantee | TB Furnitures',
  description: 'Our complete UK furniture returns policy, statutory 14-day cancellation rights under the Consumer Rights Act 2015, and our 10-year structural frame guarantee.',
};

export default function ReturnsPage() {
  return (
    <div className="bg-sand-50/50 min-h-screen py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">
            Peace of Mind Guarantee
          </span>
          <h1 className="font-editorial text-3xl md:text-5xl font-bold text-charcoal-900">
            Returns & 30-Day In-Home Trial
          </h1>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            We want you to feel completely confident living with TB Furnitures in your home. That is why we offer our extended 30-Day In-Home Trial alongside your statutory rights under UK Consumer Law.
          </p>
        </div>

        {/* Guarantees Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h3 className="font-editorial text-xl font-bold text-charcoal-900">
              30-Day In-Home Trial
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              If your chosen sofa, dining table, or bed frame doesn't harmonize perfectly with your interiors, contact our customer concierge within 30 days of delivery. We will arrange collection from your room of choice and issue a full refund minus a modest £49 two-man collection fee.
            </p>
            <ul className="space-y-2 text-xs text-charcoal-800">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sage-600 shrink-0" />
                <span>Items must be in pristine, unmarked, original condition</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sage-600 shrink-0" />
                <span>Mattresses must be used with a mattress protector</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sage-600 shrink-0" />
                <span>Full refund processed to original payment method within 5–7 days</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-xl bg-sage-50 flex items-center justify-center text-sage-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-editorial text-xl font-bold text-charcoal-900">
              10-Year Structural Frame Guarantee
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Every solid wood dining table, bed frame, cabinet, and sofa carcass built by TB Furnitures carries our 10-year manufacturer warranty covering timber warping, joint failure, and structural defects.
            </p>
            <ul className="space-y-2 text-xs text-charcoal-800">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sage-600 shrink-0" />
                <span>Covers European oak, walnut, beech and kiln-dried internal hardwood frames</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sage-600 shrink-0" />
                <span>Free repair, component replacement, or equivalent exchange</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sage-600 shrink-0" />
                <span>Transferable with your original order invoice confirmation</span>
              </li>
            </ul>
          </div>
        </div>

        {/* UK Statutory Rights Section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-4">
          <h2 className="font-editorial text-2xl font-bold text-charcoal-900">
            Your Rights Under the UK Consumer Rights Act 2015
          </h2>
          <div className="text-xs text-gray-600 space-y-3 leading-relaxed">
            <p>
              Under the UK Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013, you have a statutory right to cancel your order within 14 calendar days from the day after you receive your goods without giving any reason.
            </p>
            <p>
              Under the Consumer Rights Act 2015, goods must be as described, fit for purpose, and of satisfactory quality. If an item arrives damaged or develops a manufacturing fault within 30 days of delivery, you are entitled to an immediate full refund including all delivery charges.
            </p>
            <p>
              Between 30 days and 6 months, we will repair or replace faulty furniture at no cost to you. If a repair or replacement is not possible or unsuccessful, you may claim a price reduction or full refund.
            </p>
          </div>
        </div>

        {/* How to Arrange a Return */}
        <div className="bg-charcoal-900 text-white rounded-2xl p-6 md:p-8 space-y-4">
          <h3 className="font-editorial text-xl font-bold">
            How to Book a Collection
          </h3>
          <p className="text-xs text-brand-200/80 leading-relaxed">
            1. Email our concierge at <span className="text-white font-mono">returns@tbfurnitures.co.uk</span> with your TB Order Reference (e.g. TBF-2026-XXXX) and clear photos of the items.
          </p>
          <p className="text-xs text-brand-200/80 leading-relaxed">
            2. Our logistics scheduling team will contact you to book a convenient 3-hour collection slot.
          </p>
          <p className="text-xs text-brand-200/80 leading-relaxed">
            3. Our two-man team will inspect and collect the item directly from your room. Refunds are credited back to your original payment card within 3 to 5 business days after inspection.
          </p>
        </div>
      </div>
    </div>
  );
}
