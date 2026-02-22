'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import { MapPin, Plus, Edit2, Trash2, X, Home, Briefcase, Map as MapIcon } from 'lucide-react';
import { Country, State, City } from 'country-state-city';
import api from '@/lib/api';

interface Address {
  _id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
  type?: string;
}

export default function AddressesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Address State
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressFormData, setAddressFormData] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    isDefault: false,
    type: 'Home',
  });

  // Dropdown states for form
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
    if (user) {
      fetchAddresses();
    }
  }, [user, authLoading, router]);

  const fetchAddresses = async () => {
    try {
      const res = await api.get('/addresses');
      if (res.data.success) {
        setAddresses(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch addresses', error);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAddress) {
        await api.put(`/addresses/${editingAddress._id}`, addressFormData);
      } else {
        await api.post('/addresses', addressFormData);
      }
      setAddressModalOpen(false);
      setEditingAddress(null);
      setAddressFormData({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        isDefault: false,
        type: 'Home',
      });
      setSelectedCountry('');
      setSelectedState('');
      setSelectedCity('');
      fetchAddresses();
    } catch (error) {
      console.error('Failed to save address', error);
      alert('Failed to save address');
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    try {
      await api.delete(`/addresses/${id}`);
      fetchAddresses();
    } catch (error) {
      console.error('Failed to delete address', error);
    }
  };

  const openAddAddress = () => {
    setEditingAddress(null);
    setAddressFormData({
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      isDefault: false,
      type: 'Home',
    });
    setSelectedCountry('');
    setSelectedState('');
    setSelectedCity('');
    setAddressModalOpen(true);
  };

  const openEditAddress = (addr: Address) => {
    setEditingAddress(addr);
    setAddressFormData({
      street: addr.street,
      city: addr.city,
      state: addr.state,
      zipCode: addr.zipCode,
      country: addr.country,
      isDefault: addr.isDefault,
      type: addr.type || 'Home',
    });

    const allCountries = Country.getAllCountries();
    const countryObj = allCountries.find(
      (c) => c.name.toLowerCase() === addr.country.toLowerCase(),
    );
    const countryCode = countryObj ? countryObj.isoCode : '';
    setSelectedCountry(countryCode);

    let stateCode = '';
    if (countryCode) {
      const allStates = State.getStatesOfCountry(countryCode);
      const stateObj = allStates.find((s) => s.name.toLowerCase() === addr.state.toLowerCase());
      stateCode = stateObj ? stateObj.isoCode : '';
      setSelectedState(stateCode);
    }

    setSelectedCity(addr.city);

    setAddressModalOpen(true);
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryCode = e.target.value;
    const countryName = Country.getCountryByCode(countryCode)?.name || '';
    setSelectedCountry(countryCode);
    setSelectedState('');
    setSelectedCity('');
    setAddressFormData({ ...addressFormData, country: countryName, state: '', city: '' });
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stateCode = e.target.value;
    const stateName = State.getStateByCodeAndCountry(stateCode, selectedCountry)?.name || '';
    setSelectedState(stateCode);
    setSelectedCity('');
    setAddressFormData({ ...addressFormData, state: stateName, city: '' });
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityName = e.target.value;
    setSelectedCity(cityName);
    setAddressFormData({ ...addressFormData, city: cityName });
  };

  if (authLoading) return <div className='p-8 text-center'>Loading...</div>;
  if (!user) return null;

  return (
    <div className='max-w-4xl mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold text-gray-800 mb-8'>My Addresses</h1>

      <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-xl font-bold flex items-center'>
            <MapPin className='w-6 h-6 mr-2 text-pink-600' />
            Saved Addresses
          </h2>
          <button
            onClick={openAddAddress}
            className='flex items-center text-sm font-medium text-pink-600 hover:text-pink-700 hover:bg-pink-50 px-3 py-2 rounded-lg transition'
          >
            <Plus className='w-4 h-4 mr-1' />
            Add New
          </button>
        </div>

        {loadingAddresses ? (
          <div className='text-center py-4 text-gray-500'>Loading addresses...</div>
        ) : addresses.length === 0 ? (
          <div className='text-center py-8 bg-gray-50 rounded-lg text-gray-500'>
            No saved addresses found.
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {addresses.map((addr) => (
              <div
                key={addr._id}
                className='border border-gray-200 rounded-lg p-4 relative group hover:shadow-md transition bg-white'
              >
                {addr.isDefault && (
                  <span className='absolute top-2 right-2 bg-pink-100 text-pink-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase'>
                    Default
                  </span>
                )}
                <p className='font-medium text-gray-900 flex items-center gap-2'>
                  {addr.type === 'Home' && <Home className='w-4 h-4 text-gray-500' />}
                  {addr.type === 'Work' && <Briefcase className='w-4 h-4 text-gray-500' />}
                  {addr.type === 'Other' && <MapIcon className='w-4 h-4 text-gray-500' />}
                  <span className='capitalize'>{addr.type}</span> - {addr.street}
                </p>
                <p className='text-sm text-gray-600'>
                  {addr.city}, {addr.state} {addr.zipCode}
                </p>
                <p className='text-sm text-gray-600'>{addr.country}</p>

                <div className='mt-4 flex gap-2 overflow-hidden opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity'>
                  <button
                    onClick={() => openEditAddress(addr)}
                    className='p-1.5 text-blue-600 hover:bg-blue-50 rounded'
                    title='Edit'
                  >
                    <Edit2 className='w-4 h-4' />
                  </button>
                  <button
                    onClick={() => handleDeleteAddress(addr._id)}
                    className='p-1.5 text-red-600 hover:bg-red-50 rounded'
                    title='Delete'
                  >
                    <Trash2 className='w-4 h-4' />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Address Modal */}
      {addressModalOpen && (
        <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4'>
          <div className='bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative'>
            <button
              onClick={() => setAddressModalOpen(false)}
              className='absolute top-4 right-4 text-gray-400 hover:text-gray-600'
            >
              <X className='w-5 h-5' />
            </button>
            <h2 className='text-xl font-bold mb-4'>
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </h2>

            <form onSubmit={handleAddressSubmit} className='space-y-4'>
              <div className='flex gap-4 mb-2'>
                {['Home', 'Work', 'Other'].map((type) => (
                  <button
                    key={type}
                    type='button'
                    onClick={() => setAddressFormData({ ...addressFormData, type })}
                    className={`flex-1 py-2 rounded-lg border text-sm font-medium transition flex items-center justify-center gap-2 ${
                      addressFormData.type === type
                        ? 'border-pink-600 bg-pink-50 text-pink-700'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {type === 'Home' && <Home className='w-3.5 h-3.5' />}
                    {type === 'Work' && <Briefcase className='w-3.5 h-3.5' />}
                    {type === 'Other' && <MapIcon className='w-3.5 h-3.5' />}
                    {type}
                  </button>
                ))}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Street Address
                </label>
                <input
                  type='text'
                  required
                  value={addressFormData.street}
                  onChange={(e) =>
                    setAddressFormData({ ...addressFormData, street: e.target.value })
                  }
                  className='w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500'
                />
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Country</label>
                  <select
                    required
                    value={selectedCountry}
                    onChange={handleCountryChange}
                    className='w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 bg-white'
                  >
                    <option value=''>Select Country</option>
                    {Country.getAllCountries().map((c) => (
                      <option key={c.isoCode} value={c.isoCode}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>State</label>
                  <select
                    required
                    value={selectedState}
                    onChange={handleStateChange}
                    disabled={!selectedCountry}
                    className='w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 bg-white disabled:bg-gray-100'
                  >
                    <option value=''>Select State</option>
                    {selectedCountry
                      ? State.getStatesOfCountry(selectedCountry).map((s) => (
                          <option key={s.isoCode} value={s.isoCode}>
                            {s.name}
                          </option>
                        ))
                      : null}
                  </select>
                </div>
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>City</label>
                  <select
                    required
                    value={selectedCity}
                    onChange={handleCityChange}
                    disabled={!selectedState}
                    className='w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 bg-white disabled:bg-gray-100'
                  >
                    <option value=''>Select City</option>
                    {selectedState
                      ? City.getCitiesOfState(selectedCountry, selectedState).map((c) => (
                          <option key={c.name} value={c.name}>
                            {c.name}
                          </option>
                        ))
                      : null}
                  </select>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>ZIP Code</label>
                  <input
                    type='text'
                    required
                    value={addressFormData.zipCode}
                    onChange={(e) =>
                      setAddressFormData({ ...addressFormData, zipCode: e.target.value })
                    }
                    className='w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500'
                  />
                </div>
              </div>
              <div className='flex items-center'>
                <input
                  type='checkbox'
                  id='isDefault'
                  checked={addressFormData.isDefault}
                  onChange={(e) =>
                    setAddressFormData({ ...addressFormData, isDefault: e.target.checked })
                  }
                  className='w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500'
                />
                <label htmlFor='isDefault' className='ml-2 text-sm text-gray-700'>
                  Set as default address
                </label>
              </div>

              <button
                type='submit'
                className='w-full bg-orange-600 text-white font-bold py-3 rounded-lg hover:bg-orange-700 transition'
              >
                Save Address
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
