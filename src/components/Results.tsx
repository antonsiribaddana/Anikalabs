"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Result = {
  ticker: string;
  client: string;
  headline: string;
  paragraphs: string[];
  cardBg: string;
  panelBg: string;
  accent: string;
  initial: string;
  image?: string;
  imagePosition?: string;
};

const results: Result[] = [
  {
    ticker: "Product-to-Delivery System",
    client: "TeeBrix",
    headline: "Selling t-shirts was never the issue, it was everything required to actually run the business behind it",
    paragraphs: [
      "Behind the product, design, printing, store, and fulfillment were treated as separate parts. That created friction at every stage of the business.",
      "We connected the entire flow into one system, from product setup and printing to order handling, packaging, and delivery, so nothing breaks between steps.",
      "Now the business runs as a continuous operation, not a series of manual tasks.",
    ],
    cardBg: "#ffffff",
    panelBg: "#d0d0d0",
    accent: "#e64a4a",
    initial: "T",
    image: "/teebrix-mockup.png",
  },
  {
    ticker: "Portfolio Narrative System",
    client: "NIC Directs",
    headline: "The work was already at an Emmy-winning level, but the digital presence wasn't reflecting it with the same clarity",
    paragraphs: [
      "The work was already at an Emmy-winning level, but the digital presence didn't reflect it.",
      "We removed unnecessary layers and rebuilt the structure so the work is presented with clarity and intent, without distraction.",
      "Now the site supports the work instead of competing with it.",
    ],
    cardBg: "#ffffff",
    panelBg: "#111111",
    accent: "#f2b14a",
    initial: "N",
    image: "/nicdirects-monitor-4x3.png",
    imagePosition: "center center",
  },
  {
    ticker: "Client Positioning System",
    client: "Newflow Partners",
    headline: "The goal was a simple website, but simplicity alone wasn't solving positioning or attracting the right clients",
    paragraphs: [
      "The initial goal was a clean, simple website. But simplicity alone wasn't solving positioning or how the business attracts the right clients.",
      "We shifted the focus from pages to structure, aligning messaging, flow, and positioning into one system that supports how the business operates.",
      "The result is a presence that works, not just one that looks good.",
    ],
    cardBg: "#ffffff",
    panelBg: "#1a6b45",
    accent: "#2f8f5d",
    initial: "N",
    image: "/newflow-mockup.png",
    imagePosition: "center center",
  },
  {
    ticker: "Client Acquisition System",
    client: "ModernXPools",
    headline: "The challenge wasn't a lack of services, it was how everything was presented and connected for the user",
    paragraphs: [
      "Pools, decks, and outdoor living were presented as separate offerings with no clear path for the user. People had to piece things together themselves.",
      "We restructured how everything connects, from brand to pages to service flow, so the full offering is understood as one system instead of isolated parts.",
      "This made it easier for the right clients to understand the value and move toward a decision.",
    ],
    cardBg: "#ffffff",
    panelBg: "#4a4a4a",
    accent: "#3b6bd6",
    initial: "M",
    image: "/modernxpools-mockup.png",
  },
  {
    ticker: "Creator Onboarding System",
    client: "Camprodest",
    headline: "The platform had potential, but users struggled to understand it and take action without hesitation",
    paragraphs: [
      "The platform had potential, but users were hesitating. The value wasn't immediately clear, and the path to action felt uncertain.",
      "We simplified the structure and clarified how the platform communicates. Every step now leads somewhere intentional, reducing friction across the experience.",
      "Users don't just visit. They understand and act.",
    ],
    cardBg: "#ffffff",
    panelBg: "#5a5a5e",
    accent: "#e27d3a",
    initial: "C",
    image: "/camprodest-mockup.png",
  },
];

