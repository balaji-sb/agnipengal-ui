'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, Search } from 'lucide-react';
import Image from 'next/image';

interface VendorCategory {
  _id: string;
  name: string;
  description: string;
  image: string;
  isActive: boolean;
}

export default function VendorCategoriesPage() {
  const [categories, setCategories] = useState<VendorCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<VendorCategory | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    isActive: true,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/vendor-categories/admin/all`,
        {
          withCredentials: true,
        },
      );
      if (res.data.success) {
        setCategories(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (category: VendorCategory | null = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || '',
        image: category.image || '',
        isActive: category.isActive,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        description: '',
        image: '',
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/vendor-categories/${editingCategory._id}`,
          formData,
          { withCredentials: true },
        );
        toast.success('Category updated successfully');
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/vendor-categories`, formData, {
          withCredentials: true,
        });
        toast.success('Category created successfully');
      }
      fetchCategories();
      handleCloseModal();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Operation failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/vendor-categories/${id}`, {
          withCredentials: true,
        });
        toast.success('Category deleted');
        fetchCategories();
      } catch (error: any) {
        toast.error(error.response?.data?.error || 'Delete failed');
      }
    }
  };

  return (
    <div className='p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold text-gray-800'>Vendor Categories</h1>
        <button
          onClick={() => handleOpenModal()}
          className='bg-violet-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-violet-700 transition'
        >
          <Plus size={20} /> Add Category
        </button>
      </div>

      {loading ? (
        <div className='flex justify-center p-8'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600'></div>
        </div>
      ) : (
        <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'>
          <table className='w-full text-left'>
            <thead className='bg-gray-50 text-gray-500 font-medium'>
              <tr>
                <th className='p-4'>Name</th>
                <th className='p-4'>Description</th>
                <th className='p-4'>Status</th>
                <th className='p-4 text-right'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100'>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className='p-8 text-center text-gray-500'>
                    No categories found. Create one to get started.
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category._id} className='hover:bg-gray-50 transition'>
                    <td className='p-4 font-medium text-gray-900'>{category.name}</td>
                    <td className='p-4 text-gray-500'>{category.description || '-'}</td>
                    <td className='p-4'>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          category.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {category.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className='p-4 text-right'>
                      <div className='flex justify-end gap-2'>
                        <button
                          onClick={() => handleOpenModal(category)}
                          className='p-2 text-violet-600 hover:bg-violet-50 rounded-lg transition'
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(category._id)}
                          className='p-2 text-red-600 hover:bg-red-50 rounded-lg transition'
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
          <div className='bg-white rounded-xl shadow-xl w-full max-w-md p-6'>
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-xl font-bold text-gray-900'>
                {editingCategory ? 'Edit Category' : 'New Category'}
              </h2>
              <button onClick={handleCloseModal} className='text-gray-400 hover:text-gray-600'>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Name</label>
                <input
                  type='text'
                  required
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-violet-500 focus:border-violet-500'
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Description</label>
                <textarea
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-violet-500 focus:border-violet-500'
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              {/* Image URL Input for now - could be file upload later */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Image URL (Optional)
                </label>
                <input
                  type='text'
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-violet-500 focus:border-violet-500'
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder='https://...'
                />
              </div>

              <div className='flex items-center'>
                <input
                  type='checkbox'
                  id='isActive'
                  className='h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded'
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
                <label htmlFor='isActive' className='ml-2 block text-sm text-gray-700'>
                  Active
                </label>
              </div>

              <div className='pt-4 flex gap-3'>
                <button
                  type='button'
                  onClick={handleCloseModal}
                  className='flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='flex-1 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700'
                >
                  {editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
