'use client';

import React, { useState, useEffect } from 'react';
import ComboForm from '@/components/admin/ComboForm';
import api from '@/lib/api';
import { useParams } from 'next/navigation';

export default function EditComboPage() {
    const { id } = useParams();
    const [combo, setCombo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/combos/${id}`)
            .then(res => {
                setCombo(res.data.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (!combo) return <div>Combo not found</div>;

    return <ComboForm initialData={combo} isEditing={true} />;
}
