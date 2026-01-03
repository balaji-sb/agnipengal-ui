'use client';

import React, { useState, useEffect } from 'react';
import DealForm from '@/components/admin/DealForm';
import api from '@/lib/api';
import { useParams } from 'next/navigation';

export default function EditDealPage() {
    const { id } = useParams();
    const [deal, setDeal] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/deals/${id}`)
            .then(res => {
                setDeal(res.data.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (!deal) return <div>Deal not found</div>;

    return <DealForm initialData={deal} isEditing={true} />;
}
