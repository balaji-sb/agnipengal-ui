'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash } from 'lucide-react';

export default function AdminCarouselPage() {
  const [items, setItems] = useState([]);
  
  // New Item State
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [link, setLink] = useState('');
  const [order, setOrder] = useState(0);

  const fetchItems = () => {
    axios.get('/api/carousel').then(res => setItems(res.data.data));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        await axios.post('/api/carousel', { title, image, link, order });
        setTitle(''); setImage(''); setLink(''); setOrder(0);
        fetchItems();
    } catch (error) {
        alert('Failed to add slide');
    }
  };

  return (
    <div>
       <h1 className="text-3xl font-bold mb-8 text-gray-800">Carousel Management</h1>
       
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           {/* Form */}
           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
                <h2 className="text-xl font-bold mb-4">Add New Slide</h2>
                <form onSubmit={handleCreate} className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <input required value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 border rounded" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Image URL</label>
                        <input required value={image} onChange={e => setImage(e.target.value)} className="w-full p-2 border rounded" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Link URL</label>
                        <input required value={link} onChange={e => setLink(e.target.value)} className="w-full p-2 border rounded" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium mb-1">Order</label>
                        <input type="number" required value={order} onChange={e => setOrder(parseInt(e.target.value))} className="w-full p-2 border rounded" />
                    </div>
                    <button type="submit" className="w-full bg-pink-600 text-white py-2 rounded-lg font-bold hover:bg-pink-700 transition">
                         Add Slide
                    </button>
                </form>
           </div>

           {/* List */}
           <div className="space-y-4">
               {items.map((item: any) => (
                   <div key={item._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
                       <div className="relative w-24 h-16 bg-gray-50 rounded overflow-hidden flex-shrink-0">
                           <img src={item.image} alt={item.title} className="object-cover w-full h-full" />
                       </div>
                       <div className="flex-1">
                           <h3 className="font-bold">{item.title}</h3>
                           <p className="text-sm text-gray-500">Order: {item.order}</p>
                           <p className="text-xs text-gray-400 truncate">{item.link}</p>
                       </div>
                       <button className="text-red-500 hover:text-red-700">
                           <Trash className="w-5 h-5" />
                       </button>
                   </div>
               ))}
                {items.length === 0 && <p className="text-gray-500">No slides added.</p>}
           </div>
       </div>
    </div>
  );
}
