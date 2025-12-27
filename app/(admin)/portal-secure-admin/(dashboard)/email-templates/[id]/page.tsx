'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import axios from '@/lib/api';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import RichTextEditor from '@/components/admin/RichTextEditor';

export default function EmailTemplateEditor() {
  const params = useParams();
  const router = useRouter();
  // Ensure id is treated as string, although useParams returns string | string[]
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const isNew = id === 'new';

  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    body: '',
    variables: '',
    isActive: true
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew) {
      axios.get(`/api/email-templates/${id}`)
        .then(res => {
          setFormData({
            ...res.data,
            variables: res.data.variables ? res.data.variables.join(', ') : ''
          });
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
          // router.push('/portal-secure-admin/email-templates');
        });
    }
  }, [id, isNew, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...formData,
      variables: formData.variables.split(',').map(v => v.trim()).filter(Boolean)
    };

    try {
      if (isNew) {
        await axios.post('/api/email-templates', payload);
      } else {
        await axios.put(`/api/email-templates/${id}`, payload);
      }
      router.push('/portal-secure-admin/email-templates');
    } catch (error: any) {
        alert(error.response?.data?.message || 'Failed to save template');
        setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <Link href="/portal-secure-admin/email-templates" className="mr-4 text-gray-500 hover:text-gray-700">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">
          {isNew ? 'Create Email Template' : 'Edit Email Template'}
        </h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name (Identifier)</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                placeholder="e.g. WELCOME_EMAIL"
                disabled={!isNew}
              />
              {!isNew && <p className="text-xs text-gray-500 mt-1">Identifier cannot be changed</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                placeholder="Email Subject"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Variables (comma separated)</label>
            <input
              type="text"
              value={formData.variables}
              onChange={e => setFormData({ ...formData, variables: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
              placeholder="e.g. {{name}}, {{orderId}}"
            />
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-2">Body (HTML)</label>
          <div>
             <RichTextEditor
                value={formData.body}
                onChange={(value) => setFormData({ ...formData, body: value })}
                placeholder="<html><body>...</body></html>"
             />
          </div>
          </div>

          <div className="flex items-center">
             <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
             />
             <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                Active
             </label>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Template'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
