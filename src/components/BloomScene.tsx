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
        position: "absolute",
        right: 0,
        top: 0,
        width: "50%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      {/* Build Systems — solo, large */}
      <div className="g3-solo-stage">
        <div className="g3-shape g3-shape-1" />
        <div className="g3-shape g3-shape-2" />
        <div className="g3-shape g3-shape-3" />
      </div>
    </div>
  );
}
