'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { Plus, Edit, Trash2, Search, ImageIcon, X, Star } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function VendorProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts(search);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const fetchProducts = async (query = '') => {
    setLoading(true);
    try {
      const response = await api.get(`/products/vendor?search=${query}`);
      setProducts(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchProducts(search);
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  return (
    <div className='p-6'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold text-gray-800'>My Products</h1>
        <Link
          href='/vendor/products/add'
          className='flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition'
        >
          <Plus className='w-4 h-4 mr-2' />
          Add New
        </Link>
      </div>

      <div className='mb-6 relative'>
        <input
          type='text'
          placeholder='Search products...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none'
        />
        <Search className='w-5 h-5 text-gray-400 absolute left-3 top-2.5' />
      </div>

      <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'>
        <table className='w-full text-left'>
          <thead className='bg-gray-50 border-b border-gray-100'>
            <tr>
              <th className='p-4 font-medium text-gray-500'>Image</th>
              <th className='p-4 font-medium text-gray-500'>Name</th>
              <th className='p-4 font-medium text-gray-500'>Category</th>
              <th className='p-4 font-medium text-gray-500'>Price</th>
              <th className='p-4 font-medium text-gray-500'>Stock</th>
              <th className='p-4 font-medium text-gray-500'>Rating</th>
              <th className='p-4 font-medium text-gray-500 text-right'>Actions</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-100'>
            {loading ? (
              <tr>
                <td colSpan={7} className='p-8 text-center text-gray-500'>
                  Loading...
                </td>
              </tr>
            ) : (
              products.map((product: any) => (
                <tr key={product._id} className='hover:bg-gray-50 transition'>
                  <td className='p-4'>
                    <div
                      className='h-12 w-12 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center cursor-pointer hover:opacity-80 transition'
                      onClick={() =>
                        product.images && product.images[0] && setSelectedImage(product.images[0])
                      }
                    >
                      {product.images && product.images[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className='w-full h-full object-cover'
                        />
                      ) : (
                        <ImageIcon className='w-6 h-6 text-gray-300' />
                      )}
                    </div>
                  </td>
                  <td className='p-4 font-medium text-gray-900'>
                    {product.name}
                    <div className='text-xs text-gray-400'>{product.subcategory}</div>
                  </td>
                  <td className='p-4 text-gray-700'>{product.category?.name || '-'}</td>
                  <td className='p-4 text-gray-700'>
                    <div>
                      <span
                        className={
                          product.offerPrice > 0 ? 'line-through text-gray-400 text-xs mr-1' : ''
                        }
                      >
                        ₹{product.price}
                      </span>
                      {product.offerPrice > 0 && (
                        <span className='font-bold text-pink-600'>₹{product.offerPrice}</span>
                      )}
                    </div>
                  </td>
                  <td className='p-4'>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                    >
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                    </span>
                  </td>
                  <td className='p-4'>
                    <div className='flex items-center space-x-1'>
                      <Star className='w-4 h-4 text-yellow-400 fill-current' />
                      <span className='font-medium text-gray-900'>
                        {product.rating?.toFixed(1) || '0.0'}
                      </span>
                      <span className='text-xs text-gray-400'>({product.numReviews || 0})</span>
                    </div>
                  </td>
                  <td className='p-4 text-right space-x-2'>
                    <Link
                      href={`/vendor/products/${product._id}`}
                      className='p-2 text-blue-600 hover:bg-blue-50 rounded inline-flex'
                      title='Edit'
                    >
                      <Edit className='w-4 h-4' />
                    </Link>
                    <button
                      onClick={() => deleteProduct(product._id)}
                      className='p-2 text-red-600 hover:bg-red-50 rounded inline-flex'
                      title='Delete'
                    >
                      <Trash2 className='w-4 h-4' />
                    </button>
                  </td>
                </tr>
              ))
            )}
            {products.length === 0 && !loading && (
              <tr>
                <td colSpan={7} className='p-8 text-center text-gray-500'>
                  No products found. Add your first product!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div
          className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4'
          onClick={() => setSelectedImage(null)}
        >
          <div
            className='relative max-w-3xl max-h-[90vh] bg-white rounded-lg p-2'
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className='absolute -top-4 -right-4 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition text-gray-600'
            >
              <X className='w-6 h-6' />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedImage}
              alt='Preview'
              className='max-w-full max-h-[85vh] object-contain rounded'
            />
          </div>
        </div>
      )}
    </div>
  );
}
