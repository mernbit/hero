import React from "react";
import { useTenant } from "../context/TenantContext";

const BookATable = () => {
  const tenant = useTenant();
  const bookATable = tenant.bookATable || {};

  if (!bookATable || !bookATable.enabled) {
    return null;
  }

  const {
    headline = "HUNGRY? WE ARE READY.",
    subtext = "Book a table or order now - your next meal is waiting.",
    buttonText = "BOOK A TABLE",
    leftImage,
    rightImage,
    backgroundColor = tenant.theme?.accent || "#1a1a2e"
  } = bookATable;

  return (
    <div 
      className="w-full relative py-20 overflow-hidden"
      style={{ backgroundColor }}
    >
      {/* Abstract Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/15 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-white/18 rounded-full blur-xl"></div>
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-white/12 rounded-full blur-2xl"></div>
        <div className="absolute bottom-1/3 left-1/3 w-56 h-56 bg-white/14 rounded-full blur-2xl"></div>
        {/* Geometric shapes */}
        <div className="absolute top-10 right-1/3 w-20 h-20 bg-white/12 rotate-45 rounded-lg"></div>
        <div className="absolute bottom-1/4 right-10 w-16 h-16 bg-white/12 rotate-12 rounded-full"></div>
        <div className="absolute top-1/2 right-10 w-24 h-24 bg-white/10 -rotate-12 rounded-lg"></div>
        <div className="absolute bottom-10 left-1/4 w-12 h-12 bg-white/14 rotate-45 rounded-lg"></div>
        {/* Additional mobile-friendly shapes */}
        <div className="absolute top-1/4 left-1/2 w-16 h-16 bg-white/8 rounded-full blur-lg md:hidden"></div>
        <div className="absolute bottom-1/4 right-1/2 w-20 h-20 bg-white/8 rounded-full blur-lg md:hidden"></div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Image */}
          {leftImage && (
            <div className="flex-1 flex justify-center lg:justify-start order-2 lg:order-1">
              <img
                src={leftImage}
                alt="Food display"
                className="max-w-[200px] sm:max-w-[280px] md:max-w-[350px] lg:max-w-[400px] h-auto object-contain drop-shadow-2xl"
              />
            </div>
          )}

          {/* Center Content */}
          <div className="flex-1 text-center lg:text-left max-w-xl order-1 lg:order-2">
            <h2
              className="bungee-regular text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white uppercase tracking-tight mb-4 md:mb-6 leading-tight"
              style={{ letterSpacing: "-1px" }}
            >
              {headline}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 md:mb-8 leading-relaxed">
              {subtext}
            </p>
            <button
              className="bg-white text-accent font-bold text-xs sm:text-sm md:text-base py-3 md:py-4 px-6 md:px-8 rounded-lg cursor-pointer hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl tracking-wider uppercase"
              style={{ color: backgroundColor }}
            >
              {buttonText}
            </button>
          </div>

          {/* Right Image */}
          {rightImage && (
            <div className="flex-1 flex justify-center lg:justify-end order-3 lg:order-3">
              <img
                src={rightImage}
                alt="Food display"
                className="max-w-[200px] sm:max-w-[280px] md:max-w-[350px] lg:max-w-[400px] h-auto object-contain drop-shadow-2xl"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookATable;
