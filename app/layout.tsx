import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Using Inter as requested/standard
import "./globals.css";
import { CartProvider } from "@/lib/context/CartContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Mahi's Vriksham Boutique",
    default: "Mahi's Vriksham Boutique - Premium Aari & Sewing Materials",
  },
  description: "Buy high-quality Aari raw materials, sewing essentials, and artificial decoration items. Your one-stop shop for creativity.",
  openGraph: {
    title: "Mahi's Vriksham Boutique - Premium Aari & Sewing Materials",
    description: 'Buy high-quality Aari raw materials, sewing essentials, and artificial decoration items.',
    url: 'https://mahis-vriksham-boutique.com', // Placeholder
    siteName: "Mahi's Vriksham Boutique",
    images: [
      {
        url: 'https://images.unsplash.com/photo-1619551734325-81aaf323686c?auto=format&fit=crop&q=80', // Placeholder
        width: 800,
        height: 600,
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
};

import { AuthProvider } from "@/lib/context/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
