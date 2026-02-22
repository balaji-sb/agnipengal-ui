'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Filter, MessageSquare, ChevronRight, Clock, User } from 'lucide-react';
import axios from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/tickets/admin/all?status=${filterStatus}`);
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
  }, [filterStatus]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-blue-100 text-blue-700';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-700';
      case 'Closed':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className='max-w-7xl mx-auto'>
      <div className='flex justify-between items-center mb-8'>
        <div>
          <h1 className='text-3xl font-bold text-gray-800 flex items-center gap-2'>
            <MessageSquare className='w-8 h-8 text-pink-600' />
            Support Tickets
          </h1>
          <p className='text-gray-500 mt-1'>Manage customer inquiries and support requests</p>
        </div>
      </div>

      <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6'>
        <div className='p-4 border-b border-gray-100 flex gap-4'>
          {['All', 'Open', 'In Progress', 'Closed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filterStatus === status
                  ? 'bg-pink-50 text-pink-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'>
        {loading ? (
          <div className='p-12 text-center text-gray-500'>Loading tickets...</div>
        ) : tickets.length === 0 ? (
          <div className='p-12 text-center flex flex-col items-center text-gray-400'>
            <MessageSquare className='w-16 h-16 mb-4 opacity-20' />
            <p className='text-lg'>No tickets found.</p>
          </div>
        ) : (
          <div className='divide-y divide-gray-100'>
            {tickets.map((ticket: any) => (
              <Link
                key={ticket._id}
                href={`/mahisadminpanel/support/${ticket._id}`}
                className='block p-4 hover:bg-gray-50 transition group'
              >
                <div className='flex justify-between items-center gap-4'>
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-3 mb-1'>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-bold ${getStatusColor(ticket.status)}`}
                      >
                        {ticket.status}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded border ${
                          ticket.priority === 'High'
                            ? 'border-red-200 text-red-600 bg-red-50'
                            : ticket.priority === 'Medium'
                              ? 'border-orange-200 bg-orange-600 bg-orange-50'
                              : 'border-green-200 text-green-600 bg-green-50'
                        }`}
                      >
                        {ticket.priority} Priority
                      </span>
                      <span className='text-xs text-gray-500 flex items-center gap-1'>
                        <User className='w-3 h-3' />
                        {ticket.user?.name || 'Unknown User'}
                      </span>
                      <span className='text-xs text-gray-500'>ID: #{ticket._id.slice(-6)}</span>
                    </div>
                    <h3 className='text-base font-semibold text-gray-900 group-hover:text-pink-600 transition-colors truncate'>
                      {ticket.subject}
                    </h3>
                    <p className='text-gray-500 text-sm truncate mt-1'>
                      {ticket.messages[ticket.messages.length - 1]?.message}
                    </p>
                  </div>
                  <div className='flex flex-col items-end gap-2 text-right'>
                    <span className='text-xs text-gray-400 whitespace-nowrap'>
                      {new Date(ticket.updatedAt).toLocaleDateString()}
                    </span>
                    <ChevronRight className='w-5 h-5 text-gray-400 group-hover:text-gray-600' />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
