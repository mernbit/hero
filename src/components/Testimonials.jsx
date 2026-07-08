import React, { useState, useEffect, useRef, useCallback } from "react";
import { useTenant } from "../context/TenantContext";
import gsap from "gsap";

const Testimonials = () => {
  const tenant = useTenant();
  const testimonials = tenant.testimonials || [];

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const cardRef = useRef(null);
  const imageRefs = useRef([]);
  const containerRef = useRef(null);

  // Initialize refs array
  useEffect(() => {
    imageRefs.current = imageRefs.current.slice(0, testimonials.length);
  }, [testimonials.length]);

  const animateCardTransition = useCallback(() => {
    if (!cardRef.current) return;
    
    const tl = gsap.timeline({
      onComplete: () => setIsAnimating(false)
    });

    tl.to(cardRef.current, {
      opacity: 0,
      x: -30,
      duration: 0.3,
      ease: "power2.in"
    })
    .set(cardRef.current, {
      x: 30
    })
    .to(cardRef.current, {
      opacity: 1,
      x: 0,
      duration: 0.4,
      ease: "power2.out"
    });
  }, []);

  const animateImageHighlight = useCallback((prevIndex, newIndex) => {
    const prevImage = imageRefs.current[prevIndex];
    const newImage = imageRefs.current[newIndex];

    if (prevImage) {
      gsap.to(prevImage, {
        scale: 1,
        borderColor: "transparent",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        duration: 0.3,
        ease: "power2.out"
      });
    }

    if (newImage) {
      gsap.fromTo(newImage,
        { scale: 1 },
        {
          scale: 1.1,
          borderColor: "var(--color-accent)",
          boxShadow: "0 0 0 4px var(--color-accent), 0 10px 25px -5px rgba(0, 0, 0, 0.2)",
          duration: 0.4,
          ease: "back.out(1.7)"
        }
      );
    }
  }, []);

  const changeTestimonial = useCallback((newIndex) => {
    if (isAnimating || newIndex === currentIndex) return;
    
    setIsAnimating(true);
    const prevIndex = currentIndex;
    setCurrentIndex(newIndex);
    
    animateCardTransition();
    animateImageHighlight(prevIndex, newIndex);
  }, [currentIndex, isAnimating, animateCardTransition, animateImageHighlight]);

  const nextTestimonial = useCallback(() => {
    changeTestimonial((currentIndex + 1) % testimonials.length);
  }, [currentIndex, testimonials.length, changeTestimonial]);

  const prevTestimonial = useCallback(() => {
    changeTestimonial((currentIndex - 1 + testimonials.length) % testimonials.length);
  }, [currentIndex, testimonials.length, changeTestimonial]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        prevTestimonial();
      } else if (e.key === 'ArrowRight') {
        nextTestimonial();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevTestimonial, nextTestimonial]);

  // Autoplay with pause on hover
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      nextTestimonial();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentIndex, isPaused, nextTestimonial]);

  // Initial animation for first testimonial
  useEffect(() => {
    if (imageRefs.current[0]) {
      gsap.set(imageRefs.current[0], {
        borderColor: "var(--color-accent)",
        boxShadow: "0 0 0 4px var(--color-accent), 0 10px 25px -5px rgba(0, 0, 0, 0.2)",
        scale: 1.1
      });
    }
  }, []);

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section 
      className="w-full bg-[#f2f4f7] relative py-16 md:py-24 overflow-hidden"
      ref={containerRef}
      aria-label="Customer testimonials"
    >
      <div className="max-w-[1440px] mx-auto px-4 md:px-12">
        {/* Header */}
        <header className="mb-12 md:mb-16 text-center">
          <p className="text-sm md:text-base text-text-muted uppercase tracking-widest mb-2">
            Come and join
          </p>
          <h2 
            className="bungee-regular text-3xl md:text-4xl lg:text-5xl text-text-main uppercase tracking-tight mb-4"
          >
            Our Happy Customers
          </h2>
          <div className="w-[60px] h-[4px] bg-accent mx-auto rounded-full"></div>
        </header>

        {/* Testimonial Carousel */}
        <div 
          className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 overflow-x-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Left: Testimonial Content */}
          <div className="flex-1 w-full lg:w-1/2">
            <article 
              ref={cardRef}
              className="bg-white rounded-3xl p-8 md:p-12 lg:p-16 shadow-xl"
              aria-live="polite"
            >
              {/* Quote Icon */}
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-accent/10 flex items-center justify-center mb-6">
                <svg 
                  viewBox="0 0 24 24" 
                  fill="currentColor" 
                  className="w-6 h-6 md:w-8 md:h-8 text-accent"
                  aria-hidden="true"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>

              {/* Testimonial Text */}
              <blockquote className="text-lg md:text-xl lg:text-2xl text-text-main leading-relaxed mb-8 font-medium">
                "{currentTestimonial.text}"
              </blockquote>

              {/* Author Info */}
              <div className="flex items-center gap-4 mb-6">
                <cite className="font-bold text-lg md:text-xl text-text-main not-italic">
                  {currentTestimonial.author}
                </cite>
              </div>

              {/* Star Rating */}
              <div className="flex gap-1.5" aria-label={`Rating: ${currentTestimonial.rating} out of 5 stars`}>
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    viewBox="0 0 24 24"
                    fill={i < currentTestimonial.rating ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5 md:w-6 md:h-6 text-yellow-400"
                    aria-hidden="true"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
            </article>
          </div>

          {/* Right: Customer Profile Cards */}
          <div className="flex-1 w-full lg:w-1/2">
            <div className="relative">
              {/* Profile Images Grid */}
              <div className="grid grid-cols-3 gap-4 md:gap-6 mb-8">
                {testimonials.map((testimonial, index) => (
                  <button
                    key={testimonial.id || index}
                    ref={(el) => (imageRefs.current[index] = el)}
                    onClick={() => changeTestimonial(index)}
                    className={`relative aspect-square rounded-2xl overflow-hidden border-4 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 ${
                      index === currentIndex ? 'cursor-default' : 'cursor-pointer hover:scale-105'
                    }`}
                    style={{
                      borderColor: index === currentIndex ? 'var(--color-accent)' : 'transparent',
                      boxShadow: index === currentIndex 
                        ? '0 0 0 4px var(--color-accent), 0 10px 25px -5px rgba(0, 0, 0, 0.2)' 
                        : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      transform: index === currentIndex ? 'scale(1.1)' : 'scale(1)'
                    }}
                    aria-label={`View testimonial from ${testimonial.author}`}
                    aria-pressed={index === currentIndex}
                  >
                    <img
                      src={testimonial.image}
                      alt={testimonial.author}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Navigation Arrows */}
              <nav className="flex justify-center gap-4" aria-label="Testimonial navigation">
                <button
                  onClick={prevTestimonial}
                  className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white border-2 border-accent flex items-center justify-center hover:bg-accent hover:text-white transition-all duration-300 shadow-lg group disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                  disabled={isAnimating}
                  aria-label="Previous testimonial"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5 md:w-6 md:h-6 text-accent group-hover:text-white"
                    aria-hidden="true"
                  >
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>

                <button
                  onClick={nextTestimonial}
                  className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white border-2 border-accent flex items-center justify-center hover:bg-accent hover:text-white transition-all duration-300 shadow-lg group disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                  disabled={isAnimating}
                  aria-label="Next testimonial"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5 md:w-6 md:h-6 text-accent group-hover:text-white"
                    aria-hidden="true"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </nav>

              {/* Progress Indicator */}
              <div className="flex justify-center gap-2 mt-6" aria-label="Testimonial progress">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => changeTestimonial(index)}
                    className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 ${
                      index === currentIndex ? 'bg-accent w-8' : 'bg-gray-300 w-2 hover:bg-gray-400'
                    }`}
                    disabled={isAnimating}
                    aria-label={`Go to testimonial ${index + 1}`}
                    aria-current={index === currentIndex ? 'true' : 'false'}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
