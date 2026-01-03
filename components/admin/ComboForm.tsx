'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Loader2, Save, X, Plus, Trash } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';

interface ComboFormProps {
    initialData?: any;
    isEditing?: boolean;
}

export default function ComboForm({ initialData, isEditing = false }: ComboFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        products: [] as string[], // Array of product IDs
        isActive: true,
        image: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                description: initialData.description || '',
                price: initialData.price || '',
                products: initialData.products?.map((p: any) => typeof p === 'object' ? p._id : p) || [],
                isActive: initialData.isActive ?? true,
                image: initialData.image || ''
            });
        }
    }, [initialData]);

    useEffect(() => {
        // Fetch products for selection
        const fetchProducts = async () => {
            try {
                const res = await api.get('/products');
                if (res.data.success) {
                    setProducts(res.data.data);
                }
            } catch (error) {
                console.error('Failed to fetch products');
            }
        };
        fetchProducts();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'checkbox') {
             const checked = (e.target as HTMLInputElement).checked;
             setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
             setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleProductToggle = (productId: string) => {
        setFormData(prev => {
            const currentProducts = prev.products;
            if (currentProducts.includes(productId)) {
                return { ...prev, products: currentProducts.filter(id => id !== productId) };
            } else {
                return { ...prev, products: [...currentProducts, productId] };
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isEditing) {
                await api.put(`/combos/${initialData._id}`, formData);
            } else {
                await api.post('/combos', formData);
            }
            router.push('/portal-secure-admin/combos');
            router.refresh();
        } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.error || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-4xl mx-auto">
            <h2 className="text-xl font-bold mb-6">{isEditing ? 'Edit Combo' : 'Create New Combo'}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Combo Name</label>
                    <input 
                        required 
                        type="text" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" 
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea 
                        name="description" 
                        rows={3} 
                        value={formData.description} 
                        onChange={handleChange} 
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" 
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Price (₹)</label>
                    <input 
                        required 
                        type="number" 
                        name="price" 
                        value={formData.price} 
                        onChange={handleChange} 
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" 
                    />
                </div>

                <div>
                    <ImageUpload 
                        label="Combo Image"
                        multiple={false}
                        folder="combos"
                        value={formData.image}
                        onChange={(url) => setFormData(prev => ({ ...prev, image: url as string }))}
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Select Products</label>
                    <div className="border rounded-lg p-4 h-60 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-2">
                        {products.map(product => (
                            <div 
                                key={product._id} 
                                onClick={() => handleProductToggle(product._id)}
                                className={`flex items-center p-2 rounded cursor-pointer border transition ${
                                    formData.products.includes(product._id) 
                                        ? 'border-purple-500 bg-purple-50' 
                                        : 'border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                <div className={`w-4 h-4 rounded border flex items-center justify-center mr-3 ${
                                    formData.products.includes(product._id) ? 'bg-purple-500 border-purple-500' : 'border-gray-300'
                                }`}>
                                    {formData.products.includes(product._id) && <div className="w-2 h-2 bg-white rounded-full" />}
                                </div>
                                <div>
                                    <p className="text-sm font-medium">{product.name}</p>
                                    <p className="text-xs text-gray-500">₹{product.price}</p>
                                </div>
                            </div>
                        ))}
                        {products.length === 0 && <p className="text-gray-500 text-sm">No products found.</p>}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{formData.products.length} products selected</p>
                </div>

                 <div className="flex items-center">
                    <input 
                        type="checkbox" 
                        id="isActive" 
                        name="isActive" 
                        checked={formData.isActive} 
                        // @ts-ignore
                        onChange={handleChange}
                        className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700">Active</label>
                </div>
            </div>

            <div className="mt-8 flex justify-end space-x-3">
                <button 
                    type="button"
                    onClick={() => router.back()}
                    className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50 transition"
                >
                    Cancel
                </button>
                <button 
                    type="submit" 
                    disabled={loading}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center"
                >
                    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    <Save className="w-4 h-4 mr-2" />
                    Save Combo
                </button>
            </div>
        </form>
    );
}
