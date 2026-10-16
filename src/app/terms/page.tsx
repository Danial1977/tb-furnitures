export const metadata = {
  title: 'Terms of Sale & Website Conditions | TB Furnitures',
  description: 'Official terms and conditions of sale for TB Furnitures (UK) Ltd. Regulated under the laws of England and Wales.',
};

export default function TermsPage() {
  return (
    <div className="bg-sand-50/50 min-h-screen py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">
            Legal & Governance
          </span>
          <h1 className="font-editorial text-3xl md:text-5xl font-bold text-charcoal-900">
            Terms & Conditions of Sale
          </h1>
          <p className="text-xs text-gray-500">
            Last Updated: 16 October 2026 • Governing Law: England & Wales
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-10 shadow-sm space-y-8 text-xs text-gray-700 leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-2">
            <h2 className="font-editorial text-lg font-bold text-charcoal-900">
              1. Company Information
            </h2>
            <p>
              This website is operated by <strong>OAKLAND FURNITURE AND FLOORING LTD</strong> (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;). Registered in England and Wales under Company Registration Number 17396425 (Incorporated on 12 August 2026). Registered Office & Flagship Showroom: 236 Easterly Road, Leeds LS8 3ES, United Kingdom. Direct Customer Support: 0113 808 5120 / 07467 279653. Email: Taj.TSO@gmail.com.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-2">
            <h2 className="font-editorial text-lg font-bold text-charcoal-900">
              2. Contract Formation & Ordering
            </h2>
            <p>
              When you place an order on <span className="font-mono">tbfurnitures.co.uk</span>, you will receive an automatic acknowledgement email. This does not constitute final acceptance of your order. Acceptance of your order and formation of the contract of sale occurs when we dispatch your furniture or send an official order confirmation with scheduled delivery allocation.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-2">
            <h2 className="font-editorial text-lg font-bold text-charcoal-900">
              3. Pricing & Value Added Tax (VAT)
            </h2>
            <p>
              All prices displayed on this website are denominated in Pounds Sterling (GBP, £) and include United Kingdom Value Added Tax (VAT) at the prevailing statutory rate of 20%. Delivery charges are clearly itemized at checkout prior to final payment authorization.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-2">
            <h2 className="font-editorial text-lg font-bold text-charcoal-900">
              4. Natural Materials & Tolerances
            </h2>
            <p>
              TB Furnitures utilizes premium solid hardwoods (European oak, American walnut), natural top-grain leathers, and woven linen fabrics. Because timber is an organic natural material, variations in grain structure, natural knots, subtle mineral streaks, and slight color variations are expected characteristics of authentic craftsmanship and do not constitute manufacturing faults. Dimensions are subject to standard manufacturing tolerances of ±1.5cm.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-2">
            <h2 className="font-editorial text-lg font-bold text-charcoal-900">
              5. Delivery & Property Access
            </h2>
            <p>
              It is the customer&apos;s legal responsibility to ensure adequate and safe access into the room of choice. If delivery cannot be completed due to access restrictions (e.g. stairwell narrowness, doorway dimensions), or absence of the customer during an agreed 3-hour window, reasonable redelivery or failed-haulage charges of £49 will apply.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-2">
            <h2 className="font-editorial text-lg font-bold text-charcoal-900">
              6. Cancellation Rights & Distance Selling
            </h2>
            <p>
              Under the UK Consumer Contracts Regulations 2013, you have the right to cancel this contract within 14 days without giving reason. The cancellation period expires 14 days from the day on which you acquire physical possession of the furniture. In addition, TB Furnitures voluntarily extends a 30-Day In-Home Trial on eligible catalogue lines.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-2">
            <h2 className="font-editorial text-lg font-bold text-charcoal-900">
              7. Furniture Fire Safety Compliance
            </h2>
            <p>
              All upholstered furniture, mattresses, and fillings supplied by TB Furnitures comply fully with the UK Furniture and Furnishings (Fire) (Safety) Regulations 1988 (as amended in 1989, 1993, and 2010), meeting ignition source 0 (cigarette test), ignition source 1 (match test), and Schedule 1 Part 1 flammability standards.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-2">
            <h2 className="font-editorial text-lg font-bold text-charcoal-900">
              8. Applicable Law & Jurisdiction
            </h2>
            <p>
              These terms are governed by and construed in accordance with the laws of England and Wales. Both you and TB Furnitures (UK) Ltd submit to the non-exclusive jurisdiction of the English courts.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
