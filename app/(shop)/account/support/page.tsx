'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Plus, MessageSquare, Clock, CheckCircle, AlertCircle, ChevronRight, Loader2, Send, Paperclip, X } from 'lucide-react';
import axios from '@/lib/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function SupportTicketsPage() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        subject: '',
        priority: 'Low',
        message: '',
        attachment: ''
    });
    const router = useRouter();

    const fetchTickets = async () => {
        try {
            const res = await axios.get('/tickets/my-tickets');
            if (res.data.success) {
                setTickets(res.data.data);
            }
        } catch (error) {
            console.error('Error fetching tickets:', error);
            toast.error('Failed to load tickets');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

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

        setCreateLoading(true);
        try {
            const res = await axios.post('/tickets', formData);
            if (res.data.success) {
                toast.success('Ticket created successfully');
                setShowCreateModal(false);
                setFormData({ subject: '', priority: 'Low', message: '', attachment: '' });
                fetchTickets();
                // Optional: navigate to the new ticket or just refresh list (refreshing list is better for "all pages in layout")
            }
        } catch (error: any) {
            console.error('Error creating ticket:', error);
            toast.error('Failed to create ticket: ' + (error.response?.data?.error || 'Unknown error'));
        } finally {
            setCreateLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Open': return 'bg-blue-100 text-blue-700';
            case 'In Progress': return 'bg-yellow-100 text-yellow-700';
            case 'Closed': return 'bg-green-100 text-green-700';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    if (loading) return <div className="p-12 text-center text-gray-500">Loading support tickets...</div>;

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Support Tickets</h1>
                    <p className="text-gray-600 mt-1">View and track your support requests</p>
                </div>
                <button 
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center space-x-2 px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition shadow-sm font-medium"
                >
                    <Plus className="w-5 h-5" />
                    <span>Raise New Ticket</span>
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {tickets.length === 0 ? (
                    <div className="p-12 text-center flex flex-col items-center">
                        <MessageSquare className="w-12 h-12 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No tickets found</h3>
                        <p className="text-gray-500 mb-6">You haven't raised any support tickets yet.</p>
                        <button 
                             onClick={() => setShowCreateModal(true)}
                             className="text-pink-600 font-medium hover:underline"
                        >
                            Create your first ticket
                        </button>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {tickets.map((ticket: any) => (
                            <Link 
                                key={ticket._id} 
                                href={`/account/support/${ticket._id}`}
                                className="block p-6 hover:bg-gray-50 transition group"
                            >
                                <div className="flex justify-between items-center">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getStatusColor(ticket.status)}`}>
                                                {ticket.status}
                                            </span>
                                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {new Date(ticket.updatedAt).toLocaleDateString()}
                                            </span>
                                            <span className={`text-xs px-2 py-0.5 rounded border ${
                                                ticket.priority === 'High' ? 'border-red-200 text-red-600 bg-red-50' : 
                                                ticket.priority === 'Medium' ? 'border-orange-200 text-orange-600 bg-orange-50' : 
                                                'border-green-200 text-green-600 bg-green-50'
                                            }`}>
                                                {ticket.priority} Priority
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 truncate pr-4 group-hover:text-pink-600 transition-colors">
                                            {ticket.subject}
                                        </h3>
                                        <p className="text-gray-500 text-sm truncate mt-1">
                                            {ticket.messages[ticket.messages.length - 1]?.message}
                                        </p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

            </div>

            {/* Create Ticket Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h2 className="text-xl font-bold text-gray-900">Raise a New Ticket</h2>
                            <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
                                    rows={5}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition resize-none"
                                    placeholder="Describe your issue in detail..."
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Attachment (Optional)</label>
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
                                    <label className={`inline-flex items-center gap-2 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 cursor-pointer ${uploading ? 'opacity-50' : ''}`}>
                                        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Paperclip className="w-4 h-4" />}
                                        {uploading ? 'Uploading...' : 'Add Attachment'}
                                        <input 
                                            type="file" 
                                            className="hidden" 
                                            onChange={handleFileChange}
                                            disabled={uploading}
                                        />
                                    </label>
                                )}
                            </div>

                            <div className="pt-4 border-t border-gray-100 flex gap-4 justify-end">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={createLoading || uploading}
                                    className="px-8 py-2.5 bg-pink-600 text-white font-bold rounded-xl hover:bg-pink-700 transition flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {createLoading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Creating...
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
                </div>
            )}
        </div>
    );
}
