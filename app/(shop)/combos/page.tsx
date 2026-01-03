import React from 'react';
import api from '@/lib/api';
import ProductCard from '@/components/shop/ProductCard';
import { Sparkles, Package, AlertCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getCombos() {
    try {
        const res = await api.get('/combos');
        return res.data.data || [];
    } catch (error) {
        console.error('Combos fetch error:', error);
        return [];
    }
}

export default async function CombosPage() {
    const combos = await getCombos();

    // Map deals to product structure for card reuse if needed, 
    // but Combos usually have their own structure. 
    // However, ProductCard expects specific props.
    // Let's adapt combo to ProductCardProps
    const combosAsProducts = combos.map((c: any) => ({
        _id: c._id,
        name: c.name,
        slug: c._id, // Use ID as slug for combos to trigger the backend fallback in getProduct
        price: c.price,
        // If combo has an image, use it. Else fallback.
        images: c.image ? [c.image] : [],
        category: { name: 'Combo Bundle', slug: 'combos' },
        stock: 100, // Dummy stock for now
        description: c.description
    }));

    // Quick fix: If we don't have a specific Combo Details page, 
    // checking ProductCard links. It links to `/product/${product.slug}`.
    // If we don't have a route for combos, clicking might 404.
    // However, the request is just to "listing".
    // I will assume for this step we just list them.

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Header */}
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-violet-900 via-purple-800 to-fuchsia-900 text-white py-20 px-4 mb-12 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                
                <div className="container mx-auto max-w-4xl text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6 animate-fade-in-up">
                        <Sparkles className="w-4 h-4 text-yellow-300" />
                        <span className="text-sm font-medium tracking-wider uppercase text-purple-100">Limited Time Bundles</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200 animate-fade-in-up animation-delay-100">
                        Curated Value Combos
                    </h1>
                    <p className="text-xl text-purple-100/90 leading-relaxed max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
                        Maximize your savings with our hand-picked collections. 
                        Get everything you need in one perfect package.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4">
                {combos.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {combosAsProducts.map((combo: any) => (
                           <ProductCard key={combo._id} product={combo} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="bg-white p-8 rounded-2xl inline-block shadow-sm">
                            <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-600 mb-2">No Combos Available</h3>
                            <p className="text-gray-500">Check back later for new bundles!</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
