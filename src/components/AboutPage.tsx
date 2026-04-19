"use client";

import { useEffect, useRef, ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";

const GradientShader = dynamic(() => import("./GradientShader"), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

/* ══════════════════════════════════════════════════════════════════
   Shared design tokens — one system, one rhythm
   ══════════════════════════════════════════════════════════════════ */
const PAGE_PX = "clamp(20px, 6vw, 112px)";
const SECTION_PY = "clamp(100px, 12vw, 180px)";
const LABEL_STYLE: React.CSSProperties = {
  fontFamily: "'PP Neue Montreal', sans-serif",
  fontSize: "12px",
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.45)",
};
const FONT = "'PP Neue Montreal', 'Inter', system-ui, sans-serif";

/* ──────────────────────────────────────────────────────────────
   Section primitive — numbered label + heading, unified grid
   ────────────────────────────────────────────────────────────── */
function SectionHeader({
  label,
  heading,
}: {
  num?: string;
  label: string;
  heading: ReactNode;
}) {
  return (
    <div style={{ marginBottom: "clamp(48px, 6vw, 96px)", maxWidth: "1100px" }}>
      <div style={{ ...LABEL_STYLE, marginBottom: "clamp(20px, 2vw, 32px)" }}>{label}</div>
      <h2
        style={{
          fontFamily: FONT,
          fontSize: "clamp(32px, 4.6vw, 64px)",
          fontWeight: 500,
          lineHeight: 1.05,
          letterSpacing: "-0.03em",
          color: "#fff",
          margin: 0,
        }}
      >
        {heading}
      </h2>
    </div>
  );
}

function SectionShell({
  first = false,
  children,
  paddingY,
}: {
  first?: boolean;
  children: ReactNode;
  paddingY?: string;
}) {
  return (
    <section
      style={{
        background: "#02021e",
        padding: `${paddingY ?? SECTION_PY} ${PAGE_PX}`,
        position: "relative",
        borderTop: first ? "none" : "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {children}
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════
   1 — HERO
   ══════════════════════════════════════════════════════════════════ */
function AboutHero() {
  const headingRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = headingRef.current;
    const section = sectionRef.current;
    const glow = glowRef.current;
    if (!el || !section || !glow) return;
    const ctx = gsap.context(() => {
      const lines = el.querySelectorAll(".ap-hero-line");
      gsap.set(lines, { yPercent: 110, opacity: 0 });
      gsap.to(lines, {
        yPercent: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power4.out",
        stagger: 0.12,
        delay: 0.85,
      });

      // Hero parallax on scroll
      gsap.to(glow, {
        yPercent: 30,
        ease: "none",
        scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(el, {
        yPercent: -10,
        ease: "none",
        scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: true },
      });
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        background: "#02021e",
        padding: `clamp(140px, 14vw, 220px) ${PAGE_PX} clamp(80px, 10vw, 140px)`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient shader */}
      <div
        aria-hidden
        style={{ position: "absolute", inset: 0, opacity: 0.45, zIndex: 0, pointerEvents: "none" }}
      >
        <GradientShader />
      </div>
      <div
        ref={glowRef}
        aria-hidden
        style={{
          position: "absolute",
          top: "15%",
          right: "-8%",
          width: "55vw",
          height: "55vw",
          maxWidth: "800px",
          maxHeight: "800px",
          background:
            "radial-gradient(circle, rgba(241,119,82,0.18) 0%, rgba(241,119,82,0) 60%)",
          filter: "blur(40px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Eyebrow */}
      <div
        data-transition-reveal
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          marginBottom: "clamp(28px, 3vw, 48px)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "#f17752",
            boxShadow: "0 0 16px rgba(241,119,82,0.7)",
          }}
        />
        <span
          style={{
            fontFamily: FONT,
            fontSize: "13px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.75)",
          }}
        >
          About — Anika Labs
        </span>
      </div>

      {/* Title */}
      <div ref={headingRef} data-transition-reveal style={{ position: "relative", zIndex: 1 }}>
        <div style={{ overflow: "hidden" }}>
          <h1
            className="ap-hero-line"
            style={{
              fontFamily: FONT,
              fontSize: "clamp(64px, 13vw, 220px)",
              fontWeight: 500,
              lineHeight: 0.92,
              letterSpacing: "-0.04em",
              color: "#fff",
              margin: 0,
              willChange: "transform",
            }}
          >
            A studio built
          </h1>
        </div>
        <div style={{ overflow: "hidden", paddingBottom: "0.1em" }}>
          <h1
            className="ap-hero-line"
            style={{
              fontFamily: FONT,
              fontSize: "clamp(64px, 13vw, 220px)",
              fontWeight: 500,
              lineHeight: 0.92,
              letterSpacing: "-0.04em",
              background: "linear-gradient(135deg, #f17752 0%, #ffb28a 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              margin: 0,
              willChange: "transform",
            }}
          >
            around systems.
          </h1>
        </div>
      </div>

      {/* Subtext */}
      <div
        data-transition-reveal
        style={{
          marginTop: "clamp(56px, 7vw, 112px)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <p
          style={{
            fontFamily: FONT,
            fontSize: "clamp(18px, 1.5vw, 26px)",
            lineHeight: 1.5,
            color: "rgba(255,255,255,0.8)",
            margin: 0,
            maxWidth: "720px",
          }}
        >
          We design and build digital systems for brands who care how things
          feel, work, and hold together over time.
        </p>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════
   2 — WHO WE ARE
   ══════════════════════════════════════════════════════════════════ */
function WhoWeAre() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll(".ww-word"),
        { opacity: 0.12, y: 18 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.012,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 80%", end: "top 30%", scrub: 1 },
        }
      );
    }, el);
    return () => ctx.revert();
  }, []);

  const text =
    "We are a small studio of designers and engineers who work closely together — no handoffs, no lost context, no layers between the thinking and the building. We care about clarity, rhythm, and the kind of craft that only shows itself after a few seconds of use.";

  return (
    <section
      ref={ref}
      style={{
        background: "#02021e",
        padding: `${SECTION_PY} ${PAGE_PX}`,
        position: "relative",
        borderTop: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div style={{ ...LABEL_STYLE, marginBottom: "clamp(20px, 2vw, 32px)" }}>Who we are</div>
      <p
        style={{
          fontFamily: FONT,
          fontSize: "clamp(24px, 3vw, 44px)",
          lineHeight: 1.3,
          letterSpacing: "-0.015em",
          color: "#fff",
          margin: 0,
          fontWeight: 400,
          maxWidth: "1100px",
        }}
      >
        {text.split(" ").map((w, i) => (
          <span key={i} className="ww-word" style={{ display: "inline-block", marginRight: "0.25em" }}>
            {w}
          </span>
        ))}
      </p>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════
   3 — HOW WE WORK
   ══════════════════════════════════════════════════════════════════ */
const STEPS = [
  { num: "01", title: "Plan", desc: "Understand the business, the audience, and the edges." },
  { num: "02", title: "Design", desc: "Shape the system visually — clear, deliberate, honest." },
  { num: "03", title: "Build", desc: "Engineer it for speed, scale, and longevity." },
  { num: "04", title: "Refine", desc: "Sharpen the details that separate good from good-feeling." },
  { num: "05", title: "Launch", desc: "Ship it, measure it, keep improving." },
];

function HowWeWork() {
  const ref = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const pulseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const line = lineRef.current;
    const pulse = pulseRef.current;
    if (!el || !line || !pulse) return;
    const ctx = gsap.context(() => {
      // Track draws in left-to-right
      gsap.fromTo(
        line,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top 70%", end: "bottom 60%", scrub: 0.8 },
        }
      );

      // Traveling pulse along the line (tied to scroll)
      gsap.fromTo(
        pulse,
        { left: "0%", opacity: 0 },
        {
          left: "100%",
          opacity: 1,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top 70%", end: "bottom 60%", scrub: 0.8 },
        }
      );

      // Nodes pop in order with a flare
      const nodes = el.querySelectorAll(".hww-node");
      nodes.forEach((node, i) => {
        gsap.fromTo(
          node,
          { scale: 0.4, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            ease: "back.out(2.5)",
            scrollTrigger: {
              trigger: el,
              start: `top ${72 - i * 3}%`,
              end: `top ${55 - i * 3}%`,
              scrub: 0.6,
            },
          }
        );
      });

      // Card content rises
      gsap.fromTo(
        el.querySelectorAll(".hww-step"),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 75%", end: "top 40%", scrub: 1 },
        }
      );
    }, el);
    return () => ctx.revert();
  }, []);

  const TRACK_TOP = "clamp(48px, 5vw, 80px)";

  return (
    <SectionShell>
      <div ref={ref}>
        <SectionHeader
          label="How we work"
          heading="One continuous loop — from first conversation to long after launch."
        />

        <div style={{ position: "relative", paddingTop: "clamp(32px, 4vw, 64px)" }}>
          {/* Base track */}
          <div
            style={{
              position: "absolute",
              top: TRACK_TOP,
              left: 0,
              right: 0,
              height: "1px",
              background:
                "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.15) 10%, rgba(255,255,255,0.15) 90%, rgba(255,255,255,0) 100%)",
            }}
          />
          {/* Drawn-in orange track */}
          <div
            ref={lineRef}
            style={{
              position: "absolute",
              top: TRACK_TOP,
              left: 0,
              right: 0,
              height: "1px",
              background: "linear-gradient(90deg, #f17752 0%, #ffb28a 100%)",
              transformOrigin: "left center",
              transform: "scaleX(0)",
              boxShadow: "0 0 12px rgba(241,119,82,0.5)",
            }}
          />
          {/* Traveling pulse */}
          <div
            ref={pulseRef}
            style={{
              position: "absolute",
              top: TRACK_TOP,
              left: "0%",
              transform: "translate(-50%, -50%)",
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              background: "#f17752",
              boxShadow:
                "0 0 0 4px rgba(241,119,82,0.25), 0 0 28px rgba(241,119,82,0.8)",
              opacity: 0,
              pointerEvents: "none",
              zIndex: 2,
            }}
          />

          <div
            className="hww-grid"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${STEPS.length}, minmax(0, 1fr))`,
              gap: "clamp(16px, 2vw, 32px)",
              position: "relative",
            }}
          >
            {STEPS.map((s, i) => (
              <div key={s.num} className="hww-step" style={{ position: "relative" }}>
                {/* Node with concentric ring */}
                <div
                  className="hww-node"
                  style={{
                    position: "relative",
                    width: "28px",
                    height: "28px",
                    marginBottom: "clamp(20px, 2vw, 32px)",
                    marginLeft: "-7px",
                  }}
                >
                  {/* Outer ring */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "50%",
                      border: "1px solid rgba(241,119,82,0.35)",
                      background: "#02021e",
                    }}
                  />
                  {/* Inner dot */}
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background: "#f17752",
                      boxShadow: "0 0 12px rgba(241,119,82,0.8)",
                    }}
                  />
                  {/* Step number label above */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "calc(100% + 10px)",
                      left: "50%",
                      transform: "translateX(-50%)",
                      fontFamily: FONT,
                      fontSize: "10px",
                      letterSpacing: "0.22em",
                      color: "rgba(255,255,255,0.35)",
                      fontWeight: 500,
                    }}
                  >
                    {s.num}
                  </div>
                </div>

                <div
                  style={{
                    fontFamily: FONT,
                    fontSize: "clamp(22px, 2.2vw, 32px)",
                    fontWeight: 500,
                    color: "#fff",
                    marginBottom: "10px",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {s.title}
                </div>
                <div
                  style={{
                    fontFamily: FONT,
                    fontSize: "clamp(13px, 1vw, 15px)",
                    lineHeight: 1.5,
                    color: "rgba(255,255,255,0.6)",
                  }}
                >
                  {s.desc}
                </div>
                {/* Connector arrow between steps (desktop only) */}
                {i < STEPS.length - 1 && (
                  <div
                    aria-hidden
                    className="hww-arrow"
                    style={{
                      position: "absolute",
                      top: `calc(${TRACK_TOP} - 3px)`,
                      right: "calc(-1 * clamp(8px, 1vw, 16px))",
                      width: "7px",
                      height: "7px",
                      borderTop: "1px solid rgba(241,119,82,0.6)",
                      borderRight: "1px solid rgba(241,119,82,0.6)",
                      transform: "rotate(45deg)",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .hww-grid { grid-template-columns: 1fr 1fr !important; gap: 48px !important; }
            .hww-arrow { display: none !important; }
          }
          @media (max-width: 540px) {
            .hww-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>
    </SectionShell>
  );
}

/* ══════════════════════════════════════════════════════════════════
   4 — SYSTEM THINKING
   ══════════════════════════════════════════════════════════════════ */
const NODES = [
  { key: "audience", label: "Audience", x: 10, y: 30 },
  { key: "messaging", label: "Messaging", x: 32, y: 12 },
  { key: "structure", label: "Structure", x: 54, y: 36 },
  { key: "pages", label: "Pages", x: 76, y: 18 },
  { key: "actions", label: "Actions", x: 62, y: 68 },
  { key: "outcomes", label: "Outcomes", x: 88, y: 56 },
];
const EDGES: [number, number][] = [[0, 1], [1, 2], [2, 3], [2, 4], [3, 5], [4, 5], [0, 2]];

function SystemThinking() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll(".st-edge"),
        { strokeDashoffset: 1000 },
        {
          strokeDashoffset: 0,
          ease: "power2.out",
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: "top 70%", end: "top 30%", scrub: 1 },
        }
      );
      gsap.fromTo(
        el.querySelectorAll(".st-node"),
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          stagger: 0.06,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 75%", end: "top 40%", scrub: 1 },
        }
      );

      // Flowing particles along each edge (continuous loop)
      const particles = el.querySelectorAll<HTMLElement>(".st-particle");
      particles.forEach((p, i) => {
        const path = p.dataset.path?.split(",").map(Number) ?? [0, 0, 0, 0];
        const [x1, y1, x2, y2] = path;
        gsap.set(p, { left: `${x1}%`, top: `${y1 / 0.8}%`, opacity: 0 });
        gsap.to(p, {
          left: `${x2}%`,
          top: `${y2 / 0.8}%`,
          opacity: 1,
          duration: 2.6,
          repeat: -1,
          delay: i * 0.35,
          ease: "power1.inOut",
          keyframes: {
            opacity: [0, 1, 1, 0],
          },
        });
      });

      // Continuous node pulse
      el.querySelectorAll<HTMLElement>(".st-node-glow").forEach((g, i) => {
        gsap.to(g, {
          scale: 1.8,
          opacity: 0,
          duration: 2,
          repeat: -1,
          ease: "power2.out",
          delay: i * 0.25,
        });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <SectionShell>
      <div ref={ref}>
        <SectionHeader
          label="System thinking"
          heading="Every part pulls its weight — because everything is connected."
        />
        <div style={{ position: "relative", width: "100%", aspectRatio: "2 / 1", maxHeight: "640px" }}>
          <svg
            viewBox="0 0 100 80"
            preserveAspectRatio="none"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}
          >
            {EDGES.map(([a, b], i) => {
              const n1 = NODES[a];
              const n2 = NODES[b];
              return (
                <line
                  key={i}
                  className="st-edge"
                  x1={n1.x}
                  y1={n1.y}
                  x2={n2.x}
                  y2={n2.y}
                  stroke="rgba(241,119,82,0.5)"
                  strokeWidth="0.15"
                  strokeDasharray="1000"
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
          </svg>
          {/* Flowing particles along edges */}
          {EDGES.map(([a, b], i) => {
            const n1 = NODES[a];
            const n2 = NODES[b];
            return (
              <div
                key={`p-${i}`}
                className="st-particle"
                data-path={`${n1.x},${n1.y},${n2.x},${n2.y}`}
                style={{
                  position: "absolute",
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#f17752",
                  boxShadow: "0 0 10px rgba(241,119,82,0.9)",
                  transform: "translate(-50%, -50%)",
                  pointerEvents: "none",
                  zIndex: 1,
                  opacity: 0,
                }}
              />
            );
          })}

          {NODES.map((n) => (
            <div
              key={n.key}
              className="st-node"
              style={{
                position: "absolute",
                left: `${n.x}%`,
                top: `${n.y / 0.8}%`,
                transform: "translate(-50%, -50%)",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 18px",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.2)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                zIndex: 2,
              }}
            >
              <span
                style={{
                  position: "relative",
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#f17752",
                  boxShadow: "0 0 12px rgba(241,119,82,0.7)",
                }}
              >
                <span
                  className="st-node-glow"
                  style={{
                    position: "absolute",
                    inset: "-3px",
                    borderRadius: "50%",
                    border: "1px solid rgba(241,119,82,0.7)",
                    pointerEvents: "none",
                  }}
                />
              </span>
              <span
                style={{
                  fontFamily: FONT,
                  fontSize: "clamp(12px, 1vw, 15px)",
                  letterSpacing: "0.04em",
                  color: "#fff",
                  whiteSpace: "nowrap",
                }}
              >
                {n.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}

/* ══════════════════════════════════════════════════════════════════
   5 — BUILT TO PERFORM
   ══════════════════════════════════════════════════════════════════ */
const OUTCOMES = [
  { num: "01", title: "Clarity over cleverness", desc: "Interfaces people understand the first time — and still enjoy the hundredth." },
  { num: "02", title: "Built to last", desc: "Systems engineered to scale with the business, not break under it." },
  { num: "03", title: "Measurable outcomes", desc: "Work that moves real numbers — not just design awards." },
];

function BuiltToPerform() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll(".btp-row"),
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 75%", end: "top 40%", scrub: 1 },
        }
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <SectionShell>
      <div ref={ref}>
        <SectionHeader
          label="Built to perform"
          heading="Design that works as hard as the product behind it."
        />
        <div
          className="btp-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "clamp(40px, 5vw, 80px)",
          }}
        >
          {OUTCOMES.map((o) => (
            <div key={o.num} className="btp-row">
              <div
                style={{
                  fontFamily: FONT,
                  fontSize: "clamp(44px, 5vw, 72px)",
                  fontWeight: 500,
                  lineHeight: 1,
                  letterSpacing: "-0.03em",
                  background: "linear-gradient(135deg, #f17752 0%, #ffb28a 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  marginBottom: "clamp(20px, 2vw, 32px)",
                  display: "inline-block",
                }}
              >
                {o.num}
              </div>
              <div
                style={{
                  fontFamily: FONT,
                  fontSize: "clamp(22px, 2vw, 28px)",
                  fontWeight: 500,
                  lineHeight: 1.2,
                  color: "#fff",
                  letterSpacing: "-0.02em",
                  marginBottom: "clamp(14px, 1.2vw, 20px)",
                }}
              >
                {o.title}
              </div>
              <div
                style={{
                  fontFamily: FONT,
                  fontSize: "clamp(15px, 1.1vw, 18px)",
                  lineHeight: 1.55,
                  color: "rgba(255,255,255,0.7)",
                  maxWidth: "420px",
                }}
              >
                {o.desc}
              </div>
            </div>
          ))}
        </div>
        <style>{`
          @media (max-width: 900px) {
            .btp-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
          }
        `}</style>
      </div>
    </SectionShell>
  );
}

/* ══════════════════════════════════════════════════════════════════
   6 — CO-FOUNDERS
   ══════════════════════════════════════════════════════════════════ */
const FOUNDERS = [
  {
    name: "Anton Siribaddana",
    role: "Co-Founder · Development & Systems",
    line: "Builds the structure that makes the work hold up over time.",
  },
  {
    name: "Hansika Pinthu",
    role: "Co-Founder · Design & Strategy",
    line: "Shapes how every project looks, moves, and reads.",
  },
  {
    name: "Jane Doe",
    role: "Marketing & Strategy",
    line: "Turns the work into outcomes people actually notice.",
  },
];

function CoFounders() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll(".cf-person"),
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 75%", end: "top 40%", scrub: 1 },
        }
      );
      gsap.fromTo(
        el.querySelectorAll(".cf-statement"),
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          ease: "power3.out",
          scrollTrigger: { trigger: el.querySelector(".cf-statement-wrap"), start: "top 80%", end: "top 55%", scrub: 1 },
        }
      );
    }, el);

    // Mouse-follow glow on portraits
    const portraits = el.querySelectorAll<HTMLElement>(".cf-portrait");
    const handlers: Array<{ el: HTMLElement; move: (e: MouseEvent) => void; leave: () => void }> = [];
    portraits.forEach((p) => {
      const move = (e: MouseEvent) => {
        const rect = p.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        p.style.setProperty("--mx", `${x}%`);
        p.style.setProperty("--my", `${y}%`);
        p.style.transform = `translateY(-4px)`;
      };
      const leave = () => {
        p.style.setProperty("--mx", `30%`);
        p.style.setProperty("--my", `30%`);
        p.style.transform = `translateY(0)`;
      };
      p.addEventListener("mousemove", move);
      p.addEventListener("mouseleave", leave);
      handlers.push({ el: p, move, leave });
    });

    return () => {
      ctx.revert();
      handlers.forEach(({ el, move, leave }) => {
        el.removeEventListener("mousemove", move);
        el.removeEventListener("mouseleave", leave);
      });
    };
  }, []);

  return (
    <SectionShell>
      <div ref={ref}>
        <SectionHeader
          num="05"
          label="Co-Founders"
          heading="A small studio. Every decision shared."
        />

        {/* Founders */}
        <div
          className="cf-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "clamp(32px, 4vw, 72px)",
            marginBottom: "clamp(80px, 10vw, 160px)",
          }}
        >
          {FOUNDERS.map((f) => (
            <div key={f.name} className="cf-person">
              {/* Placeholder portrait */}
              <div
                className="cf-portrait"
                style={{
                  width: "100%",
                  aspectRatio: "1 / 1",
                  maxHeight: "360px",
                  background:
                    "linear-gradient(145deg, #0a0a2e 0%, #050518 60%, #0a0a2e 100%)",
                  borderRadius: "4px",
                  marginBottom: "clamp(20px, 2vw, 28px)",
                  position: "relative",
                  overflow: "hidden",
                  transition: "transform 0.6s cubic-bezier(0.2, 0.7, 0.2, 1)",
                }}
              >
                {/* Animated gradient sweep */}
                <div
                  aria-hidden
                  className="cf-sweep"
                  style={{
                    position: "absolute",
                    inset: "-20%",
                    background:
                      "radial-gradient(circle at var(--mx, 30%) var(--my, 30%), rgba(241,119,82,0.15) 0%, rgba(241,119,82,0) 55%)",
                    pointerEvents: "none",
                  }}
                />
                {/* Subtle grid overlay */}
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                    pointerEvents: "none",
                  }}
                />
                {/* Initials watermark */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: FONT,
                    fontSize: "clamp(48px, 6vw, 96px)",
                    fontWeight: 500,
                    color: "rgba(255,255,255,0.06)",
                    letterSpacing: "-0.04em",
                    userSelect: "none",
                  }}
                >
                  {f.name.split(" ").map((n) => n[0]).join("")}
                </div>
                {/* Corner tick */}
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    bottom: "14px",
                    left: "14px",
                    right: "14px",
                    display: "flex",
                    justifyContent: "space-between",
                    fontFamily: FONT,
                    fontSize: "10px",
                    letterSpacing: "0.2em",
                    color: "rgba(255,255,255,0.25)",
                    textTransform: "uppercase",
                  }}
                >
                  <span>Portrait</span>
                  <span>∙∙∙</span>
                </div>
              </div>
              <div
                style={{
                  fontFamily: FONT,
                  fontSize: "clamp(28px, 3vw, 44px)",
                  fontWeight: 500,
                  lineHeight: 1.05,
                  letterSpacing: "-0.025em",
                  color: "#fff",
                  marginBottom: "clamp(10px, 1vw, 14px)",
                }}
              >
                {f.name}
              </div>
              <div style={{ ...LABEL_STYLE, fontSize: "12px", marginBottom: "clamp(16px, 1.5vw, 22px)", color: "rgba(255,255,255,0.55)" }}>
                {f.role}
              </div>
              <div
                style={{
                  fontFamily: FONT,
                  fontSize: "clamp(15px, 1.1vw, 18px)",
                  lineHeight: 1.55,
                  color: "rgba(255,255,255,0.7)",
                  maxWidth: "420px",
                }}
              >
                {f.line}
              </div>
            </div>
          ))}
        </div>

        {/* Direct engagement statement */}
        <div
          className="cf-statement-wrap"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 2.6fr)",
            columnGap: "clamp(32px, 6vw, 96px)",
            alignItems: "start",
            paddingTop: "clamp(40px, 5vw, 72px)",
            borderTop: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <div style={{ ...LABEL_STYLE, display: "flex", alignItems: "baseline", gap: "14px" }}>
            <span style={{ color: "rgba(255,255,255,0.35)" }}>06</span>
            <span>You work directly with us</span>
          </div>
          <div className="cf-statement">
            <p
              style={{
                fontFamily: FONT,
                fontSize: "clamp(22px, 2.4vw, 36px)",
                lineHeight: 1.3,
                letterSpacing: "-0.015em",
                color: "#fff",
                margin: 0,
                maxWidth: "900px",
                fontWeight: 400,
              }}
            >
              Every project is handled by the same people shaping the thinking
              and building the outcome. No handoffs, no layers, just focused
              work from start to finish.
            </p>
            <p
              style={{
                fontFamily: FONT,
                fontSize: "clamp(14px, 1.05vw, 17px)",
                lineHeight: 1.55,
                color: "rgba(255,255,255,0.5)",
                margin: "clamp(24px, 2.5vw, 36px) 0 0",
                maxWidth: "720px",
              }}
            >
              We bring in trusted specialists when needed, while keeping
              direction and execution tightly led by us.
            </p>
          </div>
        </div>

        <style>{`
          @media (max-width: 960px) {
            .cf-grid { grid-template-columns: 1fr 1fr !important; }
          }
          @media (max-width: 640px) {
            .cf-grid { grid-template-columns: 1fr !important; gap: 56px !important; }
          }
        `}</style>
      </div>
    </SectionShell>
  );
}

/* ══════════════════════════════════════════════════════════════════
   7 — CLOSING
   ══════════════════════════════════════════════════════════════════ */
function Closing() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll(".cl-line"),
        { yPercent: 100, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 75%", end: "top 40%", scrub: 1 },
        }
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      style={{
        background: "#02021e",
        padding: `clamp(140px, 18vw, 260px) ${PAGE_PX}`,
        position: "relative",
        overflow: "hidden",
        borderTop: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "80vw",
          height: "80vw",
          maxWidth: "1000px",
          maxHeight: "1000px",
          background:
            "radial-gradient(circle, rgba(241,119,82,0.18) 0%, rgba(241,119,82,0) 55%)",
          filter: "blur(60px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div style={{ overflow: "hidden" }}>
          <div
            className="cl-line"
            style={{
              fontFamily: FONT,
              fontSize: "clamp(36px, 6vw, 96px)",
              fontWeight: 500,
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
              color: "#fff",
            }}
          >
            Good work takes time.
          </div>
        </div>
        <div style={{ overflow: "hidden", paddingBottom: "0.1em" }}>
          <div
            className="cl-line"
            style={{
              fontFamily: FONT,
              fontSize: "clamp(36px, 6vw, 96px)",
              fontWeight: 500,
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
              background: "linear-gradient(135deg, #f17752 0%, #ffb28a 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            So does the thinking behind it.
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════
   Main
   ══════════════════════════════════════════════════════════════════ */
export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <WhoWeAre />
      <HowWeWork />
      <SystemThinking />
      <BuiltToPerform />
      <CoFounders />
      <Closing />
    </>
  );
}
