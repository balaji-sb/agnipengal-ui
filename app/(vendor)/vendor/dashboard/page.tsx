'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';
import {
  BarChart,
  Package,
  ShoppingBag,
  Settings,
  LogOut,
  Tag,
  Sparkles,
  Copy,
} from 'lucide-react';
import Link from 'next/link';
import { useVendorAuth } from '@/lib/context/VendorAuthContext';

// Component for Vendor Dashboard Protection and Layout
export default function VendorDashboard() {
  const router = useRouter();
  const { vendor, logout, loading: authLoading } = useVendorAuth();
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    sales: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // 2. Fetch Products Count
      const productsRes = await api.get('/products/vendor');
      const productsCount = productsRes.data.data.length;

      // 3. Fetch Orders Count & Sales
      const ordersRes = await api.get('/orders/vendor');
      const ordersData = ordersRes.data.data || [];
      const ordersCount = ordersData.length;

      // Sort to get newest first, then take top 5
      const sortedOrders = [...ordersData].sort(
        (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      setRecentOrders(sortedOrders.slice(0, 5));

      const totalSales = ordersData.reduce(
        (sum: number, order: any) => sum + (order.vendorGrandTotal || order.vendorSubTotal || 0),
        0,
      );

      setStats({
        products: productsCount,
        orders: ordersCount,
        sales: totalSales,
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
      toast.error('Session expired or invalid. Please login again.');
      // Cookies.remove('vendor_token'); // Backend handles 401
      router.push('/vendor/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    logout();
  };

  if (loading || authLoading) {
    return (
      <div className='min-h-screen flex justify-center items-center bg-gray-50'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600'></div>
      </div>
    );
  }

  if (!vendor) return null; // Should redirect via middleware or internal logic if auth check is complete

  return (
    <div className='min-h-screen bg-gray-50 flex'>
      {/* Main Content */}
      <main className='flex-1 p-8'>
        <div className='mb-8 flex justify-between items-center'>
          <div>
            <h2 className='text-3xl font-bold text-gray-800'>Welcome, {vendor.storeName}</h2>
            <p className='text-gray-500'>Here is what's happening with your store today.</p>
          </div>
          <div className='md:hidden'>
            {/* Mobile Menu Toggle could go here */}
            <button onClick={handleLogout} className='text-red-600 text-sm font-medium'>
              Logout
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
          <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
            <div className='text-gray-500 text-sm font-medium mb-1'>Total Sales</div>
            <div className='text-3xl font-bold text-gray-900'>₹{stats.sales.toFixed(2)}</div>
            <div className='text-xs text-green-500 mt-2'>Lifetime Sales</div>
          </div>
          <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
            <div className='text-gray-500 text-sm font-medium mb-1'>Total Orders</div>
            <div className='text-3xl font-bold text-gray-900'>{stats.orders}</div>
            <div className='text-xs text-gray-400 mt-2'>
              {stats.orders === 0 ? 'No orders yet' : 'Orders received'}
            </div>
          </div>
          <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'>
            <div className='text-gray-500 text-sm font-medium mb-1'>Products</div>
            <div className='text-3xl font-bold text-gray-900'>{stats.products}</div>
            <div className='text-xs text-violet-500 mt-2'>
              {stats.products === 0 ? 'Add your first product' : 'Active products'}
            </div>
          </div>
        </div>

        {/* Refer and Earn Card - Catchy Redesign */}
        {vendor.referralCode && (
          <div className='relative overflow-hidden bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 rounded-2xl shadow-xl mb-8 border border-white/10'>
            {/* Abstract Background Shapes */}
            <div className='absolute top-0 right-0 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 transform translate-x-1/2 -translate-y-1/2'></div>
            <div className='absolute bottom-0 left-0 w-64 h-64 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 transform -translate-x-1/2 translate-y-1/2'></div>

            <div className='relative p-8 md:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 z-10'>
              <div className='text-white flex-1 w-full'>
                <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 mb-4 text-pink-200 text-xs font-bold uppercase tracking-wider'>
                  <Sparkles className='w-4 h-4' /> Partner Rewards Program
                </div>
                <h3 className='text-3xl md:text-4xl font-extrabold mb-3 tracking-tight'>
                  Refer &{' '}
                  <span className='text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-400'>
                    Earn Free Days!
                  </span>
                </h3>
                <p className='text-indigo-100 text-sm md:text-base leading-relaxed mb-6 max-w-lg'>
                  Invite other businesses to join the platform. When they subscribe using your
                  unique code,{' '}
                  <strong className='text-white font-bold'>
                    you BOTH earn bonus subscription days
                  </strong>{' '}
                  automatically!
                </p>

                <div className='flex flex-wrap gap-3'>
                  <div className='bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-4 flex-1 min-w-[130px] shadow-inner'>
                    <div className='text-xs text-indigo-300 uppercase font-bold mb-1 flex justify-between'>
                      <span>1-Month</span>
                      <span className='ml-2 text-white/50'>Plan</span>
                    </div>
                    <div className='text-xl font-bold text-white'>+10 Days</div>
                  </div>
                  <div className='bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-4 flex-1 min-w-[130px] shadow-inner'>
                    <div className='text-xs text-indigo-300 uppercase font-bold mb-1 flex justify-between'>
                      <span>6-Month</span>
                      <span className='ml-2 text-white/50'>Plan</span>
                    </div>
                    <div className='text-xl font-bold text-white'>+20 Days</div>
                  </div>
                  <div className='bg-gradient-to-br from-pink-500/20 to-orange-500/20 backdrop-blur-sm border border-pink-500/30 rounded-xl p-4 flex-1 min-w-[130px] shadow-inner relative overflow-hidden'>
                    <div className='absolute -right-2 -top-2 w-12 h-12 bg-pink-500/20 rounded-full blur-xl'></div>
                    <div className='text-xs text-pink-200 uppercase font-bold mb-1 flex justify-between relative z-10'>
                      <span>1-Year</span>
                      <span className='ml-2 text-pink-200/50'>Plan</span>
                    </div>
                    <div className='text-2xl font-black text-pink-100 relative z-10'>+1 Month</div>
                  </div>
                </div>
              </div>

              <div className='w-full lg:w-auto bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center flex flex-col items-center justify-center min-w-[280px] shadow-2xl'>
                <p className='text-xs font-bold text-indigo-200 uppercase tracking-widest mb-3'>
                  Your Referral Code
                </p>
                <div className='bg-white text-gray-900 rounded-xl px-6 py-4 w-full shadow-[inset_0_-4px_0_rgba(0,0,0,0.05)] mb-4 transform transition-transform hover:scale-105'>
                  <span className='text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-pink-600'>
                    {vendor.referralCode}
                  </span>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(vendor.referralCode || '');
                    toast.success('Referral code copied to clipboard!');
                  }}
                  className='w-full py-3.5 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0'
                >
                  <Copy className='w-5 h-5' /> Copy Code
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Recent Orders Table */}
        <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'>
          <div className='p-6 border-b border-gray-100 flex justify-between items-center'>
            <h3 className='text-lg font-bold text-gray-800'>Recent Orders</h3>
            <Link
              href='/vendor/orders'
              className='text-sm text-violet-600 hover:text-violet-700 font-medium'
            >
              View All
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className='text-center py-12 text-gray-500'>
              <ShoppingBag className='w-12 h-12 mx-auto text-gray-300 mb-3' />
              <p>No orders to display yet.</p>
            </div>
          ) : (
            <div className='overflow-x-auto w-full max-w-[calc(100vw-2rem)] md:max-w-none'>
              <table className='w-full min-w-[600px]'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                      Order ID
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                      Date
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                      Amount
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider'>
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-100 bg-white'>
                  {recentOrders.map((order: any) => (
                    <tr key={order._id} className='hover:bg-gray-50 transition-colors'>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                        #{order._id.substring(order._id.length - 6).toUpperCase()}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium'>
                        ₹{(order.vendorGrandTotal || order.vendorSubTotal || 0).toFixed(2)}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            order.orderStatus === 'Delivered'
                              ? 'bg-green-100 text-green-800'
                              : order.orderStatus === 'Processing'
                                ? 'bg-blue-100 text-blue-800'
                                : order.orderStatus === 'Cancelled'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {order.orderStatus || 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
