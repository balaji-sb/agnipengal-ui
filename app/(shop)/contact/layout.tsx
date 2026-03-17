import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Agnipengal – Get in Touch',
  description:
    'Have questions about our products, vendor partnerships, or orders? Reach out to the Agnipengal team via email, phone, or our contact form. We respond within 24 hours.',
  keywords: [
    'contact Agnipengal',
    'Agnipengal support',
    'women entrepreneur helpdesk India',
    'Agnipengal customer care',
    'contact women marketplace India',
    'reach Agnipengal team',
  ],
  openGraph: {
    title: 'Contact Us | Agnipengal',
    description: 'Reach out to the Agnipengal team. We are here to help you grow your business.',
    url: 'https://agnipengal.com/contact',
    images: [{ url: 'https://agnipengal.com/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@agnipengal',
    title: 'Contact Us | Agnipengal',
    description: 'Get in touch with the Agnipengal team.',
    images: ['https://agnipengal.com/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://agnipengal.com/contact',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
