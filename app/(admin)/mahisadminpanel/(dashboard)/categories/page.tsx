'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Plus, Edit, Trash2, X, Save, Search } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';
import ImportExportButtons from '@/components/admin/ImportExportButtons';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Form States
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  
  // Category Form
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catImage, setCatImage] = useState('');
  
  // Subcategory Form (Only when editing)
  const [subName, setSubName] = useState('');
  const [subSlug, setSubSlug] = useState('');
  const [subImage, setSubImage] = useState('');
  const [editingSubId, setEditingSubId] = useState<string | null>(null);

  const fetchCategories = (query = '') => {
    setLoading(true);
    api.get(`/categories?search=${query}`).then(res => {
        setCategories(res.data.data);
        setLoading(false);
    });
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
        fetchCategories(search);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  // --- Handlers ---

  const generateSlug = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')     
      .replace(/[^\w\-]+/g, '') 
      .replace(/\-\-+/g, '-');
  };

  const handleCatNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const name = e.target.value;
      setCatName(name);
      if (!editingCategory) { 
          setCatSlug(generateSlug(name));
      }
  };

  const handleSubNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const name = e.target.value;
      setSubName(name);
      if (!editingSubId) {
          setSubSlug(generateSlug(name));
      }
  };

  const resetForm = () => {
    setEditingCategory(null);
    setCatName('');
    setCatSlug('');
    setCatImage('');
    setSubName('');
    setSubSlug('');
    setSubImage('');
    setEditingSubId(null);
  };

  const startEdit = (cat: any) => {
    setEditingCategory(cat);
    setCatName(cat.name);
    setCatSlug(cat.slug);
    setCatImage(cat.image || '');
    setSubName('');
    setSubSlug('');
    setSubImage('');
    setEditingSubId(null);
  };

