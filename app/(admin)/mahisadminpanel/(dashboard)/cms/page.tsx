'use client';

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import axios from '@/lib/api';
import { Plus, Edit, Trash, X, Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import 'react-quill-new/dist/quill.snow.css';

// Dynamic import for ReactQuill to avoid SSR issues
const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill-new');
    return ({ forwardedRef, ...props }: any) => <RQ ref={forwardedRef} {...props} />;
  },
  {
    ssr: false,
    loading: () => <div className='h-40 w-full bg-gray-50 animate-pulse rounded-lg' />,
  },
);

export default function CMSPagesPage() {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '', // ReactQuill uses HTML string
    isActive: true,
  });

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'clean'],
      ],
    }),
    [],
  );

  const fetchPages = () => {
    setLoading(true);
    axios
      .get('/cms')
      .then((res) => {
        setPages(res.data);
        setLoading(false);
      })
      .catch((err) => {
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
      await axios.delete(`/cms/${id}`);
      fetchPages();
      toast.success('Page deleted successfully');
    } catch (error) {
      toast.error('Failed to delete page');
    }
  };

  const handleOpenCreate = () => {
    setFormData({ title: '', slug: '', content: '', isActive: true });
    setCurrentId(null);
    setShowModal(true);
  };

  const handleOpenEdit = (page: any) => {
    setFormData({
      title: page.title,
      slug: page.slug,
      content: page.content,
      isActive: page.isActive,
    });
    setCurrentId(page._id);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Manual validation for content if needed
      if (currentId) {
        await axios.put(`/cms/${currentId}`, formData);
        toast.success('Page updated successfully');
      } else {
        await axios.post('/cms', formData);
        toast.success('Page created successfully');
      }
      setShowModal(false);
      fetchPages();
    } catch (error) {
      console.error(error);
      toast.error('Failed to save page');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold text-gray-800'>CMS Pages</h1>
        <button
          onClick={handleOpenCreate}
          className='flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition'
        >
          <Plus className='w-4 h-4 mr-2' />
          Add New
        </button>
      </div>

      <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'>
        <table className='w-full text-left'>
          <thead className='bg-gray-50 border-b border-gray-100'>
            <tr>
              <th className='p-4 font-medium text-gray-500'>Title</th>
              <th className='p-4 font-medium text-gray-500'>Slug</th>
              <th className='p-4 font-medium text-gray-500'>Active</th>
              <th className='p-4 font-medium text-gray-500'>Action</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-100'>
            {loading ? (
              <tr>
                <td colSpan={4} className='p-8 text-center text-gray-500'>
                  Loading...
                </td>
              </tr>
            ) : pages.length === 0 ? (
              <tr>
                <td colSpan={4} className='p-8 text-center text-gray-500'>
                  No pages found.
                </td>
              </tr>
            ) : (
              pages.map((page: any) => (
                <tr key={page._id} className='hover:bg-gray-50 transition'>
                  <td className='p-4 font-medium text-gray-900'>{page.title}</td>
                  <td className='p-4 text-gray-700'>{page.slug}</td>
                  <td className='p-4 text-gray-700'>
                    <span
                      className={`px-2 py-1 rounded text-xs ${page.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                    >
                      {page.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className='p-4 flex space-x-2'>
                    <button
                      onClick={() => handleOpenEdit(page)}
                      className='p-2 text-blue-600 hover:bg-blue-50 rounded inline-flex'
                    >
                      <Edit className='w-4 h-4' />
                    </button>
                    <button
                      onClick={() => handleDelete(page._id)}
                      className='p-2 text-red-600 hover:bg-red-50 rounded'
                    >
                      <Trash className='w-4 h-4' />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4'>
          <div className='bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl animate-in fade-in zoom-in duration-200'>
            <div className='p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10'>
              <h2 className='text-xl font-bold text-gray-900'>
                {currentId ? 'Edit Page' : 'Create New Page'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className='text-gray-400 hover:text-gray-600'
              >
                <X className='w-6 h-6' />
              </button>
            </div>

            <form onSubmit={handleSubmit} className='p-6 space-y-6'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Page Title</label>
                  <input
                    type='text'
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition'
                    placeholder='e.g. Terms and Conditions'
                    required
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Slug (URL)</label>
                  <input
                    type='text'
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition'
                    placeholder='e.g. terms-and-conditions'
                    required
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Content</label>
                <div className='prose-editor-container'>
                  <ReactQuill
                    theme='snow'
                    value={formData.content}
                    onChange={(content: string) => setFormData((prev) => ({ ...prev, content }))}
                    modules={modules}
                    className='h-64 mb-12' // mb-12 for toolbar space
                  />
                </div>
              </div>

              <div className='flex items-center gap-2 pt-4'>
                <input
                  type='checkbox'
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  id='isActive'
                  className='w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500'
                />
                <label htmlFor='isActive' className='text-sm font-medium text-gray-700'>
                  Active
                </label>
              </div>

              <div className='pt-4 border-t border-gray-100 flex gap-4 justify-end'>
                <button
                  type='button'
                  onClick={() => setShowModal(false)}
                  className='px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={submitting}
                  className='px-8 py-2.5 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed'
                >
                  {submitting ? (
                    <>
                      <Loader2 className='w-5 h-5 animate-spin' />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className='w-5 h-5' />
                      Save Page
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
