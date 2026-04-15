"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─── Utility: split text into span-wrapped words ─── */
function SplitWords({ text, className, style }: { text: string; className?: string; style?: React.CSSProperties }) {
  return (
    <span className={className} style={{ ...style, display: "inline" }}>
      {text.split(" ").map((word, i) => (
        <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top" }}>
          <span className="dylan-word" style={{ display: "inline-block", transform: "translateY(110%)", opacity: 0 }}>
            {word}&nbsp;
          </span>
        </span>
      ))}
    </span>
  );
}

/* ─── Floating label component ─── */
function FloatingLabel({ text, top, left, right, bottom, delay = 0 }: {
  text: string; top?: string; left?: string; right?: string; bottom?: string; delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(ref.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1.2, delay: delay + 1.8, ease: "power3.out" }
    );
  }, [delay]);

  return (
    <div ref={ref} style={{
      position: "absolute", top, left, right, bottom,
      fontFamily: "'PP Neue Montreal', sans-serif",
      fontSize: "12px",
      fontWeight: 500,
      color: "rgba(255,255,255,0.45)",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      opacity: 0,
      zIndex: 20,
    }}>
      {text}
    </div>
  );
}

/* ─── Real-time clock label ─── */
function ClockLabel({ top, right, delay = 0 }: { top?: string; right?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(ref.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1.2, delay: delay + 1.8, ease: "power3.out" }
    );
  }, [delay]);

  return (
    <div ref={ref} style={{
      position: "absolute", top, right,
      fontFamily: "'PP Neue Montreal', sans-serif",
      fontSize: "12px",
      fontWeight: 500,
      color: "rgba(255,255,255,0.45)",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      opacity: 0,
      zIndex: 20,
      fontVariantNumeric: "tabular-nums",
    }}>
      {time} IST
    </div>
  );
}

