'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
    LogOut, Package, Star, MapPin, 
    ArrowRight, Clock, ShieldCheck, User 
} from 'lucide-react';
import api from '@/lib/api';

export default function ProfilePage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  
  const [stats, setStats] = useState({
      totalOrders: 0,
      activeOrders: 0,
      totalReviews: 0
  });
  const [recentOrder, setRecentOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
        router.push('/login');
    }
    
    if (user) {
        fetchDashboardData();
    }
  }, [user, authLoading, router]);

  const fetchDashboardData = async () => {
      try {
          const [ordersRes, reviewsRes] = await Promise.all([
              api.get('/orders/myorders'),
              api.get('/reviews/me')
          ]);

          if (ordersRes.data.success) {
              const orders = ordersRes.data.data;
              setStats(prev => ({
                  ...prev,
                  totalOrders: orders.length,
                  activeOrders: orders.filter((o: any) => 
                      !['delivered', 'cancelled', 'returned'].includes(o.orderStatus?.toLowerCase())
                  ).length
              }));
              
              if (orders.length > 0) {
                  setRecentOrder(orders[0]); // Assuming API returns sorted by date desc
              }
          }

          if (reviewsRes.data.success) {
               setStats(prev => ({
                  ...prev,
                  totalReviews: reviewsRes.data.data.length
              }));
          }

      } catch (error) {
          console.error('Failed to fetch dashboard data', error);
      } finally {
          setLoading(false);
      }
  };

  if (authLoading || loading) return (
      <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
              <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500 font-medium">Loading your dashboard...</p>
          </div>
      </div>
  );

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 lg:py-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
                <h1 className="text-4xl font-black text-gray-900 mb-2">
                    Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-violet-600">{user.name.split(' ')[0]}</span>!
                </h1>
                <p className="text-gray-500 text-lg">Here's what's happening with your account today.</p>
            </div>
            <button 
                onClick={logout} 
                className="flex items-center text-gray-500 hover:text-red-600 font-medium px-5 py-2.5 hover:bg-red-50 rounded-full transition-all border border-gray-200 hover:border-red-100 bg-white shadow-sm"
            >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
            </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <Package className="w-7 h-7" />
                </div>
                <div>
                    <p className="text-gray-500 font-medium text-sm uppercase tracking-wider">Total Orders</p>
                    <p className="text-3xl font-black text-gray-900">{stats.totalOrders}</p>
                </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                    <Clock className="w-7 h-7" />
                </div>
                <div>
                    <p className="text-gray-500 font-medium text-sm uppercase tracking-wider">Pending Orders</p>
                    <p className="text-3xl font-black text-gray-900">{stats.activeOrders}</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-full bg-pink-50 flex items-center justify-center text-pink-600">
                    <Star className="w-7 h-7" />
                </div>
                <div>
                    <p className="text-gray-500 font-medium text-sm uppercase tracking-wider">My Reviews</p>
                    <p className="text-3xl font-black text-gray-900">{stats.totalReviews}</p>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activity Section */}
            <div className="lg:col-span-2 space-y-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                        <h2 className="text-xl font-bold text-gray-900">Recent Order</h2>
                        {recentOrder && (
                            <Link href="/profile/orders" className="text-sm font-bold text-pink-600 hover:text-pink-700 hover:underline">
                                View All Orders
                            </Link>
                        )}
                    </div>
                    
                    {recentOrder ? (
                        <div className="p-6">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 pb-6 border-b border-gray-100 gap-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-2xl font-bold text-gray-900">#{recentOrder._id.substring(0, 8)}</span>
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase ${
                                            (() => {
                                                switch(recentOrder.orderStatus?.toUpperCase()) {
                                                    case 'PENDING': return 'bg-yellow-100 text-yellow-800';
                                                    case 'PROCESSING': return 'bg-blue-100 text-blue-800';
                                                    case 'SHIPPED': return 'bg-indigo-100 text-indigo-800';
                                                    case 'DELIVERED': return 'bg-green-100 text-green-800';
                                                    case 'CANCELLED': return 'bg-red-100 text-red-800';
                                                    case 'RETURNED': return 'bg-orange-100 text-orange-800';
                                                    default: return 'bg-gray-100 text-gray-800';
                                                }
                                            })()
                                        }`}>
                                            {recentOrder.orderStatus}
                                        </span>
                                    </div>
                                    <p className="text-gray-500 flex items-center gap-2 text-sm">
                                        <Clock className="w-4 h-4" />
                                        Placed on {new Date(recentOrder.createdAt).toLocaleDateString(undefined, {
                                            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                                    <p className="text-2xl font-bold text-gray-900">₹{recentOrder.totalAmount}</p>
                                </div>
                            </div>

                            <div className="space-y-4 mb-6">
                                {recentOrder.items.slice(0, 2).map((item: any, idx: number) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden flex-shrink-0">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img 
                                                    src={item.product?.images?.[0] || item.image || '/placeholder.png'} 
                                                    alt={item.product?.name || item.name} 
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{item.product?.name || item.name}</p>
                                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="font-bold text-gray-900">₹{item.price}</p>
                                    </div>
                                ))}
                                {recentOrder.items.length > 2 && (
                                    <p className="text-center text-sm text-gray-500 italic">
                                        + {recentOrder.items.length - 2} more items
                                    </p>
                                )}
                            </div>

                            <Link 
                                href={`/profile/orders/${recentOrder._id}`} 
                                className="block w-full py-3 text-center font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                            >
                                View Order Details
                            </Link>
                        </div>
                    ) : (
                        <div className="p-12 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                <Package className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">No orders yet</h3>
                            <p className="text-gray-500 mb-6">Start shopping to see your recent activity here.</p>
                            <Link 
                                href="/products" 
                                className="inline-flex items-center justify-center px-6 py-3 font-bold text-white bg-pink-600 hover:bg-pink-700 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                            >
                                Start Shopping
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Actions Sidebar */}
            <div className="space-y-6">
                 {/* Account Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-500 to-violet-500 flex items-center justify-center text-white font-bold text-xl shadow-md">
                             {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                             <p className="font-bold text-gray-900 text-lg">{user.name}</p>
                             <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                            <ShieldCheck className="w-4 h-4 text-green-600" />
                            <span>Verified Customer</span>
                        </div>
                    </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 px-1">Quick Actions</h3>
                <div className="grid grid-cols-1 gap-4">
                    <Link href="/profile/orders" className="group flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-pink-300 hover:shadow-md transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <Package className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">My Orders</p>
                                <p className="text-xs text-gray-500">Track, return, or buy things again</p>
                            </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-pink-600 transform group-hover:translate-x-1 transition-all" />
                    </Link>

                    <Link href="/profile/addresses" className="group flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-pink-300 hover:shadow-md transition-all">
                        <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-pink-600 group-hover:bg-pink-600 group-hover:text-white transition-colors">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">My Addresses</p>
                                <p className="text-xs text-gray-500">Edit addresses for orders</p>
                            </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-pink-600 transform group-hover:translate-x-1 transition-all" />
                    </Link>

                     {/* Placeholder for future Account Settings link */}
                     <button  className="group w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl opacity-60 cursor-not-allowed">
                        <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600">
                                <User className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-gray-900">Account Settings</p>
                                <p className="text-xs text-gray-500">Coming soon</p>
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
}
