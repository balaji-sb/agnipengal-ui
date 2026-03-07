export const dynamic = 'force-dynamic';
import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { Suspense } from 'react';
import './globals.css';
import { CartProvider } from '@/lib/context/CartContext';
import { AuthProvider } from '@/lib/context/AuthContext';
import { WishlistProvider } from '@/lib/context/WishlistContext';
import { Toaster } from 'react-hot-toast';
import { ConfigProvider } from '@/lib/context/ConfigContext';
import { VendorAuthProvider } from '@/lib/context/VendorAuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import AnalyticsTracker from '@/components/AnalyticsTracker';

const plusJakarta = Plus_Jakarta_Sans({ subsets: ['latin'] });

export async function generateMetadata(): Promise<Metadata> {
  let appName = 'Agnipengal';

  try {
    const apiUrl =
      process.env.INTERNAL_API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      'http://localhost:5002/api';
    const res = await fetch(`${apiUrl}/config`, { next: { revalidate: 60 } });
    const json = await res.json();
    if (json?.data?.appName) appName = json.data.appName;
  } catch (e) {
    console.error('Error fetching config for metadata', e);
  }

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://agnipengal.com';
  const title = `${appName} - Empowering Women Entrepreneurs`;
  const description =
    'Agnipengal is a community-driven platform empowering women entrepreneurs across India. Discover handmade products, support women-owned businesses, and join a movement that celebrates creativity, resilience, and financial independence for women.';

  return {
    metadataBase: new URL(siteUrl),

    title: {
      template: `%s | ${appName}`,
      default: title,
    },
    description,

    keywords: [
      'Agnipengal',
      'Agnipengal community',
      'empowering women entrepreneurs',
      'women entrepreneurship India',
      'women empowerment platform',
      'women owned business India',
      'women entrepreneur network',
      'support women businesses',
      'women artisans India',
      'women artisans marketplace',
      'female entrepreneurs India',
      'buy from women India',
      'Agnipengal marketplace',
      'handmade in India',
      'women entrepreneur marketplace India',
      'Aari embroidery India',
      'Aari materials online',
      'boutique India',
      'Made in India',
      'Indian handmade products',
      'women entrepreneur marketplace',
      'made in india products',
      'online marketplace for women',
    ],

    other: {
      'Made-In': 'India',
      Country: 'IN',
      'geo.region': 'IN',
      'geo.country': 'IN',
    },

    authors: [{ name: appName, url: siteUrl }],
    creator: appName,
    publisher: appName,
    category: 'Shopping',

    openGraph: {
      type: 'website',
      locale: 'en_IN',
      url: siteUrl,
      siteName: appName,
      title,
      description,
      images: [
        {
          url: `${siteUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: `${appName} - Empowering Women Entrepreneurs`,
        },
        {
          url: `${siteUrl}/logo.jpg`,
          width: 400,
          height: 400,
          alt: `${appName} Logo`,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      site: '@agnipengal',
      creator: '@agnipengal',
      title,
      description,
      images: [`${siteUrl}/og-image.jpg`],
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    alternates: {
      canonical: siteUrl,
    },

    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/logo.jpg', type: 'image/jpeg' },
      ],
      shortcut: '/favicon.ico',
      apple: '/logo.jpg',
    },

    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en-IN'>
      <body className={plusJakarta.className}>
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID'}
        >
          <ConfigProvider>
            <AuthProvider>
              <VendorAuthProvider>
                <CartProvider>
                  <WishlistProvider>
                    <Suspense fallback={null}>
                      <AnalyticsTracker />
                    </Suspense>
                    {children}
                    <Toaster position='top-right' />
                  </WishlistProvider>
                </CartProvider>
              </VendorAuthProvider>
            </AuthProvider>
          </ConfigProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