export default function TestPage() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoFrameRef = useRef<HTMLDivElement>(null);
  const ghostTextRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const showreelBtnRef = useRef<HTMLButtonElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const videoFrame = videoFrameRef.current;
    const ghostText = ghostTextRef.current;
    const tagline = taglineRef.current;
    if (!section || !videoFrame || !ghostText || !tagline) return;

    const ctx = gsap.context(() => {
      /* ── 1. Intro animations (on load) ── */
      const tl = gsap.timeline({ delay: 0.3 });

      // Ghost text slides up
      tl.fromTo(ghostText,
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.4, ease: "power3.out" },
        0
      );

      // Video frame scales up with clip-path reveal
      tl.fromTo(videoFrame,
        {
          scale: 0.85,
          clipPath: "inset(15% 15% 15% 15% round 16px)",
          opacity: 0,
        },
        {
          scale: 1,
          clipPath: "inset(3% 3% 3% 3% round 16px)",
          opacity: 1,
          duration: 1.6,
          ease: "power3.out",
        },
        0.2
      );

      // Word reveals
      tl.to(".dylan-word", {
        y: 0,
        opacity: 1,
        duration: 0.9,
        stagger: 0.06,
        ease: "power3.out",
      }, 0.6);

      // Subtitle fade in
      if (subtitleRef.current) {
        tl.fromTo(subtitleRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
          1.2
        );
      }

      // Showreel button
      if (showreelBtnRef.current) {
        tl.fromTo(showreelBtnRef.current,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.5)" },
          1.4
        );
      }

      // Scroll indicator
      if (scrollIndicatorRef.current) {
        tl.fromTo(scrollIndicatorRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 1 },
          2.0
        );
      }

      /* ── 2. Scroll-triggered transforms ── */
      // Video frame: perspective skew → flat as you scroll
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress;

          // Video frame transforms
          const skewY = 3 * (1 - p);
          const rotateY = -8 * (1 - p);
          const translateY = -p * 200;
          const inset = 3 - p * 3;
          gsap.set(videoFrame, {
            rotateY,
            skewY,
            y: translateY,
            clipPath: `inset(${Math.max(inset, 0)}% ${Math.max(inset, 0)}% ${Math.max(inset, 0)}% ${Math.max(inset, 0)}% round 16px)`,
          });

          // Ghost text parallax
          gsap.set(ghostText, {
            y: -p * 300,
            opacity: 1 - p * 2,
          });

          // Tagline parallax & blur
          const blurVal = Math.max(0, (p - 0.4) * 20);
          gsap.set(tagline, {
            y: -p * 120,
            filter: `blur(${blurVal}px)`,
            opacity: 1 - Math.max(0, (p - 0.5) * 3),
          });

          // Overlay darkening
          if (overlayRef.current) {
            gsap.set(overlayRef.current, {
              opacity: p * 0.6,
            });
          }
        },
      });

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Full hero section */}
      <section
        ref={sectionRef}
        style={{
          position: "relative",
          width: "100%",
          minHeight: "200vh", // Extra scroll room
          background: "#02021e",
          overflow: "hidden",
        }}
      >
        {/* ── Sticky container ── */}
        <div style={{
          position: "sticky",
          top: 0,
          width: "100%",
          height: "100vh",
          overflow: "hidden",
          perspective: "1200px",
        }}>

          {/* Gradient overlays */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse 80% 60% at 20% 10%, rgba(241,119,82,0.12) 0%, transparent 60%)",
            pointerEvents: "none",
            zIndex: 1,
          }} />
          <div style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse 60% 50% at 80% 90%, rgba(90,40,200,0.08) 0%, transparent 60%)",
            pointerEvents: "none",
            zIndex: 1,
          }} />

          {/* ── Ghost text (huge background text) ── */}
          <div
            ref={ghostTextRef}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 2,
              whiteSpace: "nowrap",
              pointerEvents: "none",
              opacity: 0,
            }}
          >
            <span style={{
              fontFamily: "var(--font-inter), 'Inter', sans-serif",
              fontWeight: 200,
              fontSize: "clamp(80px, 14vw, 220px)",
              color: "transparent",
              WebkitTextStroke: "1px rgba(255,255,255,0.06)",
              letterSpacing: "-4px",
              lineHeight: 1,
              userSelect: "none",
            }}>
              ANIKA LABS
            </span>
          </div>

          {/* ── Video frame with perspective ── */}
          <div
            ref={videoFrameRef}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "clamp(320px, 55vw, 800px)",
              aspectRatio: "16/10",
              zIndex: 5,
              borderRadius: "16px",
              overflow: "hidden",
              opacity: 0,
              willChange: "transform, clip-path",
              boxShadow: "0 40px 80px rgba(0,0,0,0.5), 0 0 120px rgba(241,119,82,0.08)",
            }}
          >
            {/* Video inside frame */}
            <video
              autoPlay
              muted
              loop
              playsInline
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            >
              <source src="/images/hero-bg.mp4" type="video/mp4" />
            </video>

            {/* Subtle inner overlay */}
            <div style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, rgba(2,2,30,0.1) 0%, rgba(2,2,30,0.3) 100%)",
              pointerEvents: "none",
            }} />
          </div>

          {/* ── PLAY SHOWREEL button ── */}
          <button
            ref={showreelBtnRef}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              gap: "12px",
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "100px",
              padding: "14px 28px",
              cursor: "pointer",
              opacity: 0,
              transition: "background 0.3s, transform 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(241,119,82,0.15)";
              e.currentTarget.style.transform = "translate(-50%, -50%) scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.08)";
              e.currentTarget.style.transform = "translate(-50%, -50%) scale(1)";
            }}
          >
            {/* Orange dot */}
            <span style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "#f17752",
              boxShadow: "0 0 12px rgba(241,119,82,0.6)",
              flexShrink: 0,
            }} />
            <span style={{
              fontFamily: "'PP Neue Montreal', sans-serif",
              fontSize: "13px",
              fontWeight: 500,
              color: "#fff",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}>
              Play Showreel
            </span>
          </button>

          {/* ── Tagline text ── */}
          <div
            ref={taglineRef}
            style={{
              position: "absolute",
              bottom: "clamp(100px, 14vh, 180px)",
              left: "clamp(24px, 5vw, 80px)",
              zIndex: 15,
              maxWidth: "700px",
            }}
          >
            <h1 style={{
              fontFamily: "var(--font-inter), 'Inter', sans-serif",
              fontWeight: 200,
              fontSize: "clamp(28px, 3.8vw, 56px)",
              lineHeight: 1.15,
              color: "#fff",
              margin: 0,
              letterSpacing: "-1px",
            }}>
              <SplitWords text="We craft experience-driven digital systems for brands that move with purpose" />
            </h1>
          </div>

          {/* ── Subtitle / role ── */}
          <div
            ref={subtitleRef}
            style={{
              position: "absolute",
              bottom: "clamp(60px, 10vh, 140px)",
              right: "clamp(24px, 5vw, 80px)",
              zIndex: 15,
              opacity: 0,
            }}
          >
            <p style={{
              fontFamily: "'PP Neue Montreal', sans-serif",
              fontSize: "13px",
              fontWeight: 500,
              color: "rgba(255,255,255,0.5)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              margin: 0,
              textAlign: "right",
            }}>
              Creative Design Studio
              <br />
              <span style={{ color: "rgba(241,119,82,0.7)" }}>Web • Brand • Systems</span>
            </p>
          </div>

          {/* ── Floating labels ── */}
          <FloatingLabel text="Design by Anika" top="clamp(90px, 12vh, 140px)" left="clamp(24px, 5vw, 80px)" delay={0} />
          <FloatingLabel text="Sri Lanka" bottom="clamp(40px, 6vh, 80px)" left="clamp(24px, 5vw, 80px)" delay={0.2} />
          <ClockLabel top="clamp(90px, 12vh, 140px)" right="clamp(24px, 5vw, 80px)" delay={0.1} />
          <FloatingLabel text="International" bottom="clamp(40px, 6vh, 80px)" right="clamp(24px, 5vw, 80px)" delay={0.3} />

          {/* ── Scroll indicator ── */}
          <div
            ref={scrollIndicatorRef}
            style={{
              position: "absolute",
              bottom: "32px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 20,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
              opacity: 0,
            }}
          >
            <span style={{
              fontFamily: "'PP Neue Montreal', sans-serif",
              fontSize: "10px",
              fontWeight: 500,
              color: "rgba(255,255,255,0.3)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}>
              Scroll
            </span>
            <div style={{
              width: "1px",
              height: "40px",
              background: "linear-gradient(180deg, rgba(241,119,82,0.6) 0%, transparent 100%)",
              animation: "scrollPulse 2s ease-in-out infinite",
            }} />
          </div>

          {/* ── Dark overlay for scroll ── */}
          <div
            ref={overlayRef}
            style={{
              position: "absolute",
              inset: 0,
              background: "#02021e",
              opacity: 0,
              pointerEvents: "none",
              zIndex: 25,
            }}
          />
        </div>
      </section>

      {/* Spacer section so scroll works */}
      <section style={{
        minHeight: "100vh",
        background: "#02021e",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <p style={{
          fontFamily: "'PP Neue Montreal', sans-serif",
          fontSize: "18px",
          color: "rgba(255,255,255,0.3)",
          textAlign: "center",
        }}>
          ↑ Scroll back up to see the header animation
        </p>
      </section>

      {/* Scroll pulse animation */}
      <style>{`
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.4; transform: scaleY(1); }
          50% { opacity: 1; transform: scaleY(1.3); }
        }
      `}</style>
    </>
  );
}
