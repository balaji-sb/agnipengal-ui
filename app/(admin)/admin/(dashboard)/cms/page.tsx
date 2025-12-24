'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Plus, Edit, Trash, ExternalLink } from 'lucide-react';

export default function CMSPagesPage() {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPages = () => {
    setLoading(true);
    axios.get('/api/cms').then(res => {
        setPages(res.data);
        setLoading(false);
    }).catch(err => {
        console.error(err);
        setLoading(false);
    });
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return;
    try {
        await axios.delete(`/api/cms/${id}`);
        fetchPages();
    } catch (error) {
        alert('Failed to delete page');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">CMS Pages</h1>
        <Link 
            href="/admin/cms/new" 
            className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition"
        >
            <Plus className="w-4 h-4 mr-2" />
            Add New
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                    <th className="p-4 font-medium text-gray-500">Title</th>
                    <th className="p-4 font-medium text-gray-500">Slug</th>
                    <th className="p-4 font-medium text-gray-500">Active</th>
                    <th className="p-4 font-medium text-gray-500">Action</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {loading ? (
                    <tr><td colSpan={4} className="p-8 text-center text-gray-500">Loading...</td></tr>
                ) : pages.map((page: any) => (
                    <tr key={page._id} className="hover:bg-gray-50 transition">
                        <td className="p-4 font-medium text-gray-900">{page.title}</td>
                        <td className="p-4 text-gray-700">{page.slug}</td>
                        <td className="p-4 text-gray-700">
                            <span className={`px-2 py-1 rounded text-xs ${page.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {page.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </td>
                        <td className="p-4 flex space-x-2">
                             <Link href={`/admin/cms/${page._id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded inline-flex">
                                <Edit className="w-4 h-4" />
                            </Link>
                            <button onClick={() => handleDelete(page._id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                                <Trash className="w-4 h-4" />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        {pages.length === 0 && !loading && (
            <div className="p-8 text-center text-gray-500">No pages found.</div>
        )}
      </div>
    </div>
  );
}
