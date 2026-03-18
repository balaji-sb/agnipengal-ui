import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How It Works | Agnipengal – Start Selling in 5 Simple Steps',
  description:
    'Learn how to become a vendor on Agnipengal. Register, set up your storefront, list products, receive orders, and grow your women-owned business — all in 5 simple steps.',
  keywords: [
    'how to sell on Agnipengal',
    'become a vendor Agnipengal',
    'women entrepreneur marketplace India',
    'sell handmade products online India',
    'online store for women India',
    'Agnipengal vendor guide',
    'start selling online India',
  ],
  openGraph: {
    title: 'How It Works | Agnipengal',
    description: 'Step-by-step guide to selling your products on Agnipengal — India\'s women entrepreneur marketplace.',
    url: 'https://agnipengal.com/partnership/how-it-works',
    images: [{ url: 'https://agnipengal.com/og-image.jpg', width: 1200, height: 630 }],
  },
  alternates: {
    canonical: 'https://agnipengal.com/partnership/how-it-works',
  },
};

export default function HowItWorksLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
