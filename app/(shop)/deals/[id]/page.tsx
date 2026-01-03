import React from 'react';
import api from '@/lib/api';
import ProductCard from '@/components/shop/ProductCard';
import { ArrowLeft, Timer, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getDeal(id: string) {
    try {
        // Fetch specific deal by ID
        const res = await api.get(`/deals/${id}`);
        if (!res.data.success) return null;
        return res.data.data;
    } catch (error) {
        console.error('Deal fetch error:', error);
        return null;
    }
}

export default async function DealDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    console.log('Deal ID:', params);
    const deal = await getDeal(id);

    if (!deal) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                 <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Deal Not Found</h2>
                    <Link href="/deals" className="text-pink-600 hover:underline">Back to Deals</Link>
                 </div>
            </div>
        );
    }

    // Map products in this deal to include deal pricing
    const dealProducts = (deal.products || []).map((p: any) => ({
        ...p,
        offerPrice: deal.dealPrice, // Apply deal price
        images: deal.image ? [deal.image] : p.images, // Use deal image if preferred, or maybe keep product images inside the deal view?
        // User requested "deals listings page... show deals image". 
        // Inside the deal details, showing the product image might be better logic, 
        // BUT for consistency let's prioritize Deal Image if that's what created the "Bundle" look.
        // Actually, if it's "Buy 1 Get 1", the products are distinct. 
        // Let's use Product Image inside the list, but with Deal Price.
        // Re-reading user request: "Deals listing page is not showing deal price and image".
        // That referred to the /deals page. 
        // Now on /deals/[id], we are seeing the ITEMS in the deal.
        // Let's fallback to Product Image here so users see what they get. 
        // But keep Deal Price.
        // Wait, if I change image here, it might look inconsistent.
        // Let's stick to: If deal has image, use it? Or maybe just for the main banner?
        // Let's use Product Image for individual items, it makes more sense for "Items in this deal".
        activeDeal: { name: deal.name },
        category: typeof p.category === 'string' ? { name: 'Deal Item', slug: 'deals' } : (p.category || { name: 'Deal Item', slug: 'deals' })
    }));

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
             {/* Hero Banner for Deal */}
             <div className="relative bg-gray-900 text-white py-16">
                 {deal.image && (
                     <>
                        <div className="absolute inset-0">
                            <img src={deal.image} alt={deal.name} className="w-full h-full object-cover opacity-40 blur-sm" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/90" />
                     </>
                 )}
                 <div className="container mx-auto px-4 relative z-10">
                     <Link href="/deals" className="inline-flex items-center text-gray-300 hover:text-white mb-6 transition-colors">
                         <ArrowLeft className="w-4 h-4 mr-2" /> Back to Deals
                     </Link>
                     <h1 className="text-4xl md:text-5xl font-bold mb-4">{deal.name}</h1>
                     <div className="flex flex-wrap items-center gap-6 text-gray-200">
                         {deal.description && <p className="text-lg opacity-90 max-w-2xl">{deal.description}</p>}
                     </div>
                     <div className="mt-8 flex items-center gap-4">
                         <div className="bg-pink-600 px-6 py-2 rounded-full font-bold text-lg flex items-center gap-2 shadow-lg">
                             <ShoppingBag className="w-5 h-5" />
                             Deal Price: ₹{deal.dealPrice}
                         </div>
                         {/* Could add Timer here too */}
                     </div>
                 </div>
             </div>

             <div className="container mx-auto px-4 py-12">
                 <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-2">
                    Items in this Deal <span className="text-sm font-normal text-gray-500">({dealProducts.length} items)</span>
                 </h2>
                 
                 {dealProducts.length > 0 ? (
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                         {dealProducts.map((product: any) => (
                             <ProductCard key={product._id} product={product} />
                         ))}
                     </div>
                 ) : (
                     <div className="text-center py-20 text-gray-500">
                         No products found in this deal.
                     </div>
                 )}
             </div>
        </div>
    );
}
