'use client';

import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import axios from '@/lib/api';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';

export default function FAQForm() {
  const router = useRouter();
  const params = useParams();
  const id = (Array.isArray(params?.id) ? params.id[0] : params?.id) as string;
  const isNew = id === 'new';
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'General',
    isActive: true,
  });

  useEffect(() => {
    if (!isNew && id) {
      const fetchFAQ = async () => {
        try {
          const res = await axios.get(`/faqs/${id}`);
          if (res.data.success) {
            setFormData(res.data.data);
          }
        } catch (error) {
          console.error('Error fetching FAQ:', error);
          toast.error('Failed to load FAQ details');
          router.push('/mahisadminpanel/faqs');
        } finally {
          setLoading(false);
        }
      };
      fetchFAQ();
    }
  }, [isNew, id, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, isActive: e.target.checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.question || !formData.answer) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      if (isNew) {
        await axios.post('/faqs', formData);
        toast.success('FAQ created successfully');
      } else {
        await axios.put(`/faqs/${id}`, formData);
        toast.success('FAQ updated successfully');
      }
      router.push('/mahisadminpanel/faqs');
    } catch (error: any) {
      console.error('Error saving FAQ:', error);
      toast.error(error.response?.data?.error || 'Failed to save FAQ');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className='p-8 text-center text-gray-500'>Loading...</div>;
  }

  return (
    <div className='max-w-3xl mx-auto'>
      <div className='flex items-center gap-4 mb-6'>
        <Link
          href='/mahisadminpanel/faqs'
          className='p-2 hover:bg-gray-100 rounded-full transition text-gray-600'
        >
          <ChevronLeft className='w-5 h-5' />
        </Link>
        <h1 className='text-2xl font-bold text-gray-800'>
          {isNew ? 'Create New FAQ' : 'Edit FAQ'}
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'
      >
        <div className='p-6 space-y-6'>
          {/* Status & Category Row */}
          <div className='flex flex-col md:flex-row gap-6'>
            <div className='flex-1'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Category</label>
              <select
                name='category'
                value={formData.category}
                onChange={handleChange}
                className='w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none bg-white'
              >
                <option value='General'>General</option>
                <option value='Orders'>Orders</option>
                <option value='Shipping'>Shipping</option>
                <option value='Returns'>Returns</option>
                <option value='Payment'>Payment</option>
                <option value='Products'>Products</option>
              </select>
            </div>
            <div className='flex items-center pt-6'>
              <label className='flex items-center gap-3 cursor-pointer'>
                <div className='relative'>
                  <input
                    type='checkbox'
                    className='sr-only'
                    checked={formData.isActive}
                    onChange={handleToggle}
                  />
                  <div
                    className={`block w-12 h-7 rounded-full transition ${formData.isActive ? 'bg-green-500' : 'bg-gray-300'}`}
                  ></div>
                  <div
                    className={`dot absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition transform ${formData.isActive ? 'translate-x-5' : 'translate-x-0'}`}
                  ></div>
                </div>
                <span className='text-sm font-medium text-gray-700'>
                  {formData.isActive ? 'Active (Visible)' : 'Draft (Hidden)'}
                </span>
              </label>
            </div>
          </div>

          {/* Question */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Question <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              name='question'
              value={formData.question}
              onChange={handleChange}
              placeholder='e.g. How do I track my order?'
              className='w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none'
              required
            />
          </div>

          {/* Answer */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Answer <span className='text-red-500'>*</span>
            </label>
            <textarea
              name='answer'
              value={formData.answer}
              onChange={handleChange}
              rows={6}
              placeholder='Enter the answer here...'
              className='w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none resize-none'
              required
            />
          </div>
        </div>

        <div className='bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-100'>
          <Link
            href='/mahisadminpanel/faqs'
            className='px-6 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition font-medium'
          >
            Cancel
          </Link>
          <button
            type='submit'
            disabled={saving}
            className='px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium shadow-sm hover:shadow flex items-center gap-2 disabled:opacity-70 disabled:cursor-wait'
          >
            {saving ? (
              <>
                <Loader2 className='w-4 h-4 animate-spin' />
                Saving...
              </>
            ) : (
              <>
                <Save className='w-4 h-4' />
                {isNew ? 'Create FAQ' : 'Update FAQ'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
