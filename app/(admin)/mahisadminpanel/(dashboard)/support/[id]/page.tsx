'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft, Send, User, UserCheck, AlertCircle, CheckCircle, Clock, Loader2, Paperclip } from 'lucide-react';
import Link from 'next/link';
import axios from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminTicketDetailsPage() {
    const params = useParams();
    const id = (Array.isArray(params?.id) ? params.id[0] : params?.id) as string;
    const [ticket, setTicket] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [reply, setReply] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [attachment, setAttachment] = useState('');
    const [uploading, setUploading] = useState(false);

    const fetchTicket = async () => {
        try {
            const res = await axios.get(`/tickets/${id}`); // Admin uses same GET endpoint but protected by checks, or create separate if needed. Using user endpoint which allows admin access.
            if (res.data.success) {
                setTicket(res.data.data);
            }
        } catch (error) {
            console.error('Error fetching ticket:', error);
            toast.error('Failed to load ticket details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchTicket();
        }
    }, [id]);

    useEffect(() => {
        if (ticket) {
            scrollToBottom();
        }
    }, [ticket]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

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
                setAttachment(res.data.data.imageUrl);
                toast.success('File attached');
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload attachment');
        } finally {
            setUploading(false);
        }
    };

    const handleReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reply.trim() && !attachment) return;

        setSubmitting(true);
        try {
            const res = await axios.post(`/tickets/${id}/reply`, {
                message: reply,
                attachment
            });
            if (res.data.success) {
                setTicket(res.data.data);
                setReply('');
                setAttachment('');
                toast.success('Reply sent');
            }
        } catch (error) {
            console.error('Error sending reply:', error);
            toast.error('Failed to send reply');
        } finally {
            setSubmitting(false);
        }
    };

    const handleStatusUpdate = async (newStatus: string) => {
        setUpdatingStatus(true);
        try {
            const res = await axios.put(`/tickets/admin/${id}/status`, { status: newStatus });
            if (res.data.success) {
                setTicket(res.data.data);
                toast.success(`Status updated to ${newStatus}`);
            }
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        } finally {
            setUpdatingStatus(false);
        }
    };

    if (loading) return <div className="p-12 text-center text-gray-500">Loading ticket...</div>;
    if (!ticket) return <div className="p-12 text-center text-gray-500">Ticket not found</div>;

    return (
        <div className="max-w-5xl mx-auto h-[calc(100vh-100px)] flex flex-col">
            <div className="flex justify-between items-start gap-4 mb-6 flex-shrink-0">
                <div className="flex items-center gap-4">
                    <Link 
                        href="/mahisadminpanel/support"
                        className="p-2 hover:bg-gray-100 rounded-full transition text-gray-600"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 line-clamp-1 flex items-center gap-2">
                            {ticket.subject}
                            <span className={`text-xs px-2 py-0.5 rounded border border-gray-200 font-normal
                                ${ticket.priority === 'High' ? 'text-red-600 bg-red-50' : 
                                  ticket.priority === 'Medium' ? 'text-orange-600 bg-orange-50' : 
                                  'text-green-600 bg-green-50'}`}>
                                {ticket.priority} Priority
                            </span>
                        </h1>
                        <div className="flex items-center gap-3 text-sm mt-1 text-gray-500">
                             <span className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {ticket.user?.name} ({ticket.user?.email})
                             </span>
                             <span>•</span>
                             <span>ID: #{ticket._id.slice(-6)}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
                    {['Open', 'In Progress', 'Closed'].map((status) => (
                        <button
                            key={status}
                            onClick={() => handleStatusUpdate(status)}
                            disabled={updatingStatus || ticket.status === status}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                                ticket.status === status 
                                    ? status === 'Open' ? 'bg-blue-100 text-blue-700' 
                                    : status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' 
                                    : 'bg-green-100 text-green-700'
                                    : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden flex flex-col shadow-sm">
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {ticket.messages.map((msg: any, index: number) => {
                        const isAdmin = msg.sender === 'Admin';
                        return (
                            <div key={index} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex max-w-[80%] ${isAdmin ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isAdmin ? 'bg-pink-100 text-pink-600' : 'bg-gray-200 text-gray-600'}`}>
                                        {isAdmin ? <UserCheck className="w-5 h-5" /> : <User className="w-5 h-5" />}
                                    </div>
                                    <div className={`group relative p-4 rounded-2xl ${
                                        isAdmin ? 'bg-pink-600 text-white rounded-tr-none' : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'
                                    }`}>
                                        <div className="flex items-baseline justify-between gap-4 mb-1">
                                            <span className="text-xs font-bold opacity-80">{isAdmin ? 'You' : ticket.user?.name}</span> 
                                        </div>
                                        <p className="whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                                        {msg.attachment && (
                                            <div className="mt-3">
                                                <a 
                                                    href={msg.attachment} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                                                        isAdmin ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-gray-50 text-pink-600 hover:bg-gray-100'
                                                    }`}
                                                >
                                                    <Paperclip className="w-4 h-4" />
                                                    View Attachment
                                                </a>
                                            </div>
                                        )}
                                        <div className={`text-[10px] mt-2 opacity-70 flex items-center gap-1 ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                                            <Clock className="w-3 h-3" />
                                            {new Date(msg.createdAt).toLocaleString([], { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 bg-white border-t border-gray-200">
                    <div className="relative flex gap-3 items-end">
                         <label className={`p-3 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50 transition flex-shrink-0 ${uploading ? 'opacity-50' : ''}`}>
                            <input 
                                type="file" 
                                className="hidden" 
                                onChange={handleFileChange} 
                                disabled={uploading}
                            />
                            {uploading ? <Loader2 className="w-5 h-5 animate-spin text-gray-500" /> : <Paperclip className={`w-5 h-5 ${attachment ? 'text-pink-600' : 'text-gray-500'}`} />}
                         </label>
                         
                         <div className="flex-1 relative">
                            {attachment && (
                                <div className="absolute -top-10 left-0 bg-pink-50 text-pink-700 text-xs px-2 py-1 rounded-lg border border-pink-100 flex items-center gap-2">
                                    <Paperclip className="w-3 h-3" />
                                    Attached File
                                    <button onClick={() => setAttachment('')} className="hover:text-pink-900 ml-1">×</button>
                                </div>
                            )}
                            <textarea
                                value={reply}
                                onChange={(e) => setReply(e.target.value)}
                                placeholder="Type your reply as support admin..."
                                rows={1}
                                className="w-full px-5 py-3 bg-gray-50 border-gray-200 border rounded-xl focus:ring-2 focus:ring-pink-500 outline-none resize-none"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleReply(e);
                                    }
                                }}
                            />
                         </div>

                         <button 
                            onClick={handleReply}
                            disabled={submitting || (!reply.trim() && !attachment)}
                            className="p-3 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 mb-0.5"
                         >
                            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                         </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
