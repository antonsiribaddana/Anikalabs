"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─── Brand logos for marquee ─── */
const brandLogos = [
  "StyleHaven",
  "DataPulse",
  "GreenBridge",
  "Camprodest",
  "Sleeq",
  "BMA Design",
  "GoSage",
  "Château Lumière",
  "PayStream",
  "Wander Women",
];

const results = [
  {
    category: "E-Commerce",
    flag: "🇺🇸",
    headline: "Increased conversion rate by 42% through strategic redesign and UX optimisation",
    metric: "+42%",
    metricLabel: "Conversion Rate",
    rating: 5,
    quote: "Anika Labs delivered a site that actually converts. The results spoke within the first month.",
    client: "Sarah K.",
    role: "Founder, StyleHaven",
    badge: null,
    accent: "#f17752",
  },
  {
    category: "SaaS",
    flag: "🇬🇧",
    headline: "Helped secure $2.1M seed funding with a brand identity that investors trusted",
    metric: "$2.1M",
    metricLabel: "Seed Funding",
    rating: 5,
    quote: "They built a brand that made our pitch deck and product feel like a $10M company.",
    client: "James R.",
    role: "CEO, DataPulse",
    badge: "Funded $2.1M",
    accent: "#a78bfa",
  },
  {
    category: "Agency",
    flag: "🇦🇺",
    headline: "3x lead generation within 60 days through performance-driven web systems",
    metric: "3x",
    metricLabel: "Lead Generation",
    rating: 5,
    quote: "We went from 15 leads/month to consistent 50+ after Anika Labs rebuilt our entire funnel.",
    client: "Dave G.",
    role: "Director, GreenBridge",
    badge: null,
    accent: "#34d399",
  },
  {
    category: "Hospitality",
    flag: "🇫🇷",
    headline: "Reduced bounce rate by 58% with immersive storytelling and performance optimisation",
    metric: "-58%",
    metricLabel: "Bounce Rate",
    rating: 5,
    quote: "Our site finally tells the story our guests experience in person. Bookings have never been higher.",
    client: "Marie L.",
    role: "CMO, Château Lumière",
    badge: null,
    accent: "#f59e0b",
  },
  {
    category: "FinTech",
    flag: "🇩🇪",
    headline: "Scaled to 50K users in 90 days with a product-led growth strategy and clean UX",
    metric: "50K",
    metricLabel: "Users in 90 Days",
    rating: 5,
    quote: "The UX overhaul transformed our onboarding. Activation rates doubled within weeks.",
    client: "Tobias W.",
    role: "CPO, PayStream",
    badge: "Acquired",
    accent: "#06b6d4",
  },
];

