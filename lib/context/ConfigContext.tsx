'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '@/lib/api';

interface Config {
    appName: string;
    logo: string;
    themeColor: string;
    adminEmail: string;
    adminUsername: string;
    adminWhatsapp: string;
    whatsappApiUrl: string;
    whatsappApiKey: string;
    whatsappPhoneNumberId: string;
    shippingCharge: number;
    freeShippingThreshold: number;
    adminCommissionRate: number;
    homepageSections: any[];
}

interface ConfigContextType {
    config: Config | null;
    loading: boolean;
    refreshConfig: () => void;
}

const ConfigContext = createContext<ConfigContextType>({
    config: null,
    loading: true,
    refreshConfig: () => {},
});

export const useConfig = () => useContext(ConfigContext);

export const ConfigProvider = ({ children }: { children: React.ReactNode }) => {
    const [config, setConfig] = useState<Config | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchConfig = async () => {
        try {
            const res = await axios.get('/config');
            setConfig(res.data.data);
        } catch (error) {
            console.error('Failed to fetch config', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConfig();
    }, []);

    return (
        <ConfigContext.Provider value={{ config, loading, refreshConfig: fetchConfig }}>
            {children}
        </ConfigContext.Provider>
    );
};
