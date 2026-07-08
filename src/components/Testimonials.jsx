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
  const imageRef = useRef(null);
  const railRef = useRef([]);
  const progressRef = useRef(null);
  const progressTweenRef = useRef(null);
  const transitionTweenRef = useRef(null);
  const prefersReducedMotion = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    railRef.current = railRef.current.slice(0, testimonials.length);
  }, [testimonials.length]);

  // Vertical slide: the whole spotlight block exits upward and vanishes
  // (clipped by the overflow-hidden wrapper), then the new testimonial's
  // content is dropped in below the fold and animates up into place.
  // The actual data swap happens mid-timeline via tl.call(), once the old
  // content has already scrolled out of the clipped area.
  const animateTransition = useCallback((newIndex) => {
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

    const tl = gsap.timeline({ onComplete: () => setIsAnimating(false) });

    tl.to(content, {
      y: -500,
      opacity: 0,
      duration: 0.45,
      ease: "power2.in",
    })
      .call(() => setCurrentIndex(newIndex))
      .set(content, { y: 500 })
      .to(content, {
        y: 0,
        opacity: 1,
        duration: 0.55,
        ease: "power3.out",
      });

    // A little extra polish once the block has landed: stars settle in
    // just after the slide, instead of arriving stiffly with everything else
    const stars = cardRef.current?.querySelectorAll("[data-star]");
    if (stars?.length) {
      tl.fromTo(
        stars,
        { opacity: 0, scale: 0.4 },
        { opacity: 1, scale: 1, duration: 0.3, stagger: 0.05, ease: "back.out(2)" },
        "-=0.2"
      );
    }

    transitionTweenRef.current = tl;
  }, []);

  const changeTestimonial = useCallback(
    (newIndex) => {
      if (isAnimating || newIndex === currentIndex) return;
      setIsAnimating(true);
      animateTransition(newIndex);
    },
    [currentIndex, isAnimating, animateTransition]
  );

  const nextTestimonial = useCallback(() => {
    changeTestimonial((currentIndex + 1) % testimonials.length);
  }, [currentIndex, testimonials.length, changeTestimonial]);

  const prevTestimonial = useCallback(() => {
    changeTestimonial((currentIndex - 1 + testimonials.length) % testimonials.length);
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
      className="w-full bg-[var(--color-bg-card)] relative py-16 md:py-24 overflow-hidden"
      aria-label="Customer testimonials"
    >
      <div className="max-w-[1100px] mx-auto px-4 md:px-12">
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
          {/* Spotlight: photo + overlapping quote card.
              overflow-hidden here is the clip mask for the vertical slide —
              contentRef is the block that actually translates up/down;
              its natural (untransformed) height is what sizes this wrapper,
              so anything that slides past y:-500 or in from y:500 gets cut off. */}
          <div className="relative overflow-hidden">
            <div
              ref={contentRef}
              className="flex flex-col md:flex-row items-start"
            >
              <div
                ref={imageRef}
                className="relative w-full md:w-[42%] aspect-[4/5] md:aspect-auto md:h-[420px] rounded-3xl overflow-hidden shadow-[0_20px_25px_-5px_var(--color-shadow)] flex-shrink-0"
              >
                <img
                  src={currentTestimonial.image}
                  alt={currentTestimonial.author}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <p
                  data-author
                  className="absolute left-4 bottom-4 text-white font-semibold text-sm md:text-base"
                >
                  {currentTestimonial.author}
                </p>
              </div>

              <article
                ref={cardRef}
                className="bg-white rounded-3xl p-8 md:p-10 shadow-[0_20px_25px_-5px_var(--color-shadow)] md:-ml-10 md:mt-10 md:w-[58%] z-10"
                aria-live="polite"
              >
                <div className="bg-[var(--color-secondary-soft)] w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <svg
                    data-quote-mark
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-8 h-8 text-accent"
                    aria-hidden="true"
                  >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>

                <blockquote
                  data-quote-text
                  className="text-lg md:text-xl text-text-main leading-relaxed mb-6 font-medium"
                >
                  "{currentTestimonial.text}"
                </blockquote>

                <div
                  className="flex gap-1.5"
                  aria-label={`Rating: ${currentTestimonial.rating} out of 5 stars`}
                >
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      data-star
                      viewBox="0 0 24 24"
                      fill={i < currentTestimonial.rating ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth="2"
                      className="w-5 h-5 text-yellow-400"
                      aria-hidden="true"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
              </article>
            </div>
          </div>

          {/* Avatar rail + controls + progress */}
          <div className="flex items-center gap-4 mt-8 md:mt-10">
            <div
              className="flex gap-3 overflow-x-auto flex-1 py-2 px-1 scrollbar-hide"
              role="tablist"
              aria-label="Choose a testimonial"
            >
              {testimonials.map((testimonial, index) => (
                <button
                  key={testimonial.id || index}
                  ref={(el) => (railRef.current[index] = el)}
                  onClick={() => changeTestimonial(index)}
                  role="tab"
                  aria-selected={index === currentIndex}
                  aria-label={`View testimonial from ${testimonial.author}`}
                  className={`relative flex-shrink-0 rounded-full overflow-hidden transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 ${
                    index === currentIndex
                      ? "w-12 h-12 ring-2 ring-accent ring-offset-2"
                      : "w-9 h-9 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={testimonial.image}
                    alt=""
                    aria-hidden="true"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={prevTestimonial}
                disabled={isAnimating}
                aria-label="Previous testimonial"
                className="w-10 h-10 rounded-full border-2 border-accent flex items-center justify-center hover:bg-accent hover:text-white transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                onClick={nextTestimonial}
                disabled={isAnimating}
                aria-label="Next testimonial"
                className="w-10 h-10 rounded-full border-2 border-accent flex items-center justify-center hover:bg-accent hover:text-white transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>

          {/* Autoplay progress bar — replaces the dot pagination */}
          <div
            className="h-[3px] w-full bg-gray-200 rounded-full mt-4 overflow-hidden"
            aria-hidden="true"
          >
            <div
              ref={progressRef}
              className="h-full bg-accent rounded-full origin-left"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;