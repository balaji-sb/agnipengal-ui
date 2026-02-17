'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import {
  Layers,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Save,
  Loader2,
  Plus,
  Trash2,
  Edit2,
  X,
} from 'lucide-react';

export default function LayoutManager() {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // UI State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<any>(null);
  const [newSectionType, setNewSectionType] = useState('product_grid');
  const [newSectionLabel, setNewSectionLabel] = useState('');

  useEffect(() => {
    fetchLayout();
  }, []);

  const fetchLayout = async () => {
    setLoading(true);
    try {
      const res = await api.get('/homepage-layout');
      setSections(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === sections.length - 1) return;

    const newSections = [...sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    // Swap
    [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];

    // Update order property
    newSections.forEach((s, idx) => (s.order = idx + 1));

    setSections(newSections);
  };

  const handleVisibilityToggle = (index: number) => {
    const newSections = [...sections];
    newSections[index].isVisible = !newSections[index].isVisible;
    setSections(newSections);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/homepage-layout', { layout: sections });
      alert('Layout updated successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to update layout');
    } finally {
      setSaving(false);
    }
  };

  const handleAddSection = async () => {
    if (!newSectionLabel) return alert('Please enter a label');

    try {
      const res = await api.post('/homepage-layout/add', {
        type: newSectionType,
        label: newSectionLabel,
      });
      setSections([...sections, res.data.data]);
      setIsAddModalOpen(false);
      setNewSectionLabel('');
    } catch (error) {
      console.error(error);
      alert('Failed to add section');
    }
  };

  const handleDeleteSection = async (id: string) => {
    if (!confirm('Are you sure you want to delete this section?')) return;

    try {
      await api.delete(`/homepage-layout/${id}`);
      setSections(sections.filter((s) => s._id !== id));
    } catch (error) {
      console.error(error);
      alert('Failed to delete section');
    }
  };

  const openEditModal = (section: any) => {
    setEditingSection(section);
    setNewSectionLabel(section.label);
    setIsEditModalOpen(true);
  };

  const handleEditLabel = async () => {
    if (!newSectionLabel.trim()) return;

    const updatedSections = sections.map((s) =>
      s._id === editingSection._id ? { ...s, label: newSectionLabel } : s,
    );
    setSections(updatedSections);

    setSaving(true);
    try {
      await api.put('/homepage-layout', { layout: updatedSections });
      // Close modal after successful save
      setIsEditModalOpen(false);
      setEditingSection(null);
      setNewSectionLabel('');
    } catch (error) {
      console.error(error);
      alert('Failed to update label');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className='max-w-4xl mx-auto'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold text-gray-800 flex items-center'>
          <Layers className='mr-2 text-gray-600' />
          Homepage Layout Manager
        </h1>
        <div className='flex space-x-2'>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className='flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition'
          >
            <Plus className='w-4 h-4 mr-2' />
            Add Section
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className='flex items-center px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition'
          >
            {saving ? (
              <Loader2 className='w-4 h-4 mr-2 animate-spin' />
            ) : (
              <Save className='w-4 h-4 mr-2' />
            )}
            Save Changes
          </button>
        </div>
      </div>

      <p className='text-gray-500 mb-6'>
        Reorder sections to control their position on the homepage. Toggle visibility to hide/show
        sections.
      </p>

      <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden space-y-2 p-4'>
        {sections.map((section, index) => (
          <div
            key={section.sectionId}
            className={`flex items-center justify-between p-4 rounded-lg border transition ${
              section.isVisible
                ? 'bg-white border-gray-200'
                : 'bg-gray-50 border-gray-200 opacity-60'
            }`}
          >
            <div className='flex items-center space-x-4'>
              <span className='font-mono text-xs text-gray-400 w-6'>#{index + 1}</span>
              <div>
                <div className='flex items-center space-x-2'>
                  <h3 className='font-semibold text-gray-800'>{section.label}</h3>
                  <button
                    onClick={() => openEditModal(section)}
                    className='text-gray-400 hover:text-blue-500'
                  >
                    <Edit2 className='w-3 h-3' />
                  </button>
                </div>
                <p className='text-xs text-gray-500 font-mono'>{section.type}</p>
              </div>
            </div>

            <div className='flex items-center space-x-2'>
              <button
                onClick={() => handleMove(index, 'up')}
                disabled={index === 0}
                className='p-2 text-gray-500 hover:bg-gray-100 rounded disabled:opacity-30'
              >
                <ArrowUp className='w-4 h-4' />
              </button>
              <button
                onClick={() => handleMove(index, 'down')}
                disabled={index === sections.length - 1}
                className='p-2 text-gray-500 hover:bg-gray-100 rounded disabled:opacity-30'
              >
                <ArrowDown className='w-4 h-4' />
              </button>
              <div className='w-px h-6 bg-gray-200 mx-2' />
              <button
                onClick={() => handleVisibilityToggle(index)}
                className={`p-2 rounded ${section.isVisible ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}
              >
                {section.isVisible ? <Eye className='w-4 h-4' /> : <EyeOff className='w-4 h-4' />}
              </button>
              <button
                onClick={() => handleDeleteSection(section._id)}
                className='p-2 text-red-400 hover:bg-red-50 rounded'
              >
                <Trash2 className='w-4 h-4' />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Section Modal */}
      {isAddModalOpen && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
          <div className='bg-white p-6 rounded-xl w-96 shadow-xl'>
            <div className='flex justify-between items-center mb-4'>
              <h3 className='text-lg font-bold'>Add New Section</h3>
              <button onClick={() => setIsAddModalOpen(false)}>
                <X className='w-5 h-5 text-gray-400' />
              </button>
            </div>
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium mb-1'>Section Label</label>
                <input
                  type='text'
                  value={newSectionLabel}
                  onChange={(e) => setNewSectionLabel(e.target.value)}
                  className='w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none'
                  placeholder='e.g. Summer Collection'
                />
              </div>
              <div>
                <label className='block text-sm font-medium mb-1'>Section Type</label>
                <select
                  value={newSectionType}
                  onChange={(e) => setNewSectionType(e.target.value)}
                  className='w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none'
                >
                  <option value='product_grid'>Product Grid</option>
                  <option value='carousel'>Carousel</option>
                  <option value='categories'>Categories</option>
                  <option value='deals'>Deals</option>
                  <option value='combos'>Combo Offers</option>
                  <option value='shops'>Shops</option>
                  <option value='vendor_category'>Vendor Categories</option>
                </select>
              </div>
              <button
                onClick={handleAddSection}
                className='w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700'
              >
                Add Section
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Label Modal */}
      {isEditModalOpen && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
          <div className='bg-white p-6 rounded-xl w-96 shadow-xl'>
            <div className='flex justify-between items-center mb-4'>
              <h3 className='text-lg font-bold'>Edit Section Label</h3>
              <button onClick={() => setIsEditModalOpen(false)}>
                <X className='w-5 h-5 text-gray-400' />
              </button>
            </div>
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium mb-1'>Section Label</label>
                <input
                  type='text'
                  value={newSectionLabel}
                  onChange={(e) => setNewSectionLabel(e.target.value)}
                  className='w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none'
                />
              </div>
              <button
                onClick={handleEditLabel}
                className='w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700'
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
