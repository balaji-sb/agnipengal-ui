'use client';

import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import axios from '@/lib/api';
import toast from 'react-hot-toast';

interface ExportOrdersButtonProps {
    orders?: any[]; // Kept for prop compatibility but unused for main logic
}

export default function ExportOrdersButton({  }: ExportOrdersButtonProps) {
    const [loading, setLoading] = useState(false);

    const downloadCSV = async () => {
        setLoading(true);
        try {
            // Fetch all orders from backend
            const res = await axios.get('/orders/export');
            const orders = res.data.data;

            if (!orders || orders.length === 0) {
                toast.error("No orders found to export.");
                setLoading(false);
                return;
            }

            // Define Headers
            const headers = [
                'Order ID', 
                'Date',
                'Status', 
                'Customer Name', 
                'Email',
                'Mobile', 
                'Address',
                'City',
                'State',
                'Pincode',
                'Items',
                'Total Amount', 
                'Payment Status',
                'Payment ID'
            ];
            
            // Format Rows
            const rows = orders.map((order: any) => {
                 const itemsString = order.items.map((item: any) => 
                    `${item.product?.name || item.name} (x${item.quantity})`
                 ).join('; ');

                 return [
                    order.orderId || order._id,
                    new Date(order.createdAt).toLocaleDateString(),
                    order.orderStatus || 'PENDING',
                    `"${order.customer?.name || ''}"`, // Escape quotes
                    order.customer?.email || '',
                    order.customer?.mobile || '',
                    `"${order.customer?.address || ''}"`,
                    order.customer?.city || '',
                    order.customer?.state || '',
                    order.customer?.pincode || '',
                    `"${itemsString}"`,
                    order.totalAmount,
                    order.status, // Payment Status
                    order.paymentId || ''
                ];
            });

            // Combine into CSV string
            const csvContent = [
                headers.join(','),
                ...rows.map((row: any[]) => row.join(','))
            ].join('\n');

            // Create Blob and Download
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', `orders_export_all_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            toast.success("Orders exported successfully!");

        } catch (error) {
            console.error(error);
            toast.error("Failed to export orders.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button 
            onClick={downloadCSV}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
        >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            <span>{loading ? 'Exporting...' : 'Export All CSV'}</span>
        </button>
    );
}
