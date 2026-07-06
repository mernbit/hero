import React from 'react';
import { useTenant } from '../../context/TenantContext';
const Menu = () => {
    const tenant = useTenant();
    const menuItems = tenant.products;

    return (
        <div id="products" className="w-full bg-[#f2f4f7] relative py-20 overflow-x-hidden border-b-8 border-text-muted">
            <div className="max-w-[1440px] mx-auto px-4 md:px-12">
                <h2 className="bungee-regular text-5xl text-center text-text-main mb-16">Our Products</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {menuItems.map((item) => (
                        <div key={item.id} className="relative bg-white pt-[50px] pb-6 flex flex-col group shadow-sm hover:shadow-2xl transition-all duration-300">
                            
                            {/* Three Top Rectangles */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 flex gap-[8px]">
                                <div className="w-[18px] h-[22px] bg-accent"></div>
                                <div className="w-[18px] h-[22px] bg-accent"></div>
                                <div className="w-[18px] h-[22px] bg-accent"></div>
                            </div>
                            
                            {/* Title */}
                            <h3 className="bungee-regular text-[26px] px-6 text-text-main leading-tight z-10 relative">
                                {item.title}
                            </h3>
                            
                            {/* Price Ribbon */}
                            <div 
                                className="absolute top-[80px] right-0 bg-accent text-white py-2 pr-5 pl-7 flex items-baseline gap-1 z-10 shadow-md"
                                style={{ clipPath: 'polygon(15px 0, 100% 0, 100% 100%, 15px 100%, 0 50%)' }}
                            >
                                <span className="text-[14px] font-bold">Rs</span>
                                <span className="text-[28px] font-black leading-none">{item.price}</span>
                            </div>
                            
                            {/* Image Wrapper */}
                            <div className="relative flex-1 flex items-center justify-center mt-[40px] px-6 h-[260px]">
                                <img 
                                    src={item.image} 
                                    alt={item.title} 
                                    className="max-h-full max-w-full object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.2)] group-hover:-translate-y-2 group-hover:scale-105 transition-transform duration-500 ease-out"
                                />
                            </div>
                            
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Menu;