import React, { useState, useEffect, useRef, useCallback } from "react";
import { useTenant } from "../context/TenantContext";
import gsap from "gsap";

const AUTOPLAY_MS = 5000;

const Testimonials = () => {
  const tenant = useTenant();
  const testimonials = tenant.testimonials || [];

  // --- all hooks run unconditionally, every render ---
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const contentRef = useRef(null);
  const cardRef = useRef(null);
  const railRef = useRef([]);
  const progressRef = useRef(null);
  const progressTweenRef = useRef(null);
  const transitionTweenRef = useRef(null);
  const prefersReducedMotion = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    railRef.current = railRef.current.slice(0, testimonials.length);
  }, [testimonials.length]);

  // Card slides horizontally based on direction.
  // Data swap happens mid-timeline via tl.call(), once the outgoing card
  // is fully hidden.
  const animateTransition = useCallback((newIndex, direction = "next") => {
    transitionTweenRef.current?.kill();

    const content = contentRef.current;
    if (!content) {
      setCurrentIndex(newIndex);
      setIsAnimating(false);
      return;
    }

    if (prefersReducedMotion.current) {
      setCurrentIndex(newIndex);
      setIsAnimating(false);
      return;
    }

    const isNext = direction === "next";
    const exitX = isNext ? 500 : -500;
    const enterX = isNext ? -500 : 500;

    const tl = gsap.timeline({ onComplete: () => setIsAnimating(false) });

    tl.to(content, {
      x: exitX,
      duration: 0.35,
      ease: "power2.in",
    })
      .call(() => setCurrentIndex(newIndex))
      .set(content, { x: enterX })
      .to(content, {
        x: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power3.out",
      });

    // Stars settle in just after the card lands
    const stars = cardRef.current?.querySelectorAll("[data-star]");
    if (stars?.length) {
      tl.fromTo(
        stars,
        { opacity: 0, scale: 0.4 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          stagger: 0.05,
          ease: "back.out(2)",
        },
        "-=0.2",
      );
    }

    transitionTweenRef.current = tl;
  }, []);

  const changeTestimonial = useCallback(
    (newIndex, direction = "next") => {
      if (isAnimating || newIndex === currentIndex) return;
      setIsAnimating(true);
      animateTransition(newIndex, direction);
    },
    [currentIndex, isAnimating, animateTransition],
  );

  const nextTestimonial = useCallback(() => {
    changeTestimonial((currentIndex + 1) % testimonials.length, "next");
  }, [currentIndex, testimonials.length, changeTestimonial]);

  const prevTestimonial = useCallback(() => {
    changeTestimonial(
      (currentIndex - 1 + testimonials.length) % testimonials.length,
      "prev",
    );
  }, [currentIndex, testimonials.length, changeTestimonial]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") prevTestimonial();
      if (e.key === "ArrowRight") nextTestimonial();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prevTestimonial, nextTestimonial]);

  // Autoplay + its visual progress bar, driven by ONE gsap tween instead of setInterval math
  useEffect(() => {
    if (testimonials.length <= 1) return;

    if (isPaused) {
      progressTweenRef.current?.pause();
      return;
    }

    if (progressRef.current) {
      gsap.set(progressRef.current, { scaleX: 0 });
      progressTweenRef.current = gsap.to(progressRef.current, {
        scaleX: 1,
        duration: AUTOPLAY_MS / 1000,
        ease: "none",
        onComplete: nextTestimonial,
      });
    }

    return () => progressTweenRef.current?.kill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, isPaused, testimonials.length]);

  // Basic swipe support — carousels on mobile need this more than arrow buttons
  const touchStartX = useRef(null);
  const handleTouchStart = (e) => (touchStartX.current = e.touches[0].clientX);
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) {
      delta < 0 ? nextTestimonial() : prevTestimonial();
    }
    touchStartX.current = null;
  };

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section
      className="w-full bg-bg-card relative py-16 md:py-24 overflow-hidden"
      aria-label="Customer testimonials"
    >
      {/* Ambient background blobs */}
      <div className="pointer-events-none absolute -top-16 -left-16 w-72 h-72 rounded-full bg-(--color-text-light)/10 blur-2xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-96 h-96 rounded-full bg-(--color-text-light)/10 blur-2xl translate-x-1/4 translate-y-1/4" />

      <div className="max-w-[720px] mx-auto px-4 md:px-6 relative">
        <header className="mb-12 md:mb-16 text-center">
          <p className="text-sm md:text-base text-text-muted uppercase tracking-widest mb-2">
            Come and join
          </p>
          <h2 className="bungee-regular text-3xl md:text-4xl lg:text-5xl text-text-main uppercase tracking-tight mb-4">
            Our Happy Customers
          </h2>
          <div className="w-[60px] h-[4px] bg-accent mx-auto rounded-full" />
        </header>

        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Card zone — sized generously so the quote-bubble accents have room to sit outside the card edges */}
          <div className="relative px-6 pt-6 pb-8 md:px-10 md:pt-10 md:pb-12 min-h-[400px]">
            <div ref={contentRef}>
              <article
                ref={cardRef}
                className="relative bg-white rounded-[28px] px-8 py-12 md:px-14 md:py-14 shadow-[0_25px_50px_-12px_var(--color-shadow)] -rotate-1"
                aria-live="polite"
              >
                {/* Big quote bubble, top right */}
                <div
                  className="absolute -top-6 -right-5 md:-top-7 md:-right-7 w-16 h-16 md:w-20 md:h-20 bg-accent flex items-center justify-center shadow-lg"
                  style={{ borderRadius: "50% 50% 4px 50%" }}
                  aria-hidden="true"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-7 h-7 md:w-9 md:h-9 text-white"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>

                {/* Small comma bubble, bottom left */}
                <div
                  className="absolute -bottom-5 -left-5 md:-bottom-6 md:-left-6 w-10 h-10 md:w-12 md:h-12 bg-accent shadow-md"
                  style={{ borderRadius: "50% 4px 50% 50%" }}
                  aria-hidden="true"
                />

                <blockquote
                  data-quote-text
                  className="text-lg md:text-xl text-text-muted italic text-center leading-relaxed mb-8"
                >
                  {currentTestimonial.text}
                </blockquote>

                <div
                  className="flex gap-1.5 justify-center mb-4"
                  aria-label={`Rating: ${currentTestimonial.rating} out of 5 stars`}
                >
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      data-star
                      viewBox="0 0 24 24"
                      fill={
                        i < currentTestimonial.rating ? "currentColor" : "none"
                      }
                      stroke="currentColor"
                      strokeWidth="2"
                      className="w-5 h-5 text-yellow-400"
                      aria-hidden="true"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>

                <p className="text-center text-accent italic font-semibold text-base md:text-lg">
                  {currentTestimonial.author}
                  {currentTestimonial.role && (
                    <span className="block text-sm text-text-muted not-italic font-normal mt-0.5">
                      {currentTestimonial.role}
                    </span>
                  )}
                </p>
              </article>
            </div>
          </div>

          {/* Avatar rail + controls + progress */}
          <div className="flex items-center gap-4 mt-4 md:mt-6">
            {/* Autoplay progress bar — replaces the dot pagination
            <div
              className="h-[3px] w-full max-w-[400px] mx-auto bg-gray-200 rounded-full mt-4 overflow-hidden"
              aria-hidden="true"
            >
              <div
                ref={progressRef}
                className="h-full bg-accent rounded-full origin-left"
                style={{ transform: "scaleX(0)" }}
              />
            </div> */}
            <div className="w-full flex justify-center">
              <div className="flex gap-2  shrink-0">
                <button
                  onClick={nextTestimonial}
                  disabled={isAnimating}
                  aria-label="Previous testimonial"
                  className="w-10 h-10 rounded-full border-2 border-accent flex items-center justify-center hover:bg-accent hover:text-white transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-4 h-4"
                  >
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <button
                  onClick={prevTestimonial}
                  disabled={isAnimating}
                  aria-label="Next testimonial"
                  className="w-10 h-10 rounded-full border-2 border-accent flex items-center justify-center hover:bg-accent hover:text-white transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-4 h-4"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
