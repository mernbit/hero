
// import React, { useRef } from "react";
// import { useGSAP } from "@gsap/react";
// import gsap from "gsap";
// import ScrollTrigger from "gsap/ScrollTrigger";

// gsap.registerPlugin(ScrollTrigger);

// function buildGoldenSpiralPath({
//   cx,
//   cy,
//   startRadius,
//   startAngleDeg,
//   totalAngleDeg,
//   clockwise = true,
//   quarterTurnRatio = 1 / 1.6180339887,
//   steps = 240,
// }) {
//   const dir = clockwise ? 1 : -1;
//   const points = [];

//   for (let i = 0; i <= steps; i++) {
//     const t = i / steps;
//     const angleDeg = startAngleDeg + dir * totalAngleDeg * t;
//     const angleRad = (angleDeg * Math.PI) / 180;
//     const radius =
//       startRadius * Math.pow(quarterTurnRatio, (totalAngleDeg * t) / 90);
//     const x = cx + radius * Math.cos(angleRad);
//     const y = cy + radius * Math.sin(angleRad);
//     points.push([x, y]);
//   }

//   let d = `M ${points[0][0].toFixed(2)} ${points[0][1].toFixed(2)} `;
//   for (let i = 0; i < points.length - 1; i++) {
//     const p0 = points[i - 1] || points[i];
//     const p1 = points[i];
//     const p2 = points[i + 1];
//     const p3 = points[i + 2] || p2;

//     const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
//     const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
//     const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
//     const cp2y = p2[1] - (p3[1] - p1[1]) / 6;

//     d += `C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2[0].toFixed(2)} ${p2[1].toFixed(2)} `;
//   }

//   return d;
// }

// export default function AnimatedRoadmap() {
//   const containerRef = useRef(null);
//   const pathRef = useRef(null);

//   const d = buildGoldenSpiralPath({
//     cx: 300,
//     cy: 300,
//     startRadius: 260,
//     startAngleDeg: 140,
//     totalAngleDeg: 470,
//     clockwise: true,
//     quarterTurnRatio: 1 / 1.618033988749895,
//     steps: 240,
//   });

//   useGSAP(
//     () => {
//       const path = pathRef.current;
//       const length = path.getTotalLength();

//       gsap.set(path, {
//         strokeDasharray: length,
//         strokeDashoffset: length,
//       });

//       gsap.to(path, {
//         strokeDashoffset: 0,
//         ease: "none",
//         scrollTrigger: {
//           trigger: containerRef.current,
//           start: "top top",
//           end: "+=3000",       // <- tune this: bigger = slower/longer scroll to complete
//           scrub: 1,
//           pin: true,
//           anticipatePin: 1,    // avoids a jump/flicker right as pin engages
//           // markers: true,    // uncomment while debugging
//         },
//       });
//     },
//     { scope: containerRef }
//   );

//   return (
//     <div
//       ref={containerRef}
//       className="h-screen w-full flex items-center justify-center bg-white"
//     >
//       <svg
//         viewBox="0 0 600 600"
//         preserveAspectRatio="xMidYMid meet"
//         className="w-[min(150vw,150vh)] h-[min(150vw,150vh)]"
//       >
//         <path
//           ref={pathRef}
//           d={d}
//           fill="none"
//           stroke="#000000"
//           strokeWidth="3"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         />
//       </svg>
//     </div>
//   );
// }

"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function buildGoldenSpiralPath({
  cx,
  cy,
  startRadius,
  startAngleDeg,
  totalAngleDeg,
  clockwise = true,
  quarterTurnRatio = 1 / 1.6180339887,
  steps = 240,
}) {
  const dir = clockwise ? 1 : -1;
  const points = [];

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const angleDeg = startAngleDeg + dir * totalAngleDeg * t;
    const angleRad = (angleDeg * Math.PI) / 180;
    const radius =
      startRadius * Math.pow(quarterTurnRatio, (totalAngleDeg * t) / 90);
    const x = cx + radius * Math.cos(angleRad);
    const y = cy + radius * Math.sin(angleRad);
    points.push([x, y]);
  }

  let d = `M ${points[0][0].toFixed(2)} ${points[0][1].toFixed(2)} `;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;

    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;

    d += `C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2[0].toFixed(2)} ${p2[1].toFixed(2)} `;
  }

  return d;
}

