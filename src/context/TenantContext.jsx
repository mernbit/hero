import React, { createContext, useContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

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
                    root.style.setProperty('--color-secondary', data.theme.secondary);
                    root.style.setProperty('--color-secondary-soft', data.theme.secondarySoft);
                    root.style.setProperty('--color-highlight', data.theme.highlight);
                    root.style.setProperty('--color-bg-card', data.theme.bgCard);
                    root.style.setProperty('--color-surface', data.theme.surface);
                    root.style.setProperty('--color-surface-alt', data.theme.surfaceAlt);
                    root.style.setProperty('--color-page-bg', data.theme.pageBg);
                    root.style.setProperty('--color-border', data.theme.border);
                    root.style.setProperty('--color-border-hover', data.theme.borderHover);
                    root.style.setProperty('--color-text-main', data.theme.textMain);
                    root.style.setProperty('--color-text-muted', data.theme.textMuted);
                    root.style.setProperty('--color-text-light', data.theme.textLight);
                    root.style.setProperty('--color-text-inverse', data.theme.textInverse);
                    root.style.setProperty('--color-success', data.theme.success);
                    root.style.setProperty('--color-warning', data.theme.warning);
                    root.style.setProperty('--color-danger', data.theme.danger);
                    root.style.setProperty('--color-info', data.theme.info);
                    root.style.setProperty('--color-button-primary-hover', data.theme.buttonPrimaryHover);
                    root.style.setProperty('--color-button-secondary', data.theme.buttonSecondary);
                    root.style.setProperty('--color-button-secondary-hover', data.theme.buttonSecondaryHover);
                    root.style.setProperty('--color-badge', data.theme.badge);
                    root.style.setProperty('--color-badge-text', data.theme.badgeText);
                    root.style.setProperty('--color-shadow', data.theme.shadow);
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
        const isMenuRoute = window.location.pathname.endsWith('/menu');
        return <Navigate to={isMenuRoute ? "/the-creamery/menu" : "/the-creamery"} replace />;
    }

    return (
        <TenantContext.Provider value={tenantData}>
            {children}
        </TenantContext.Provider>
    );
};

export const useTenant = () => useContext(TenantContext);
