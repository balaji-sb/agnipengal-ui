'use client';

import React from 'react';
import { Download } from 'lucide-react';

interface ExportOrdersButtonProps {
    orders: any[];
}

export default function ExportOrdersButton({ orders }: ExportOrdersButtonProps) {
    
    const downloadCSV = () => {
        if (!orders || orders.length === 0) {
            alert("No orders to export.");
            return;
        }

        // Define Headers
        const headers = ['Order ID', 'Customer Name', 'Mobile', 'Date', 'Status', 'Total Amount', 'Payment Status', 'Items Count'];
        
        // Format Rows
        const rows = orders.map(order => [
            order._id,
            `"${order.customer.name}"`, // Escape quotes
            order.customer.mobile,
            new Date(order.createdAt).toLocaleDateString(),
            order.status,
            order.totalAmount,
            order.status,
            order.items.length
        ]);

        // Combine into CSV string
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        // Create Blob and Download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <button 
            onClick={downloadCSV}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm"
        >
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
        </button>
    );
}