// ViewBox is 0 0 600 600 — every icon anchor is expressed as a fraction of
// the path's total length (0 = very start of the draw, 1 = very end, i.e.
// the center where the spiral converges). Tune these 8 numbers to slide
// icons along the curve. The last one is pinned to 1 on purpose — it's the
// spiral's endpoint, so it should appear exactly when the line finishes
// drawing rather than slightly before it.
// Note: this path is parameterized by angle (t), not by arc length — and
// since radius decays exponentially toward the center, equal length
// fractions near the end correspond to a much bigger angular sweep than
// equal length fractions near the start. That's why a "linear" spacing
// left a visible gap before the last icon: the 2nd-to-last point needs to
// sit much closer to 1 (in length-fraction terms) to look evenly spaced
// next to the endpoint. Nudge freely, but expect this asymmetry near 1.
const ICON_FRACTIONS = [0.04, 0.13, 0.24, 0.36, 0.48, 0.63, 0.93, 1];

// How much of the timeline (in the same 0–1 units as ICON_FRACTIONS) each
// icon takes to fade in. Smaller = snappier "pop", larger = softer reveal.
const FADE_WINDOW = 0.045;

export default function AnimatedRoadmap() {
  const containerRef = useRef(null);
  const pathRef = useRef(null);
  const wrapperRef = useRef(null);
  const iconRefs = useRef([]);

  const d = buildGoldenSpiralPath({
    cx: 300,
    cy: 300,
    startRadius: 260,
    startAngleDeg: 140,
    totalAngleDeg: 470,
    clockwise: true,
    quarterTurnRatio: 1 / 1.618033988749895,
    steps: 240,
  });

  useGSAP(
    () => {
      const path = pathRef.current;
      const length = path.getTotalLength();

      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
      });

      // Place each icon on the *actual rendered path* (not the raw spiral
      // math) so it lines up exactly with the stroke, curve-smoothing and
      // all. getPointAtLength gives us viewBox coordinates directly.
      const iconPoints = ICON_FRACTIONS.map((f) =>
        path.getPointAtLength(f * length)
      );

      iconPoints.forEach((pos, i) => {
        const el = iconRefs.current[i];
        if (!el) return;
        gsap.set(el, {
          left: `${(pos.x / 600) * 100}%`,
          top: `${(pos.y / 600) * 100}%`,
          xPercent: -50,
          yPercent: -50,
          opacity: 0,
          scale: 0.6,
        });
      });

      // One timeline, one ScrollTrigger. The path draw and every icon
      // reveal are all children of the same scrubbed timeline, so they
      // stay perfectly in sync with scroll position and with each other —
      // no separate onUpdate/progress listeners needed.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=3000", // tune: bigger = slower/longer scroll to complete
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          // markers: true, // uncomment while debugging
        },
      });

      // Draw the path over an explicit 0 -> 1 span of timeline time.
      tl.to(path, { strokeDashoffset: 0, ease: "none", duration: 1 }, 0);

      // Fade + pop each icon in as the draw "arrives" at its point.
      ICON_FRACTIONS.forEach((f, i) => {
        const el = iconRefs.current[i];
        if (!el) return;
        const start = Math.max(f - FADE_WINDOW, 0);
        tl.to(
          el,
          { opacity: 1, scale: 1, ease: "back.out(2)", duration: FADE_WINDOW },
          start
        );
      });
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="h-screen w-full flex items-center justify-center bg-white"
    >
      <div
        ref={wrapperRef}
        className="relative w-[min(200vw,175vh)] h-[min(150vw,150vh)]"
      >
        {/* preserveAspectRatio="none" lets this stretch horizontally to
            fill the wider wrapper above instead of letterboxing to a
            square. Because the icon overlay below is positioned with the
            same %-of-container math, it stretches identically and stays
            lined up with the path. */}
        <svg
          viewBox="0 0 600 600"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
        >
          <path
            ref={pathRef}
            d={d}
            fill="none"
            stroke="#000000"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Icon overlay — same square box as the svg, positioned with
            percentages so it tracks the viewBox regardless of scale. */}
        <div className="absolute inset-0 pointer-events-none">
          {ICON_FRACTIONS.map((_, i) => (
            <div
              key={i}
              ref={(el) => (iconRefs.current[i] = el)}
              className="absolute w-[100px] h-[100px] rounded-full bg-white shadow-[0_4px_20px_rgba(0,0,0,0.12)] flex items-center justify-center overflow-hidden"
            >
              {/* Drop logo {i + 1} here, e.g.: */}
              {/* <img src="/logos/logo-1.svg" alt="" className="w-12 h-12 object-contain" /> */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}