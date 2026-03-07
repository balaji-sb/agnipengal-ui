'use client';

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import api from '@/lib/api';
import { Plus, Edit, Trash, X, Save, Loader2, ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import ImageUpload from '@/components/admin/ImageUpload';
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

export default function BlogsAdminPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    author: 'Agnipengal',
    category: 'Updates',
    image: '',
    isPublished: true,
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

  const fetchBlogs = () => {
    setLoading(true);
    api
      .get('/blogs')
      .then((res) => {
        setBlogs(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;
    try {
      await api.delete(`/blogs/${id}`);
      fetchBlogs();
      toast.success('Blog deleted successfully');
    } catch (error) {
      toast.error('Failed to delete blog');
    }
  };

  const handleOpenCreate = () => {
    setFormData({
      title: '',
      slug: '',
      content: '',
      author: 'Agnipengal',
      category: 'Updates',
      image: '',
      isPublished: true,
    });
    setCurrentId(null);
    setShowModal(true);
  };

  const handleOpenEdit = (blog: any) => {
    setFormData({
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      author: blog.author,
      category: blog.category,
      image: blog.image || '',
      isPublished: blog.isPublished,
    });
    setCurrentId(blog._id);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (currentId) {
        await api.put(`/blogs/${currentId}`, formData);
        toast.success('Blog updated successfully');
      } else {
        await api.post('/blogs', formData);
        toast.success('Blog created successfully');
      }
      setShowModal(false);
      fetchBlogs();
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || 'Failed to save blog';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: currentId ? prev.slug : generateSlug(title),
    }));
  };

  return (
    <div>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold text-gray-800'>Blogs</h1>
        <button
          onClick={handleOpenCreate}
          className='flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition'
        >
          <Plus className='w-4 h-4 mr-2' />
          Add New
        </button>
      </div>

      <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto overflow-hidden'>
        <table className='w-full text-left'>
          <thead className='bg-gray-50 border-b border-gray-100'>
            <tr>
              <th className='p-4 font-medium text-gray-500'>Title</th>
              <th className='p-4 font-medium text-gray-500'>Category</th>
              <th className='p-4 font-medium text-gray-500'>Status</th>
              <th className='p-4 font-medium text-gray-500'>Date</th>
              <th className='p-4 font-medium text-gray-500'>Action</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-100'>
            {loading ? (
              <tr>
                <td colSpan={5} className='p-8 text-center text-gray-500'>
                  Loading...
                </td>
              </tr>
            ) : blogs.length === 0 ? (
              <tr>
                <td colSpan={5} className='p-8 text-center text-gray-500'>
                  No blogs found.
                </td>
              </tr>
            ) : (
              blogs.map((blog: any) => (
                <tr key={blog._id} className='hover:bg-gray-50 transition'>
                  <td className='p-4'>
                    <div className='flex items-center gap-3'>
                      {blog.image ? (
                        <div className='w-10 h-10 rounded overflow-hidden bg-gray-100 flex-shrink-0'>
                          <img src={blog.image} alt='' className='w-full h-full object-cover' />
                        </div>
                      ) : (
                        <div className='w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0'>
                          <ImageIcon className='w-5 h-5' />
                        </div>
                      )}
                      <div>
                        <div className='font-medium text-gray-900'>{blog.title}</div>
                        <div className='text-xs text-gray-500'>{blog.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className='p-4 text-gray-700'>{blog.category}</td>
                  <td className='p-4 text-gray-700'>
                    <span
                      className={`px-2 py-1 rounded text-xs ${blog.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}
                    >
                      {blog.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className='p-4 text-gray-500 text-sm'>
                    {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString()}
                  </td>
                  <td className='p-4 flex space-x-2'>
                    <button
                      onClick={() => handleOpenEdit(blog)}
                      className='p-2 text-blue-600 hover:bg-blue-50 rounded inline-flex'
                    >
                      <Edit className='w-4 h-4' />
                    </button>
                    <button
                      onClick={() => handleDelete(blog._id)}
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
                {currentId ? 'Edit Blog' : 'Create New Blog'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className='text-gray-400 hover:text-gray-600'
              >
                <X className='w-6 h-6' />
              </button>
            </div>

            <form onSubmit={handleSubmit} className='p-6 space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Title</label>
                  <input
                    type='text'
                    value={formData.title}
                    onChange={handleTitleChange}
                    className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition'
                    placeholder='Blog post title'
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
                    placeholder='url-slug-here'
                    required
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Author</label>
                  <input
                    type='text'
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition'
                    placeholder='Author name'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Category</label>
                  <input
                    type='text'
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition'
                    placeholder='e.g. Embroidery, Fashion'
                  />
                </div>
              </div>

              <div>
                <ImageUpload
                  label='Featured Image'
                  multiple={false}
                  folder='blogs'
                  value={formData.image ? [formData.image] : []}
                  onChange={(url) => setFormData({ ...formData, image: url as string })}
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Content</label>
                <div className='prose-editor-container'>
                  <ReactQuill
                    theme='snow'
                    value={formData.content}
                    onChange={(content: string) => setFormData((prev) => ({ ...prev, content }))}
                    modules={modules}
                    className='h-64 mb-12'
                  />
                </div>
              </div>

              <div className='flex items-center gap-2 pt-4'>
                <input
                  type='checkbox'
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  id='isPublished'
                  className='w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500'
                />
                <label htmlFor='isPublished' className='text-sm font-medium text-gray-700'>
                  Published
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
                      Save Blog
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
