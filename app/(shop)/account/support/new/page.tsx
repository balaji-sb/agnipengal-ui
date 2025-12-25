"use client"

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Send, Loader2, Paperclip } from 'lucide-react';
import axios from '@/lib/api';
import toast from 'react-hot-toast';

export default function NewTicketPage() {
    const router = useRouter();
    const [showUploadModal, setShowUploadModal] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        subject: '',
        priority: 'Low',
        message: '',
        attachment: ''
    });

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
             toast.error('File size too large (max 5MB)');
             return;
        }

        const uploadData = new FormData();
        uploadData.append('file', file);
        uploadData.append('folder', 'tickets');

        setUploading(true);
        try {
            const res = await axios.post('/upload/ticket', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.data.success) {
                setFormData(prev => ({ ...prev, attachment: res.data.data.imageUrl }));
                toast.success('File attached successfully');
                setShowUploadModal(false);
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload attachment');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.subject || !formData.message) {
            toast.error('Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post('/tickets', formData);
            if (res.data.success) {
                toast.success('Ticket created successfully');
                router.push(`/account/support/${res.data.data._id}`);
            }
        } catch (error) {
            console.error('Error creating ticket:', error);
            toast.error('Failed to create ticket: ' + (error || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-8 relative">
            <Link 
                href="/account/support" 
                className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-6 transition"
            >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back to Tickets
            </Link>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Raise a New Ticket</h1>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                        <input
                            type="text"
                            value={formData.subject}
                            onChange={(e) => setFormData({...formData, subject: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition"
                            placeholder="Briefly describe your issue"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                        <select
                            value={formData.priority}
                            onChange={(e) => setFormData({...formData, priority: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none bg-white transition"
                        >
                            <option value="Low">Low - General Question</option>
                            <option value="Medium">Medium - Issue with Order</option>
                            <option value="High">High - Urgent / Payment Issue</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                        <textarea
                            value={formData.message}
                            onChange={(e) => setFormData({...formData, message: e.target.value})}
                            rows={6}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition resize-none"
                            placeholder="Describe your issue in detail..."
                            required
                        />
                    </div>

                    <div>
                         <label className="block text-sm font-medium text-gray-700 mb-2">Attachment</label>
                         
                         {formData.attachment ? (
                            <div className="flex items-center gap-3 p-3 bg-pink-50 border border-pink-100 rounded-xl w-fit">
                                <a href={formData.attachment} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-pink-700 hover:underline flex items-center gap-2">
                                    <Paperclip className="w-4 h-4" />
                                    View Attached File
                                </a>
                                <button 
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, attachment: '' }))}
                                    className="text-pink-400 hover:text-pink-700 font-bold ml-2"
                                >
                                    ×
                                </button>
                            </div>
                         ) : (
                             <button
                                type="button"
                                onClick={() => setShowUploadModal(true)}
                                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                            >
                                <Paperclip className="w-4 h-4" />
                                Add Attachment
                            </button>
                         )}
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-pink-600 text-white font-bold py-3 rounded-xl hover:bg-pink-700 transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    Submit Ticket
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl animate-in fade-in zoom-in duration-200">
                        <div className="text-center mb-6">
                            <div className="mx-auto w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                                <Paperclip className="w-6 h-6 text-pink-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">Upload Attachment</h3>
                            <p className="text-sm text-gray-500 mt-1">Select a file to attach to your ticket</p>
                        </div>
                        
                        <div className="space-y-4">
                            <label className="block w-full cursor-pointer group">
                                <div className="w-full h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 group-hover:border-pink-500 group-hover:bg-pink-50/50 transition bg-gray-50">
                                    {uploading ? (
                                        <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
                                    ) : (
                                        <>
                                            <Paperclip className="w-8 h-8 text-gray-400 group-hover:text-pink-500" />
                                            <span className="text-sm text-gray-500 group-hover:text-pink-600 font-medium">Click to browse</span>
                                        </>
                                    )}
                                </div>
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    onChange={handleFileChange}
                                    disabled={uploading}
                                />
                            </label>

                            <button
                                onClick={() => setShowUploadModal(false)}
                                className="w-full py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
                                disabled={uploading}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
