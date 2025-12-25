import React from 'react';
import api from '@/lib/api-server';
import { HelpCircle, ChevronDown } from 'lucide-react';

async function getFAQs() {
    try {
        // Fetch only active FAQs
        const res = await api.get('/faqs');
        if (res.data.success) {
            return res.data.data;
        }
        return [];
    } catch (error) {
        return [];
    }
}

export const metadata = {
    title: 'Frequently Asked Questions',
    description: 'Find answers to common questions about shipping, returns, and products.',
};

export default async function FAQPage() {
    const faqs = await getFAQs();

    // Group FAQs by category
    const groupedFaqs: Record<string, any[]> = {};
    faqs.forEach((faq: any) => {
        if (!groupedFaqs[faq.category]) {
            groupedFaqs[faq.category] = [];
        }
        groupedFaqs[faq.category].push(faq);
    });

    return (
        <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                     <div className="flex justify-center mb-4">
                        <div className="p-3 bg-pink-100 rounded-full">
                            <HelpCircle className="w-8 h-8 text-pink-600" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Frequently Asked Questions
                    </h1>
                    <p className="mt-4 text-lg text-gray-600">
                        Can't find the answer you're looking for? Reach out to our customer support.
                    </p>
                </div>

                <div className="space-y-8">
                    {Object.keys(groupedFaqs).length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                            <p className="text-gray-500">No FAQs available at the moment.</p>
                        </div>
                    ) : (
                        Object.entries(groupedFaqs).map(([category, items]) => (
                            <div key={category} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                                    <h2 className="text-lg font-bold text-gray-800">{category}</h2>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    {items.map((faq) => (
                                        <details key={faq._id} className="group">
                                            <summary className="flex justify-between items-center w-full px-6 py-4 text-left cursor-pointer hover:bg-gray-50 transition focus:outline-none">
                                                <span className="font-medium text-gray-900">{faq.question}</span>
                                                <span className="ml-6 flex-shrink-0 transition-transform duration-200 group-open:-rotate-180">
                                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                                </span>
                                            </summary>
                                            <div className="px-6 pb-4 pt-0 text-gray-600 leading-relaxed whitespace-pre-wrap animate-fade-in">
                                                {faq.answer}
                                            </div>
                                        </details>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
