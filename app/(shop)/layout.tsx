import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import { ConfigProvider } from "@/lib/context/ConfigContext";

export default function ShopLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConfigProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </ConfigProvider>
  );
}
