import { Sparkles, Sun, Droplets, Shield, CheckCircle2, AlertOctagon } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Timber & Leather Care Guide | TB Furnitures',
  description: 'How to protect, maintain, and nourish solid oak, American walnut, natural top-grain leathers, and woven linen fabrics.',
};

export default function CareGuidePage() {
  return (
    <div className="bg-sand-50/50 min-h-screen py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">
            Craft Preservation
          </span>
          <h1 className="font-editorial text-3xl md:text-5xl font-bold text-charcoal-900">
            Timber, Leather & Upholstery Care
          </h1>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Our furniture is designed to mature gracefully over decades. Proper maintenance ensures that your solid wood, natural leathers, and linen weaves maintain their rich luster and resilience.
          </p>
        </div>

        {/* 4 Golden Rules */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 text-center space-y-2">
            <Sun className="w-6 h-6 text-amber-500 mx-auto" />
            <h4 className="font-editorial font-bold text-sm text-charcoal-900">Avoid Direct Sunlight</h4>
            <p className="text-[11px] text-gray-500">Prolonged UV exposure can cause natural wood bleaching and leather fading.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 text-center space-y-2">
            <Droplets className="w-6 h-6 text-blue-500 mx-auto" />
            <h4 className="font-editorial font-bold text-sm text-charcoal-900">Wipe Spills Promptly</h4>
            <p className="text-[11px] text-gray-500">Blot liquids immediately with a dry cloth; never rub into the grain.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 text-center space-y-2">
            <Shield className="w-6 h-6 text-brand-500 mx-auto" />
            <h4 className="font-editorial font-bold text-sm text-charcoal-900">Use Table Coasters</h4>
            <p className="text-[11px] text-gray-500">Always place trivets or heat mats under hot dishes, mugs, and bowls.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 text-center space-y-2">
            <Sparkles className="w-6 h-6 text-sage-600 mx-auto" />
            <h4 className="font-editorial font-bold text-sm text-charcoal-900">Annual Nourishment</h4>
            <p className="text-[11px] text-gray-500">Re-oil natural timber with clear Osmo Polyx oil or beeswax twice yearly.</p>
          </div>
        </div>

        {/* Detailed Material Sections */}
        <div className="space-y-8">
          {/* Solid Hardwoods */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-4">
            <h2 className="font-editorial text-2xl font-bold text-charcoal-900 flex items-center gap-2">
              <span>Solid European Oak & American Walnut</span>
            </h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              Solid wood reacts organically to environmental temperature and relative humidity. In winter when domestic central heating is active, wood contracts; in summer humidity, it gently expands. Maintain indoor humidity between 40% and 60% where possible.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-gray-50 p-4 rounded-xl space-y-2 text-xs">
                <strong className="text-sage-700 flex items-center gap-1.5 font-semibold">
                  <CheckCircle2 className="w-4 h-4" /> Recommended Practice
                </strong>
                <ul className="space-y-1 text-gray-600">
                  <li>• Dust weekly using a dry microfiber cloth following the grain.</li>
                  <li>• For light dirt, use a damp cloth followed immediately by dry drying.</li>
                  <li>• Apply natural wax or Osmo wood oil once or twice a year.</li>
                </ul>
              </div>

              <div className="bg-red-50/50 p-4 rounded-xl space-y-2 text-xs">
                <strong className="text-red-700 flex items-center gap-1.5 font-semibold">
                  <AlertOctagon className="w-4 h-4" /> What to Avoid
                </strong>
                <ul className="space-y-1 text-gray-600">
                  <li>• Do not use silicone-based furniture sprays or bleach cleaners.</li>
                  <li>• Do not position solid timber directly against radiators or fireplaces.</li>
                  <li>• Never leave wet glasses or pooling condensation on the wood.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Natural Leathers */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-4">
            <h2 className="font-editorial text-2xl font-bold text-charcoal-900">
              Aniline & Semi-Aniline Leather Sofas
            </h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              Our leather sofas use supple Italian full-grain hides. Leather develops a distinguished patina with age. Treat it gently with dedicated leather balms every 6 to 12 months to maintain suppleness and prevent cracking. Keep pets with sharp claws off unprotected surfaces.
            </p>
          </div>

          {/* Woven Linen & Bouclé Fabrics */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-4">
            <h2 className="font-editorial text-2xl font-bold text-charcoal-900">
              Woven Linen, Velvet & Bouclé Upholstery
            </h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              Vacuum upholstery cushions bi-weekly with an upholstery brush attachment to remove microscopic dust and particulate debris that causes fiber abrasion. Rotate reversible seat cushions monthly to ensure even settling of feather and foam cores. For accidental stains, blot immediately with a clean cotton cloth and lukewarm distilled water.
            </p>
          </div>
        </div>

        {/* Swatches Banner */}
        <div className="bg-brand-900 text-white rounded-2xl p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h3 className="font-editorial text-xl font-bold">Want to feel our materials first-hand?</h3>
            <p className="text-xs text-brand-200/80 mt-1">Order our complimentary swatch kit delivered straight to your door.</p>
          </div>
          <Link
            href="/swatches"
            className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-400 text-white text-xs font-semibold px-5 py-3 rounded-xl transition-colors shrink-0"
          >
            Order Free Swatches
          </Link>
        </div>
      </div>
    </div>
  );
}
