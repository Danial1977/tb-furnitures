export const metadata = {
  title: 'Privacy Notice & Cookie Policy | TB Furnitures',
  description: 'How TB Furnitures protects your personal data in compliance with the UK General Data Protection Regulation (UK GDPR) and Data Protection Act 2018.',
};

export default function PrivacyPage() {
  return (
    <div className="bg-sand-50/50 min-h-screen py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">
            Data Protection & Trust
          </span>
          <h1 className="font-editorial text-3xl md:text-5xl font-bold text-charcoal-900">
            Privacy Notice & Cookie Policy
          </h1>
          <p className="text-xs text-gray-500">
            Compliant with UK GDPR, Data Protection Act 2018 & PECR Regulations
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-10 shadow-sm space-y-8 text-xs text-gray-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-editorial text-lg font-bold text-charcoal-900">
              1. Who We Are (Data Controller)
            </h2>
            <p>
              TB Furnitures (UK) Ltd (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is the Data Controller responsible for your personal data. If you have questions regarding this notice or wish to exercise your data subject rights, contact our Data Privacy Officer at <span className="font-mono text-brand-700">privacy@tbfurnitures.co.uk</span> or write to: Data Protection Officer, TB Furnitures, 45 Regent Mews, Marylebone, London, W1B 3HH.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-editorial text-lg font-bold text-charcoal-900">
              2. Personal Data We Collect
            </h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Identity & Contact Information:</strong> Full name, billing address, delivery address, email address, telephone number.</li>
              <li><strong>Financial Data:</strong> Encrypted payment card tokenization via PCI-DSS Level 1 compliant gateway (Stripe). We never store raw card numbers.</li>
              <li><strong>Order & Transaction Records:</strong> Purchased furniture pieces, room preferences, delivery notes, swatches requested.</li>
              <li><strong>Technical & Browsing Data:</strong> IP address, browser type, device information, and session preferences (such as selected visual theme swatches).</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-editorial text-lg font-bold text-charcoal-900">
              3. Legal Basis for Processing
            </h2>
            <p>
              Under UK GDPR Article 6, we process your information under the following legal bases:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Contractual Necessity:</strong> Processing your delivery address, telephone number, and payment to fulfill your furniture order.</li>
              <li><strong>Legal Obligation:</strong> Retaining invoices and VAT tax records for 6 years in compliance with HMRC requirements.</li>
              <li><strong>Legitimate Interests:</strong> Improving website performance, customer experience, and preventing fraudulent transactions.</li>
              <li><strong>Consent:</strong> Sending email newsletters or interior design inspiration catalogs where you have explicitly opted in.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-editorial text-lg font-bold text-charcoal-900">
              4. Third-Party Data Disclosures
            </h2>
            <p>
              We only share your data with vetted service partners essential for fulfilling your orders:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Specialist two-man UK furniture courier fleets (e.g., Panther, BJS Logistics) to arrange room delivery.</li>
              <li>Payment infrastructure providers (Stripe UK Ltd) for secure card authorization.</li>
              <li>Cloud hosting and secure relational database infrastructure located within the United Kingdom and European Economic Area.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-editorial text-lg font-bold text-charcoal-900">
              5. Your Rights Under UK Data Protection Law
            </h2>
            <p>
              You have the right to request access to your personal data (Subject Access Request), request correction of inaccurate data, request erasure (&quot;Right to be Forgotten&quot;), or object to direct marketing at any time. You also have the right to lodge a complaint with the UK Information Commissioner&apos;s Office (ICO) at <span className="font-mono">ico.org.uk</span>.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-editorial text-lg font-bold text-charcoal-900">
              6. Cookie Policy
            </h2>
            <p>
              Our website uses strictly necessary cookies (to maintain your shopping bag and authenticated admin sessions) and functional session storage (to save your preferred theme palette, e.g. Heritage Walnut or Nordic Sand). We do not sell tracking profiles to third-party ad networks.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
