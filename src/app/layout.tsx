import type { Metadata } from 'next';
import './globals.css';
import { StorefrontLayoutWrapper } from '@/components/layout/StorefrontLayoutWrapper';
import { Providers } from '@/components/providers/Providers';

export const metadata: Metadata = {
  title: 'TB Furnitures | Handcrafted & Contemporary British Furniture',
  description:
    'Discover timeless living, bedroom, dining, and outdoor furniture handcrafted with natural oak, rich walnut, and bespoke finishes. White glove UK delivery available.',
  keywords: 'furniture UK, modern sofa, oak dining table, bedroom sets, luxury home decor, TB Furnitures',
  openGraph: {
    title: 'TB Furnitures — British Home Interiors',
    description: 'Elevate your home with contemporary and timeless furniture collections.',
    url: 'https://tbfurnitures.co.uk',
    siteName: 'TB Furnitures',
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
