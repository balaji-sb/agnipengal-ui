'use client';

import React, { useState, useEffect } from 'react';
// import axios from 'axios'; // Replaced by centralized api
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface ProductFormProps {
    initialData?: any;
    isEditing?: boolean;
}

export default function ProductForm({ initialData, isEditing = false }: ProductFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    subcategory: '',
    images: '',
    isFeatured: false,
    attributes: '', // Display as simple text for Material default
    ...initialData // Override defaults if data provided
  });

  // If initial Data has images array, join it back to string
  useEffect(() => {
      if (initialData) {
          setFormData({
              ...initialData,
              images: initialData.images ? initialData.images.join(', ') : '',
              attributes: initialData.attributes ? (initialData.attributes.Material || '') : '', // Extract Material for demo
              category: initialData.category?._id || initialData.category, // Handle populated vs id
          });
      }
  }, [initialData]);

  useEffect(() => {
    api.get('/categories').then(res => setCategories(res.data.data));
  }, []);

  const handleChange = (e: any) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
        const payload = {
            ...formData,
            images: formData.images.split(',').map((s: string) => s.trim()).filter((s: string) => s),
            attributes: formData.attributes ? { Material: formData.attributes } : {}, 
        };

        if (payload.category === '') {
             alert('Please select a category');
             setLoading(false);
             return;
        }

        if (isEditing && initialData) {
            await api.put(`/products/${initialData._id}`, payload);
        } else {
            await api.post('/products', payload);
        }
        
        router.push('/admin/products');
        router.refresh();
    } catch (error) {
        console.error(error);
        alert('Failed to save product');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6 text-gray-500 hover:text-gray-800 transition w-fit">
            <ArrowLeft className="w-4 h-4 mr-1" />
            <Link href="/admin/products">Back to Products</Link>
        </div>

        <h1 className="text-2xl font-bold mb-6">{isEditing ? 'Edit Product' : 'Add New Product'}</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium mb-1">Product Name</label>
                    <input required name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Slug (Unique URL)</label>
                    <input required name="slug" value={formData.slug} onChange={handleChange} className="w-full p-2 border rounded" placeholder="e.g. pink-silk-thread" />
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium mb-1">Price (₹)</label>
                    <input required type="number" name="price" value={formData.price} onChange={handleChange} className="w-full p-2 border rounded" />
                </div>
                 <div>
                    <label className="block text-sm font-medium mb-1">Stock</label>
                    <input required type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full p-2 border rounded" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded">
                        <option value="">Select Category</option>
                        {categories.map((cat: any) => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Subcategory</label>
                    <select 
                        name="subcategory" 
                        value={formData.subcategory} 
                        onChange={handleChange} 
                        className="w-full p-2 border rounded"
                        disabled={!formData.category}
                    >
                        <option value="">Select Subcategory</option>
                        {categories.find((c: any) => c._id === formData.category)?.subcategories?.map((sub: any) => (
                            <option key={sub._id} value={sub.slug}>{sub.name}</option>
                        ))}
                    </select>
                    {!formData.category && <p className="text-xs text-gray-500 mt-1">Select a category first.</p>}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea required name="description" value={formData.description} rows={4} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
            
             <div>
                <label className="block text-sm font-medium mb-1">Image URLs (Comma separated)</label>
                <input required name="images" value={formData.images} onChange={handleChange} className="w-full p-2 border rounded" placeholder="https://..., https://..." />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Material (Attribute)</label>
                <input name="attributes" value={formData.attributes} onChange={handleChange} className="w-full p-2 border rounded" placeholder="e.g. Silk" />
            </div>

            <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded border border-gray-100 w-fit">
                <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="rounded w-4 h-4 text-pink-600" />
                <span className="text-sm font-medium">Feature this product (Show on Home)</span>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-pink-600 text-white py-3 rounded-lg font-bold hover:bg-pink-700 transition flex items-center justify-center">
                {loading ? <Loader2 className="animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                {isEditing ? 'Update Product' : 'Create Product'}
            </button>
        </form>
    </div>
  );
}
