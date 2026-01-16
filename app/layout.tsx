import type { Metadata } from "next";
import { Montserrat,Quicksand,Plus_Jakarta_Sans } from "next/font/google"; 
import "./globals.css";
import { CartProvider } from "@/lib/context/CartContext";
import { AuthProvider } from "@/lib/context/AuthContext";
import { WishlistProvider } from "@/lib/context/WishlistContext";
import { Toaster } from "react-hot-toast";

const montserrat = Montserrat({ subsets: ["latin"] });
const quicksand = Quicksand({ subsets: ["latin"] });
const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://mahisvrikshamboutique.vercel.app'),
  title: {
    template: "%s | Mahi's Vriksham Boutique",
    default: "Mahi's Vriksham Boutique - Premium Aari & Sewing Materials",
  },
  description: "Discover premium Aari embroidery supplies, sewing essentials, and artificial decoration items at Mahi's Vriksham Boutique. High-quality materials for your creative journey.",
  keywords: ["Aari work materials", "Sewing supplies", "Embroidery kits", "Maggam work", "Zardosi materials", "Online boutique India", "Tailoring materials","Mahis Vriksham Boutique"],
  authors: [{ name: "Mahi's Vriksham Boutique" }],
  openGraph: {
    title: "Mahi's Vriksham Boutique - Premium Aari & Sewing Materials",
    description: "Your one-stop shop for high-quality Aari raw materials, sewing essentials, and creative decoration items.",
    url: 'https://mahisvrikshamboutique.vercel.app',
    siteName: "Mahi's Vriksham Boutique",
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/logo.jpg',
        width: 800,
        height: 600,
        alt: "Mahi's Vriksham Boutique Logo",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Mahi's Vriksham Boutique",
    description: "Premium Aari & Sewing Materials for your creative needs.",
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
 import { GoogleOAuthProvider } from '@react-oauth/google';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log("GOOGLE_CLIENT_ID", process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
  return (
    <html lang="en">
      <body className={plusJakarta.className}>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID'}>
        <AuthProvider>
        <CartProvider>
        <WishlistProvider>
            {children}
            <Toaster position="top-right" />
        </WishlistProvider>
        </CartProvider>
        </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
