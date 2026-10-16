import type { Metadata } from 'next';
import './globals.css';
import { StorefrontLayoutWrapper } from '@/components/layout/StorefrontLayoutWrapper';
import { Providers } from '@/components/providers/Providers';

export const metadata: Metadata = {
  title: 'Oakland Furniture & Flooring | Handcrafted Furniture & Flooring UK',
  description:
    'OAKLAND FURNITURE AND FLOORING LTD — Crafted for Living. Exceptional handcrafted furniture, solid hardwoods, luxury upholstery, and designer flooring solutions in Leeds and across the UK.',
  keywords: 'Oakland Furniture, flooring Leeds, modern sofa, solid oak dining table, luxury bedroom furniture, bespoke flooring UK',
  openGraph: {
    title: 'Oakland Furniture & Flooring — Crafted for Living',
    description: 'Discover handcrafted furniture and designer flooring built for timeless family living.',
    siteName: 'Oakland Furniture & Flooring',
    locale: 'en_GB',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB">
      <body className="flex flex-col min-h-screen">
        <Providers>
          <StorefrontLayoutWrapper>{children}</StorefrontLayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
