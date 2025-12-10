'use client';

import React, { useState } from 'react';
import { useCart } from '@/lib/context/CartContext';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import axios from 'axios';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    address: '',
    city: '',
    pincode: '',
  });

  if (items.length === 0) {
      // Redirect or show empty (handled by effect ideally but simple return here for now)
      return <div className="p-20 text-center">Your cart is empty.</div>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create Order
      const { data } = await axios.post('/api/orders', {
        customer: formData,
        items: items.map(item => ({
            product: item.product._id,
            quantity: item.quantity,
            price: item.product.price // Pass price but backend verifies it
        })),
      });

      if (!data.success) throw new Error(data.error);

      // 2. Open Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_RiwMBWx7bvaFOi', // Should be public key
        amount: data.order.totalAmount * 100,
        currency: 'INR',
        name: "Mahi's Vriksham Boutique",
        description: 'Order Payment',
        order_id: data.razorpayOrderId,
        handler: async function (response: any) {
             try {
                const verifyRes = await axios.post('/api/payment/verify', {
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature
                });

                if (verifyRes.data.success) {
                    clearCart();
                    router.push('/checkout/success');
                } else {
                    alert('Payment verification failed');
                }
             } catch (error) {
                 console.error('Verification error', error);
                 alert('Payment verification failed. Please contact support.');
             }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.mobile,
        },
        theme: {
          color: '#D946EF',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error: any) {
      console.error('Checkout failed', error);
      alert('Checkout failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>

      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <form onSubmit={handleCheckout} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input 
                        required type="text" name="name" 
                        value={formData.name} onChange={handleChange}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none transition"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                    <input 
                        required type="tel" name="mobile" 
                        value={formData.mobile} onChange={handleChange}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none transition"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email (Optional)</label>
                <input 
                    type="email" name="email" 
                    value={formData.email} onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none transition"
                />
            </div>

            <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                 <textarea 
                    required name="address" rows={3}
                    value={formData.address} onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none transition"
                 />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input 
                        required type="text" name="city" 
                        value={formData.city} onChange={handleChange}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none transition"
                    />
                </div>
                <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                    <input 
                        required type="text" name="pincode" 
                        value={formData.pincode} onChange={handleChange}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none transition"
                    />
                </div>
            </div>

            <div className="border-t pt-6 mt-6">
                 <div className="flex justify-between items-center text-xl font-bold mb-6">
                     <span>Total Amount</span>
                     <span>₹{totalPrice}</span>
                 </div>
                 
                 <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-pink-600 to-violet-600 text-white font-bold rounded-xl hover:opacity-90 transition shadow-lg flex items-center justify-center"
                 >
                     {loading ? (
                         <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                     ) : 'Pay Now'}
                 </button>
            </div>
        </form>
      </div>
    </div>
  );
}
