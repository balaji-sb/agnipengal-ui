import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vendor Partnership Plans | Agnipengal – Grow Your Business',
  description:
    'Join Agnipengal as a vendor partner. Choose from flexible subscription plans to list your products, reach thousands of customers, and grow your women-owned business across India.',
  keywords: [
    'vendor partnership India',
    'Agnipengal vendor plans',
    'sell on Agnipengal',
    'women entrepreneur subscription',
    'become a seller India',
    'online marketplace vendor India',
    'sell handmade products India',
    'women business subscription plan',
  ],
  openGraph: {
    title: 'Vendor Partnership Plans | Agnipengal',
    description:
      "Flexible plans to list your products and grow your women-owned business on Agnipengal \u2013 India's women entrepreneur marketplace.",
    url: 'https://agnipengal.com/partnership',
    images: [{ url: 'https://agnipengal.com/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@agnipengal',
    title: 'Vendor Partnership Plans | Agnipengal',
    description: 'Join Agnipengal as a vendor and grow your women-owned business.',
    images: ['https://agnipengal.com/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://agnipengal.com/partnership',
  },
};

export default function PartnershipLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
