import React from 'react';
import api from '@/lib/api-server'; // Using server-side API helper
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

async function getPage(slug: string) {
    try {
        const res = await api.get(`/cms/slug/${slug}`);
        if (res.data) {
            return res.data;
        }
        return null;
    } catch (error) {
        return null; // Return null to trigger notFound
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const page = await getPage(slug);
    
    if (!page) {
        return {
            title: 'Page Not Found',
        };
    }

    return {
        title: page.title,
        description: `Read about ${page.title} at Mahi's Vriksham`,
    };
}

export default async function CMSPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const page = await getPage(slug);

    if (!page || page.isActive === false) { // isActive is default true, explicit false check
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">{page.title}</h1>
            <div 
                className="prose prose-lg max-w-none text-gray-700 space-y-4"
                dangerouslySetInnerHTML={{ __html: page.content }}
            />
        </div>
    );
}
