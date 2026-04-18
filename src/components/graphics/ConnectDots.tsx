"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Connect the dots — a scroll-driven network graphic.
 *
 * Metaphor: scattered freelancer work → a connected system.
 *
 * Phase 1 (p 0.0 → 0.4):  ~24 dots sit scattered, drifting lightly
 * Phase 2 (p 0.4 → 0.75): dots ease into fixed network positions
 *                         edges draw in one-by-one as connections resolve
 * Phase 3 (p 0.75 → 1.0): nucleus brightens, subtle breathing
 *
 * 2D canvas, transform-only, no filters, 60fps on mid laptops.
 */

type Node = {
  // scattered (home) position — random across the canvas
  sx: number; sy: number;
  // network (target) position — deliberate coordinates in a radial lattice
  tx: number; ty: number;
  // drift parameters — layered oscillations so every dot moves differently
  seedA: number;   // primary phase
  seedB: number;   // secondary phase
  freqA: number;   // primary frequency
  freqB: number;   // secondary frequency
  ampX: number;    // horizontal amplitude
  ampY: number;    // vertical amplitude
  // size
  r: number;
};

export default function ConnectDots({ triggerRef }: { triggerRef: React.RefObject<HTMLElement | null> }) {
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

    // Build the network layout in normalised space (0..1 on each axis)
    // Centre nucleus + 3 rings of orbiting nodes
    type Layout = { x: number; y: number; r: number };
    const layout: Layout[] = [];
    // Nucleus
    layout.push({ x: 0.5, y: 0.5, r: 4 });
    // Inner ring — 6 nodes
    const inner = 6;
    for (let i = 0; i < inner; i++) {
      const a = (i / inner) * Math.PI * 2 - Math.PI / 2;
      layout.push({ x: 0.5 + Math.cos(a) * 0.16, y: 0.5 + Math.sin(a) * 0.22, r: 3 });
    }
    // Outer ring — 10 nodes
    const outer = 10;
    for (let i = 0; i < outer; i++) {
      const a = (i / outer) * Math.PI * 2 - Math.PI / 2 + Math.PI / outer;
      layout.push({ x: 0.5 + Math.cos(a) * 0.34, y: 0.5 + Math.sin(a) * 0.42, r: 2.6 });
    }
    // Far satellites — 6 scattered
    const sats: { x: number; y: number }[] = [
      { x: 0.12, y: 0.22 },
      { x: 0.18, y: 0.8 },
      { x: 0.88, y: 0.18 },
      { x: 0.92, y: 0.78 },
      { x: 0.5, y: 0.08 },
      { x: 0.5, y: 0.92 },
    ];
    sats.forEach((s) => layout.push({ x: s.x, y: s.y, r: 2.2 }));

    const N = layout.length;

    // Build edges — connections between indices
    type Edge = { a: number; b: number; order: number };
    const edges: Edge[] = [];
    // Nucleus → inner ring
    for (let i = 1; i <= inner; i++) edges.push({ a: 0, b: i, order: i });
    // Inner ring around
    for (let i = 1; i <= inner; i++) {
      const next = i === inner ? 1 : i + 1;
      edges.push({ a: i, b: next, order: inner + i });
    }
    // Inner → outer (skip-one pattern)
    for (let i = 0; i < outer; i++) {
      const innerIdx = 1 + (i % inner);
      const outerIdx = 1 + inner + i;
      edges.push({ a: innerIdx, b: outerIdx, order: 2 * inner + i });
    }
    // Outer ring around
    for (let i = 0; i < outer; i++) {
      const cur = 1 + inner + i;
      const next = 1 + inner + ((i + 1) % outer);
      edges.push({ a: cur, b: next, order: 2 * inner + outer + i });
    }
    // Satellites connect to nearest outer nodes
    const satStart = 1 + inner + outer;
    for (let i = 0; i < sats.length; i++) {
      // pick two nearest outer nodes
      const s = layout[satStart + i];
      const outerIdxs = [] as { idx: number; d: number }[];
      for (let j = 0; j < outer; j++) {
        const o = layout[1 + inner + j];
        const d = (o.x - s.x) ** 2 + (o.y - s.y) ** 2;
        outerIdxs.push({ idx: 1 + inner + j, d });
      }
      outerIdxs.sort((a, b) => a.d - b.d);
      edges.push({ a: satStart + i, b: outerIdxs[0].idx, order: 2 * inner + 2 * outer + i * 2 });
      edges.push({ a: satStart + i, b: outerIdxs[1].idx, order: 2 * inner + 2 * outer + i * 2 + 1 });
    }
    const edgeCount = edges.length;

    // Build the nodes with scattered start positions and layered drift.
    // Wider amplitudes so dots visibly roam, not twitch in place.
    const nodes: Node[] = layout.map((l) => ({
      sx: 0.1 + Math.random() * 0.8,
      sy: 0.1 + Math.random() * 0.8,
      tx: l.x,
      ty: l.y,
      seedA: Math.random() * Math.PI * 2,
      seedB: Math.random() * Math.PI * 2,
      freqA: 0.6 + Math.random() * 1.0,
      freqB: 1.0 + Math.random() * 1.6,
      ampX: 0.09 + Math.random() * 0.09,   // 9–18% of width
      ampY: 0.11 + Math.random() * 0.12,   // 11–23% of height
      r: l.r + 0.6,
    }));

    // Dust particles — 60 smaller ambient dots that ALWAYS drift, independent
    // of the network. Keeps the space feeling alive even when the network has
    // settled. They fade out as the nucleus brightens.
    type Dust = {
      x: number; y: number;
      seedA: number; seedB: number;
      freqA: number; freqB: number;
      ampX: number; ampY: number;
      r: number;
      alpha: number;
    };
    const dust: Dust[] = Array.from({ length: 60 }, () => ({
      x: Math.random(),
      y: Math.random(),
      seedA: Math.random() * Math.PI * 2,
      seedB: Math.random() * Math.PI * 2,
      freqA: 0.4 + Math.random() * 1.2,
      freqB: 0.7 + Math.random() * 1.4,
      ampX: 0.05 + Math.random() * 0.1,
      ampY: 0.07 + Math.random() * 0.13,
      r: 0.6 + Math.random() * 1.4,
      alpha: 0.15 + Math.random() * 0.4,
    }));

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

    // Tie progress to the PINNED scroll range of the manifesto section
    // (same start/end as the pin timeline), so p=0 is slide 1 start and
    // p=1 is slide 2 end. Otherwise "top bottom → bottom top" would already
    // be at ~0.5 when the section fills the viewport.
    const st = ScrollTrigger.create({
      trigger: triggerRef.current,
      start: "top top",
      end: "+=150%",
      scrub: 0.8,
      onUpdate: (self) => {
        progressRef.current = self.progress;
      },
    });

    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    let rafId = 0;
    let t = 0;

    const ease = (x: number) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);

    const draw = () => {
      rafId = requestAnimationFrame(draw);
      t += 0.016;
      const p = progressRef.current;

      // Phase progress — hard gate so scattered phase shows NO lines
      //   p 0.00 → 0.45 : scattered only
      //   p 0.45 → 0.70 : dots converge to network positions
      //   p 0.70 → 0.90 : edges draw in one-by-one
      //   p 0.85 → 1.00 : nucleus + node pulses + signal shimmer active
      const converge = gsap.utils.clamp(0, 1, (p - 0.45) / 0.25);
      const connect = gsap.utils.clamp(0, 1, (p - 0.7) / 0.2);
      const settle = gsap.utils.clamp(0, 1, (p - 0.85) / 0.15);

      const e = ease(converge);

      ctx.clearRect(0, 0, w, h);

      // Dust layer — ambient coral motes that always drift, keeps the entire
      // canvas feeling alive regardless of phase. Fades slightly as the
      // network forms so it doesn't fight the nodes for attention.
      const dustAlpha = 0.6 + (1 - converge) * 0.4;
      for (let i = 0; i < dust.length; i++) {
        const d = dust[i];
        const dx =
          (d.x +
            Math.sin(t * d.freqA + d.seedA) * d.ampX * 0.5 +
            Math.cos(t * d.freqB + d.seedB) * d.ampX * 0.3) *
          w;
        const dy =
          (d.y +
            Math.cos(t * d.freqA * 0.9 + d.seedA) * d.ampY * 0.5 +
            Math.sin(t * d.freqB * 1.2 + d.seedB) * d.ampY * 0.3) *
          h;
        const pulseA = 0.5 + 0.5 * Math.sin(t * 1.4 + d.seedA);
        ctx.fillStyle = `rgba(210, 110, 70, ${d.alpha * dustAlpha * (0.5 + pulseA * 0.5)})`;
        ctx.beginPath();
        ctx.arc(dx, dy, d.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Drift fades out as dots converge toward their network positions
      const driftStrength = 1 - e;

      // Compute current node positions
      const pos = nodes.map((n) => {
        // Layered oscillation — two sines at different frequencies so every
        // particle has its own unique organic path, not a synced wobble
        const driftX =
          (Math.sin(t * n.freqA + n.seedA) * 0.6 +
            Math.cos(t * n.freqB + n.seedB) * 0.4) *
          n.ampX *
          driftStrength;
        const driftY =
          (Math.cos(t * n.freqA * 0.85 + n.seedA) * 0.6 +
            Math.sin(t * n.freqB * 1.1 + n.seedB) * 0.4) *
          n.ampY *
          driftStrength;

        const sx = (n.sx + driftX) * w;
        const sy = (n.sy + driftY) * h;
        const tx = n.tx * w;
        const ty = n.ty * h;
        return { x: sx + (tx - sx) * e, y: sy + (ty - sy) * e };
      });

      // Draw edges — only after convergence is essentially complete AND
      // the connect phase has kicked in. Hard double gate so no lines ever
      // appear during the scattered or mid-convergence phases.
      if (connect > 0 && converge > 0.9) {
        for (let i = 0; i < edgeCount; i++) {
          const ed = edges[i];
          const edgeProgress = gsap.utils.clamp(0, 1, connect * edgeCount - ed.order);
          if (edgeProgress <= 0) continue;
          const a = pos[ed.a];
          const b = pos[ed.b];
          const lx = a.x + (b.x - a.x) * edgeProgress;
          const ly = a.y + (b.y - a.y) * edgeProgress;
          // Warm coral edges (not cold gray) that blend with the background
          ctx.strokeStyle = `rgba(178, 78, 44, ${0.35 + settle * 0.25})`;
          ctx.lineWidth = 1.1;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(lx, ly);
          ctx.stroke();
        }

        // Signal shimmer — bright coral pulses traveling along fully drawn
        // edges with a soft halo, like live signal flowing through the system
        if (connect > 0.3) {
          const shimmerStrength = gsap.utils.clamp(0, 1, (connect - 0.3) / 0.5);
          const PULSES = 14;
          for (let k = 0; k < PULSES; k++) {
            const ed = edges[(k * 13 + Math.floor(t * 0.25)) % edgeCount];
            const fullyDrawn = connect * edgeCount - ed.order;
            if (fullyDrawn < 1) continue;
            const a = pos[ed.a];
            const b = pos[ed.b];
            const phase = (t * 0.45 + k * 0.13) % 1;
            const px = a.x + (b.x - a.x) * phase;
            const py = a.y + (b.y - a.y) * phase;

            // Soft halo glow around the head
            const halo = ctx.createRadialGradient(px, py, 0, px, py, 10);
            halo.addColorStop(0, `rgba(255, 210, 150, ${0.7 * shimmerStrength})`);
            halo.addColorStop(1, "rgba(255, 150, 80, 0)");
            ctx.fillStyle = halo;
            ctx.beginPath();
            ctx.arc(px, py, 10, 0, Math.PI * 2);
            ctx.fill();

            // Bright head
            ctx.fillStyle = `rgba(255, 230, 200, ${0.95 * shimmerStrength})`;
            ctx.beginPath();
            ctx.arc(px, py, 3.2, 0, Math.PI * 2);
            ctx.fill();

            // Trailing tail
            for (let s = 1; s <= 5; s++) {
              const tPhase = phase - s * 0.03;
              if (tPhase < 0) continue;
              const tx = a.x + (b.x - a.x) * tPhase;
              const ty = a.y + (b.y - a.y) * tPhase;
              ctx.fillStyle = `rgba(255, 180, 110, ${(0.55 / s) * shimmerStrength})`;
              ctx.beginPath();
              ctx.arc(tx, ty, 2.6 - s * 0.4, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }

        // Node pulse — each network node breathes a faint expanding ring
        // once the network has settled. Subtle, staggered by node index.
        if (settle > 0) {
          for (let i = 1; i < N; i++) {
            const { x, y } = pos[i];
            const phase = (t * 0.7 + i * 0.37) % 1;
            const ringR = nodes[i].r + phase * 11;
            const ringA = (1 - phase) * 0.4 * settle;
            ctx.strokeStyle = `rgba(232, 93, 47, ${ringA})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.arc(x, y, ringR, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (let i = 0; i < N; i++) {
        const n = nodes[i];
        const { x, y } = pos[i];
        // Nucleus (i === 0) — system control point
        //   · soft outer glow halo
        //   · rotating targeting grid (crosshair + tick marks), very low opacity
        //   · large faint outer ring
        //   · thin inner ring close to core, counter-rotating crosshair
        //   · breathing pulse ring
        //   · small solid core dot with bright highlight
        if (i === 0) {
          const glow = 0.3 + settle * 0.7;
          const appear = settle; // 0..1 as the system settles

          // Soft outer glow halo
          const grd = ctx.createRadialGradient(x, y, 0, x, y, 70);
          grd.addColorStop(0, `rgba(255, 150, 85, ${0.35 * glow})`);
          grd.addColorStop(1, "rgba(232, 93, 47, 0)");
          ctx.fillStyle = grd;
          ctx.beginPath();
          ctx.arc(x, y, 70, 0, Math.PI * 2);
          ctx.fill();

          // Rotating targeting grid — subtle crosshair + tick marks
          // Only appears once the system is settling, very low opacity
          if (appear > 0) {
            const gridRot = t * 0.15;
            const outerRingR = 42;
            const gridA = 0.18 * appear;

            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(gridRot);

            // Long crosshair lines
            ctx.strokeStyle = `rgba(178, 78, 44, ${gridA})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(-outerRingR - 8, 0);
            ctx.lineTo(outerRingR + 8, 0);
            ctx.moveTo(0, -outerRingR - 8);
            ctx.lineTo(0, outerRingR + 8);
            ctx.stroke();

            // 8 tick marks just outside the outer ring
            ctx.strokeStyle = `rgba(178, 78, 44, ${gridA * 1.4})`;
            ctx.lineWidth = 0.8;
            for (let k = 0; k < 8; k++) {
              const ang = (k / 8) * Math.PI * 2 + Math.PI / 8;
              const x1 = Math.cos(ang) * (outerRingR + 2);
              const y1 = Math.sin(ang) * (outerRingR + 2);
              const x2 = Math.cos(ang) * (outerRingR + 7);
              const y2 = Math.sin(ang) * (outerRingR + 7);
              ctx.beginPath();
              ctx.moveTo(x1, y1);
              ctx.lineTo(x2, y2);
              ctx.stroke();
            }
            ctx.restore();

            // Larger faint outer ring
            ctx.strokeStyle = `rgba(178, 78, 44, ${0.22 * appear})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.arc(x, y, outerRingR, 0, Math.PI * 2);
            ctx.stroke();

            // Counter-rotating short crosshair tied to the inner ring
            const innerRingR = 14;
            const innerRot = -t * 0.35;
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(innerRot);
            ctx.strokeStyle = `rgba(232, 93, 47, ${0.5 * appear})`;
            ctx.lineWidth = 0.9;
            for (let k = 0; k < 4; k++) {
              const ang = (k / 4) * Math.PI * 2;
              const x1 = Math.cos(ang) * (innerRingR - 3);
              const y1 = Math.sin(ang) * (innerRingR - 3);
              const x2 = Math.cos(ang) * (innerRingR + 3);
              const y2 = Math.sin(ang) * (innerRingR + 3);
              ctx.beginPath();
              ctx.moveTo(x1, y1);
              ctx.lineTo(x2, y2);
              ctx.stroke();
            }
            ctx.restore();

            // Thin inner ring close to core
            ctx.strokeStyle = `rgba(232, 93, 47, ${0.7 * appear})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(x, y, innerRingR, 0, Math.PI * 2);
            ctx.stroke();

            // Breathing pulse ring — expands outward and fades
            const pulse = (t * 0.5) % 1;
            const pulseR = innerRingR + pulse * (outerRingR - innerRingR);
            const pulseA = (1 - pulse) * 0.5 * appear;
            ctx.strokeStyle = `rgba(232, 93, 47, ${pulseA})`;
            ctx.lineWidth = 0.9;
            ctx.beginPath();
            ctx.arc(x, y, pulseR, 0, Math.PI * 2);
            ctx.stroke();
          }

          // Solid core dot
          ctx.fillStyle = "#e85d2f";
          ctx.beginPath();
          ctx.arc(x, y, 5 + settle * 1.2, 0, Math.PI * 2);
          ctx.fill();

          // Bright highlight
          ctx.fillStyle = "rgba(255, 240, 220, 0.95)";
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fill();
          continue;
        }

        // Regular node — warm coral with a soft glow halo so they feel alive
        const nodeHalo = ctx.createRadialGradient(x, y, 0, x, y, n.r * 3.5);
        nodeHalo.addColorStop(0, `rgba(255, 160, 100, ${0.35 + settle * 0.25})`);
        nodeHalo.addColorStop(1, "rgba(232, 93, 47, 0)");
        ctx.fillStyle = nodeHalo;
        ctx.beginPath();
        ctx.arc(x, y, n.r * 3.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(178, 70, 38, ${0.88})`;
        ctx.beginPath();
        ctx.arc(x, y, n.r, 0, Math.PI * 2);
        ctx.fill();

        // Bright highlight dot on top
        ctx.fillStyle = `rgba(255, 230, 200, ${0.7 + settle * 0.3})`;
        ctx.beginPath();
        ctx.arc(x, y, n.r * 0.45, 0, Math.PI * 2);
        ctx.fill();
      }
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
