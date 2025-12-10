import React from 'react';
import dbConnect from '@/lib/db';
import OrderModel from '@/lib/models/Order';
import ProductModel from '@/lib/models/Product';

export const dynamic = 'force-dynamic';

async function getStats() {
    await dbConnect();
    const orderCount = await OrderModel.countDocuments();
    const productCount = await ProductModel.countDocuments();
    // Calculate total revenue
    const orders = await OrderModel.find({ status: { $ne: 'CANCELLED' } }).lean();
    const totalRevenue = orders.reduce((acc: number, order: any) => acc + order.totalAmount, 0);

    return { orderCount, productCount, totalRevenue };
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
