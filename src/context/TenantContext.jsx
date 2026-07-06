import React, { createContext, useContext, useState, useEffect } from 'react';

const TenantContext = createContext();

export const TenantProvider = ({ children, slug }) => {
    const [tenantData, setTenantData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTenant = async () => {
            try {
                setLoading(true);
                // Lowercase the slug to match our file names uniformly
                const normalizedSlug = (slug || 'the-creamery').toLowerCase();
                const response = await fetch(`/api/${normalizedSlug}.json`);
                
                if (!response.ok) {
                    throw new Error(`Tenant '${normalizedSlug}' not found. Check if the URL is correct.`);
                }
                
                const data = await response.json();
                setTenantData(data);
                
                // Inject Theme Variables
                const root = document.documentElement;
                if (data.theme) {
                    root.style.setProperty('--color-accent', data.theme.accent);
                    root.style.setProperty('--color-lavender', data.theme.lavender);
                    root.style.setProperty('--color-bg-card', data.theme.bgCard);
                    root.style.setProperty('--color-text-main', data.theme.textMain);
                    root.style.setProperty('--color-text-muted', data.theme.textMuted);
                }
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTenant();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center font-bold text-2xl bg-[#f2f4f7] text-gray-800">
                Loading Application...
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="min-h-screen w-full flex flex-col items-center justify-center font-bold text-red-500 text-2xl bg-[#f2f4f7]">
                <p>Error: {error}</p>
                <p className="text-sm font-normal text-gray-600 mt-4">Try /the-creamery or /abc-resturant</p>
            </div>
        );
    }

    return (
        <TenantContext.Provider value={tenantData}>
            {children}
        </TenantContext.Provider>
    );
};

export const useTenant = () => useContext(TenantContext);
