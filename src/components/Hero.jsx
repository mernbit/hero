import React, { useRef, useState, useCallback } from "react";
import { useGSAP } from "@gsap/react";

import gsap from "gsap";
import Navbar from "./Navbar";
import { useTenant } from "../context/TenantContext";

/** Calculate scale needed for a 60px circle to cover the entire viewport */
const getRevealScale = () => {
  const diagonal = Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2);
  // Circle diameter = 60px, so radius = 30px. Scale = diagonal / 60 + buffer
  return Math.ceil(diagonal / 60) + 2;
};

let heroIntroPlayed = false;
const Hero = () => {
  const tenant = useTenant();
  const flavors = tenant.flavors;
  const [activeFlavor, setActiveFlavor] = useState(flavors[0]);
  const heroRef = useRef();
  document.title = tenant.name;
  // Refs for animated elements
  const revealCircleRef = useRef(null);
  const headingRef = useRef(null);
  const descRef = useRef(null);
  const buttonRef = useRef(null);
  const coneImgRef = useRef(null);
  const ghostImgRef = useRef(null);
  const imageMaskRef = useRef(null);
  const isAnimating = useRef(false);
  const wrapperRef = useRef(null);
  const particleRefs = useRef([]);
  const textMaskRef = useRef(null); // overflow-hidden container around heading+desc
  const textBlockRef = useRef(null); // wraps the REAL headingRef + descRef, this is what pushes in
  const ghostTextRef = useRef(null); // wraps the GHOST (old) heading + desc, this is what pushes out
  const ghostHeadingRef = useRef(null);
  const ghostDescRef = useRef(null);

  const scatterParticles = (particles, timeline, label) => {
    // 9 positions: 5 main + 4 sub-particles
    const positions = [
      {
        x: () => gsap.utils.random(-209, -114),
        y: () => gsap.utils.random(-209, -114),
      },
      {
        x: () => gsap.utils.random(114, 209),
        y: () => gsap.utils.random(-209, -114),
      },
      {
        x: () => gsap.utils.random(-209, -114),
        y: () => gsap.utils.random(-95, 95),
      },
      {
        x: () => gsap.utils.random(114, 209),
        y: () => gsap.utils.random(-95, 95),
      },
      {
        x: () => gsap.utils.random(-95, 95),
        y: () => gsap.utils.random(114, 209),
      },
      {
        x: () => gsap.utils.random(-180, -100),
        y: () => gsap.utils.random(-100, 100),
      },
      {
        x: () => gsap.utils.random(100, 180),
        y: () => gsap.utils.random(-100, 100),
      },
      {
        x: () => gsap.utils.random(-180, -100),
        y: () => gsap.utils.random(100, 180),
      },
      {
        x: () => gsap.utils.random(100, 180),
        y: () => gsap.utils.random(100, 180),
      },
    ];

    particles.forEach((p, i) => {
      const pos = positions[i];
      timeline.to(
        p,
        {
          x: pos.x(),
          y: pos.y(),
          rotation: gsap.utils.random(-30, 30),
          scale: gsap.utils.random(0.8, 1.1),
          opacity: 1,
          duration: gsap.utils.random(0.6, 1),
          ease: "back.out(1.2)",
        },
        `${label}+=${gsap.utils.random(0, 0.2)}`,
      );
    });
  };

  const retractParticles = (particles, timeline, label) => {
    particles.forEach((p) => {
      timeline.to(
        p,
        {
          x: 0,
          y: 0,
          scale: 0.5,
          opacity: 0,
          duration: gsap.utils.random(0.3, 0.5),
          ease: "power2.inOut",
        },
        `${label}+=${gsap.utils.random(0, 0.1)}`,
      );
    });
  };
  const setParticlesFinalState = () => {
    const positions = [
      {
        x: () => gsap.utils.random(-209, -114),
        y: () => gsap.utils.random(-209, -114),
      },
      {
        x: () => gsap.utils.random(114, 209),
        y: () => gsap.utils.random(-209, -114),
      },
      {
        x: () => gsap.utils.random(-209, -114),
        y: () => gsap.utils.random(-95, 95),
      },
      {
        x: () => gsap.utils.random(114, 209),
        y: () => gsap.utils.random(-95, 95),
      },
      {
        x: () => gsap.utils.random(-130, 130),
        y: () => gsap.utils.random(114, 209),
      },
      {
        x: () => gsap.utils.random(-180, -100),
        y: () => gsap.utils.random(-100, 100),
      },
      {
        x: () => gsap.utils.random(100, 180),
        y: () => gsap.utils.random(-100, 100),
      },
      {
        x: () => gsap.utils.random(-180, -100),
        y: () => gsap.utils.random(100, 180),
      },
      {
        x: () => gsap.utils.random(100, 180),
        y: () => gsap.utils.random(100, 180),
      },
    ];
    particleRefs.current.forEach((particle, i) => {
      const pos = positions[i];

      gsap.set(particle, {
        x: pos.x(),
        y: pos.y(),
        opacity: 1,
        scale: 1,
      });
    });
  };
  const playIntro = () => {
    const tl = gsap.timeline();

    // animations

    tl.from(
      "#img",
      {
        y: 500,
        // opacity: 0,
        duration: 0.6,
        // delay: 1,
        scale: 0.9,
      },
      1,
    )
      .addLabel("rotate", "+=1")
      .to(
        "#img img",
        {
          rotateZ: -10,
          //   delay: 0.5,
          duration: 1,
          ease: "power2.out",
          // ease: "power2",
        },
        "rotate",
      )
      .from(
        "#hero #left",
        {
          x: -550,
          //   opacity: 0,
          duration: 0.4,
          ease: "back.out(1.5)",
        },
        // 5.5,
        "rotate+=0.3",
      )
      .from(
        "#stats",
        {
          x: 500,
          //   opacity: 0,
          duration: 0.4,
          ease: "back.out(1.5)",
        },
        // 5.5,
        "<",
      )
      .fromTo(
        "#flavors div",
        {
          x: 500,
          // opacity: 0
        },
        {
          x: 0,
          opacity: 1,
          //   ease: "back.out(1.5)",
          stagger: 0.2,
          duration: 0.4,
        },
        // 5.5,
        "<",
      )
      .from(
        "header",
        {
          y: -100,
          //   opacity: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        "rotate+=1.3",
        // 6.5,
      );

    // tl.addLabel("particlesScatter", 5.5);
    tl.addLabel("particlesScatter");
    scatterParticles(particleRefs.current, tl, "particlesScatter");
  };

  const { contextSafe } = useGSAP(() => {
    if (heroIntroPlayed) {
      setParticlesFinalState();
      return;
    }

    heroIntroPlayed = true;
    playIntro();
  });
  const handleFlavorClick = contextSafe((flavor) => {
    if (flavor.name === activeFlavor.name || isAnimating.current) return;
    isAnimating.current = true;

    const circle = revealCircleRef.current;
    const heading = headingRef.current;
    const desc = descRef.current;
    const btn = buttonRef.current;
    const img = coneImgRef.current;
    const requiredScale = getRevealScale();

    // ── Text push transition setup ──
    const textGhost = ghostTextRef.current;
    const textBlock = textBlockRef.current;
    const ghostHeadingEl = ghostHeadingRef.current;
    const ghostDescEl = ghostDescRef.current;
    const textPushDistance = textMaskRef.current.offsetHeight;

    // Ghost takes over the OLD text visually
    ghostHeadingEl.textContent = heading.textContent;
    ghostDescEl.textContent = desc.textContent;
    gsap.set(textGhost, { y: 0, opacity: 1 });

    // Real block gets NEW text immediately, waits just below the mask
    heading.textContent = flavor.name;
    desc.textContent = flavor.desc;
    gsap.set(textBlock, { y: textPushDistance, opacity: 1 });

    // Disable CSS transition during GSAP animation so they don't fight
    img.style.transition = "none";

    gsap.set(circle, {
      backgroundColor: flavor.bgColor,
      scale: 0,
      opacity: 1,
    });

    // ── Push transition setup ──
    // Ghost takes over the OLD image visually, so the real <img> is free to
    // switch to the NEW image immediately and wait just below the mask.
    const ghost = ghostImgRef.current;
    const pushDistance = imageMaskRef.current.offsetHeight;

    ghost.src = img.src;
    gsap.set(ghost, { y: 0, opacity: 1 });

    img.src = flavor.cone;
    gsap.set(img, { y: pushDistance, opacity: 1 });

    const master = gsap.timeline({
      onComplete: () => {
        isAnimating.current = false;
        img.style.transition = ""; // Restore hover transition
      },
    });

    master.addLabel("start");

    // Retract particles first
    retractParticles(particleRefs.current, master, "start");

    // 1. Circle expands (Liquid reveal)
    master.to(
      circle,
      {
        scale: requiredScale,
        duration: 1.8,
        ease: "expo.inOut",
      },
      "start",
    );

    // 2. ANTICIPATION — small dip
    master.to(
      ghost,
      {
        y: 30,
        duration: 0.55,
        ease: "power2.out",
      },
      "start",
    );

    // Anticipation dip on outgoing text
    master.to(textGhost, { y: 30, duration: 0.3, ease: "power2.out" }, "start");
    // 2b. Push transition: outgoing (ghost) and incoming (img) move together,
    // same start, same duration, same ease — one continuous strip. Starts
    // right as the anticipation dip finishes.

    master.to(
      ghost,
      {
        y: -pushDistance,
        scaleY: 1,
        scaleX: 1,
        duration: 0.6,
        ease: "power2.inOut",
      },
      "start+=0.35",
    );
    master.to(
      textGhost,
      { y: -textPushDistance, duration: 0.6, ease: "power2.inOut" },
      "start+=0.35",
    );
    master.to(
      textBlock,
      { y: 0, duration: 0.6, ease: "power2.inOut" },
      "start+=0.35",
    );
    master.to(
      img,
      { y: 0, duration: 0.6, ease: "power2.inOut" },
      "start+=0.35",
    );

    master.set(ghost, { opacity: 0 }, "start+=0.95");
    // 3. Swap state EXACTLY at 1.25s (safely after the 1.0s image exit)
    master.addLabel("swap", "start+=1.25");
    master.call(
      () => {
        setActiveFlavor(flavor);
      },
      [],
      "swap",
    );

    // 4. Update the background explicitly at 1.7s
    master.set(
      wrapperRef.current,
      { backgroundColor: flavor.bgColor },
      "start+=1.9",
    );
    master.set(circle, { scale: 0, opacity: 0 }, "start+=2.05");

    // 5. Explicitly prepare the new elements just before animating them in protecting against race conditions
    master.addLabel("enter", "start+=1.3");

    // 7. Scatter particles 0.3s after cone enters (cone enters at enter+0.05, so enter+0.3)
    master.addLabel("scatterNewParticles", "enter+=0.3");
    scatterParticles(particleRefs.current, master, "scatterNewParticles");
  });

  return (
    <div
      id="home"
      ref={wrapperRef}
      style={{ backgroundColor: activeFlavor.bgColor }}
      className="w-full overflow-x-hidden min-h-screen lg:h-screen"
    >
      {/* ── Reveal Circle ── */}
      <div ref={revealCircleRef} className="reveal-circle" />

      <div className="w-full min-h-screen lg:h-screen max-w-[1440px] mx-auto px-4 lg:px-12 py-4 lg:py-6 relative overflow-hidden">
        {/* ── Header ── */}
        <Navbar />

        {/* ── Hero ── */}
        <section
          id="hero"
          ref={heroRef}
          className=" mt-20 lg:mt-14 grid grid-cols-1 lg:grid-cols-[260px_1fr_260px] grid-rows-auto lg:grid-rows-[auto_1fr] items-center lg:items-start min-h-[calc(100vh-120px)] relative gap-8 lg:gap-0 pb-10 lg:pb-0"
        >
          {/* Left */}
          <div
            id="left"
            className="col-start-1 lg:col-start-1 lg:row-start-1 lg:row-end-3 self-center z-2 flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1"
          >
            <div
              ref={textMaskRef}
              className="relative overflow-y-clip w-full  h-[150px] lg:h-[180px]"
            >
              {/* Ghost (old) text — pushes OUT */}
              <div
                ref={ghostTextRef}
                aria-hidden="true"
                className="absolute top-0 left-0 w-full flex flex-col items-center lg:items-start opacity-0 pointer-events-none"
              >
                <h1
                  ref={ghostHeadingRef}
                  className="bungee-regular font-black text-[48px] lg:text-[64px] leading-none mb-4 text-text-main"
                >
                  {activeFlavor.name}
                </h1>
                <p
                  ref={ghostDescRef}
                  className="text-[14px] lg:text-[15px] leading-[1.6] text-text-muted max-w-[280px] lg:max-w-[220px] mb-7"
                >
                  {activeFlavor.desc}
                </p>
              </div>

              {/* Real (current/new) text — pushes IN */}
              <div
                ref={textBlockRef}
                className="w-full flex flex-col items-center lg:items-start"
              >
                <h1
                  ref={headingRef}
                  className="bungee-regular font-black text-[48px] lg:text-[64px] leading-none mb-4 text-text-main"
                >
                  {activeFlavor.name}
                </h1>
                <p
                  ref={descRef}
                  className="text-[14px] lg:text-[15px] leading-[1.6] text-text-muted max-w-[280px] lg:max-w-[220px] mb-7"
                >
                  {activeFlavor.desc}
                </p>
              </div>
            </div>
            {/* <h1
              ref={headingRef}
              className="bungee-regular font-black text-[48px] lg:text-[64px] leading-none mb-4 text-text-main"
            >
              {activeFlavor.name}
            </h1>
            <p
              ref={descRef}
              className="text-[14px] lg:text-[15px] leading-[1.6] text-text-muted max-w-[280px] lg:max-w-[220px] mb-7"
            >
              {activeFlavor.desc}
            </p> */}
            <button
              ref={buttonRef}
              className="inline-block py-[14px] px-8 bg-accent text-white border-none rounded-full text-[14px] font-semibold cursor-pointer tracking-[0.5px] shadow-lg hover:bg-(--color-button-primary-hover) hover:-translate-y-0.5 transition-all"
            >
              {tenant.hero.buttonText}
            </button>
          </div>

          {/* Center */}
          <div
            id="img"
            className="col-start-1 lg:col-start-2 lg:row-start-1 lg:row-end-3 flex items-center justify-center z-1 relative order-1 lg:order-2 h-[320px] lg:h-auto mt-4 lg:mt-0"
          >
            {/* Particles */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[-1]">
              {Array(9)
                .fill(0)
                .map((_, i) => (
                  <img
                    key={i}
                    ref={(el) => (particleRefs.current[i] = el)}
                    src={i < 5 ? activeFlavor.particle : `/images/${activeFlavor.name.toLowerCase()}-sub-particle.png`}
                    alt=""
                    className={`absolute object-contain opacity-0 scale-50 ${i < 5 ? 'w-24 h-24 lg:w-36 lg:h-36' : 'w-16 h-16 lg:w-24 lg:h-24'}`}
                  />
                ))}
            </div>

            <div
              ref={imageMaskRef}
              className="relative overflow-hidden w-full h-[280px] lg:h-156"
            >
              <img
                ref={ghostImgRef}
                src={activeFlavor.cone}
                alt=""
                aria-hidden="true"
                className="absolute top-0 left-0 right-0 mx-auto h-[280px] lg:h-156 rotate-z-335 max-w-full w-auto object-contain lg:-mt-5 drop-shadow-2xl opacity-0 pointer-events-none"
              />
              <img
                id="ghost-img"
                ref={coneImgRef}
                src={activeFlavor.cone}
                alt={`${activeFlavor.name}`}
                className="absolute top-0 left-0 right-0 mx-auto pt-5 h-[280px] lg:h-156 rotate-z-335 max-w-full w-auto object-contain lg:-mt-5 drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Right */}
          <div className="col-start-1 lg:col-start-3 lg:row-start-1 lg:row-end-3 flex flex-col items-center lg:items-end gap-8 lg:gap-10 lg:pt-2.5 order-3">
            <div
              id="stats"
              className="flex gap-6 lg:gap-7 w-full justify-center lg:justify-end"
            >
              {tenant.hero.stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="bungee-regular font-bold text-[28px] lg:text-[38px] leading-none">
                    {stat.value}
                  </div>
                  <div className="text-[14px] lg:text-[18px]  mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <div
              id="flavors"
              className="grid grid-cols-2 lg:flex lg:flex-col overflow-x-hidden lg:overflow-visible w-full lg:w-auto py-2 lg:py-0 gap-3 lg:gap-1.5 lg:mt-auto"
            >
              {flavors.map((f) => {
                const isActive = f.name === activeFlavor.name;
                return (
                  <div
                    key={f.name}
                    onClick={() => handleFlavorClick(f)}
                    className={`flex items-center gap-[10px] lg:gap-[14px] rounded-full py-2 lg:py-3 pr-6 lg:pr-14 pl-2 min-w-[140px] lg:min-w-[180px] cursor-pointer border-2 transition-all shrink-0 hover:scale-105 ${isActive ? "border-lavender bg-white shadow-md" : "border-(--color-border) bg-(--color-surface) hover:bg-(--color-surface-alt)"}`}
                  >
                    <img
                      src={f.img}
                      alt={f.name}
                      className="w-10 h-10 lg:w-12 lg:h-12 rounded-full object-cover shadow-sm"
                    />
                    <span className="text-[14px] lg:text-[15px] font-semibold">
                      {f.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Hero;
