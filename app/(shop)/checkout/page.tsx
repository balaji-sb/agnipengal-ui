'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/lib/context/CartContext';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import axios from 'axios';
import { Country, State, City } from 'country-state-city';
import { useAuth } from '@/lib/context/AuthContext';
import api from '@/lib/api';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    address: '',
    pincode: '',
  });

  // Calculate country code based on selected country
  const countryCode = selectedCountry ? Country.getCountryByCode(selectedCountry)?.phonecode : '';

  if (items.length === 0) {
      return <div className="p-20 text-center">Your cart is empty.</div>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedCountry(e.target.value);
      setSelectedState('');
      setSelectedCity('');
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedState(e.target.value);
      setSelectedCity('');
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedCity(e.target.value);
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert('Please login to complete your purchase');
      router.push('/login');
      return;
    }

    setLoading(true);

    const countryName = Country.getCountryByCode(selectedCountry)?.name;
    const stateName = State.getStateByCodeAndCountry(selectedState, selectedCountry)?.name;

    // Combine country code and mobile
    const fullMobile = countryCode ? `+${countryCode}${formData.mobile}` : formData.mobile;

    const finalFormData = {
        ...formData,
        mobile: fullMobile,
        country: countryName,
        state: stateName,
        city: selectedCity, 
    };

    try {
      // 1. Create Order
      const { data } = await api.post('/orders', {
        customer: {
            ...finalFormData,
            city: selectedCity 
        },
        user:user && user._id,
        totalAmount: totalPrice,
        items: items.map(item => ({
            product: item.product,
            quantity: item.quantity,
            price: item.product.price 
        })),
      });

      if (!data.success) throw new Error(data.error);

      // 2. Open Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_RiwMBWx7bvaFOi', 
        amount: data.amount, // Already in paisa from backend
        currency: 'INR',
        name: "Mahi's Vriksham Boutique",
        description: 'Order Payment',
        order_id: data.orderId, // Matches backend response key
        handler: async function (response: any) {
             try {
                setProcessingPayment(true); // Start full screen loader
                const verifyRes = await api.post('/payment/verify', {
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature
                });

                if (verifyRes.data.success) {
                    clearCart();
                    router.push('/checkout/success');
                    // Keep loader true until redirect happens
                } else {
                    alert('Payment verification failed');
                    setProcessingPayment(false);
                }
             } catch (error) {
                 console.error('Verification error', error);
                 alert('Payment verification failed. Please contact support.');
                 setProcessingPayment(false);
             }
        },

        prefill: {
          name: formData.name,
          email: formData.email,
          contact: fullMobile,
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

  const countries = Country.getAllCountries();
  const states = selectedCountry ? State.getStatesOfCountry(selectedCountry) : [];
  const cities = selectedState ? City.getCitiesOfState(selectedCountry, selectedState) : [];

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
                    <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                            {countryCode ? `+${countryCode}` : 'Code'}
                        </span>
                        <input 
                            required type="tel" name="mobile" 
                            value={formData.mobile} onChange={handleChange}
                            className="w-full p-3 border rounded-r-lg focus:ring-2 focus:ring-pink-500 outline-none transition"
                            placeholder="9876543210"
                        />
                    </div>
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <select
                        required
                        value={selectedCountry}
                        onChange={handleCountryChange}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none transition bg-white"
                    >
                        <option value="">Select Country</option>
                        {countries.map((country) => (
                            <option key={country.isoCode} value={country.isoCode}>
                                {country.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <select
                        required
                        value={selectedState}
                        onChange={handleStateChange}
                        disabled={!selectedCountry}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none transition bg-white disabled:bg-gray-100"
                    >
                        <option value="">Select State</option>
                        {states.map((state) => (
                            <option key={state.isoCode} value={state.isoCode}>
                                {state.name}
                            </option>
                        ))}
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                     <select
                        required
                        value={selectedCity}
                        onChange={handleCityChange}
                        disabled={!selectedState}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none transition bg-white disabled:bg-gray-100"
                    >
                        <option value="">Select City</option>
                        {cities.map((city) => (
                            <option key={city.name} value={city.name}>
                                {city.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            
            <div className="mt-4">
                 <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                <input 
                    required type="text" name="pincode" 
                    value={formData.pincode} onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none transition"
                />
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
      
      {/* Full Screen Processing Loader */}
      {processingPayment && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 border-4 border-pink-100 border-t-pink-600 rounded-full animate-spin mb-4"></div>
                <h3 className="text-xl font-bold text-gray-800">Processing Payment</h3>
                <p className="text-gray-500 mt-2">Please do not close this window...</p>
            </div>
        </div>
      )}
    </div>
  );
}
