'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft, Send, Paperclip, Clock, Loader2, User, UserCheck } from 'lucide-react';
import Link from 'next/link';
import axios from '@/lib/api';
import toast from 'react-hot-toast';

export default function TicketDetailsPage() {
    const params = useParams();
    const id = (Array.isArray(params?.id) ? params.id[0] : params?.id) as string;
    const [ticket, setTicket] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [reply, setReply] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [attachment, setAttachment] = useState('');
    const [uploading, setUploading] = useState(false);

    const fetchTicket = async () => {
        try {
            const res = await axios.get(`/tickets/${id}`);
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

    if (loading) return <div className="p-12 text-center text-gray-500">Loading ticket...</div>;
    if (!ticket) return <div className="p-12 text-center text-gray-500">Ticket not found</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 h-[calc(100vh-100px)] flex flex-col">
            <div className="flex items-center gap-4 mb-6 flex-shrink-0">
                <Link 
                    href="/account/support"
                    className="p-2 hover:bg-gray-100 rounded-full transition text-gray-600"
                >
                    <ChevronLeft className="w-5 h-5" />
                </Link>
                <div className="flex-1">
                    <h1 className="text-xl font-bold text-gray-900 line-clamp-1">{ticket.subject}</h1>
                    <div className="flex items-center gap-3 text-sm mt-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                            ticket.status === 'Open' ? 'bg-blue-100 text-blue-700' : 
                            ticket.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                        }`}>
                            {ticket.status}
                        </span>
                        <span className="text-gray-500">Ticket ID: #{ticket._id.slice(-6)}</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden flex flex-col shadow-sm">
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {ticket.messages.map((msg: any, index: number) => {
                        const isAdmin = msg.sender === 'Admin';
                        return (
                            <div key={index} className={`flex ${isAdmin ? 'justify-start' : 'justify-end'}`}>
                                <div className={`flex max-w-[80%] ${isAdmin ? 'flex-row' : 'flex-row-reverse'} gap-3`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isAdmin ? 'bg-pink-100 text-pink-600' : 'bg-gray-200 text-gray-600'}`}>
                                        {isAdmin ? <UserCheck className="w-5 h-5" /> : <User className="w-5 h-5" />}
                                    </div>
                                    <div className={`group relative p-4 rounded-2xl ${
                                        isAdmin ? 'bg-white border border-gray-100 text-gray-800 rounded-tl-none' : 'bg-pink-600 text-white rounded-tr-none'
                                    }`}>
                                        <p className="whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                                        {msg.attachment && (
                                            <div className="mt-3">
                                                <a 
                                                    href={msg.attachment} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                                                        isAdmin ? 'bg-gray-50 text-pink-600 hover:bg-gray-100' : 'bg-white/20 text-white hover:bg-white/30'
                                                    }`}
                                                >
                                                    <Paperclip className="w-4 h-4" />
                                                    View Attachment
                                                </a>
                                            </div>
                                        )}
                                        <div className={`text-[10px] mt-2 opacity-70 flex items-center gap-1 ${isAdmin ? 'justify-start' : 'justify-end'}`}>
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
                                disabled={uploading || ticket.status === 'Closed'}
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
                                placeholder={ticket.status === 'Closed' ? "This ticket is closed" : "Type your reply..."}
                                disabled={ticket.status === 'Closed'}
                                rows={1}
                                className="w-full px-5 py-3 bg-gray-50 border-gray-200 border rounded-xl focus:ring-2 focus:ring-pink-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
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
                            disabled={submitting || (!reply.trim() && !attachment) || ticket.status === 'Closed'}
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
