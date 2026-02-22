import api from '@/lib/api';
import { getAuthHeaders } from '@/lib/api-server'; // Keeping in case we add auth check later
import {
  IndianRupee,
  ShoppingBag,
  Package,
  MessageSquare,
  Layers,
  Tag,
  Store,
  CreditCard,
} from 'lucide-react';
export const dynamic = 'force-dynamic';

async function getStats() {
  try {
    const headers = await getAuthHeaders();
    const res = await api.get('/admin/stats', { headers }); // Backend route remains /admin
    return res.data.data;
  } catch (error) {
    console.error('Dashboard Stats Error:', error);
    return {
      orderCount: 0,
      productCount: 0,
      totalRevenue: 0,
      reviewCount: 0,
      categoryCount: 0,
      comboCount: 0,
      dealCount: 0,
      vendorCount: 0,
      vendorCategoryCount: 0,
      subscriptionPlanCount: 0,
    };
  }
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div className='space-y-8'>
      <div>
        <h1 className='text-3xl font-bold text-gray-900'>Dashboard Overview</h1>
        <p className='text-gray-500 mt-1'>Welcome back, here's what's happening today.</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {/* Total Revenue */}
        <div className='bg-gradient-to-br from-pink-500 to-rose-600 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden group hover:shadow-xl transition-all'>
          <div className='absolute -right-4 -top-4 opacity-10 transform group-hover:scale-110 transition-transform'>
            <IndianRupee size={120} />
          </div>
          <div className='relative z-10'>
            <div className='p-3 bg-white/20 rounded-xl w-fit mb-4 backdrop-blur-sm'>
              <IndianRupee size={24} className='text-white' />
            </div>
            <h3 className='text-pink-100 font-medium mb-1'>Total Revenue</h3>
            <p className='text-4xl font-bold'>₹{stats.totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        {/* Total Orders */}
        <div className='bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden group hover:shadow-xl transition-all'>
          <div className='absolute -right-4 -top-4 opacity-10 transform group-hover:scale-110 transition-transform'>
            <ShoppingBag size={120} />
          </div>
          <div className='relative z-10'>
            <div className='p-3 bg-white/20 rounded-xl w-fit mb-4 backdrop-blur-sm'>
              <ShoppingBag size={24} className='text-white' />
            </div>
            <h3 className='text-blue-100 font-medium mb-1'>Total Orders</h3>
            <p className='text-4xl font-bold'>{stats.orderCount}</p>
          </div>
        </div>

        {/* Total Products */}
        <div className='bg-gradient-to-br from-amber-500 to-orange-600 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden group hover:shadow-xl transition-all'>
          <div className='absolute -right-4 -top-4 opacity-10 transform group-hover:scale-110 transition-transform'>
            <Package size={120} />
          </div>
          <div className='relative z-10'>
            <div className='p-3 bg-white/20 rounded-xl w-fit mb-4 backdrop-blur-sm'>
              <Package size={24} className='text-white' />
            </div>
            <h3 className='text-amber-100 font-medium mb-1'>Total Products</h3>
            <p className='text-4xl font-bold'>{stats.productCount}</p>
          </div>
        </div>

        {/* Total Reviews */}
        <div className='bg-gradient-to-br from-violet-500 to-purple-600 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden group hover:shadow-xl transition-all'>
          <div className='absolute -right-4 -top-4 opacity-10 transform group-hover:scale-110 transition-transform'>
            <MessageSquare size={120} />
          </div>
          <div className='relative z-10'>
            <div className='p-3 bg-white/20 rounded-xl w-fit mb-4 backdrop-blur-sm'>
              <MessageSquare size={24} className='text-white' />
            </div>
            <h3 className='text-violet-100 font-medium mb-1'>Total Reviews</h3>
            <p className='text-4xl font-bold'>{stats.reviewCount}</p>
          </div>
        </div>

        {/* Categories */}
        <div className='bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden group hover:shadow-xl transition-all'>
          <div className='absolute -right-4 -top-4 opacity-10 transform group-hover:scale-110 transition-transform'>
            <Layers size={120} />
          </div>
          <div className='relative z-10'>
            <div className='p-3 bg-white/20 rounded-xl w-fit mb-4 backdrop-blur-sm'>
              <Layers size={24} className='text-white' />
            </div>
            <h3 className='text-emerald-100 font-medium mb-1'>Categories</h3>
            <p className='text-4xl font-bold'>{stats.categoryCount}</p>
          </div>
        </div>

        {/* Combos */}
        <div className='bg-gradient-to-br from-purple-500 to-fuchsia-600 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden group hover:shadow-xl transition-all'>
          <div className='absolute -right-4 -top-4 opacity-10 transform group-hover:scale-110 transition-transform'>
            <Layers size={120} />
          </div>
          <div className='relative z-10'>
            <div className='p-3 bg-white/20 rounded-xl w-fit mb-4 backdrop-blur-sm'>
              <Layers size={24} className='text-white' />
            </div>
            <h3 className='text-purple-100 font-medium mb-1'>Total Combos</h3>
            <p className='text-4xl font-bold'>{stats.comboCount}</p>
          </div>
        </div>

        {/* Deals */}
        <div className='bg-gradient-to-br from-red-500 to-rose-600 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden group hover:shadow-xl transition-all'>
          <div className='absolute -right-4 -top-4 opacity-10 transform group-hover:scale-110 transition-transform'>
            <Tag size={120} />
          </div>
          <div className='relative z-10'>
            <div className='p-3 bg-white/20 rounded-xl w-fit mb-4 backdrop-blur-sm'>
              <Tag size={24} className='text-white' />
            </div>
            <h3 className='text-red-100 font-medium mb-1'>Active Deals</h3>
            <p className='text-4xl font-bold'>{stats.dealCount}</p>
          </div>
        </div>
      </div>

      {/* Vendor Section */}
      <div>
        <h2 className='text-xl font-bold text-gray-800 mb-4'>Vendor Management</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {/* Total Vendors */}
          <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4'>
            <div className='p-3 bg-orange-100 rounded-xl'>
              <Store size={24} className='bg-orange-600' />
            </div>
            <div>
              <h3 className='text-gray-500 text-sm font-medium'>Total Vendors</h3>
              <p className='text-2xl font-bold text-gray-900'>{stats.vendorCount || 0}</p>
            </div>
          </div>

          {/* Vendor Categories */}
          <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4'>
            <div className='p-3 bg-teal-100 rounded-xl'>
              <Layers size={24} className='text-teal-600' />
            </div>
            <div>
              <h3 className='text-gray-500 text-sm font-medium'>Vendor Categories</h3>
              <p className='text-2xl font-bold text-gray-900'>{stats.vendorCategoryCount || 0}</p>
            </div>
          </div>

          {/* Subscription Plans */}
          <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4'>
            <div className='p-3 bg-indigo-100 rounded-xl'>
              <CreditCard size={24} className='text-indigo-600' />
            </div>
            <div>
              <h3 className='text-gray-500 text-sm font-medium'>Subscription Plans</h3>
              <p className='text-2xl font-bold text-gray-900'>{stats.subscriptionPlanCount || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
