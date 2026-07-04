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
import gsap from 'gsap'

const flavors = [
  { name: 'Vanilla', img: vanillaThumb, cone: vanillaCone, desc: 'Classic, creamy, and smooth vanilla bean perfection.', bgColor: '#fcecb4' },
  { name: 'Chocolate', img: chocolateThumb, cone: chocolateCone, desc: 'Rich, luxurious chocolate fudge delight.', bgColor: '#d4b098' },
  { name: 'Blueberry', img: blueberryThumb, cone: blueberryCone, desc: 'Sweet, juicy, and refreshingly tangy, a burst of berry bliss.', bgColor: '#AECDEC' },
  { name: 'Raspberry', img: raspberryThumb, cone: raspberryCone, desc: 'Tart and sweet raspberry swirl, perfectly refreshing.', bgColor: '#F6A6B2' },
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
        delay: 1
      }, 1)
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
      }, 1)
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

    // Set the circle to the incoming flavor color
    gsap.set(circle, {
      backgroundColor: flavor.bgColor,
      scale: 0,
      opacity: 1,
    })

    const master = gsap.timeline({
      onComplete: () => {
        // Update wrapper bg BEFORE hiding circle — no flash
        wrapperRef.current.style.backgroundColor = flavor.bgColor
        gsap.set(circle, { scale: 0, opacity: 0 })
        isAnimating.current = false
      }
    })

    // ── LABEL: exit — old content leaves ──
    master.addLabel("exit")

    // Background circle expands from center
    master.to(circle, {
      scale: requiredScale,
      duration: 0.9,
      ease: "power4.inOut",
    }, "exit")

    // Old image exits — scales down, moves down, fades out
    master.to(img, {
      y: 80,
      scale: 0.95,
      opacity: 0,
      duration: 0.5,
      ease: "power2.in",
    }, "exit")

    // Old text exits — fades out, shifts up slightly
    master.to([heading, desc, btn], {
      y: -20,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      stagger: 0.04,
    }, "exit")

    // ── LABEL: enter — new content arrives (overlaps with circle expansion) ──
    master.addLabel("enter", "exit+=0.45")

    // Swap React state at the midpoint (before enter animations)
    master.call(() => {
      setActiveFlavor(flavor)
    }, [], "enter-=0.05")

    // New image enters — from above, scales up, fades in
    master.fromTo(img,
      { y: -80, scale: 0.95, opacity: 0 },
      {
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
      }, "enter"
    )

    // New text enters — fades in, slides down into place
    master.fromTo([heading, desc, btn],
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
        stagger: 0.08,
      }, "enter+=0.1"
    )
  });

  return (
    <div
      ref={wrapperRef}
      style={{ backgroundColor: activeFlavor.bgColor }}
      className="w-full min-h-screen"
    >
      {/* ── Reveal Circle ── */}
      <div ref={revealCircleRef} className="reveal-circle" />

      <div className="w-full min-h-screen max-w-[1440px] mx-auto px-12 py-6 relative overflow-hidden">
        {/* ── Header ── */}
        <div className='fixed top-5 left-5 right-5 z-9999 '>
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
            <h1 ref={headingRef} className="font-playfair font-black text-[64px] leading-none mb-4 text-text-main">{activeFlavor.name}</h1>
            <p ref={descRef} className="text-[15px] leading-[1.6] text-text-muted max-w-[220px] mb-7">
              {activeFlavor.desc}
            </p>
            <button ref={buttonRef} className="inline-block py-[14px] px-8 bg-accent text-white border-none rounded-full text-[14px] font-semibold cursor-pointer tracking-[0.5px] shadow-lg hover:-translate-y-0.5 transition-all">Order Bucket</button>
          </div>

          {/* Center */}
          <div id='img' className="col-start-2 row-start-1 row-end-3 flex items-center justify-center z-[1]">
            <img ref={coneImgRef} src={activeFlavor.cone} alt={`${activeFlavor.name} ice cream cone`} className="w-[420px] max-w-full h-auto object-contain -mt-5 drop-shadow-2xl" />
          </div>

          {/* Right */}
          <div className="col-start-3 row-start-1 row-end-3 flex flex-col items-end gap-10 pt-2.5">
            <div id='stats' className="flex gap-7">
              <div className="text-center">
                <div className="font-playfair font-bold text-[38px] leading-none">10+</div>
                <div className="text-[18px] text-text-muted mt-1">Flavors</div>
              </div>
              <div className="text-center">
                <div className="font-playfair font-bold text-[38px] leading-none">11K+</div>
                <div className="text-[18px] text-text-muted mt-1">Reviews</div>
              </div>
              <div className="text-center">
                <div className="font-playfair font-bold text-[38px] leading-none">30+</div>
                <div className="text-[18px] text-text-muted mt-1">Variations</div>
              </div>
            </div>

            <div id='flavors' className="flex flex-col gap-1.5 mt-auto">
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