function ArrowButton({ direction, onClick }: { direction: "prev" | "next"; onClick: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label={direction === "prev" ? "Previous result" : "Next result"}
      style={{
        position: "relative",
        width: "44px",
        height: "44px",
        borderRadius: "50%",
        border: "none",
        background: "transparent",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
      }}
    >
      {/* Static thin ring */}
      <span
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: "1px solid rgba(10,10,10,0.18)",
          transition: "opacity 0.3s ease",
          opacity: hover ? 0.3 : 1,
        }}
      />
      {/* Shimmer orange ring */}
      <span
        style={{
          position: "absolute",
          inset: "-1px",
          borderRadius: "50%",
          padding: "1.5px",
          background: "conic-gradient(from 0deg, transparent 0deg, #f17752 80deg, transparent 160deg)",
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          opacity: hover ? 1 : 0,
          animation: hover ? "arrowSpin 1.2s linear infinite" : "none",
          transition: "opacity 0.3s ease",
          pointerEvents: "none",
        }}
      />
      <svg width="14" height="14" viewBox="0 0 18 18" fill="none" style={{ color: hover ? "#f17752" : "#0a0a0a", position: "relative", zIndex: 1, transition: "color 0.25s ease" }}>
        {direction === "prev" ? (
          <path d="M11 4L6 9L11 14" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
        ) : (
          <path d="M7 4L12 9L7 14" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
        )}
      </svg>
    </button>
  );
}

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
        duration: 1.2,
        ease: "power2.inOut",
        onComplete: i === nextIndex ? () => { isAnimatingRef.current = false; } : undefined,
      });
    });

    // Progress
    if (progressFillRef.current) {
      gsap.to(progressFillRef.current, {
        width: `${((nextIndex + 1) / total) * 100}%`,
        duration: 1.2,
        ease: "power2.inOut",
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

  const resetAutoplay = useCallback(() => {}, []);

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

  return (
    <section
      ref={sectionRef}
      style={{
        background: "#f5f3ef",
        padding: "clamp(60px, 7vw, 110px) 0 clamp(60px, 8vw, 120px)",
        overflow: "hidden",
      }}
    >
      <style>{`@keyframes arrowSpin { to { transform: rotate(360deg); } }`}</style>
      {/* ─── Heading ─── */}
      <div
        ref={headingRef}
        style={{
          padding: "0 clamp(20px, 5vw, 80px)",
          marginBottom: "clamp(36px, 5vw, 72px)",
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <h2 style={{
          fontFamily: "'PP Neue Montreal', 'Inter', system-ui, sans-serif",
          fontSize: "clamp(42px, 6vw, 88px)",
          fontWeight: 500,
          lineHeight: 1.02,
          letterSpacing: "-1.5px",
          color: "#111",
          margin: 0,
          whiteSpace: "nowrap",
        }}>
          We Build Systems That Work.
        </h2>

        <p style={{
          fontFamily: "'PP Neue Montreal', sans-serif",
          fontSize: "clamp(15px, 1.4vw, 18px)",
          fontWeight: 400,
          lineHeight: 1.7,
          color: "#888",
          margin: "clamp(20px, 2.5vw, 32px) 0 0",
          textAlign: "center",
          maxWidth: "640px",
        }}>
          Every project starts by finding what is not working and fixing it at the root.
        </p>
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
            height: "clamp(540px, 58vw, 680px)",
          }}
        >
          {results.map((r, i) => {
            const isDark = r.cardBg === "#1f1f1f";
            const textMain = isDark ? "#fff" : "#1a1a1a";
            const textMuted = isDark ? "rgba(255,255,255,0.65)" : "rgba(26,26,26,0.72)";
            const textFaint = isDark ? "rgba(255,255,255,0.55)" : "rgba(26,26,26,0.55)";
            const chipBg = isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.7)";
            const chipBorder = isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(26,26,26,0.06)";
            return (
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
                {/* ── Halo-Lab-style card ── */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
                    gap: "clamp(24px, 3vw, 56px)",
                    background: r.cardBg,
                    borderRadius: "clamp(20px, 2vw, 32px)",
                    padding: "clamp(28px, 3.2vw, 56px)",
                    height: "100%",
                    boxShadow: "0 8px 60px rgba(0,0,0,0.06)",
                    overflow: "hidden",
                  }}
                >
                  {/* LEFT — copy column */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      minWidth: 0,
                    }}
                  >
                    {/* Eyebrow — system ticker + case number */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginBottom: "clamp(14px, 1.4vw, 20px)",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'PP Neue Montreal', 'Inter', system-ui, sans-serif",
                          fontSize: "clamp(13px, 1vw, 15px)",
                          fontWeight: 500,
                          color: "#f17752",
                          letterSpacing: "0.14em",
                          textTransform: "uppercase",
                        }}
                      >
                        {r.ticker}
                      </span>
                    </div>

                    {/* Headline */}
                    <h3
                      style={{
                        fontFamily: "'PP Neue Montreal', 'Inter', system-ui, sans-serif",
                        fontWeight: 500,
                        fontSize: "clamp(26px, 2.8vw, 42px)",
                        lineHeight: 1.12,
                        letterSpacing: "-0.01em",
                        color: textMain,
                        margin: 0,
                        marginBottom: "clamp(20px, 2vw, 32px)",
                      }}
                    >
                      {r.headline}
                    </h3>

                    {/* Body paragraphs */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "clamp(10px, 0.9vw, 16px)",
                        marginBottom: "clamp(24px, 2.5vw, 40px)",
                      }}
                    >
                      {r.paragraphs.map((p, j) => (
                        <p
                          key={j}
                          style={{
                            fontFamily: "'PP Neue Montreal', 'Inter', system-ui, sans-serif",
                            fontSize: "clamp(15px, 1.4vw, 18px)",
                            lineHeight: 1.6,
                            color: j === r.paragraphs.length - 1 ? textMain : textMuted,
                            margin: 0,
                            fontWeight: j === r.paragraphs.length - 1 ? 500 : 400,
                          }}
                        >
                          {p}
                        </p>
                      ))}
                    </div>

                  </div>

                  {/* RIGHT — visual panel */}
                  <div
                    style={{
                      position: "relative",
                      borderRadius: "clamp(16px, 1.4vw, 22px)",
                      background: r.panelBg,
                      overflow: "hidden",
                      alignSelf: "center",
                      width: "100%",
                      aspectRatio: "4 / 3",
                    }}
                  >
                    {/* Panel visual */}
                    {r.image ? (
                      <img
                        src={r.image}
                        alt={`${r.client} website mockup`}
                        style={{
                          position: "absolute",
                          inset: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          objectPosition: "center center",
                        }}
                      />
                    ) : (
                      /* All other cards — concentric rings SVG */
                      <svg
                        viewBox="0 0 600 600"
                        preserveAspectRatio="xMidYMid slice"
                        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
                      >
                        {[0, 1, 2, 3, 4, 5].map((rr) => (
                          <circle
                            key={rr}
                            cx="300"
                            cy="300"
                            r={60 + rr * 55}
                            fill="none"
                            stroke={isDark ? "rgba(255,255,255,0.08)" : `${r.accent}22`}
                            strokeWidth={1}
                          />
                        ))}
                        {[
                          { cx: 470, cy: 210 },
                          { cx: 160, cy: 250 },
                          { cx: 430, cy: 430 },
                          { cx: 200, cy: 450 },
                        ].map((n, k) => (
                          <g key={k}>
                            <line
                              x1="300"
                              y1="300"
                              x2={n.cx}
                              y2={n.cy}
                              stroke={isDark ? "rgba(255,255,255,0.18)" : `${r.accent}55`}
                              strokeWidth={1}
                            />
                            <circle cx={n.cx} cy={n.cy} r={7} fill={r.accent} opacity={0.9} />
                          </g>
                        ))}
                        <circle cx="300" cy="300" r="18" fill={r.accent} opacity="0.95" />
                        <circle cx="300" cy="300" r="6" fill="#fff" opacity="0.95" />
                      </svg>
                    )}

                    {/* Label chip top-left */}
                    {!r.image && <div
                      style={{
                        position: "absolute",
                        top: "clamp(16px, 1.6vw, 24px)",
                        left: "clamp(16px, 1.6vw, 24px)",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "8px 14px",
                        borderRadius: "999px",
                        background: chipBg,
                        backdropFilter: "blur(6px)",
                        border: chipBorder,
                        fontFamily: "'PP Neue Montreal', sans-serif",
                        fontSize: "11px",
                        fontWeight: 500,
                        color: isDark ? "rgba(255,255,255,0.85)" : "#1a1a1a",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                      }}
                    >
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: r.accent }} />
                      System
                    </div>}

                    {/* Bottom strip: case label + read case */}
                    {!r.image && <div
                      style={{
                        position: "absolute",
                        bottom: "clamp(16px, 1.6vw, 24px)",
                        left: "clamp(16px, 1.6vw, 24px)",
                        right: "clamp(16px, 1.6vw, 24px)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-end",
                        gap: "16px",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontFamily: "'PP Neue Montreal', sans-serif",
                            fontSize: "clamp(30px, 3.4vw, 48px)",
                            fontWeight: 500,
                            color: isDark ? "#fff" : r.accent,
                            lineHeight: 1,
                            letterSpacing: "-0.02em",
                          }}
                        >
                          {r.client}
                        </div>
                      </div>
                      <span
                        style={{
                          fontFamily: "'PP Neue Montreal', sans-serif",
                          fontSize: "11px",
                          fontWeight: 500,
                          color: isDark ? "rgba(255,255,255,0.55)" : "rgba(26,26,26,0.55)",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                        }}
                      >
                        Read case →
                      </span>
                    </div>}
                  </div>
                </div>
              </div>
            );
          })}
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
        <div style={{ display: "flex", gap: "8px" }}>
          <ArrowButton direction="prev" onClick={() => { prev(); resetAutoplay(); }} />
          <ArrowButton direction="next" onClick={() => { next(); resetAutoplay(); }} />
        </div>
      </div>


    </section>
  );
}
