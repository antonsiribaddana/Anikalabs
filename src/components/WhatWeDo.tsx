"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const NebulaBackground = dynamic(() => import("./NebulaBackground"), { ssr: false });
const FractalSingularity = dynamic(() => import("./FractalSingularity"), { ssr: false });

const BLIND_COUNT = 20;

export default function WhatWeDo() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const blindsRef = useRef<HTMLDivElement>(null);
  const tracerRef = useRef<HTMLDivElement>(null);

  // Grid line tracer — dot travels along separator lines
  useEffect(() => {
    const tracer = tracerRef.current as HTMLElement | null;
    const cards = cardsRef.current;
    if (!tracer || !cards) return;

    let tl: gsap.core.Timeline | null = null;

    const build = () => {
      if (tl) tl.kill();
      const w = cards.offsetWidth;
      const h = cards.offsetHeight;
      const col1 = w * 0.3333;
      const col2 = w * 0.6666;

      // Center the 8px diamond on each line: offset by -4px
      const o = -4;
      tl = gsap.timeline({ repeat: -1 });
      tl.set(tracer, { x: o, y: o })
        .to(tracer, { x: col1 + o, y: o, duration: 6, ease: "none" })        // → top
        .to(tracer, { x: col1 + o, y: h + o, duration: 8, ease: "none" })    // ↓ col1
        .to(tracer, { x: col2 + o, y: h + o, duration: 6, ease: "none" })    // → bottom
        .to(tracer, { x: col2 + o, y: o, duration: 8, ease: "none" })        // ↑ col2
        .to(tracer, { x: w + o, y: o, duration: 6, ease: "none" })           // → right edge top
        .to(tracer, { x: w + o, y: h + o, duration: 8, ease: "none" })       // ↓ right edge
        .to(tracer, { x: o, y: h + o, duration: 6, ease: "none" })           // ← bottom
        .to(tracer, { x: o, y: o, duration: 8, ease: "none" });              // ↑ left edge
    };

    requestAnimationFrame(() => requestAnimationFrame(build));
    window.addEventListener("resize", build);

    return () => {
      if (tl) tl.kill();
      window.removeEventListener("resize", build);
    };
  }, []);


  // CSS div blind strip entry animation — disabled

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const para = paraRef.current;
    if (!section || !heading || !para) return;

    const ctx = gsap.context(() => {
      // Heading fades up
      gsap.fromTo(
        heading,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 55%",
            end: "top 25%",
            scrub: 1,
          },
        }
      );

      // Paragraph fades up after
      gsap.fromTo(
        para,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 45%",
            end: "top 15%",
            scrub: 1,
          },
        }
      );

      // Card geometric icon animations
      const cards = cardsRef.current;
      if (cards) {
        const g2Inner = cards.querySelector(".g2-card-inner");
        if (g2Inner) {
          gsap.to(g2Inner, { rotate: 360, duration: 2.5, ease: "expo.inOut", repeat: -1, repeatDelay: 0.4 });
        }

        const g3Circle = cards.querySelector(".g3-card-circle");
        const g3Dashed = cards.querySelector(".g3-card-dashed");
        if (g3Circle && g3Dashed) {
          const g3Tl = gsap.timeline({ repeat: -1, repeatDelay: 0.4 });
          g3Tl
            .to(g3Dashed, { rotation: 45, duration: 0.9, ease: "power2.inOut" }, 0.3)
            .to(g3Circle, { scale: 0.75, borderColor: "rgba(161,130,255,0.6)", duration: 1, ease: "power2.inOut" }, 0.4)
            .to(g3Dashed, { rotation: 0, duration: 1, ease: "elastic.out(1, 0.25)" }, 1.4)
            .to(g3Circle, { scale: 1, borderColor: "#F17752", duration: 1, ease: "elastic.out(1, 0.25)" }, 1.4);
        }

        const g1Rings = cards.querySelectorAll(".g1-card-stage > div");
        if (g1Rings.length === 3) {
          const g1Tl = gsap.timeline({ repeat: -1, repeatDelay: 0.4 });
          g1Tl
            .to(g1Rings[0], { rotateY: 0, duration: 0.5, ease: "expo.in" }, 0.5)
            .to(g1Rings[1], { rotateY: 0, duration: 0.5, ease: "expo.in" }, 0.5)
            .to(g1Rings[0], { rotateY: 60, duration: 0.5, ease: "expo" }, 1)
            .to(g1Rings[1], { rotateY: 40, duration: 0.5, ease: "expo" }, 1);
        }
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      style={{ background: "#fffbf2", paddingTop: "0" }}
    >
      <div
        ref={innerRef}
        data-wwd-section
        className="relative overflow-hidden"
        style={{ background: "#02021e" }}
      >
        {/* Nebula shader background */}
        <NebulaBackground />

        {/* Fractal singularity — right side */}
        <FractalSingularity />


        {/* Content */}
        <div
          className="relative z-10 flex flex-col"
          style={{ paddingTop: "clamp(80px, 9vw, 140px)", paddingBottom: "clamp(64px, 6vw, 100px)", paddingLeft: "clamp(20px, 6vw, 112px)", paddingRight: "clamp(20px, 6vw, 112px)" }}
        >
          <div className="flex flex-col items-start" style={{ gap: "0" }}>
            <div className="flex flex-col w-full" style={{ paddingTop: "20px" }}>
              <h2
                ref={headingRef}
                className="text-white"
                style={{
                  fontSize: "clamp(40px, 5vw, 80px)",
                  fontFamily: "'PP Neue Montreal', 'Inter', system-ui, sans-serif",
                  fontWeight: 500,
                  letterSpacing: "0px",
                  lineHeight: 1.05,
                  marginBottom: "28px",
                  opacity: 0,
                }}
              >
                Built with structure.<br />Refined through brand.
              </h2>
              <p
                ref={paraRef}
                className="text-white/75 leading-[1.6]"
                style={{
                  fontSize: "clamp(16px, 1.6vw, 22px)",
                  fontFamily: "'PP Neue Montreal', sans-serif",
                  opacity: 0,
                  maxWidth: "700px",
                }}
              >
                We shape your ideas into something clear and intentional. Not just good looking, but something people understand, connect with, and remember. Built to guide, convert, and perform. Not something people scroll past.
              </p>
            </div>

          </div>

          <div ref={cardsRef} className="relative flex flex-col md:flex-row" style={{ marginTop: "clamp(60px, 8vw, 120px)", borderTop: "1px solid rgba(138,100,255,0.18)" }}>
            {/* Left outer line — extends 50px above (desktop only) */}
            <div className="hidden md:block" style={{ position: "absolute", top: "-50px", bottom: 0, left: 0, width: "1px", background: "rgba(138,100,255,0.18)" }} />
            {/* Bottom line — extends 60px beyond the left vertical line (desktop only) */}
            <div className="hidden md:block" style={{ position: "absolute", bottom: 0, left: "-60px", right: 0, height: "1px", background: "rgba(138,100,255,0.18)" }} />
            {/* Middle divider 1 (desktop only) */}
            <div className="hidden md:block" style={{ position: "absolute", top: 0, bottom: 0, left: "33.33%", width: "1px", background: "rgba(138,100,255,0.18)" }} />
            {/* Middle divider 2 (desktop only) */}
            <div className="hidden md:block" style={{ position: "absolute", top: 0, bottom: 0, left: "66.66%", width: "1px", background: "rgba(138,100,255,0.18)" }} />
            {/* Right outer line — extends 50px below (desktop only) */}
            <div className="hidden md:block" style={{ position: "absolute", top: 0, bottom: "-50px", right: 0, width: "1px", background: "rgba(138,100,255,0.18)" }} />

            {/* Diamond tracer (desktop only) */}
            <div
              ref={tracerRef}
              className="hidden md:block"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "8px",
                height: "8px",
                background: "linear-gradient(135deg, #F17752, #ffb347)",
                transform: "rotate(45deg)",
                transformOrigin: "center center",
                pointerEvents: "none",
                zIndex: 10,
              }}
            />

            {/* Card 1 — Discovery */}
            <div className="wwd-card" style={{
              flex: 1,
              padding: "clamp(32px, 4vw, 60px) clamp(20px, 3vw, 48px) clamp(48px, 5vw, 80px) clamp(20px, 2vw, 32px)",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              minHeight: "clamp(320px, 35vw, 520px)",
            }}>
              <div className="g2-card-stage" style={{ position: "relative", width: "160px", height: "120px", marginBottom: "8px" }}>
                <div style={{ position: "absolute", width: "90px", height: "90px", borderRadius: "50%", border: "2px solid rgba(255,255,255,0.25)", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
                <div className="g2-card-inner" style={{ position: "absolute", width: "90px", height: "90px", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                  <div style={{ position: "absolute", width: "55px", height: "55px", borderRadius: "50%", border: "2px dashed rgba(161,130,255,0.5)", top: "50%", left: "0", transform: "translateY(-50%)" }} />
                  <div style={{ position: "absolute", width: "55px", height: "55px", borderRadius: "50%", border: "2px solid #F17752", top: "50%", right: "0", transform: "translateY(-50%)" }} />
                </div>
              </div>
              <h4 style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontSize: "28px", fontWeight: 600, color: "#fff", margin: 0, lineHeight: 1.2 }}>
                Discovery
              </h4>
              <p style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontSize: "17px", color: "rgba(255,255,255,0.45)", lineHeight: "1.7", margin: 0 }}>
                We align on your goals, audience, and priorities fast.
                No fluff. Just clarity on what needs to be built and why.
              </p>
            </div>

            {/* Card 2 — Design & Build */}
            <div className="wwd-card" style={{
              flex: 1,
              padding: "clamp(32px, 4vw, 60px) clamp(20px, 3vw, 48px) clamp(48px, 5vw, 80px) clamp(20px, 2vw, 32px)",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              minHeight: "clamp(320px, 35vw, 520px)",
            }}>
              <div className="g3-card-stage" style={{ position: "relative", width: "160px", height: "120px", marginBottom: "8px" }}>
                <div className="g3-card-square" style={{ position: "absolute", width: "80px", height: "80px", border: "2px solid rgba(255,255,255,0.25)", left: "20px", top: "20px" }} />
                <div className="g3-card-circle" style={{ position: "absolute", width: "80px", height: "80px", borderRadius: "50%", border: "2px solid #F17752", left: "20px", top: "20px" }} />
                <div className="g3-card-dashed" style={{ position: "absolute", width: "80px", height: "80px", borderRadius: "50%", border: "2px dashed rgba(161,130,255,0.5)", left: "60px", top: "0px" }} />
              </div>
              <h4 style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontSize: "28px", fontWeight: 600, color: "#fff", margin: 0, lineHeight: 1.2 }}>
                Design & Build
              </h4>
              <p style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontSize: "17px", color: "rgba(255,255,255,0.45)", lineHeight: "1.7", margin: 0 }}>
                We design and develop your site as a structured system.
                Every element purposeful. Every interaction intentional.
              </p>
            </div>

            {/* Card 3 — Launch & Perform */}
            <div style={{
              flex: 1,
              padding: "clamp(32px, 4vw, 60px) clamp(20px, 2vw, 32px) clamp(48px, 5vw, 80px) clamp(20px, 2vw, 32px)",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              minHeight: "clamp(320px, 35vw, 520px)",
            }}>
              <div className="g1-card-stage" style={{ position: "relative", width: "160px", height: "120px", marginBottom: "8px" }}>
                <div style={{ position: "absolute", width: "100px", height: "100px", borderRadius: "50%", border: "2px dashed rgba(161,130,255,0.45)", top: "50%", left: "50%", transform: "translate(-50%, -50%) rotateY(60deg)", perspective: "400px" }} />
                <div style={{ position: "absolute", width: "100px", height: "100px", borderRadius: "50%", border: "2px solid rgba(255,255,255,0.6)", top: "50%", left: "50%", transform: "translate(-50%, -50%) rotateY(40deg)" }} />
                <div style={{ position: "absolute", width: "100px", height: "100px", borderRadius: "50%", border: "2px solid #F17752", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
              </div>
              <h4 style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontSize: "28px", fontWeight: 600, color: "#fff", margin: 0, lineHeight: 1.2 }}>
                Launch & Perform
              </h4>
              <p style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontSize: "17px", color: "rgba(255,255,255,0.45)", lineHeight: "1.7", margin: 0 }}>
                You go live with a brand and website built to convert.
                We stay close to refine and make sure it performs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
