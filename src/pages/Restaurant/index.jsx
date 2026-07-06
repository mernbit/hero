import React from 'react';
import { useParams } from 'react-router-dom';
import { TenantProvider } from '../../context/TenantContext';
import Hero from '../Hero';
import Menu from '../Menu';

const Restaurant = () => {
    // Extract the slug from the URL e.g. /the-creamery or /abc-resturant
    const { slug } = useParams();

    return (
        <TenantProvider slug={slug}>
            <div className="w-full">
                <Hero />
                <Menu />
            </div>
        </TenantProvider>
    );
};

export default Restaurant;
