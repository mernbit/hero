// import React from "react";
// import { useTenant } from "../context/TenantContext";

// const AboutUs = () => {
//   const tenant = useTenant();
//   const about = tenant.about || {};

//   if (!about || !about.enabled) {
//     return null;
//   }

//   const {
//     headline = "About Us",
//     description = "",
//     story = "",
//     image,
//     stats = []
//   } = about;

//   return (
//     <div className="w-full bg-[var(--color-page-bg)] relative py-20 overflow-hidden">
//       <div className="max-w-[1440px] mx-auto px-4 md:px-12">
//         {/* Header */}
//         <div className="mb-12 text-center">
//           <h2
//             className="bungee-regular text-3xl md:text-4xl text-text-main uppercase tracking-tight mb-4"
//           >
//             {headline}
//           </h2>
//           <div className="w-[60px] h-[4px] bg-accent mx-auto rounded-full"></div>
//         </div>

//         {/* Content */}
//         <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
//           {/* Left: Image */}
//           {image && (
//             <div className="flex-1 w-full">
//               <div className="relative rounded-2xl overflow-hidden shadow-[0_20px_25px_-5px_var(--color-shadow)]">
//                 <img
//                   src={image}
//                   alt="About us"
//                   className="w-full h-auto object-cover"
//                 />
//               </div>
//             </div>
//           )}

//           {/* Right: Content */}
//           <div className="flex-1 w-full">
//             <div className="bg-[var(--color-surface)] rounded-2xl p-8 md:p-12 shadow-[0_10px_15px_-3px_var(--color-shadow)]">
//               {/* Description */}
//               {description && (
//                 <p className="text-lg text-text-main leading-relaxed mb-8">
//                   {description}
//                 </p>
//               )}

//               {/* Story */}
//               {story && (
//                 <div className="mb-8">
//                   <h3 className="font-bold text-xl text-text-main mb-4">Our Story</h3>
//                   <p className="text-base text-text-muted leading-relaxed">
//                     {story}
//                   </p>
//                 </div>
//               )}

//               {/* Stats */}
//               {stats && stats.length > 0 && (
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-[var(--color-border)]">
//                   {stats.map((stat, index) => (
//                     <div key={index} className="text-center">
//                       <div className="font-black text-3xl md:text-4xl text-accent mb-1">
//                         {stat.value}
//                       </div>
//                       <div className="text-sm text-text-muted uppercase tracking-wide">
//                         {stat.label}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AboutUs;

import React, { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useTenant } from "../context/TenantContext";

const AboutUs = () => {
  const tenant = useTenant();
  const about = tenant.about || {};

  const sectionRef = useRef(null);
  const statRefs = useRef([]);

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
            ".about-eyebrow",
            ".about-headline",
            ".about-frame",
            ".about-image img",
            ".about-content > *",
            ".about-stat",
          ],
          { clearProps: "all" },
        );
      } else {
        tl.from(".about-eyebrow", { opacity: 0, x: -16, duration: 0.5 })
          .from(".about-headline", { opacity: 0, y: 22, duration: 0.7 }, "<0.1")
          .from(".about-frame", { opacity: 0, duration: 0.5 }, "<0.2")
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
                  description ? "mt-10 pt-10 border-t border-[var(--color-border)]" : ""
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