// ... existing methods ...

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
        await api.delete(`/categories/${id}`);
        fetchCategories();
        if (editingCategory?._id === id) resetForm();
    } catch (error) {
        alert('Failed to delete category');
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const payload = { name: catName, slug: catSlug, image: catImage };
        if (editingCategory) {
            await api.put(`/categories/${editingCategory._id}`, payload);
        } else {
            await api.post('/categories', payload);
        }
        fetchCategories();
        resetForm();
    } catch (error) {
        alert('Failed to save category');
    }
  };

  // --- Subcategory Handlers ---

  const handleSaveSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    
    try {
        const payload = { name: subName, slug: subSlug, image: subImage, subId: editingSubId };
        const url = `/categories/${editingCategory._id}/subcategories`;
        
        if (editingSubId) {
            await api.put(url, payload);
        } else {
            await api.post(url, payload);
        }
        
        // Refresh categories and update local state
        const res = await api.get('/categories');
        setCategories(res.data.data);
        const updatedCat = res.data.data.find((c: any) => c._id === editingCategory._id);
        if (updatedCat) setEditingCategory(updatedCat);
        
        setSubName('');
        setSubSlug('');
        setSubImage('');
        setEditingSubId(null);
    } catch (error: any) {
        alert(error.response?.data?.error || 'Failed to save subcategory');
    }
  };

  const handleDeleteSubcategory = async (subId: string) => {
     if (!confirm('Delete this subcategory?')) return;
     if (!editingCategory) return;
     
     try {
         await api.delete(`/categories/${editingCategory._id}/subcategories?subId=${subId}`);
         
         const res = await api.get('/categories');
         setCategories(res.data.data);
         const updatedCat = res.data.data.find((c: any) => c._id === editingCategory._id);
         if (updatedCat) setEditingCategory(updatedCat);
     } catch (error) {
         alert('Failed to delete subcategory');
     }
  };

  const startEditSub = (sub: any) => {
      setSubName(sub.name);
      setSubSlug(sub.slug);
      setSubImage(sub.image || '');
      setEditingSubId(sub._id);
  };

  const cancelEditSub = () => {
      setSubName('');
      setSubSlug('');
      setSubImage('');
      setEditingSubId(null);
  };

  return (
    <div>
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-800">Categories</h1>
            <ImportExportButtons entity="categories" onSuccess={() => fetchCategories()} />
        </div>
        
        <div className="mb-6 relative max-w-lg">
             <input 
                type="text" 
                placeholder="Search categories..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* List */}
             <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-4 font-medium text-gray-500">Name</th>
                                <th className="p-4 font-medium text-gray-500">Subcategories</th>
                                <th className="p-4 font-medium text-gray-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {categories.map((cat: any) => (
                                <tr key={cat._id} className={`hover:bg-gray-50 ${editingCategory?._id === cat._id ? 'bg-pink-50' : ''}`}>
                                    <td className="p-4 font-medium">
                                        <div className="flex items-center gap-3">
                                            {cat.image && (
                                                <img src={cat.image} alt={cat.name} className="w-10 h-10 object-cover rounded text-xs" />
                                            )}
                                            <div>
                                                {cat.name}
                                                <div className="text-xs text-gray-400">{cat.slug}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-500">
                                        <div className="flex flex-wrap gap-2">
                                            {cat.subcategories.map((sub: any) => (
                                                <div key={sub._id} className="bg-gray-100 px-2 py-1 rounded-md border border-gray-200 flex items-center gap-2">
                                                    {sub.image && (
                                                        <img src={sub.image} alt={sub.name} className="w-5 h-5 object-cover rounded-sm" />
                                                    )}
                                                    <span>{sub.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        <button onClick={() => startEdit(cat)} className="text-blue-600 hover:text-blue-800"><Edit size={18} /></button>
                                        <button onClick={() => handleDeleteCategory(cat._id)} className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {categories.length === 0 && !loading && (
                         <div className="p-8 text-center text-gray-500">No categories found.</div>
                    )}
                </div>
            </div>

            {/* Create/Edit Form */}
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit sticky top-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">{editingCategory ? 'Edit Category' : 'Add Category'}</h2>
                        {editingCategory && (
                            <button onClick={resetForm} className="text-gray-500 hover:text-gray-700 text-sm flex items-center">
                                <X size={16} className="mr-1" /> Cancel
                            </button>
                        )}
                    </div>
                    
                    <form onSubmit={handleSaveCategory} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Name</label>
                            <input required value={catName} onChange={handleCatNameChange} className="w-full p-2 border rounded" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Slug</label>
                            <input required value={catSlug} onChange={e => setCatSlug(e.target.value)} className="w-full p-2 border rounded" placeholder="slug" />
                        </div>
                        <div className="mb-4">
                            <ImageUpload 
                                value={catImage} 
                                onChange={(url) => {
                                    if (typeof url === 'string') setCatImage(url);
                                }} 
                                label="Category Image"
                                folder="categories"
                            />
                        </div>
                        
                        <button type="submit" className="w-full bg-pink-600 text-white py-2 rounded-lg font-bold hover:bg-pink-700 transition flex items-center justify-center">
                            {editingCategory ? <Save className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                            {editingCategory ? 'Update Category' : 'Create Category'}
                        </button>
                    </form>

                    {/* Subcategories Section - Only visible when editing */}
                    {editingCategory && (
                        <div className="mt-8 border-t pt-6">
                            <h3 className="font-bold text-lg mb-3">Subcategories</h3>
                            
                            {/* Subcategory List */}
                            <ul className="space-y-2 mb-4">
                                {editingCategory.subcategories.map((sub: any) => (
                                    <li key={sub._id} className="flex justify-between items-center bg-gray-50 p-2 rounded border border-gray-100">
                                        <div className="flex items-center gap-3">
                                            {sub.image && (
                                                <img src={sub.image} alt={sub.name} className="w-8 h-8 object-cover rounded" />
                                            )}
                                            <div>
                                                <span className="font-medium block">{sub.name}</span>
                                                <span className="text-xs text-gray-400">({sub.slug})</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <button onClick={() => startEditSub(sub)} className="text-blue-500 p-1 hover:bg-blue-50 rounded"><Edit size={14}/></button>
                                            <button onClick={() => handleDeleteSubcategory(sub._id)} className="text-red-500 p-1 hover:bg-red-50 rounded"><X size={14}/></button>
                                        </div>
                                    </li>
                                ))}
                                {editingCategory.subcategories.length === 0 && (
                                    <p className="text-sm text-gray-400 italic">No subcategories.</p>
                                )}
                            </ul>

                            {/* Add/Edit Subcategory Form */}
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                <h4 className="text-sm font-bold mb-2 text-gray-600">{editingSubId ? 'Edit Subcategory' : 'Add Subcategory'}</h4>
                                <form onSubmit={handleSaveSubcategory} className="space-y-3">
                                     <input required value={subName} onChange={handleSubNameChange} className="w-full p-2 text-sm border rounded" placeholder="Name" />
                                     <input required value={subSlug} onChange={e => setSubSlug(e.target.value)} className="w-full p-2 text-sm border rounded" placeholder="Slug" />
                                     
                                     <div className="bg-white p-2 rounded border border-gray-200">
                                         <ImageUpload 
                                            value={subImage} 
                                            onChange={(url) => {
                                                if (typeof url === 'string') setSubImage(url);
                                            }} 
                                            label="Subcategory Image"
                                            folder="subcategories"
                                        />
                                     </div>

                                     <div className="flex space-x-2">
                                         <button type="submit" className="flex-1 bg-gray-800 text-white py-1.5 rounded text-sm font-medium hover:bg-gray-900">
                                             {editingSubId ? 'Update' : 'Add'}
                                         </button>
                                         {editingSubId && (
                                              <button type="button" onClick={cancelEditSub} className="bg-gray-200 text-gray-600 px-3 py-1.5 rounded text-sm font-medium hover:bg-gray-300">
                                                  Cancel
                                              </button>
                                         )}
                                     </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
}
