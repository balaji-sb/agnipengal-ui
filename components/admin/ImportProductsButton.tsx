'use client';

import React, { useRef, useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import axios from 'axios';

interface ImportProductsButtonProps {
    onSuccess: () => void;
}

export default function ImportProductsButton({ onSuccess }: ImportProductsButtonProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
            alert('Please upload a valid CSV file.');
            return;
        }

        setUploading(true);

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const text = e.target?.result as string;
                const lines = text.split('\n');
                
                // Assuming Header: name, price, description, category, stock, image
                // Simple parsing (splitting by comma, not handling quotes/commas inside values robustly for v1)
                // For a robust app, use a library like 'papaparse'.
                
                // Naive parser for prototype:
                const products = lines.slice(1).map(line => {
                    const columns = line.split(','); 
                    if (columns.length < 2) return null; // Skip empty lines
                    
                    // Cleanup strings
                    const clean = (str: string) => str?.trim().replace(/^"|"$/g, '');

                    return {
                        name: clean(columns[0]),
                        price: clean(columns[1]),
                        description: clean(columns[2]),
                        category: clean(columns[3]),
                        stock: clean(columns[4]),
                        image: clean(columns[5])
                    };
                }).filter(p => p && p.name); // Filter out nulls/empty

                if (products.length === 0) {
                    alert("No valid products found in CSV.");
                    setUploading(false);
                    return;
                }

                // Send to backend
                await axios.post('/api/products/bulk', products);
                
                alert(`Successfully imported ${products.length} products!`);
                onSuccess();
                if (fileInputRef.current) fileInputRef.current.value = '';

            } catch (error) {
                console.error('Import failed', error);
                alert('Failed to import products. Check console for details.');
            } finally {
                setUploading(false);
            }
        };
        
        reader.readAsText(file);
    };

    return (
        <>
            <input 
                type="file" 
                accept=".csv"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
            />
            <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
            >
                {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                Import CSV
            </button>
        </>
    );
}
