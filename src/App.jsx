import React, { useRef } from 'react'
import './App.css'
import { useGSAP } from '@gsap/react'

import blueberryCone from './assets/blueberry-cone.png'
import vanillaThumb from './assets/vanilla-thumb.png'
import chocolateThumb from './assets/chocolate-thumb.png'
import blueberryThumb from './assets/blueberry-thumb.png'
import raspberryThumb from './assets/raspberry-thumb.png'
import gsap from 'gsap'

const flavors = [
  { name: 'Vanilla', img: vanillaThumb },
  { name: 'Chocolate', img: chocolateThumb },
  { name: 'Blueberry', img: blueberryThumb, active: true },
  { name: 'Raspberry', img: raspberryThumb },
]

const App = () => {
  const heroRef = useRef()
  const tl = gsap.timeline()

  useGSAP(() => {
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

      .fromTo("#flavors div",
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, ease: 'power2.in', stagger: 0.1, duration: 0.2 },
        2
      );
  });

  return (
    <div className="w-full min-h-screen max-w-[1440px] mx-auto px-12 py-6 relative overflow-hidden">
      {/* ── Header ── */}
      <header className="flex items-center justify-between pb-6">
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

        <nav className="flex items-center gap-0 bg-white rounded-full py-1.5 px-2 shadow-[0_1px_4px_rgba(0,0,0,.06)]">
          <a className="no-underline text-text-main text-[14px] font-semibold py-2 px-5 rounded-full cursor-pointer bg-bg">Home</a>
          <a className="no-underline text-text-main text-[14px] font-medium py-2 px-5 rounded-full cursor-pointer hover:bg-gray-50 transition-colors">Products</a>
          <a className="no-underline text-text-main text-[14px] font-medium py-2 px-5 rounded-full cursor-pointer hover:bg-gray-50 transition-colors">Flavors</a>
          <a className="no-underline text-text-main text-[14px] font-medium py-2 px-5 rounded-full cursor-pointer hover:bg-gray-50 transition-colors">About</a>
        </nav>

        {/* empty right placeholder to balance flex */}
        <div style={{ width: 160 }} />
      </header>

      {/* ── Hero ── */}
      <section id='hero' ref={heroRef} className="grid grid-cols-[260px_1fr_260px] grid-rows-[auto_1fr] items-start min-h-[calc(100vh-120px)] relative">
        {/* Left */}
        <div id='left' className="col-start-1 row-start-2 self-end pb-[60px] z-[2]">
          <h1 className="font-playfair font-black text-[64px] leading-none mb-4 text-text-main">Blueberry</h1>
          <p className="text-[15px] leading-[1.6] text-text-muted max-w-[220px] mb-7">
            Sweet, juicy, and refreshingly tangy, a burst of berry bliss.
          </p>
          <button className="inline-block py-[14px] px-8 bg-accent text-white border-none rounded-full text-[14px] font-semibold cursor-pointer tracking-[0.5px] shadow-lg hover:-translate-y-0.5 transition-all">Order Bucket</button>
        </div>

        {/* Center */}
        <div id='img' className="col-start-2 row-start-1 row-end-3 flex items-center justify-center z-[1]">
          <img src={blueberryCone} alt="Blueberry ice cream cone" className="w-[420px] max-w-full h-auto object-contain -mt-5 drop-shadow-2xl hover:scale-105 transition-transform duration-500" />
        </div>

        {/* Right */}
        <div className="col-start-3 row-start-1 row-end-3 flex flex-col items-end gap-10 pt-2.5">
          <div className="flex gap-7">
            <div className="text-center">
              <div className="font-playfair font-bold text-[28px] leading-none">10+</div>
              <div className="text-[12px] text-text-muted mt-1">Flavors</div>
            </div>
            <div className="text-center">
              <div className="font-playfair font-bold text-[28px] leading-none">11K+</div>
              <div className="text-[12px] text-text-muted mt-1">Reviews</div>
            </div>
            <div className="text-center">
              <div className="font-playfair font-bold text-[28px] leading-none">30+</div>
              <div className="text-[12px] text-text-muted mt-1">Variations</div>
            </div>
          </div>

          <div id='flavors' className="flex flex-col gap-1.5 mt-auto">
            {flavors.map((f) => (
              <div key={f.name} className={`flex items-center gap-[14px] rounded-full py-2 pr-6 pl-2 min-w-[180px] cursor-pointer border-2 transition-all hover:scale-105 ${f.active ? 'border-lavender bg-white shadow-md' : 'border-transparent bg-bg-card hover:bg-gray-100'}`}>
                <img src={f.img} alt={f.name} className="w-12 h-12 rounded-full object-cover shadow-sm" />
                <span className="text-[15px] font-semibold">{f.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default App