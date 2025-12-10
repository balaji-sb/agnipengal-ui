import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Using Inter as requested/standard
import "./globals.css";
import { CartProvider } from "@/lib/context/CartContext";
import { AuthProvider } from "@/lib/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Mahi's Vriksham Boutique",
    default: "Mahi's Vriksham Boutique - Premium Aari & Sewing Materials",
  },
  description: "Buy high-quality Aari raw materials, sewing essentials, and artificial decoration items. Your one-stop shop for creativity.",
};

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
            {children}
        </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
