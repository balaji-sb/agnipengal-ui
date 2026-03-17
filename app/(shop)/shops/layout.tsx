import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Discover Shops | Agnipengal – Women-Owned Stores',
  description:
    'Browse a curated directory of women-owned shops and vendors on Agnipengal. Discover unique stores selling handmade products, Aari embroidery, and artisan goods from across India.',
  keywords: [
    'women owned shops India',
    'Agnipengal vendor directory',
    'discover women stores India',
    'handmade shops online India',
    'women entrepreneur stores',
    'artisan shops India',
    'Aari embroidery shops',
    'browse women businesses India',
  ],
  openGraph: {
    title: 'Discover Women-Owned Shops | Agnipengal',
    description:
      'Explore our curated directory of women-owned stores and artisan shops on Agnipengal.',
    url: 'https://agnipengal.com/shops',
    images: [{ url: 'https://agnipengal.com/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@agnipengal',
    title: 'Discover Women-Owned Shops | Agnipengal',
    description: 'Browse our directory of women-owned stores and artisan shops.',
    images: ['https://agnipengal.com/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://agnipengal.com/shops',
  },
};

export default function ShopsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
