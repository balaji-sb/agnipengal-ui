import type { Metadata } from "next";
import { Montserrat,Quicksand,Plus_Jakarta_Sans } from "next/font/google"; 
import "./globals.css";
import { CartProvider } from "@/lib/context/CartContext";
import { AuthProvider } from "@/lib/context/AuthContext";

const montserrat = Montserrat({ subsets: ["latin"] });
const quicksand = Quicksand({ subsets: ["latin"] });
const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Mahi's Vriksham Boutique",
    default: "Mahi's Vriksham Boutique - Premium Aari & Sewing Materials",
  },
  description: "Buy high-quality Aari raw materials, sewing essentials, and artificial decoration items. Your one-stop shop for creativity.",
  icons: {
    icon: '/logo.jpg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={plusJakarta.className}>
        <AuthProvider>
        <CartProvider>
            {children}
        </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
