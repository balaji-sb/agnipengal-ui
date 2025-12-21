'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/lib/context/CartContext';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import axios from 'axios';
import { Country, State, City } from 'country-state-city';
import { useAuth } from '@/lib/context/AuthContext';
import api from '@/lib/api';
import { MapPin, Plus, CheckCircle2, Circle } from 'lucide-react';

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

  // Address Selection State
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isNewAddress, setIsNewAddress] = useState(false);

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
      // Save to Session Storage
      sessionStorage.setItem('checkoutAddress', JSON.stringify(finalFormData));
      router.push('/checkout/summary');
    } catch (error: any) {
      console.error('Checkout navigation failed', error);
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
      // Fetch user's saved addresses
      const fetchAddresses = async () => {
          if (user) {
              try {
                  const res = await api.get('/addresses');
                  if (res.data.success && res.data.data.length > 0) {
                      setSavedAddresses(res.data.data);
                      // Auto-select default address if available
                      const defaultAddr = res.data.data.find((a: any) => a.isDefault);
                      if (defaultAddr) {
                          handleAddressSelect(defaultAddr);
                      } else {
                          handleAddressSelect(res.data.data[0]);
                      }
                  } else {
                      setIsNewAddress(true);
                  }
              } catch (error) {
                  console.error('Failed to fetch addresses', error);
                  setIsNewAddress(true);
              }
          }
      };
      fetchAddresses();
  }, [user]);

  const handleAddressSelect = (address: any) => {
      setSelectedAddressId(address._id);
      setIsNewAddress(false);

      // Map Country Name to Code
      const allCountries = Country.getAllCountries();
      const countryObj = allCountries.find(c => c.name.toLowerCase() === address.country.toLowerCase());
      const countryCode = countryObj ? countryObj.isoCode : '';
      
      setSelectedCountry(countryCode);

      // Map State Name to Code
      let stateCode = '';
      if (countryCode) {
          const allStates = State.getStatesOfCountry(countryCode);
          const stateObj = allStates.find(s => s.name.toLowerCase() === address.state.toLowerCase());
          stateCode = stateObj ? stateObj.isoCode : '';
          setSelectedState(stateCode);
      }
      
      // City (just set name as we use value logic)
      // Note: We need to trigger city update after state is set, but React state is async.
      // However, the 'useEffect' for cities list depends on selectedState.
      // And we set selectedCity value directly.
      // Ideally we would verify city exists in the list, but for now we trust the stored name.
      setSelectedCity(address.city);
      
      setFormData(prev => ({
          ...prev,
          address: address.street,
          pincode: address.zipCode,
          // Keep name/email/mobile from user profile if not in address? 
          // Address model doesn't store name/phone yet (simplified).
          // So we keep existing inputs for those or user profile defaults.
      }));
  };

  const handleNewAddressSelect = () => {
      setSelectedAddressId(null);
      setIsNewAddress(true);
      // Reset form fields related to address, strictly
      setFormData(prev => ({
          ...prev,
          address: '',
          pincode: ''
      }));
      setSelectedCountry('');
      setSelectedState('');
      setSelectedCity('');
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

            {/* Address Selection Section */}
            {savedAddresses.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                        <MapPin className="w-5 h-5 mr-2 text-pink-600" />
                        Select Delivery Address
                    </h2>
                    <div className="grid grid-cols-1 gap-4">
                        {savedAddresses.map((addr) => (
                            <div 
                                key={addr._id}
                                onClick={() => handleAddressSelect(addr)}
                                className={`relative p-4 rounded-xl border-2 cursor-pointer transition flex items-start space-x-3 ${
                                    selectedAddressId === addr._id 
                                        ? 'border-pink-600 bg-pink-50/50' 
                                        : 'border-gray-100 hover:border-pink-200'
                                }`}
                            >
                                <div className={`mt-1 ${selectedAddressId === addr._id ? 'text-pink-600' : 'text-gray-300'}`}>
                                    {selectedAddressId === addr._id ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                                </div>
                                <div>
                                    <div className="font-medium text-gray-900 flex items-center">
                                        {addr.isDefault && (
                                            <span className="bg-pink-100 text-pink-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full mr-2">Default</span>
                                        )}
                                        {addr.name}
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {addr.street}, {addr.city}, {addr.state}, {addr.zipCode}, {addr.country}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {/* New Address Option */}
                        <div 
                            onClick={handleNewAddressSelect}
                            className={`relative p-4 rounded-xl border-2 cursor-pointer transition flex items-center space-x-3 ${
                                isNewAddress
                                    ? 'border-pink-600 bg-pink-50/50' 
                                    : 'border-gray-100 hover:border-pink-200'
                            }`}
                        >
                             <div className={`mt-0 ${isNewAddress ? 'text-pink-600' : 'text-gray-300'}`}>
                                {isNewAddress ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                            </div>
                            <span className="font-medium text-gray-900 flex items-center">
                                <Plus className="w-4 h-4 mr-2" />
                                Add New Address
                            </span>
                        </div>
                    </div>
                </div>
            )}

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
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                    required
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
                     ) : 'Proceed to Summary'}
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
