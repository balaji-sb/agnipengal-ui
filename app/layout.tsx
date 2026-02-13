export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { Montserrat,Quicksand,Plus_Jakarta_Sans } from "next/font/google";
import { Suspense } from 'react';
import "./globals.css";
import { CartProvider } from "@/lib/context/CartContext";
import { AuthProvider } from "@/lib/context/AuthContext";
import { WishlistProvider } from "@/lib/context/WishlistContext";
import { Toaster } from "react-hot-toast";

import { ConfigProvider } from "@/lib/context/ConfigContext";

const montserrat = Montserrat({ subsets: ["latin"] });
const quicksand = Quicksand({ subsets: ["latin"] });
const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  let appName = "Mahi's Vriksham Boutique";
  let description = "Discover premium Aari embroidery supplies, sewing essentials, and artificial decoration items. High-quality materials for your creative journey.";
  
  try {
     const apiUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002/api';
     console.log("Api url",apiUrl)
     const res = await fetch(`${apiUrl}/config`, { next: { revalidate: 60 } });
     const json = await res.json();
     if (json?.data?.appName) {
        appName = json.data.appName;
     }
  } catch (e) {
     console.error("Error fetching config for metadata", e);
  }

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://mahisvrikshamboutique.vercel.app'),
    title: {
      template: `%s | ${appName}`,
      default: `${appName} - Premium Aari & Sewing Materials`,
    },
    description: description.replace("Mahi's Vriksham Boutique", appName),
    keywords: ["Aari work materials", "Sewing supplies", "Embroidery kits", "Maggam work", "Zardosi materials", "Online boutique India", "Tailoring materials", appName],
    authors: [{ name: appName }],
    openGraph: {
      title: `${appName} - Premium Aari & Sewing Materials`,
      description: `Your one-stop shop for high-quality Aari raw materials, sewing essentials, and creative decoration items at ${appName}.`,
      url: 'https://mahisvrikshamboutique.vercel.app',
      siteName: appName,
      locale: 'en_IN',
      type: 'website',
      images: [
        {
          url: '/logo.jpg',
          width: 800,
          height: 600,
          alt: `${appName} Logo`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: appName,
      description: `Premium Aari & Sewing Materials for your creative needs at ${appName}.`,
      images: ['/logo.jpg'],
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
      canonical: 'https://mahisvrikshamboutique.vercel.app',
    },
    icons: {
      icon: '/logo.jpg',
      shortcut: '/logo.jpg',
      apple: '/logo.jpg',
    },
  };
}

import { GoogleOAuthProvider } from '@react-oauth/google';
import AnalyticsTracker from '@/components/AnalyticsTracker';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // console.log("GOOGLE_CLIENT_ID", process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
  return (
    <html lang="en">
      <body className={plusJakarta.className}>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID'}>
        <ConfigProvider>
        <AuthProvider>
        <CartProvider>


        <WishlistProvider>
            <Suspense fallback={null}>
                <AnalyticsTracker />
            </Suspense>
            {children}
            <Toaster position="top-right" />
        </WishlistProvider>
        </CartProvider>
        </AuthProvider>
        </ConfigProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
