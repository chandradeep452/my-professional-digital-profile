'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  phase: number;
  speed: number;
  color: string;
  baseSize: number;
}

const SPECTRUM_STOPS = [
  { t: 0.0, r: 59, g: 130, b: 246 },  // Royal Blue
  { t: 0.3, r: 99, g: 102, b: 241 },  // Indigo
  { t: 0.55, r: 168, g: 85, b: 247 }, // Violet
  { t: 0.78, r: 239, g: 68, b: 68 },  // Coral Red
  { t: 1.0, r: 245, g: 158, b: 11 },  // Amber Gold
];

function sampleSpectrumColor(nx: number, ny: number): string {
  const t = Math.max(0, Math.min(1, nx * 0.75 + ny * 0.25));
  for (let i = 0; i < SPECTRUM_STOPS.length - 1; i++) {
    const a = SPECTRUM_STOPS[i];
    const b = SPECTRUM_STOPS[i + 1];
    if (t >= a.t && t <= b.t) {
      const local = (t - a.t) / (b.t - a.t);
      const r = Math.round(a.r + (b.r - a.r) * local);
      const g = Math.round(a.g + (b.g - a.g) * local);
      const bl = Math.round(a.b + (b.b - a.b) * local);
      return `rgb(${r}, ${g}, ${bl})`;
    }
  }
  return 'rgb(59, 130, 246)';
}

export default function AntigravityFieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let particles: Particle[] = [];
    let animationId = 0;

    // Smoothly interpolated pointer state
    const pointer = {
      x: width * 0.5,
      y: height * 0.38,
      tx: width * 0.5,
      ty: height * 0.38,
      vx: 0,
      vy: 0,
      active: false,
      lastMoveTime: 0,
    };

    const buildParticles = () => {
      particles = [];
      // Balanced spacing (~36px grid with organic jitter)
      const spacing = width < 640 ? 34 : 38;
      const cols = Math.ceil(width / spacing) + 2;
      const rows = Math.ceil(height / spacing) + 2;

      for (let row = -1; row < rows; row++) {
        for (let col = -1; col < cols; col++) {
          const jitterX = (Math.random() - 0.5) * spacing * 0.72;
          const jitterY = (Math.random() - 0.5) * spacing * 0.72;
          const baseX = col * spacing + jitterX;
          const baseY = row * spacing + jitterY;
          const nx = Math.max(0, Math.min(1, baseX / Math.max(1, width)));
          const ny = Math.max(0, Math.min(1, baseY / Math.max(1, height)));

          particles.push({
            baseX,
            baseY,
            x: baseX,
            y: baseY,
            vx: 0,
            vy: 0,
            phase: Math.random() * Math.PI * 2,
            speed: 0.6 + Math.random() * 0.8,
            color: sampleSpectrumColor(nx, ny),
            baseSize: 1.0 + Math.random() * 0.7,
          });
        }
      }
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildParticles();
    };

    const handleMouseMove = (e: MouseEvent) => {
      pointer.tx = e.clientX;
      pointer.ty = e.clientY;
      pointer.active = true;
      pointer.lastMoveTime = performance.now();
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        pointer.tx = e.touches[0].clientX;
        pointer.ty = e.touches[0].clientY;
        pointer.active = true;
        pointer.lastMoveTime = performance.now();
      }
    };

    const handleMouseLeave = () => {
      pointer.active = false;
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    const render = (now: number) => {
      const time = now * 0.001;

      // Gentle autonomous drift when cursor hasn't moved recently
      const idleSeconds = (now - pointer.lastMoveTime) * 0.001;
      if (!pointer.active || idleSeconds > 3.5) {
        pointer.tx = width * 0.5 + Math.cos(time * 0.45) * (width * 0.22);
        pointer.ty = height * 0.42 + Math.sin(time * 0.6) * (height * 0.16);
      }

      const prevX = pointer.x;
      const prevY = pointer.y;
      pointer.x += (pointer.tx - pointer.x) * 0.12;
      pointer.y += (pointer.ty - pointer.y) * 0.12;
      pointer.vx = pointer.x - prevX;
      pointer.vy = pointer.y - prevY;

      ctx.clearRect(0, 0, width, height);

      const influenceRadius = Math.min(360, Math.max(240, width * 0.28));
      const ringRadius = influenceRadius * 0.55;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Ambient breathing wave
        const driftX = Math.cos(time * p.speed + p.phase) * 4;
        const driftY = Math.sin(time * p.speed * 0.9 + p.phase) * 4;
        const targetHomeX = p.baseX + driftX;
        const targetHomeY = p.baseY + driftY;

        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const dist = Math.hypot(dx, dy) || 0.001;

        // Interactive cursor field: gentle radial wave + tangential swirl
        if (dist < influenceRadius) {
          const force = 1 - dist / influenceRadius;
          const smoothForce = force * force;
          const nx = dx / dist;
          const ny = dy / dist;

          // Subtle ring push + cursor momentum wake
          const radialPush = (ringRadius - dist) * 0.025 * smoothForce;
          const swirlX = -ny * smoothForce * 1.15 + pointer.vx * smoothForce * 0.35;
          const swirlY = nx * smoothForce * 1.15 + pointer.vy * smoothForce * 0.35;

          p.vx += nx * radialPush + swirlX;
          p.vy += ny * radialPush + swirlY;
        }

        // Spring back to organic home position + damping
        p.vx += (targetHomeX - p.x) * 0.055;
        p.vy += (targetHomeY - p.y) * 0.055;
        p.vx *= 0.84;
        p.vy *= 0.84;

        p.x += p.vx;
        p.y += p.vy;

        // Calculate dash elongation & angle matching Antigravity's field wave
        const proximity = Math.max(0, 1 - dist / (influenceRadius * 1.25));
        const ringHighlight = Math.exp(-Math.pow((dist - ringRadius) / (influenceRadius * 0.42), 2));

        // Dash angle aligns toward/around the cursor wave
        const angle = Math.atan2(dy, dx) + Math.sin(time * 0.8 + p.phase) * 0.15;

        const dashLength = p.baseSize + ringHighlight * 5.2 + proximity * 1.6;
        const dashWidth = 1.4 + ringHighlight * 1.0;
        const alpha = 0.22 + ringHighlight * 0.68 + proximity * 0.12;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(angle);
        ctx.globalAlpha = Math.min(0.95, alpha);
        ctx.fillStyle = p.color;

        // Rounded capsule dash
        const halfL = dashLength * 0.5;
        const halfW = dashWidth * 0.5;
        ctx.beginPath();
        ctx.roundRect(-halfL, -halfW, dashLength, dashWidth, halfW);
        ctx.fill();
        ctx.restore();
      }

      if (!prefersReducedMotion) {
        animationId = requestAnimationFrame(render);
      }
    };

    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none"
    />
  );
}
