"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ConnectDots = dynamic(() => import("./graphics/ConnectDots"), { ssr: false });

/**
 * Awwwards-style pinned manifesto.
 *   - One viewport pinned section, ~150vh of scroll
 *   - Slide 1 ("80% of freelancers just building a site") holds, then fades out
 *   - Slide 2 ("We build a system that works for your business") fades in
 *   - Right side holds a ConnectDots graphic that evolves with scroll:
 *     scattered dots → network of connected nodes → nucleus brightens
 *
 * Only transform + opacity animated on the text. The graphic is a separate
 * canvas that reads scroll progress directly, so text transitions never lag.
 */
export default function ProcessManifesto() {
  const rootRef = useRef<HTMLDivElement>(null);
  const slide1Ref = useRef<HTMLDivElement>(null);
  const slide2Ref = useRef<HTMLDivElement>(null);
  const bgSolutionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set(slide2Ref.current, { autoAlpha: 0, yPercent: 8 });
      gsap.set(bgSolutionRef.current, { autoAlpha: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "+=150%",
          scrub: 1,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Slide 1 fades and lifts out of frame so it doesn't overlap slide 2.
      // (Keeping it at full opacity while in frame — only fades once it's
      // already sliding out, so the text stays crisp during its own slide.)
      tl.to(slide1Ref.current, { yPercent: -100, autoAlpha: 0, duration: 0.3 }, 0.4)
        // Shift the bottom of the gradient to a warmer Bogdan-style coral-red
        // in sync with the slide change — top bone color stays identical
        .to(bgSolutionRef.current, { autoAlpha: 1, duration: 0.35 }, 0.4)
        .to(slide2Ref.current, { autoAlpha: 1, yPercent: 0, duration: 0.3 }, 0.45);
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        // Base gradient — problem state (bone → deeper coral toward bottom)
        background:
          "linear-gradient(180deg, #ece8e0 0%, #ece8e0 35%, #f2b48d 78%, #ea6e3e 100%)",
      }}
    >
      {/* Solution backdrop — crossfades in on slide 2.
          Brighter, more luminous warm wash so the solution feels illuminated,
          like the system just switched on */}
      <div
        ref={bgSolutionRef}
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, #ece8e0 0%, #ece8e0 35%, #ff8f66 82%, #ff5a3c 100%)",
          willChange: "opacity",
          pointerEvents: "none",
        }}
      />

      {/* Connecting-dots graphic — lives on the right half the whole time,
          evolves based on scroll progress so it bridges the two slides */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: "45%",
          pointerEvents: "none",
        }}
      >
        <ConnectDots triggerRef={rootRef} />
      </div>

      {/* Slide 1 */}
      <div
        ref={slide1Ref}
        style={{
          position: "absolute",
          inset: 0,
          padding: "clamp(70px, 8vw, 140px) clamp(20px, 6vw, 112px)",
          display: "flex",
          alignItems: "center",
          willChange: "transform, opacity",
        }}
      >
        <h2
          style={{
            fontFamily: "'PP Neue Montreal', 'Inter', system-ui, sans-serif",
            fontWeight: 500,
            fontSize: "clamp(42px, 6.4vw, 104px)",
            lineHeight: 1.02,
            letterSpacing: "-0.02em",
            margin: 0,
            maxWidth: "14ch",
          }}
        >
          <span style={{ color: "#1a1a1a", opacity: 0.4 }}>80% of companies only </span>
          <span style={{ color: "#1a1a1a" }}>build websites.</span>
        </h2>
      </div>

      {/* Slide 2 */}
      <div
        ref={slide2Ref}
        style={{
          position: "absolute",
          inset: 0,
          padding: "clamp(70px, 8vw, 140px) clamp(20px, 6vw, 112px)",
          display: "flex",
          alignItems: "center",
          willChange: "transform, opacity",
        }}
      >
        <h2
          style={{
            fontFamily: "'PP Neue Montreal', 'Inter', system-ui, sans-serif",
            fontWeight: 500,
            fontSize: "clamp(42px, 6.4vw, 104px)",
            lineHeight: 1.02,
            letterSpacing: "-0.02em",
            margin: 0,
            maxWidth: "14ch",
          }}
        >
          <span style={{ color: "#1a1a1a", opacity: 0.4 }}>We build a </span>
          <span style={{ color: "#1a1a1a" }}>system that works</span>
          <span style={{ color: "#1a1a1a", opacity: 0.4 }}> for your business.</span>
        </h2>
      </div>
    </section>
  );
}
