import api from '@/lib/api';
import { getAuthHeaders } from '@/lib/api-server';

async function getStats() {
    try {
        const headers = await getAuthHeaders();
        const res = await api.get('/admin/stats', { headers });
        return res.data.data;
    } catch (error) {
        return { orderCount: 0, productCount: 0, totalRevenue: 0 };
    }
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 font-medium mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold text-gray-900">₹{stats.totalRevenue}</p>
         </div>
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 font-medium mb-2">Total Orders</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.orderCount}</p>
         </div>
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 font-medium mb-2">Total Products</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.productCount}</p>
         </div>
      </div>
    </div>
  );
}
