import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useTenant } from "../context/TenantContext";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const AboutUs = () => {
  const tenant = useTenant();
  const about = tenant.about || {};
  const sectionRef = useRef(null);
  const statRefs = useRef([]);
  gsap.registerPlugin(ScrollTrigger);

  const {
    enabled,
    headline = "About Us",
    description = "",
    story = "",
    image,
    stats = [],
  } = about;

  // GSAP entrance sequence + stat count-up.
  // Guarded internally — safe to call even when the section won't render.
  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
        defaults: { ease: "power2.out" },
      });

      if (reduceMotion) {
        gsap.set(
          [
            ".about-frame",
            ".about-image img",
            ".about-content > *",
            ".about-stat",
          ],
          { clearProps: "all" },
        );
      } else {
        tl.from(".about-frame", { opacity: 0, duration: 0.5 }, "<0.2")
          .fromTo(
            ".about-image img",
            { clipPath: "inset(0 100% 0 0)" },
            { clipPath: "inset(0 0% 0 0)", duration: 1, ease: "power3.inOut" },
            "<",
          )
          .from(
            ".about-content > *",
            { opacity: 0, y: 14, duration: 0.6, stagger: 0.08 },
            "<0.2",
          )
          .from(
            ".about-stat",
            { opacity: 0, y: 10, duration: 0.5, stagger: 0.06 },
            "-=0.25",
          );
      }

      statRefs.current.forEach((el, i) => {
        if (!el) return;
        const rawValue = stats[i]?.value ?? "0";
        const finalValue = parseFloat(rawValue) || 0;
        const suffix = String(rawValue).replace(/[0-9.]/g, ""); // keeps "+", "%", etc.

        const counter = { val: 0 };
        gsap.to(counter, {
          val: finalValue,
          duration: reduceMotion ? 0 : 1.4,
          ease: "power1.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
          onUpdate: () => {
            el.textContent = Math.round(counter.val) + suffix;
          },
        });
      });
    },
    { scope: sectionRef, dependencies: [stats] },
  );

  if (!enabled) return null;

  const statsCols =
    stats.length === 1
      ? "grid-cols-1"
      : stats.length === 2
        ? "grid-cols-2"
        : stats.length === 3
          ? "grid-cols-3"
          : "grid-cols-2 md:grid-cols-4";

  return (
    <section
      id="about"
      ref={sectionRef}
      className="w-full bg-[var(--color-page-bg)] py-24 md:py-32 overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Eyebrow + headline */}
        <div className="mb-16 md:mb-20 max-w-3xl">
          <h2 className="bungee-regular text-3xl md:text-4xl lg:text-5xl text-text-main leading-[0.95] tracking-tight">
            {headline}
          </h2>
        </div>

        {/* Content */}
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-y-14 lg:gap-x-12">
          {/* Spine — ties the two columns together on large screens */}
          <div className="hidden lg:block absolute left-[calc(41.666%+1.5rem)] top-2 bottom-2 w-px bg-[var(--color-border)]">
            <span className="absolute -left-[3px] top-0 w-[7px] h-[7px] rounded-full bg-accent" />
          </div>

          {/* Left: Image */}
          {image && (
            <div className="lg:col-span-5">
              <div className="about-image relative group">
                <div className="about-frame absolute -inset-3 border border-accent/30 rounded-sm -z-10 translate-x-3 translate-y-3" />
                <div className="relative overflow-hidden rounded-sm bg-[var(--color-surface)] aspect-[4/5] shadow-[0_20px_25px_-5px_var(--color-shadow)]">
                  <img
                    src={image}
                    alt="About us"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Right: Text content */}
          <div
            className={`about-content ${
              image ? "lg:col-span-6 lg:col-start-7" : "lg:col-span-8"
            } flex flex-col`}
          >
            {description && (
              <p className="text-xl leading-relaxed text-text-main font-medium">
                {description}
              </p>
            )}

            {story && (
              <div
                className={
                  description
                    ? "mt-10 pt-10 border-t border-[var(--color-border)]"
                    : ""
                }
              >
                <span className="block text-xs uppercase tracking-[0.2em] text-accent font-semibold mb-3">
                  Our story
                </span>
                <p className="text-base text-text-muted leading-relaxed">
                  {story}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Stats — hairline grid instead of boxed cards */}
        {stats.length > 0 && (
          <div
            className={`grid ${statsCols} gap-px bg-[var(--color-border)] mt-20 rounded-sm overflow-hidden`}
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                className="about-stat bg-[var(--color-surface)] px-6 py-8 md:px-8 md:py-10 flex flex-col gap-2"
              >
                <div
                  ref={(el) => (statRefs.current[index] = el)}
                  className="font-black text-3xl md:text-4xl tabular-nums text-text-main"
                >
                  0
                </div>
                <div className="text-xs uppercase tracking-[0.15em] text-[var(--color-text-light)]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AboutUs;
