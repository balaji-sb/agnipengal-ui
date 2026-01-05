'use client';

import React, { useRef, useState } from 'react';
import { Upload, Download, Loader2 } from 'lucide-react';
import api from '@/lib/api';

interface ImportExportButtonsProps {
    entity: 'products' | 'categories';
    onSuccess: () => void;
}

export default function ImportExportButtons({ entity, onSuccess }: ImportExportButtonsProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [importing, setImporting] = useState(false);
    const [exporting, setExporting] = useState(false);

    const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
            alert('Please upload a valid CSV file.');
            return;
        }

        setImporting(true);

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const csvData = e.target?.result as string;
                
                await api.post(`/${entity}/import`, { csvData });
                
                alert(`Successfully imported ${entity}!`);
                onSuccess();
                if (fileInputRef.current) fileInputRef.current.value = '';

            } catch (error: any) {
                console.error('Import failed', error);
                alert(`Failed to import ${entity}. ${error.response?.data?.error || ''}`);
            } finally {
                setImporting(false);
            }
        };
        
        reader.readAsText(file);
    };

    const handleExport = async () => {
        setExporting(true);
        try {
            const response = await api.get(`/${entity}/export`, {
                responseType: 'blob',
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${entity}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Export failed', error);
            alert(`Failed to export ${entity}`);
        } finally {
            setExporting(false);
        }
    };

    return (
        <div className="flex space-x-2">
            <input 
                type="file" 
                accept=".csv"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImport}
            />
            
            <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={importing || exporting}
                className="flex items-center px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
            >
                {importing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                Import
            </button>

            <button 
                onClick={handleExport}
                disabled={importing || exporting}
                className="flex items-center px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
            >
                {exporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                Export
            </button>
        </div>
    );
}
