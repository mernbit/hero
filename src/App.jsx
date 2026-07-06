import React, { useRef, useState, useCallback } from 'react'
import './App.css'
import { useGSAP } from '@gsap/react'

import blueberryCone from './assets/blueberry-cone.png'
import vanillaCone from './assets/vanilla-cone.png'
import chocolateCone from './assets/chocolate-cone.png'
import raspberryCone from './assets/raspberry-cone.png'

import vanillaThumb from './assets/vanilla-thumb.png'
import chocolateThumb from './assets/chocolate-thumb.png'
import blueberryThumb from './assets/blueberry-thumb.png'
import raspberryThumb from './assets/raspberry-thumb.png'
import vanillaParticle from './assets/vanilla.png'
import chocolateParticle from './assets/chocolate.png'
import blueberryParticle from './assets/blueberry.png'
import raspberryParticle from './assets/raspberry.png'
import gsap from 'gsap'

const flavors = [
  { name: 'Vanilla', img: vanillaThumb, cone: vanillaCone, particle: vanillaParticle, desc: 'Classic, creamy, and smooth vanilla bean perfection.', bgColor: '#fcecb4' },
  { name: 'Chocolate', img: chocolateThumb, cone: chocolateCone, particle: chocolateParticle, desc: 'Rich, luxurious chocolate fudge delight.', bgColor: '#d4b098' },
  { name: 'Blueberry', img: blueberryThumb, cone: blueberryCone, particle: blueberryParticle, desc: 'Sweet, juicy, and refreshingly tangy, a burst of berry bliss.', bgColor: '#AECDEC' },
  { name: 'Raspberry', img: raspberryThumb, cone: raspberryCone, particle: raspberryParticle, desc: 'Tart and sweet raspberry swirl, perfectly refreshing.', bgColor: '#F6A6B2' },
]

/** Calculate scale needed for a 60px circle to cover the entire viewport */
const getRevealScale = () => {
  const diagonal = Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2)
  // Circle diameter = 60px, so radius = 30px. Scale = diagonal / 60 + buffer
  return Math.ceil(diagonal / 60) + 2
}

