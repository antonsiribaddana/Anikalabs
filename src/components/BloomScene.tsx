"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

// ═══════════════════════════════════════════════════════════
// Geometric animation grid — inspired by vanholtzco CodePen
// Pure CSS shapes + GSAP timelines. No Three.js.
// Adapted for Anika Labs "What We Do" section right side.
// ═══════════════════════════════════════════════════════════

interface BloomSceneProps {
  triggerProgress: number;
}

export default function BloomScene({ triggerProgress }: BloomSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  const blobRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const blob = blobRef.current;
    if (!blob) return;

    // Continuously pulsing blob
    gsap.to(blob, {
      scale: 1.25,
      opacity: 0.55,
      duration: 2.2,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
  }, []);

  useEffect(() => {
    if (triggerProgress < 0.3 || hasAnimated.current) return;
    hasAnimated.current = true;

    const container = containerRef.current;
    if (!container) return;

    // ── Build Systems — circle scales + rotates, dashed circle rotates ──
    const g3Shape2 = container.querySelector(".g3-shape-2") as HTMLElement;
    const g3Shape3 = container.querySelector(".g3-shape-3") as HTMLElement;
    if (g3Shape2 && g3Shape3) {
      gsap.set(g3Shape2, { scale: 1, borderColor: "#4a80ff" });
      gsap.set(g3Shape3, { rotation: 0 });
      const g3Tl = gsap.timeline({ repeat: -1, repeatDelay: 0.4 });
      g3Tl
        .to(g3Shape3, { rotation: 80, duration: 0.9, ease: "power2.inOut" }, 0.3)
        .to(g3Shape2, { scale: 0.75, duration: 1, ease: "power2.inOut" }, 0.4)
        .to(g3Shape2, { borderColor: "#e9e9ea", duration: 1, ease: "power2.inOut" }, 0.4)
        .to(g3Shape3, { rotation: 0, duration: 1, ease: "elastic.out(0.25, 1.4)" })
        .to(g3Shape2, { scale: 1, duration: 1, ease: "elastic.out(0.25, 1.4)" }, "<")
        .to(g3Shape2, { borderColor: "#4a80ff", duration: 1, ease: "elastic.out(0.25, 1.4)" }, "<");
    }

  }, [triggerProgress]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      {/* Pulsing glow blob behind shapes */}
      <div
        ref={blobRef}
        style={{
          position: "absolute",
          width: 480,
          height: 480,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(74,128,255,0.22) 0%, rgba(74,128,255,0.08) 45%, transparent 70%)",
          filter: "blur(40px)",
          opacity: 0.35,
          pointerEvents: "none",
        }}
      />

      {/* Build Systems — solo, large */}
      <div className="g3-solo-stage" style={{ width: 560, height: 560 }}>
        <div className="g3-shape g3-shape-1" style={{ width: 360, height: 360, left: 80, top: 200 }} />
        <div className="g3-shape g3-shape-2" style={{ width: 420, height: 420, left: 50, top: 130 }} />
        <div className="g3-shape g3-shape-3" style={{ width: 340, height: 340, left: 200, top: 30 }} />
      </div>
    </div>
  );
}
