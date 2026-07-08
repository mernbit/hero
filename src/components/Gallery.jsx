import React, { useState } from "react";
import { useTenant } from "../context/TenantContext";

const Gallery = () => {
  const tenant = useTenant();
  const gallery = tenant.gallery || [];
  const [selectedImage, setSelectedImage] = useState(null);

  if (!gallery || gallery.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-[#f2f4f7] relative py-16 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 md:px-12">
        {/* Header */}
        <div className="mb-10 flex flex-col items-start">
          <h2 
            className="font-black bungee-regular text-3xl md:text-4xl text-text-main uppercase tracking-tight" 
            style={{ letterSpacing: "-0.5px" }}
          >
            Gallery
          </h2>
          <div className="w-[35px] h-[3px] bg-accent mt-1.5"></div>
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {gallery.map((item, index) => (
            <div
              key={index}
              onClick={() => setSelectedImage(item.image)}
              className={`relative overflow-hidden rounded-lg cursor-pointer group ${
                index === 0 ? 'col-span-2 row-span-2' : ''
              }`}
              style={{ height: index === 0 ? '400px' : '200px' }}
            >
              <img
                src={item.image}
                alt={item.caption || `Gallery ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
              {item.caption && (
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-sm font-medium">{item.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-[10000] flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <img
            src={selectedImage}
            alt="Selected gallery image"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default Gallery;
