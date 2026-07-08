import React, { useState, useMemo } from "react";
import { useTenant } from "../context/TenantContext";

const Gallery = () => {
  const tenant = useTenant();
  const gallery = tenant.gallery || [];
  const [selectedImage, setSelectedImage] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Limit to 6 images
  const galleryImages = gallery.slice(0, 6);

  if (!galleryImages || galleryImages.length === 0) {
    return null;
  }

  // Generate alternating rotations: -15°, +15°, -15°, +15°, etc.
  const cardStyles = useMemo(() => {
    const styles = [];
    
    for (let i = 0; i < galleryImages.length; i++) {
      styles.push({
        rotation: i % 2 === 0 ? -15 : 15, // Alternating -15 and +15 degrees
        zIndex: i
      });
    }
    
    return styles;
  }, [galleryImages.length]);

  const handleCardHover = (index, isHovering) => {
    setHoveredIndex(isHovering ? index : null);
  };

  return (
    <section className="w-full bg-[#f2f4f7] relative py-16 md:py-24 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 md:px-12">
        {/* Header */}
        <header className="mb-12 md:mb-16 text-center">
          {/* Pill Badge */}
          <div className="inline-block bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wider mb-4">
            Our Moments
          </div>
          {/* Heading */}
          <h2 
            className="bungee-regular text-3xl md:text-4xl lg:text-5xl text-text-main uppercase tracking-tight mb-4"
          >
            Gallery
          </h2>
          <div className="w-[60px] h-[4px] bg-accent mx-auto rounded-full"></div>
        </header>

        {/* Polaroid Gallery - Desktop/Tablet */}
        <div className="hidden md:block">
          <div className="flex items-center justify-center gap-8">
            {galleryImages.map((item, index) => {
              const style = cardStyles[index];
              const isHovered = hoveredIndex === index;
              
              return (
                <div
                  key={index}
                  className="cursor-pointer transition-all duration-500 ease-out"
                  style={{
                    transform: `rotate(${isHovered ? style.rotation * 0.3 : style.rotation}deg) scale(${isHovered ? 1.05 : 1})`,
                    zIndex: isHovered ? 100 : style.zIndex,
                    transformOrigin: 'center center'
                  }}
                  onMouseEnter={() => handleCardHover(index, true)}
                  onMouseLeave={() => handleCardHover(index, false)}
                  onClick={() => setSelectedImage(item.image)}
                >
                  {/* Polaroid Card */}
                  <div 
                    className="bg-white rounded-2xl p-3 shadow-lg"
                    style={{
                      boxShadow: isHovered 
                        ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' 
                        : '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    {/* Image Area - Square 1:1, 150px */}
                    <div 
                      className="relative overflow-hidden rounded-xl mb-3"
                      style={{ width: '150px', height: '150px' }}
                    >
                      <img
                        src={item.image}
                        alt={item.caption || `Gallery ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Label Area */}
                    <div className="bg-white py-3 px-2 text-center">
                      <p className="text-text-main font-medium text-sm md:text-base truncate" style={{ width: '150px' }}>
                        {item.caption || `Photo ${index + 1}`}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile - Horizontal Scrollable Carousel */}
        <div className="md:hidden">
          <div className="flex items-center justify-center gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide px-4">
            {galleryImages.map((item, index) => {
              const style = cardStyles[index];
              const isHovered = hoveredIndex === index;
              
              return (
                <div
                  key={index}
                  className="flex-shrink-0 snap-start cursor-pointer transition-all duration-500 ease-out"
                  style={{
                    transform: `rotate(${style.rotation}deg) scale(${isHovered ? 1.05 : 1})`,
                    zIndex: isHovered ? 100 : style.zIndex,
                    transformOrigin: 'center center'
                  }}
                  onTouchStart={() => handleCardHover(index, true)}
                  onTouchEnd={() => handleCardHover(index, false)}
                  onClick={() => setSelectedImage(item.image)}
                >
                  {/* Polaroid Card */}
                  <div className="bg-white rounded-2xl p-3 shadow-lg">
                    {/* Image Area - Square 1:1, 150px */}
                    <div 
                      className="relative overflow-hidden rounded-xl mb-3"
                      style={{ width: '150px', height: '150px' }}
                    >
                      <img
                        src={item.image}
                        alt={item.caption || `Gallery ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Label Area */}
                    <div className="bg-white py-3 px-2 text-center">
                      <p className="text-text-main font-medium text-sm truncate" style={{ width: '150px' }}>
                        {item.caption || `Photo ${index + 1}`}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-[10000] flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
            onClick={() => setSelectedImage(null)}
            aria-label="Close lightbox"
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
    </section>
  );
};

export default Gallery;
