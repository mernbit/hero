import React from "react";

// Generates a true logarithmic (golden-ratio) spiral path.
// Radius shrinks by a constant factor every 90° of sweep — that constant
// ratio is what makes it a "golden" spiral rather than an arbitrary curl.
function buildGoldenSpiralPath({
  cx,
  cy,
  startRadius,
  startAngleDeg, // where the spiral begins, in degrees (0 = 3 o'clock)
  totalAngleDeg, // total sweep — 360 = one full turn
  clockwise = true,
  quarterTurnRatio = 1 / 1.6180339887, // radius * this every 90° (true golden ratio)
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

  // Smooth the sampled points into a curve (Catmull-Rom -> cubic Bezier)
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

export default function AnimatedRoadmap() {
  const d = buildGoldenSpiralPath({
    cx: 300, // center = where the spiral converges (your burger icon)
    cy: 300,
    startRadius: 260, // outer radius = the "START" point
    startAngleDeg: 140, // ~8 o'clock — matches "START" sitting bottom-left
    totalAngleDeg: 470, // ~1.3 turns: sweeps through 12, 3, 6 o'clock back to center
    clockwise: true, // matches the flow direction in your diagram
    quarterTurnRatio: 1 / 1.618033988749895, // true golden-ratio decay
    steps: 240,
  });

  return (
    <svg className="w-full" viewBox="0 0 600 600">
      <path
        d={d}
        fill="none"
        stroke="#FFD700"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
