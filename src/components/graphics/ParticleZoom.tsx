"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Converging streams — a meaningful particle system.
 * 4 horizontal streams flow across the section (scattered freelancer output).
 * As the user scrolls, every particle is pulled along a smooth curve toward a
 * single nucleus on the right (Anika's system — the blossom's center).
 * The nucleus brightens as convergence completes.
 *
 * Not a scatter. Every particle has a home and a destination.
 */

type P = {
  lane: number;       // 0..3 stream index
  laneOffset: number; // small random vertical jitter within the lane
  phase: number;      // 0..1 horizontal position along the stream
  speed: number;      // flow speed
  r: number;          // particle size
  tone: number;       // 0..1 darkness (darker = more contrast against cream)
  alpha: number;
};

const LANES = 4;

export default function ParticleZoom({ triggerRef }: { triggerRef: React.RefObject<HTMLElement | null> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !triggerRef.current) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    // Build particles — 45 per lane
    const PER_LANE = 45;
    const parts: P[] = [];
    for (let lane = 0; lane < LANES; lane++) {
      for (let i = 0; i < PER_LANE; i++) {
        parts.push({
          lane,
          laneOffset: (Math.random() - 0.5) * 0.04,
          phase: Math.random(),
          speed: 0.035 + Math.random() * 0.05,
          r: 0.8 + Math.random() * 1.6,
          tone: Math.random(),
          alpha: 0.25 + Math.random() * 0.5,
        });
      }
    }

    const st = ScrollTrigger.create({
      trigger: triggerRef.current,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        progressRef.current = self.progress;
      },
    });

    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    let rafId = 0;
    let t = 0;

    const draw = () => {
      rafId = requestAnimationFrame(draw);
      t += 0.0065;
      const p = progressRef.current;

      ctx.clearRect(0, 0, w, h);

      // Convergence amount: 0 = flowing streams, 1 = fully gathered at nucleus
      const conv = gsap.utils.clamp(0, 1, (p - 0.25) / 0.45);
      // Brightness peaks as convergence completes
      const nucleusGlow = gsap.utils.clamp(0, 1, (p - 0.55) / 0.3);

      // Nucleus location — right side, vertically centered
      const nx = w * 0.76;
      const ny = h * 0.5;

      // Lane Y positions — evenly distributed vertically
      const laneY = (lane: number) => {
        const pad = h * 0.18;
        return pad + ((h - pad * 2) / (LANES - 1)) * lane;
      };

      for (let i = 0; i < parts.length; i++) {
        const pt = parts[i];
        // Advance phase (slows as convergence kicks in so stream motion calms)
        const flowFactor = 1 - conv * 0.7;
        pt.phase = (pt.phase + pt.speed * flowFactor * 0.016 * 60) % 1;

        // Stream (home) position — flowing left to right
        const sx = pt.phase * w;
        const sy = laneY(pt.lane) + pt.laneOffset * h;

        // Curved convergence — ease each particle toward nucleus along a curve
        // biased by the lane so they all funnel in like streams merging
        const e = ease(conv); // smooth convergence
        // Curve control point — biases the path so particles arc upward/downward
        // into the nucleus instead of traveling in straight lines
        const bias = (pt.lane - (LANES - 1) / 2) / (LANES - 1); // -0.5..0.5
        const ctrlX = sx * (1 - e) + nx * e - 80 * e;
        const ctrlY = sy * (1 - e) + ny * e - bias * 120 * e;

        // Quadratic bezier lerp: P = (1-e)^2*S + 2(1-e)e*C + e^2*N
        const oneMinusE = 1 - e;
        const x = oneMinusE * oneMinusE * sx + 2 * oneMinusE * e * ctrlX + e * e * nx;
        const y = oneMinusE * oneMinusE * sy + 2 * oneMinusE * e * ctrlY + e * e * ny;

        // Size slightly grows into the nucleus
        const size = pt.r * (1 + conv * 0.4);

        // Alpha — visible while flowing, brightest mid-convergence, then fades as
        // it merges into the nucleus disc
        const a =
          pt.alpha *
          (0.5 + (1 - conv) * 0.35 + conv * 0.2) *
          (1 - nucleusGlow * 0.5);

        // Warm palette — darker taupe in flow, brightens to orange as converging
        const rCol = Math.round(80 + conv * 160 + pt.tone * 30);
        const gCol = Math.round(60 + conv * 60 + pt.tone * 20);
        const bCol = Math.round(50 + conv * 20);

        ctx.globalAlpha = Math.max(0, Math.min(1, a));
        ctx.fillStyle = `rgb(${rCol},${gCol},${bCol})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Nucleus glow — the destination
      if (nucleusGlow > 0) {
        const grd = ctx.createRadialGradient(nx, ny, 0, nx, ny, 140);
        grd.addColorStop(0, `rgba(255, 160, 90, ${0.45 * nucleusGlow})`);
        grd.addColorStop(0.5, `rgba(232, 93, 47, ${0.18 * nucleusGlow})`);
        grd.addColorStop(1, "rgba(232, 93, 47, 0)");
        ctx.globalAlpha = 1;
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(nx, ny, 140, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
    };

    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      st.kill();
    };
  }, [triggerRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}

// Smooth ease-in-out
function ease(x: number) {
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}
