import api from '@/lib/api';
import { getAuthHeaders } from '@/lib/api-server'; // Keeping in case we add auth check later
import { IndianRupee, ShoppingBag, Package } from 'lucide-react';
export const dynamic = 'force-dynamic';

async function getStats() {
    try {
        const headers = await getAuthHeaders();
        const res = await api.get('/admin/stats', { headers });
        return res.data.data;
    } catch (error) {
        console.error('Dashboard Stats Error:', error);
        return { orderCount: 0, productCount: 0, totalRevenue: 0 };
    }
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">Welcome back, here's what's happening today.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Total Revenue */}
         <div className="bg-gradient-to-br from-pink-500 to-rose-600 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden group hover:shadow-xl transition-all">
            <div className="absolute -right-4 -top-4 opacity-10 transform group-hover:scale-110 transition-transform">
                <IndianRupee size={120} />
            </div>
            <div className="relative z-10">
                <div className="p-3 bg-white/20 rounded-xl w-fit mb-4 backdrop-blur-sm">
                    <IndianRupee size={24} className="text-white" />
                </div>
                <h3 className="text-pink-100 font-medium mb-1">Total Revenue</h3>
                <p className="text-4xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
            </div>
         </div>

         {/* Total Orders */}
         <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden group hover:shadow-xl transition-all">
             <div className="absolute -right-4 -top-4 opacity-10 transform group-hover:scale-110 transition-transform">
                <ShoppingBag size={120} />
            </div>
            <div className="relative z-10">
                <div className="p-3 bg-white/20 rounded-xl w-fit mb-4 backdrop-blur-sm">
                    <ShoppingBag size={24} className="text-white" />
                </div>
                <h3 className="text-blue-100 font-medium mb-1">Total Orders</h3>
                <p className="text-4xl font-bold">{stats.orderCount}</p>
            </div>
         </div>

         {/* Total Products */}
         <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden group hover:shadow-xl transition-all">
             <div className="absolute -right-4 -top-4 opacity-10 transform group-hover:scale-110 transition-transform">
                <Package size={120} />
            </div>
            <div className="relative z-10">
                <div className="p-3 bg-white/20 rounded-xl w-fit mb-4 backdrop-blur-sm">
                    <Package size={24} className="text-white" />
                </div>
                <h3 className="text-amber-100 font-medium mb-1">Total Products</h3>
                <p className="text-4xl font-bold">{stats.productCount}</p>
            </div>
         </div>
      </div>
    </div>
  );
}
