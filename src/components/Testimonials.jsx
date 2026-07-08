import React, { useState, useEffect } from "react";
import { useTenant } from "../context/TenantContext";

const Testimonials = () => {
  const tenant = useTenant();
  const testimonials = tenant.testimonials || [];

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextTestimonial = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevTestimonial = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToTestimonial = (index) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const currentTestimonial = testimonials[currentIndex];

  // Auto-advance every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial();
    }, 6000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div className="w-full bg-[#f2f4f7] relative py-20 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 md:px-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 
            className="bungee-regular text-3xl md:text-4xl text-text-main uppercase tracking-tight mb-4"
          >
            Come and join Our Happy Customers
          </h2>
          <div className="w-[60px] h-[4px] bg-accent mx-auto rounded-full"></div>
        </div>

        {/* Testimonial Carousel */}
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          {/* Left: Testimonial Content */}
          <div className="flex-1 w-full">
            <div 
              className={`bg-white rounded-2xl p-8 md:p-12 shadow-lg transition-all duration-500 ${
                isAnimating ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'
              }`}
            >
              {/* Quote Icon */}
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-6">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-accent">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>

              {/* Testimonial Text */}
              <p className="text-lg md:text-xl text-text-main leading-relaxed mb-6 font-medium">
                {currentTestimonial.text}
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-3 mb-4">
                <div className="font-bold text-text-main text-lg">
                  {currentTestimonial.author}
                </div>
              </div>

              {/* Star Rating */}
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    viewBox="0 0 24 24"
                    fill={i < currentTestimonial.rating ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5 text-yellow-400"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Profile Images Carousel */}
          <div className="flex-1 w-full">
            <div className="relative">
              {/* Main Profile Image */}
              <div 
                className={`relative w-48 h-48 md:w-64 md:h-64 mx-auto rounded-full overflow-hidden border-4 border-white shadow-xl transition-all duration-500 ${
                  isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                }`}
              >
                <img
                  src={currentTestimonial.image}
                  alt={currentTestimonial.author}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Navigation Arrows */}
              <div className="flex justify-center gap-4 mt-8">
                <button
                  onClick={prevTestimonial}
                  className="w-12 h-12 rounded-full bg-white border-2 border-accent flex items-center justify-center hover:bg-accent hover:text-white transition-all duration-300 shadow-md group"
                  disabled={isAnimating}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5 text-accent group-hover:text-white"
                  >
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>

                <button
                  onClick={nextTestimonial}
                  className="w-12 h-12 rounded-full bg-white border-2 border-accent flex items-center justify-center hover:bg-accent hover:text-white transition-all duration-300 shadow-md group"
                  disabled={isAnimating}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5 text-accent group-hover:text-white"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>

              {/* Dots Indicator */}
              <div className="flex justify-center gap-2 mt-6">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentIndex ? 'bg-accent w-8' : 'bg-gray-300'
                    }`}
                    disabled={isAnimating}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
