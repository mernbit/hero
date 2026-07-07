import React, { useState } from "react";
import { useTenant } from "../context/TenantContext";
import { useCart } from "../context/CartContext";

const TopDeals = () => {
  const tenant = useTenant();
  const { openModal } = useCart();
  const deals = tenant.topDeals;
  const [wishlist, setWishlist] = useState({});

  const toggleWishlist = (id) => {
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="w-full bg-[#f2f4f7] relative py-16 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 md:px-12">
        {/* Header */}
        <div className="mb-10 flex flex-col items-start">
          <h2 
            className="font-black text-[26px] md:text-[30px] text-text-main uppercase tracking-tight" 
            style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "-0.5px" }}
          >
            TOP DEALS
          </h2>
          <div className="w-[35px] h-[3px] bg-accent mt-1.5"></div>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 gap-y-12">
          {deals.map((deal) => (
            <div
              key={deal.id}
              onClick={() => openModal(deal)}
              className="relative bg-white rounded-xl overflow-visible group flex flex-col cursor-pointer"
              style={{
                boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
                border: "1px solid rgba(0,0,0,0.06)"
              }}
            >
              {/* Top Center Red Bars */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 flex gap-[5px]">
                <div className="w-[14px] h-[18px] bg-accent"></div>
                <div className="w-[14px] h-[18px] bg-accent"></div>
                <div className="w-[14px] h-[18px] bg-accent"></div>
              </div>

              {/* Heart Wishlist Icon */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist(deal.id);
                }}
                className="absolute top-4 right-4 z-10 bg-transparent border-none cursor-pointer hover:scale-110 transition-transform"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-[20px] h-[20px] text-accent"
                  fill={wishlist[deal.id] ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>

              {/* Image */}
              <div className="relative h-[220px] flex items-center justify-center px-6 pt-12 pb-2">
                <img
                  src={deal.image}
                  alt={deal.title}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 ease-out"
                />
              </div>

              {/* Content */}
              <div className="px-5 pb-12 pt-1 flex flex-col flex-1">
                <h3 className="font-bold text-[17px] text-text-main leading-tight mb-2 font-inter tracking-tight">
                  {deal.title}
                </h3>
                <p className="text-[13px] text-text-muted leading-[1.4] mb-auto line-clamp-2">
                  {deal.description}
                </p>
                <div className="font-black text-[15px] text-text-main mt-4 font-inter tracking-tight">
                  Rs {deal.price}
                </div>
              </div>

              {/* Overlapping Button */}
              <button
                onClick={(e) => { e.stopPropagation(); openModal(deal); }}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-accent text-white py-[8px] px-5 rounded-[6px] font-bold text-[12px] cursor-pointer whitespace-nowrap tracking-wider hover:brightness-90 transition-all border-none"
              >
                + ADD TO BUCKET
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopDeals;