export default function Results() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const isAnimatingRef = useRef(false);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dragRef = useRef({ startX: 0, isDragging: false });
  const marqueeRow1Ref = useRef<HTMLDivElement>(null);
  const marqueeRow2Ref = useRef<HTMLDivElement>(null);
  const marqueeWrapRef = useRef<HTMLDivElement>(null);

  const [current, setCurrent] = useState(0);
  const total = results.length;

  /* ─── Navigate to slide ─── */
  const goTo = useCallback((index: number) => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    const nextIndex = ((index % total) + total) % total;
    const direction = nextIndex > current || (current === total - 1 && nextIndex === 0) ? 1 : -1;

    // Animate ALL cards to their new positions
    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      const offset = i - nextIndex;

      gsap.to(card, {
        xPercent: offset * 105,
        scale: offset === 0 ? 1 : 0.88,
        opacity: Math.abs(offset) > 1 ? 0 : offset === 0 ? 1 : 0.4,
        rotateY: offset * -4,
        z: offset === 0 ? 0 : -100,
        filter: offset === 0 ? "blur(0px)" : "blur(2px)",
        duration: 0.8,
        ease: "power3.inOut",
        onComplete: i === nextIndex ? () => { isAnimatingRef.current = false; } : undefined,
      });
    });

    // Progress
    if (progressFillRef.current) {
      gsap.to(progressFillRef.current, {
        width: `${((nextIndex + 1) / total) * 100}%`,
        duration: 0.8,
        ease: "power3.inOut",
      });
    }

    // Counter animation
    if (counterRef.current) {
      gsap.to(counterRef.current, {
        y: -16 * direction,
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          setCurrent(nextIndex);
          if (counterRef.current) {
            gsap.fromTo(counterRef.current,
              { y: 16 * direction, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.2, ease: "power2.out" }
            );
          }
        },
      });
    } else {
      setCurrent(nextIndex);
    }
  }, [current, total]);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  /* ─── Autoplay ─── */
  useEffect(() => {
    autoplayRef.current = setInterval(next, 5000);
    return () => { if (autoplayRef.current) clearInterval(autoplayRef.current); };
  }, [next]);

  const resetAutoplay = useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(next, 5000);
  }, [next]);

  /* ─── Initial card positions ─── */
  useEffect(() => {
    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      const offset = i - 0; // relative to slide 0
      gsap.set(card, {
        xPercent: offset * 105,
        scale: offset === 0 ? 1 : 0.88,
        opacity: Math.abs(offset) > 1 ? 0 : offset === 0 ? 1 : 0.4,
        rotateY: offset * -4,
        z: offset === 0 ? 0 : -100,
        filter: offset === 0 ? "blur(0px)" : "blur(2px)",
      });
    });
    if (progressFillRef.current) {
      gsap.set(progressFillRef.current, { width: `${(1 / total) * 100}%` });
    }
  }, [total]);

  /* ─── Heading scroll reveal ─── */
  useEffect(() => {
    const heading = headingRef.current;
    if (!heading) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(heading, { y: 60, opacity: 0 }, {
        y: 0, opacity: 1, ease: "power3.out",
        scrollTrigger: { trigger: heading, start: "top 85%", end: "top 50%", scrub: 1 },
      });
    });

    return () => ctx.revert();
  }, []);

  /* ─── Drag / swipe ─── */
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const onStart = (x: number) => {
      dragRef.current = { startX: x, isDragging: true };
    };
    const onEnd = (x: number) => {
      if (!dragRef.current.isDragging) return;
      const diff = x - dragRef.current.startX;
      if (Math.abs(diff) > 50) {
        if (diff < 0) { next(); } else { prev(); }
        resetAutoplay();
      }
      dragRef.current.isDragging = false;
    };

    const onMouseDown = (e: MouseEvent) => onStart(e.clientX);
    const onMouseUp = (e: MouseEvent) => onEnd(e.clientX);
    const onTouchStart = (e: TouchEvent) => onStart(e.touches[0].clientX);
    const onTouchEnd = (e: TouchEvent) => onEnd(e.changedTouches[0].clientX);

    slider.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    slider.addEventListener("touchstart", onTouchStart, { passive: true });
    slider.addEventListener("touchend", onTouchEnd);

    return () => {
      slider.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      slider.removeEventListener("touchstart", onTouchStart);
      slider.removeEventListener("touchend", onTouchEnd);
    };
  }, [next, prev, resetAutoplay]);

  /* ─── Keyboard ─── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") { next(); resetAutoplay(); }
      if (e.key === "ArrowLeft") { prev(); resetAutoplay(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev, resetAutoplay]);

  /* ─── Marquee: scroll-direction skew + continuous drift ─── */
  useEffect(() => {
    const row1 = marqueeRow1Ref.current;
    const row2 = marqueeRow2Ref.current;
    const wrap = marqueeWrapRef.current;
    if (!row1 || !row2 || !wrap) return;

    const ctx = gsap.context(() => {
      // Continuous horizontal scroll — row1 left, row2 right
      gsap.to(row1, {
        x: "-50%",
        duration: 40,
        ease: "none",
        repeat: -1,
      });

      gsap.fromTo(row2,
        { x: "-50%" },
        {
          x: "0%",
          duration: 35,
          ease: "none",
          repeat: -1,
        }
      );

      // Scroll-direction skew
      let skew = 0;
      let currentSkew = 0;

      ScrollTrigger.create({
        trigger: wrap,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          skew = self.direction === 1 ? -3 : 3;
        },
      });

      // Smooth lerp the skew
      gsap.ticker.add(() => {
        currentSkew += (skew - currentSkew) * 0.06;
        gsap.set([row1, row2], { skewX: currentSkew });
        // Decay skew back to 0
        skew *= 0.95;
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        background: "#f5f3ef",
        padding: "clamp(80px, 10vw, 160px) 0 clamp(60px, 8vw, 120px)",
        overflow: "hidden",
      }}
    >
      {/* ─── Heading ─── */}
      <div
        ref={headingRef}
        style={{
          textAlign: "center",
          padding: "0 clamp(20px, 5vw, 80px)",
          marginBottom: "clamp(56px, 7vw, 100px)",
        }}
      >
        <p style={{
          fontFamily: "'PP Neue Montreal', sans-serif",
          fontSize: "13px",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "rgba(10,10,10,0.35)",
          margin: "0 0 clamp(16px, 2vw, 28px)",
          fontWeight: 500,
        }}>
          Case Studies
        </p>
        <h2 style={{
          fontFamily: "'NN Nouvelle Grotesk', sans-serif",
          fontSize: "clamp(36px, 5.5vw, 88px)",
          fontWeight: 700,
          lineHeight: 1.05,
          color: "#0a0a0a",
          margin: 0,
          letterSpacing: "-1px",
          textTransform: "uppercase",
        }}>
          Where great ideas
          <br />
          <span style={{ color: "#f17752" }}>became real results</span>
        </h2>
      </div>

      {/* ─── Slider ─── */}
      <div
        ref={sliderRef}
        style={{
          position: "relative",
          width: "100%",
          padding: "0 clamp(20px, 5vw, 80px)",
          cursor: "grab",
          userSelect: "none",
          perspective: "1200px",
        }}
      >
        {/* Cards container */}
        <div
          ref={trackRef}
          style={{
            position: "relative",
            width: "100%",
            height: "clamp(440px, 50vw, 560px)",
          }}
        >
          {results.map((r, i) => (
            <div
              key={i}
              ref={(el) => { if (el) cardsRef.current[i] = el; }}
              style={{
                position: "absolute",
                inset: 0,
                willChange: "transform, opacity, filter",
                transformStyle: "preserve-3d",
              }}
            >
              <div
                style={{
                  display: "flex",
                  height: "100%",
                  background: "#fff",
                  borderRadius: "clamp(16px, 2vw, 24px)",
                  overflow: "hidden",
                  boxShadow: "0 8px 60px rgba(0,0,0,0.06)",
                }}
              >
                {/* ─── Left: Content ─── */}
                <div style={{
                  flex: "1 1 55%",
                  padding: "clamp(32px, 4vw, 56px) clamp(28px, 4vw, 56px)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minWidth: 0,
                }}>
                  {/* Top */}
                  <div>
                    {/* Category + flag + badge */}
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "clamp(20px, 2.5vw, 32px)" }}>
                      <span style={{ fontSize: "18px" }}>{r.flag}</span>
                      <span style={{
                        fontFamily: "'PP Neue Montreal', sans-serif",
                        fontSize: "12px",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "rgba(10,10,10,0.4)",
                        fontWeight: 500,
                      }}>
                        {r.category}
                      </span>
                      {r.badge && (
                        <span style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          padding: "4px 12px",
                          borderRadius: "100px",
                          background: r.accent + "18",
                          fontFamily: "'PP Neue Montreal', sans-serif",
                          fontSize: "11px",
                          fontWeight: 500,
                          color: r.accent,
                        }}>
                          <span style={{ fontSize: "10px" }}>&#x2714;</span>
                          {r.badge}
                        </span>
                      )}
                    </div>

                    {/* Headline */}
                    <h3 style={{
                      fontFamily: "'NN Nouvelle Grotesk', sans-serif",
                      fontSize: "clamp(20px, 2.2vw, 32px)",
                      fontWeight: 700,
                      color: "#0a0a0a",
                      lineHeight: 1.2,
                      margin: "0 0 clamp(20px, 2.5vw, 36px)",
                      maxWidth: "480px",
                    }}>
                      {r.headline}
                    </h3>
                  </div>

                  {/* Bottom */}
                  <div>
                    {/* Stars */}
                    <div style={{ display: "flex", gap: "2px", marginBottom: "12px" }}>
                      {Array.from({ length: r.rating }).map((_, j) => (
                        <span key={j} style={{ color: "#f5a623", fontSize: "16px" }}>&#9733;</span>
                      ))}
                    </div>

                    {/* Quote */}
                    <p style={{
                      fontFamily: "'PP Neue Montreal', sans-serif",
                      fontSize: "clamp(13px, 1.1vw, 15px)",
                      color: "rgba(10,10,10,0.5)",
                      lineHeight: "1.65",
                      margin: "0 0 14px",
                      maxWidth: "420px",
                      fontStyle: "italic",
                    }}>
                      &ldquo;{r.quote}&rdquo;
                    </p>

                    {/* Client */}
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      {/* Avatar placeholder */}
                      <div style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        background: r.accent + "20",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "'PP Neue Montreal', sans-serif",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: r.accent,
                      }}>
                        {r.client.charAt(0)}
                      </div>
                      <div>
                        <p style={{
                          fontFamily: "'PP Neue Montreal', sans-serif",
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "#0a0a0a",
                          margin: 0,
                        }}>
                          {r.client}
                        </p>
                        <p style={{
                          fontFamily: "'PP Neue Montreal', sans-serif",
                          fontSize: "12px",
                          color: "rgba(10,10,10,0.35)",
                          margin: 0,
                        }}>
                          {r.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ─── Right: Metric + visual ─── */}
                <div style={{
                  flex: "1 1 45%",
                  background: `linear-gradient(135deg, ${r.accent}12 0%, ${r.accent}08 100%)`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  overflow: "hidden",
                  minHeight: "280px",
                }}>
                  {/* Decorative rings */}
                  <div style={{
                    position: "absolute",
                    width: "clamp(300px, 35vw, 500px)",
                    height: "clamp(300px, 35vw, 500px)",
                    borderRadius: "50%",
                    border: `1px solid ${r.accent}15`,
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    pointerEvents: "none",
                  }} />
                  <div style={{
                    position: "absolute",
                    width: "clamp(200px, 24vw, 360px)",
                    height: "clamp(200px, 24vw, 360px)",
                    borderRadius: "50%",
                    border: `1px dashed ${r.accent}20`,
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    pointerEvents: "none",
                  }} />

                  {/* Giant metric */}
                  <span style={{
                    fontFamily: "'NN Nouvelle Grotesk', sans-serif",
                    fontSize: "clamp(56px, 8vw, 120px)",
                    fontWeight: 700,
                    color: r.accent,
                    lineHeight: 1,
                    letterSpacing: "-3px",
                    position: "relative",
                    zIndex: 1,
                  }}>
                    {r.metric}
                  </span>
                  <span style={{
                    fontFamily: "'PP Neue Montreal', sans-serif",
                    fontSize: "clamp(12px, 1vw, 15px)",
                    fontWeight: 500,
                    color: "rgba(10,10,10,0.35)",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    marginTop: "8px",
                    position: "relative",
                    zIndex: 1,
                  }}>
                    {r.metricLabel}
                  </span>

                  {/* Glow */}
                  <div style={{
                    position: "absolute",
                    width: "clamp(120px, 15vw, 220px)",
                    height: "clamp(120px, 15vw, 220px)",
                    borderRadius: "50%",
                    background: r.accent,
                    opacity: 0.06,
                    filter: "blur(60px)",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    pointerEvents: "none",
                  }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Controls ─── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "clamp(24px, 3vw, 40px) clamp(20px, 5vw, 80px) 0",
        gap: "clamp(16px, 2vw, 32px)",
      }}>
        {/* Counter */}
        <div style={{
          fontFamily: "'PP Neue Montreal', sans-serif",
          fontSize: "14px",
          fontWeight: 500,
          color: "rgba(10,10,10,0.35)",
          minWidth: "60px",
          display: "flex",
          alignItems: "center",
          gap: "4px",
          overflow: "hidden",
        }}>
          <span ref={counterRef} style={{ display: "inline-block", willChange: "transform, opacity", color: "#0a0a0a" }}>
            {String(current + 1).padStart(2, "0")}
          </span>
          <span>/</span>
          <span>{String(total).padStart(2, "0")}</span>
        </div>

        {/* Progress */}
        <div style={{
          flex: 1,
          height: "2px",
          background: "rgba(10,10,10,0.06)",
          borderRadius: "2px",
          overflow: "hidden",
        }}>
          <div
            ref={progressFillRef}
            style={{
              height: "100%",
              background: "#f17752",
              borderRadius: "2px",
              willChange: "width",
            }}
          />
        </div>

        {/* Arrows */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => { prev(); resetAutoplay(); }}
            aria-label="Previous result"
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              border: "1.5px solid rgba(10,10,10,0.1)",
              background: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.25s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#0a0a0a"; e.currentTarget.style.borderColor = "#0a0a0a"; (e.currentTarget.querySelector("svg") as SVGElement).style.color = "#fff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "rgba(10,10,10,0.1)"; (e.currentTarget.querySelector("svg") as SVGElement).style.color = "#0a0a0a"; }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ color: "#0a0a0a", transition: "color 0.25s" }}>
              <path d="M11 4L6 9L11 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button
            onClick={() => { next(); resetAutoplay(); }}
            aria-label="Next result"
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              border: "1.5px solid rgba(10,10,10,0.1)",
              background: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.25s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#0a0a0a"; e.currentTarget.style.borderColor = "#0a0a0a"; (e.currentTarget.querySelector("svg") as SVGElement).style.color = "#fff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "rgba(10,10,10,0.1)"; (e.currentTarget.querySelector("svg") as SVGElement).style.color = "#0a0a0a"; }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ color: "#0a0a0a", transition: "color 0.25s" }}>
              <path d="M7 4L12 9L7 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ─── Dot indicators ─── */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "8px",
        marginTop: "clamp(24px, 3vw, 40px)",
      }}>
        {results.map((r, i) => (
          <button
            key={i}
            onClick={() => { goTo(i); resetAutoplay(); }}
            aria-label={`Go to slide ${i + 1}`}
            style={{
              width: current === i ? "32px" : "8px",
              height: "8px",
              borderRadius: "100px",
              border: "none",
              background: current === i ? r.accent : "rgba(10,10,10,0.1)",
              cursor: "pointer",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              padding: 0,
            }}
          />
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════
          LOGO SCROLLER — Dylan Brouwer style
          ═══════════════════════════════════════════════════════════ */}
      <div
        ref={marqueeWrapRef}
        style={{
          marginTop: "clamp(80px, 10vw, 140px)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Heading */}
        <div style={{
          padding: "0 clamp(20px, 5vw, 80px)",
          marginBottom: "clamp(36px, 4vw, 56px)",
        }}>
          <h3 style={{
            fontFamily: "'NN Nouvelle Grotesk', sans-serif",
            fontSize: "clamp(24px, 3vw, 44px)",
            fontWeight: 700,
            lineHeight: 1.15,
            color: "#0a0a0a",
            margin: 0,
            maxWidth: "420px",
          }}>
            Brands &amp; creative teams{" "}
            <span style={{ color: "rgba(10,10,10,0.2)" }}>
              we&apos;ve collaborated with:
            </span>
          </h3>
        </div>

        {/* Row 1 — scrolls left */}
        <div
          ref={marqueeRow1Ref}
          style={{
            display: "flex",
            gap: "clamp(12px, 1.5vw, 20px)",
            width: "max-content",
            willChange: "transform",
            marginBottom: "clamp(12px, 1.5vw, 20px)",
          }}
        >
          {[...brandLogos, ...brandLogos].map((name, i) => (
            <div
              key={`r1-${i}`}
              className="logo-card"
              style={{
                position: "relative",
                padding: "clamp(28px, 3.5vw, 48px) clamp(36px, 4.5vw, 64px)",
                background: "#eceae5",
                borderRadius: "clamp(10px, 1.2vw, 16px)",
                overflow: "hidden",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "default",
                transition: "background 0.3s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#e2dfd8")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#eceae5")}
            >
              {/* Diagonal stripe overlay */}
              <div style={{
                position: "absolute",
                inset: 0,
                background: `repeating-linear-gradient(
                  -55deg,
                  transparent,
                  transparent 18px,
                  rgba(0,0,0,0.018) 18px,
                  rgba(0,0,0,0.018) 19px
                )`,
                pointerEvents: "none",
              }} />
              <span style={{
                fontFamily: "'NN Nouvelle Grotesk', sans-serif",
                fontSize: "clamp(16px, 1.8vw, 26px)",
                fontWeight: 700,
                color: "rgba(10,10,10,0.35)",
                whiteSpace: "nowrap",
                position: "relative",
                zIndex: 1,
                letterSpacing: "-0.3px",
                transition: "color 0.3s",
              }}>
                {name}
              </span>
            </div>
          ))}
        </div>

        {/* Row 2 — scrolls right */}
        <div
          ref={marqueeRow2Ref}
          style={{
            display: "flex",
            gap: "clamp(12px, 1.5vw, 20px)",
            width: "max-content",
            willChange: "transform",
          }}
        >
          {[...brandLogos.slice().reverse(), ...brandLogos.slice().reverse()].map((name, i) => (
            <div
              key={`r2-${i}`}
              className="logo-card"
              style={{
                position: "relative",
                padding: "clamp(28px, 3.5vw, 48px) clamp(36px, 4.5vw, 64px)",
                background: "#eceae5",
                borderRadius: "clamp(10px, 1.2vw, 16px)",
                overflow: "hidden",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "default",
                transition: "background 0.3s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#e2dfd8")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#eceae5")}
            >
              {/* Diagonal stripe overlay */}
              <div style={{
                position: "absolute",
                inset: 0,
                background: `repeating-linear-gradient(
                  -55deg,
                  transparent,
                  transparent 18px,
                  rgba(0,0,0,0.018) 18px,
                  rgba(0,0,0,0.018) 19px
                )`,
                pointerEvents: "none",
              }} />
              <span style={{
                fontFamily: "'NN Nouvelle Grotesk', sans-serif",
                fontSize: "clamp(16px, 1.8vw, 26px)",
                fontWeight: 700,
                color: "rgba(10,10,10,0.35)",
                whiteSpace: "nowrap",
                position: "relative",
                zIndex: 1,
                letterSpacing: "-0.3px",
                transition: "color 0.3s",
              }}>
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
