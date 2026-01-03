import React from 'react';
import api from '@/lib/api';
import DealCard from '@/components/shop/DealCard'; // Verify import path
import { Sparkles, Timer, AlertCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getDeals() {
    try {
        const res = await api.get('/deals?activeOnly=true');
        return res.data.data || [];
    } catch (error) {
        console.error('Deals fetch error:', error);
        return [];
    }
}

export default async function DealsPage() {
    const deals = await getDeals();

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-600 to-rose-600 text-white py-12 mb-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                <div className="container mx-auto px-4 text-center relative z-10">
                    <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-bold mb-4 animate-pulse">
                        <Timer className="w-4 h-4 inline-block mr-2" />
                        LIMITED TIME OFFERS
                    </div>
                    <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
                        <Sparkles className="w-8 h-8 text-yellow-300" />
                        Deals of the Day
                    </h1>
                    <p className="text-pink-100 max-w-2xl mx-auto text-lg">
                        Explore our exclusive collections and limited-time offers.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4">
                {deals.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {deals.map((deal: any) => (
                           <DealCard key={deal._id} deal={deal} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="bg-white p-8 rounded-2xl inline-block shadow-sm">
                            <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-600 mb-2">No Active Deals</h3>
                            <p className="text-gray-500">Check back later for new offers!</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
