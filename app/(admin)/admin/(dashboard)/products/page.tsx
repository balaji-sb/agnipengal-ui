'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Plus, Edit, Trash, Loader2, Search } from 'lucide-react';
import ImportProductsButton from '@/components/admin/ImportProductsButton';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchProducts = (query = '') => {
    setLoading(true);
    axios.get(`/api/products?search=${query}`).then(res => {
        setProducts(res.data.data);
        setLoading(false);
    }).catch(err => {
        console.error(err);
        setLoading(false);
    });
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts(search);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
        await axios.delete(`/api/products/${id}`);
        fetchProducts();
    } catch (error) {
        alert('Failed to delete product');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Products</h1>
        <div className="flex space-x-3">
             <ImportProductsButton onSuccess={() => fetchProducts()} />
            <Link 
                href="/admin/products/new" 
                className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition"
            >
                <Plus className="w-4 h-4 mr-2" />
                Add New
            </Link>
        </div>
      </div>

      <div className="mb-6 relative">
        <input 
            type="text" 
            placeholder="Search products..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
        />
        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                    <th className="p-4 font-medium text-gray-500">Name</th>
                    <th className="p-4 font-medium text-gray-500">Category</th>
                    <th className="p-4 font-medium text-gray-500">Price</th>
                    <th className="p-4 font-medium text-gray-500">Stock</th>
                    <th className="p-4 font-medium text-gray-500">Action</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {loading ? (
                    <tr><td colSpan={5} className="p-8 text-center text-gray-500">Loading...</td></tr>
                ) : products.map((product: any) => (
                    <tr key={product._id} className="hover:bg-gray-50 transition">
                        <td className="p-4 font-medium text-gray-900">
                            {product.name}
                            <div className="text-xs text-gray-400">{product.subcategory}</div>
                        </td>
                        <td className="p-4 text-gray-700">{product.category?.name || '-'}</td>
                        <td className="p-4 text-gray-700">₹{product.price}</td>
                        <td className="p-4 text-gray-700">{product.stock}</td>
                        <td className="p-4 flex space-x-2">
                             <Link href={`/admin/products/${product._id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded inline-flex">
                                <Edit className="w-4 h-4" />
                            </Link>
                            <button onClick={() => handleDelete(product._id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                                <Trash className="w-4 h-4" />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        {products.length === 0 && !loading && (
            <div className="p-8 text-center text-gray-500">No products found.</div>
        )}
      </div>
    </div>
  );
}
