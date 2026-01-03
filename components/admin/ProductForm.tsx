'use client';

import React, { useState, useEffect } from 'react';
// import axios from 'axios'; // Replaced by centralized api
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Loader2, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import ImageUpload from '@/components/admin/ImageUpload';

interface ProductFormProps {
    initialData?: any;
    isEditing?: boolean;
}

export default function ProductForm({ initialData, isEditing = false }: ProductFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Custom state for dynamic attributes
  const [attributeList, setAttributeList] = useState<{ key: string; value: string }[]>([
      { key: 'Material', value: '' } // Default one
  ]);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    offerPrice: '', // Added offerPrice
    stock: '',
    category: '',
    subcategory: '',
    images: [] as string[],
    isFeatured: false,
    isDeal: false, // Added isDeal
    ...initialData
  });

  // If initial Data has images array, use it directly
  useEffect(() => {
      if (initialData) {
          setFormData({
              ...initialData,
              images: initialData.images || [],
              category: initialData.category?._id || initialData.category, // Handle populated vs id
          });
          
          // Populate attributes
          if (initialData.attributes) {
              const attrs = Object.entries(initialData.attributes).map(([key, value]) => ({
                  key,
                  value: value as string
              }));
              if (attrs.length > 0) {
                  setAttributeList(attrs);
              }
          }
      }
  }, [initialData]);

  useEffect(() => {
    api.get('/categories').then(res => setCategories(res.data.data));
  }, []);

  const handleChange = (e: any) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData((prev: any) => {
        const newData = { ...prev, [e.target.name]: value };
        
        // Auto-generate slug if name changes and not in edit mode (or simple helper)
        if (e.target.name === 'name' && !isEditing) {
            newData.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        }
        
        return newData;
    });
  };

  // Attribute handlers
  const handleAttributeChange = (index: number, field: 'key' | 'value', value: string) => {
      const list = [...attributeList];
      list[index][field] = value;
      setAttributeList(list);
  };

  const addAttribute = () => {
      setAttributeList([...attributeList, { key: '', value: '' }]);
  };

  const removeAttribute = (index: number) => {
      const list = [...attributeList];
      list.splice(index, 1);
      setAttributeList(list);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
        // Convert attributes list to object
        const attributesObj: any = {};
        attributeList.forEach(item => {
            if (item.key && item.value) {
                attributesObj[item.key] = item.value;
            }
        });

        const payload = {
            ...formData,
            attributes: attributesObj, 
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
        
        router.push('/portal-secure-admin/products');
        router.refresh();
    } catch (error) {
        console.error(error);
        alert('Failed to save product');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
        <div className="flex items-center mb-6 text-gray-500 hover:text-gray-800 transition w-fit">
            <ArrowLeft className="w-4 h-4 mr-1" />
            <Link href="/portal-secure-admin/products">Back to Products</Link>
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
                    <label className="block text-sm font-medium mb-1">Offer Price (₹)</label>
                    <input type="number" name="offerPrice" value={formData.offerPrice} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Optional" />
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
                <ImageUpload 
                    label="Product Images"
                    multiple={true}
                    folder="products"
                    value={formData.images} 
                    onChange={(urls) => setFormData({ ...formData, images: urls as string[] })}
                />
            </div>

            {/* Dynamic Attributes */}
            <div>
                <label className="block text-sm font-medium mb-2">Attributes</label>
                <div className="space-y-3">
                    {attributeList.map((attr, index) => (
                        <div key={index} className="flex gap-2 items-center">
                            <input 
                                placeholder="Key (e.g. Material)" 
                                value={attr.key} 
                                onChange={(e) => handleAttributeChange(index, 'key', e.target.value)}
                                className="flex-1 p-2 border rounded text-sm"
                            />
                            <input 
                                placeholder="Value (e.g. Silk)" 
                                value={attr.value} 
                                onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                                className="flex-1 p-2 border rounded text-sm"
                            />
                            <button 
                                type="button" 
                                onClick={() => removeAttribute(index)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
                <button type="button" onClick={addAttribute} className="mt-2 text-sm text-pink-600 font-medium flex items-center hover:text-pink-700">
                    <Plus className="w-4 h-4 mr-1" /> Add Attribute
                </button>
            </div>

            <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded border border-gray-100 w-fit">
                    <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="rounded w-4 h-4 text-pink-600 focus:ring-pink-500" />
                    <span className="text-sm font-medium">Feature this product</span>
                </div>
                
                <div className="flex items-center space-x-2 bg-yellow-50 p-3 rounded border border-yellow-100 w-fit">
                    <input type="checkbox" name="isDeal" checked={formData.isDeal} onChange={handleChange} className="rounded w-4 h-4 text-yellow-600 focus:ring-yellow-500" />
                    <span className="text-sm font-medium text-yellow-800">Deal of the Day</span>
                </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-pink-600 text-white py-3 rounded-lg font-bold hover:bg-pink-700 transition flex items-center justify-center">
                {loading ? <Loader2 className="animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                {isEditing ? 'Update Product' : 'Create Product'}
            </button>
        </form>
    </div>
  );
}
