'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Plus, Trash, Image as ImageIcon, Link as LinkIcon, AlertCircle, Upload, Loader2, X } from 'lucide-react';
import axios from 'axios';

interface CarouselItem {
    _id: string;
    title: string;
    image: string;
    link: string;
    order: number;
}

export default function AdminCarouselPage() {
  const [items, setItems] = useState<CarouselItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // New Item State
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [link, setLink] = useState('');
  const [order, setOrder] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchItems = async () => {
    try {
        const res = await api.get('/carousel');
        setItems(res.data.data);
    } catch (error) {
        console.error('Failed to fetch slides', error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const resetForm = () => {
      setTitle(''); 
      setImage(''); 
      setLink(''); 
      setOrder(0);
      setEditingId(null);
  };

  const handleEdit = (item: CarouselItem) => {
      setTitle(item.title || '');
      setImage(item.image);
      setLink(item.link || '');
      setOrder(item.order || 0);
      setEditingId(item._id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'carousel');

    setUploading(true);
    try {
        const res = await api.post('/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        setImage(res.data.data.imageUrl);
    } catch (error) {
        console.error('Upload failed', error);
        alert('Image upload failed');
    } finally {
        setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
        if (editingId) {
            // Update
            await api.put(`/carousel/${editingId}`, { title, image, link, order });
        } else {
            // Create
            await api.post('/carousel', { title, image, link, order });
        }
        resetForm();
        fetchItems();
    } catch (error) {
        alert('Failed to save slide');
    } finally {
        setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
      if (!confirm('Are you sure you want to delete this slide?')) return;
      try {
          await api.delete(`/carousel/${id}`);
          fetchItems();
      } catch (error) {
          alert('Failed to delete slide');
      }
  };

  return (
    <div>
       <h1 className="text-3xl font-bold mb-8 text-gray-800">Carousel Management</h1>
       
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           {/* Form */}
           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        {editingId ? (
                            <>Edit Slide</>
                        ) : (
                            <>
                                <Plus className="w-5 h-5 text-pink-600" />
                                Add New Slide
                            </>
                        )}
                    </h2>
                    {editingId && (
                        <button onClick={resetForm} className="text-sm text-gray-500 hover:text-gray-700">
                            Cancel Edit
                        </button>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Title</label>
                        <input 
                            required 
                            value={title} 
                            onChange={e => setTitle(e.target.value)} 
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all"
                            placeholder="e.g. Summer Collection"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Image</label>
                        <div className="space-y-3">
                            {image && (
                                <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 group">
                                    <img src={image} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => setImage('')}
                                        className="absolute top-2 right-2 p-1.5 bg-red-100 text-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-200"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                            
                            <div className="flex items-center gap-2">
                                <label className={`flex-1 flex items-center justify-center gap-2 p-2.5 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-pink-500 hover:bg-pink-50 transition-all ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden" 
                                        disabled={uploading}
                                    />
                                    {uploading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin text-pink-600" />
                                            <span className="text-gray-500 font-medium">Uploading...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-5 h-5 text-gray-500" />
                                            <span className="text-gray-500 font-medium">Upload Image</span>
                                        </>
                                    )}
                                </label>
                            </div>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                Recommended size: 1920x600px
                            </p>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Link URL</label>
                        <div className="relative">
                            <input 
                                required 
                                value={link} 
                                onChange={e => setLink(e.target.value)} 
                                className="w-full pl-10 p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all"
                                placeholder="/products/sarees"
                            />
                            <LinkIcon className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Order</label>
                        <input 
                            type="number" 
                            required 
                            value={order} 
                            onChange={e => setOrder(parseInt(e.target.value))} 
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all"
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={submitting}
                        className={`w-full text-white py-2.5 rounded-lg font-bold transition disabled:opacity-50 disabled:cursor-not-allowed mt-4 ${editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-pink-600 hover:bg-pink-700'}`}
                    >
                         {submitting ? 'Saving...' : editingId ? 'Update Slide' : 'Add Slide'}
                    </button>
                </form>
           </div>

           {/* List */}
           <div className="space-y-4">
               {loading ? (
                   <p className="text-gray-500 animate-pulse">Loading slides...</p>
               ) : (
                <>
                    {items.map((item) => (
                        <div key={item._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 group hover:shadow-md transition-all">
                            <div className="relative w-24 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                                <img src={item.image} alt={item.title} className="object-cover w-full h-full" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150?text=No+Image')} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-gray-800 truncate">{item.title}</h3>
                                <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                    <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-mono">#{item.order}</span>
                                    <span className="truncate max-w-[150px] text-xs text-blue-500 hover:underline">{item.link}</span>
                                </div>
                            </div>
                            <button 
                                onClick={() => handleEdit(item)}
                                className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                                title="Edit Slide"
                            >
                                {/* We can import Edit icon or just use text if icon missing, but let's assume we can add Edit icon to imports or reuse something */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                            </button>
                            <button 
                                onClick={() => handleDelete(item._id)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                title="Delete Slide"
                            >
                                <Trash className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                    {items.length === 0 && (
                        <div className="text-center p-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <ImageIcon className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                            <p className="text-gray-500">No slides added yet.</p>
                        </div>
                    )}
                </>
               )}
           </div>
       </div>
    </div>
  );
}
