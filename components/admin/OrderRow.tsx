'use client';

import React, { useState } from 'react';
import axios from '@/lib/api'; // Using the axios instance
import { Eye, X, Check, Truck, Package, AlertCircle, Loader2 } from 'lucide-react';
import { createPortal } from 'react-dom';

const ORDER_STATUSES = [
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
  'RETURNED'
];

interface OrderRowProps {
  order: any;
}

export default function OrderRow({ order }: OrderRowProps) {
  const [status, setStatus] = useState(order.status);
  const [orderStatus, setOrderStatus] = useState(order.orderStatus);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    if (confirm(`Are you sure you want to change status to ${newStatus}?`)) {
        setLoading(true);
        try {
            const res = await axios.put(`/orders/${order._id}`, { status: newStatus });
            if (res.data.success) {
                setOrderStatus(newStatus);
            } else {
                alert('Failed to update status');
                // revert? but simplified
            }
        } catch (error) {
            console.error(error);
            alert('Error updating status');
        } finally {
            setLoading(false);
        }
    }
  };

  const statusColors = {
      'PAID': 'bg-green-100 text-green-700',
      'PENDING': 'bg-yellow-100 text-yellow-700',
      'PROCESSING': 'bg-blue-100 text-blue-700',
      'SHIPPED': 'bg-purple-100 text-purple-700',
      'DELIVERED': 'bg-emerald-100 text-emerald-700',
      'CANCELLED': 'bg-red-100 text-red-700',
      'RETURNED': 'bg-red-300 text-red-900',
  };

  return (
    <>
        <tr className="hover:bg-gray-50 border-b border-gray-100">
            <td className="p-4 text-sm font-mono text-gray-500">
                #{order._id.substring(0, 8)}
            </td>
            <td className="p-4">
                <p className="font-medium text-gray-900">{order.customer?.name || 'N/A'}</p>
                <p className="text-sm text-gray-500">{order.customer?.mobile || 'N/A'}</p>
            </td>
            <td className="p-4 text-sm text-gray-600 max-w-xs">
                {order.items.length > 0 ? (
                    <div>
                        <p className="font-medium text-gray-900 truncate" title={order.items[0].product?.name || order.items[0].name}>
                            {order.items[0].product?.name || order.items[0].name || 'Product Deleted'}
                        </p>
                        {order.items.length > 1 && (
                            <p className="text-xs text-gray-500">+{order.items.length - 1} more items</p>
                        )}
                    </div>
                ) : (
                    <span className="text-gray-400 italic">No items</span>
                )}
            </td>
            <td className="p-4 text-sm text-gray-500" suppressHydrationWarning>
                {new Date(order.createdAt).toLocaleDateString()}
            </td>
            <td className="p-4">
                 <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                    ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'RETURNED'].includes(status) 
                    ? 'bg-green-100 text-green-700' 
                    : status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                 }`}>
                    {['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'RETURNED'].includes(status) ? 'PAID' : status === 'CANCELLED' ? 'FAILED' : 'PENDING'}
                </span>
            </td>
            <td className="p-4">
                <div className="flex items-center gap-2">
                    <select 
                        value={orderStatus} 
                        onChange={handleStatusChange}
                        disabled={loading}
                        className={`px-3 py-1 rounded-full text-xs font-bold border-none cursor-pointer focus:ring-2 focus:ring-offset-1 outline-none appearance-none pr-8 relative ${statusColors[orderStatus as keyof typeof statusColors] || 'bg-gray-100 text-gray-700'} ${loading ? 'opacity-70 cursor-wait' : ''}`}
                        style={{ backgroundImage: 'none' }} 
                    >
                        {ORDER_STATUSES.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                    {loading && (
                        <div className="animate-spin text-pink-600">
                           <Loader2 className="w-4 h-4" />
                        </div>
                    )}
                </div>
            </td>
            <td className="p-4 font-bold text-gray-900">₹{order.totalAmount}</td>
            <td className="p-4">
                <button 
                    onClick={() => setShowModal(true)}
                    className="p-2 hover:bg-gray-200 rounded-full transition text-gray-600"
                    title="View Details"
                >
                    <Eye size={18} />
                </button>
            </td>
        </tr>

        {showModal && typeof document !== 'undefined' && createPortal(
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
                <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in-up">
                    <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                        <h2 className="text-xl font-bold">Order Details #{order._id.slice(0,8)}</h2>
                        <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                            <X size={20} />
                        </button>
                    </div>
                    
                    <div className="p-6 space-y-6">
                        {/* Status & Date */}
                        {/* Status & Date */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl">
                             <div>
                                <p className="text-sm text-gray-500">Order Date</p>
                                <p className="font-medium">{new Date(order.createdAt).toLocaleString()}</p>
                             </div>
                             <div className="text-center md:text-left">
                                <p className="text-sm text-gray-500">Payment Status</p>
                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                                    ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'RETURNED'].includes(status) 
                                    ? 'bg-green-100 text-green-700' 
                                    : status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                    {['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'RETURNED'].includes(status) ? 'PAID' : status === 'CANCELLED' ? 'FAILED' : 'PENDING'}
                                </span>
                             </div>
                             <div className="text-right">
                                <p className="text-sm text-gray-500">Order Status</p>
                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${statusColors[orderStatus as keyof typeof statusColors] || 'bg-gray-200'}`}>
                                    {orderStatus}
                                </span>
                             </div>
                        </div>

                        {/* Customer Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                    Customer Info
                                </h3>
                                <div className="text-sm text-gray-600 space-y-1">
                                    <p><span className="font-medium">Name:</span> {order.customer?.name}</p>
                                    <p><span className="font-medium">Email:</span> {order.customer?.email}</p>
                                    <p><span className="font-medium">Phone:</span> {order.customer?.mobile}</p>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                     Shipping Address
                                </h3>
                                <div className="text-sm text-gray-600 space-y-1">
                                    <p>{order.customer?.address}</p>
                                    <p>{order.customer?.city}, {order.customer?.state}</p>
                                    <p>{order.customer?.country} - {order.customer?.pincode}</p>
                                </div>
                            </div>
                        </div>

                        {/* Items */}
                        <div>
                             <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <Package className="w-4 h-4" /> Order Items ({order.items.length})
                             </h3>
                             <div className="border rounded-xl overflow-hidden">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="p-3 font-medium text-gray-500">Product</th>
                                            <th className="p-3 font-medium text-gray-500 text-center">Qty</th>
                                            <th className="p-3 font-medium text-gray-500 text-right">Price</th>
                                            <th className="p-3 font-medium text-gray-500 text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {order.items.map((item: any, i: number) => (
                                            <tr key={i}>
                                                <td className="p-3">
                                                    <p className="font-medium text-gray-900">{item.product?.name || item.name || 'Product Deleted'}</p>
                                                    {item.variant && <p className="text-xs text-gray-500">{item.variant}</p>}
                                                </td>
                                                <td className="p-3 text-center">{item.quantity}</td>
                                                <td className="p-3 text-right">₹{item.price}</td>
                                                <td className="p-3 text-right font-medium">₹{item.price * item.quantity}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="bg-gray-50 border-t">
                                        <tr>
                                            <td colSpan={3} className="p-2 text-right text-gray-600">Subtotal</td>
                                            <td className="p-2 text-right font-medium text-gray-900">₹{order.subTotal || order.totalAmount}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={3} className="p-2 text-right text-gray-600">Shipping Charge</td>
                                            <td className="p-2 text-right font-medium text-gray-900">
                                                {order.shippingCharge ? `+₹${order.shippingCharge}` : 'Free'}
                                            </td>
                                        </tr>
                                        {order.discount > 0 && (
                                            <tr>
                                                <td colSpan={3} className="p-2 text-right text-green-600">
                                                    Discount {order.couponCode ? <span className="text-xs border border-green-200 bg-green-50 px-1 rounded ml-1">{order.couponCode}</span> : ''}
                                                </td>
                                                <td className="p-2 text-right font-medium text-green-600">-₹{order.discount}</td>
                                            </tr>
                                        )}
                                        <tr className="border-t border-gray-200">
                                            <td colSpan={3} className="p-3 text-right font-bold text-gray-900 text-lg">Total Amount</td>
                                            <td className="p-3 text-right font-bold text-pink-600 text-lg">₹{order.totalAmount}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                             </div>
                        </div>
                    </div>
                </div>
            </div>,
            document.body
        )}
    </>
  );
}