const App = () => {
  const [activeFlavor, setActiveFlavor] = useState(flavors[0])
  const heroRef = useRef()

  // Refs for animated elements
  const revealCircleRef = useRef(null)
  const headingRef = useRef(null)
  const descRef = useRef(null)
  const buttonRef = useRef(null)
  const coneImgRef = useRef(null)
  const isAnimating = useRef(false)
  const wrapperRef = useRef(null)
  const particleRefs = useRef([])

  const scatterParticles = (particles, timeline, label) => {
    // 7 positions: TL, TR, L, R, BL, BR, TC
    const positions = [
      { x: () => gsap.utils.random(-160, -100), y: () => gsap.utils.random(-220, -140) },
      { x: () => gsap.utils.random(100, 160), y: () => gsap.utils.random(-220, -140) },
      { x: () => gsap.utils.random(-220, -160), y: () => gsap.utils.random(-50, 50) },
      { x: () => gsap.utils.random(160, 220), y: () => gsap.utils.random(-50, 50) },
      { x: () => gsap.utils.random(-180, -120), y: () => gsap.utils.random(140, 220) },
      { x: () => gsap.utils.random(120, 180), y: () => gsap.utils.random(140, 220) },
      { x: () => gsap.utils.random(-50, 50), y: () => gsap.utils.random(-260, -180) },
    ];

    particles.forEach((p, i) => {
      const pos = positions[i];
      timeline.to(p, {
        x: pos.x(),
        y: pos.y(),
        scale: gsap.utils.random(0.7, 1.2),
        rotation: gsap.utils.random(-180, 180),
        opacity: 1,
        duration: gsap.utils.random(0.8, 1.2),
        ease: 'back.out(1.2)'
      }, `${label}+=${gsap.utils.random(0, 0.2)}`);
    });
  };

  const retractParticles = (particles, timeline, label) => {
    particles.forEach((p) => {
      timeline.to(p, {
        x: 0,
        y: 0,
        scale: 0.5,
        opacity: 1, // Keep opacity 1 until fading fully
        duration: gsap.utils.random(0.3, 0.5),
        ease: 'power2.inOut'
      }, `${label}+=${gsap.utils.random(0, 0.1)}`);

      // Fade out separately slightly faster at the end of movement
      timeline.to(p, { opacity: 0, duration: 0.2 }, `${label}+=0.3`);
    });
  };

  const tl = gsap.timeline()

  const { contextSafe } = useGSAP(() => {
    tl
      .from("#hero #left", {
        x: -50,
        opacity: 0,
        duration: 0.5,
        delay: 1
      }, 1)

      .from("#img", {
        y: 50,
        opacity: 0,
        duration: 1,
        delay: 1,
        scale: 0.9,
      }, 1)
      .to("#img img", {
        rotateZ: -10,
        delay: 1,
        duration: 1.5,
        ease: 'power2'
      })
      .from('#stats', {
        x: 50,
        opacity: 0,
        duration: 0.5,
        delay: 1
      }, 1)
      .fromTo("#flavors div",
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, ease: 'power2.in', stagger: 0.1, duration: 0.2 },
        2
      )
      .from('header', {
        y: -50,
        opacity: 0,
        duration: 0.5,
        delay: 2,
        ease: 'power2.out'
      }, 1);

    tl.addLabel("particlesScatter", 3);
    scatterParticles(particleRefs.current, tl, "particlesScatter");
  });

  const handleFlavorClick = contextSafe((flavor) => {
    if (flavor.name === activeFlavor.name || isAnimating.current) return;
    isAnimating.current = true;

    const circle = revealCircleRef.current
    const heading = headingRef.current
    const desc = descRef.current
    const btn = buttonRef.current
    const img = coneImgRef.current
    const requiredScale = getRevealScale()

    // Disable CSS transition during GSAP animation so they don't fight
    img.style.transition = "none";

    gsap.set(circle, {
      backgroundColor: flavor.bgColor,
      scale: 0,
      opacity: 1,
    })

    const master = gsap.timeline({
      onComplete: () => {
        isAnimating.current = false
        img.style.transition = ""; // Restore hover transition
      }
    })

    master.addLabel("start")

    // Retract particles first
    retractParticles(particleRefs.current, master, "start")

    // 1. Circle expands (Liquid reveal)
    master.to(circle, {
      scale: requiredScale,
      duration: 1.8,
      ease: "expo.inOut",
    }, "start")

    // 2. Pause exactly 0.4s (wait for particles to retract), then Old Image drops down and fades out cleanly
    master.to(img, {
      y: -150,
      opacity: 0,
      duration: 0.6,
      ease: "power2.inOut",
    }, "start+=0.4")

    master.to([heading, desc, btn], {
      y: -20,
      opacity: 0,
      duration: 0.5,
      ease: "power2.inOut",
      stagger: 0.05,
    }, "start+=0.2")

    // 3. Swap state EXACTLY at 1.05s (safely after the 1.0s image exit)
    master.addLabel("swap", "start+=1.05")

    master.call(() => {
      setActiveFlavor(flavor)
    }, [], "swap")

    // 4. Update the background explicitly at 1.7s
    master.set(wrapperRef.current, { backgroundColor: flavor.bgColor }, "start+=1.7")
    master.set(circle, { scale: 0, opacity: 0 }, "start+=1.85")

    // 5. Explicitly prepare the new elements just before animating them in protecting against race conditions
    master.addLabel("enter", "start+=1.1")

    // Explicitly set starting values for the new image instead of fromTo
    master.set(img, { y: 150, opacity: 0, scale: 0.95 }, "enter")
    master.set([heading, desc, btn], { y: 20, opacity: 0 }, "enter")

    // 6. Animate the new image and text in smoothly
    master.to(img, {
      y: 0,
      scale: 1,
      opacity: 1,
      duration: 0.8,
      ease: "back.out(1.5)"
    }, "enter+=0.05")

    master.to([heading, desc, btn], {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "expo.out",
      stagger: 0.08,
    }, "enter+=0.2")

    // 7. Scatter particles 1s after cone enters (cone enters at enter+0.05, so enter+1.05)
    master.addLabel("scatterNewParticles", "enter+=1.05")
    scatterParticles(particleRefs.current, master, "scatterNewParticles")
  });

  return (
    <div
      ref={wrapperRef}
      style={{ backgroundColor: activeFlavor.bgColor }}
      className="w-full overflow-hidden h-screen"
    >
      {/* ── Reveal Circle ── */}
      <div ref={revealCircleRef} className="reveal-circle" />

      <div className="w-full h-screen max-w-[1440px] mx-auto px-12 py-6 relative overflow-hidden">
        {/* ── Header ── */}
        <div className='fixed top-3 left-5 right-5 z-9999 '>
          <header className="flex items-center justify-between pb-6 ">
            <div className="flex items-center gap-2.5">
              <div className="w-11 h-11 rounded-full bg-accent flex items-center justify-center">
                <svg viewBox="0 0 40 40" fill="none" className="w-[26px] h-[26px]">
                  <circle cx="20" cy="20" r="16" stroke="#fff" strokeWidth="2" />
                  <path d="M12 20c4-8 12-8 16 0" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                  <path d="M12 20c4 8 12 8 16 0" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div className="flex flex-col leading-[1.1]">
                <span className="font-bold text-[14px] tracking-[1.5px] uppercase">The Creamery</span>
                <span className="text-[9px] tracking-[2px] uppercase text-text-muted">Since 2024</span>
              </div>
            </div>

            <nav className="flex items-center gap-0 bg-white backdrop-blur-sm rounded-full py-1.5 px-2 shadow-[0_1px_4px_rgba(0,0,0,.06)]">
              <a className="no-underline text-text-main text-[14px] font-semibold py-2 px-5 rounded-full cursor-pointer bg-bg">Home</a>
              <a className="no-underline text-text-main text-[14px] font-medium py-2 px-5 rounded-full cursor-pointer hover:bg-gray-50 transition-colors">Products</a>
              <a className="no-underline text-text-main text-[14px] font-medium py-2 px-5 rounded-full cursor-pointer hover:bg-gray-50 transition-colors">Flavors</a>
              <a className="no-underline text-text-main text-[14px] font-medium py-2 px-5 rounded-full cursor-pointer hover:bg-gray-50 transition-colors">About</a>
            </nav>

            {/* empty right placeholder to balance flex */}
            <div style={{ width: 160 }} />
          </header>
        </div>

        {/* ── Hero ── */}
        <section id='hero' ref={heroRef} className=" mt-14 grid grid-cols-[260px_1fr_260px] grid-rows-[auto_1fr] items-start min-h-[calc(100vh-120px)] relative">
          {/* Left */}
          <div id='left' className="col-start-1 row-start-1 row-end-3 self-center z-[2]">
            <h1 ref={headingRef} className="bungee-regular font-black text-[64px] leading-none mb-4 text-text-main">{activeFlavor.name}</h1>
            <p ref={descRef} className="text-[15px] leading-[1.6] text-text-muted max-w-[220px] mb-7">
              {activeFlavor.desc}
            </p>
            <button ref={buttonRef} className="inline-block py-[14px] px-8 bg-accent text-white border-none rounded-full text-[14px] font-semibold cursor-pointer tracking-[0.5px] shadow-lg hover:-translate-y-0.5 transition-all">Order Bucket</button>
          </div>

          {/* Center */}
          <div id='img' className="col-start-2 row-start-1 row-end-3 flex items-center justify-center z-1 relative">
            {/* Particles */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[-1]">
              {Array(7).fill(0).map((_, i) => (
                <img key={i} ref={el => particleRefs.current[i] = el} src={activeFlavor.particle} alt="" className="absolute w-20 h-20 object-contain opacity-0 scale-50" />
              ))}
            </div>

            <img ref={coneImgRef} src={activeFlavor.cone} alt={`${activeFlavor.name} ice cream cone`} className="h-156  rotate-z-335  max-w-full w-auto object-contain -mt-5 drop-shadow-2xl" />
          </div>

          {/* Right */}
          <div className="col-start-3 row-start-1 row-end-3 flex flex-col items-end gap-10 pt-2.5">
            <div id='stats' className="flex gap-7">
              <div className="text-center">
                <div className="bungee-regular font-bold text-[38px] leading-none">10+</div>
                <div className="text-[18px] text-text-muted mt-1">Flavors</div>
              </div>
              <div className="text-center">
                <div className="bungee-regular font-bold text-[38px] leading-none">11K+</div>
                <div className="text-[18px] text-text-muted mt-1">Reviews</div>
              </div>
              <div className="text-center">
                <div className="bungee-regular font-bold text-[38px] leading-none">30+</div>
                <div className="text-[18px] text-text-muted mt-1">Variations</div>
              </div>
            </div>

            <div id='flavors' className="flex flex-col select-none gap-1.5 mt-auto">
              {flavors.map((f) => {
                const isActive = f.name === activeFlavor.name
                return (
                  <div key={f.name} onClick={() => handleFlavorClick(f)} className={`flex items-center gap-[14px] rounded-full py-3 pr-14 pl-2 min-w-[180px] cursor-pointer border-2 transition-all hover:scale-105 ${isActive ? 'border-lavender bg-white shadow-md' : 'border-transparent bg-bg-card hover:bg-gray-100'}`}>
                    <img src={f.img} alt={f.name} className="w-12 h-12 rounded-full object-cover shadow-sm" />
                    <span className="text-[15px] font-semibold">{f.name}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default App