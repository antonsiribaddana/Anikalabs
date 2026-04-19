"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import dynamic from "next/dynamic";

const WebsiteBoxPattern = dynamic(() => import("./graphics/WebsiteBoxPattern"), { ssr: false });
const BrandBoxPattern = dynamic(() => import("./graphics/BrandBoxPattern"), { ssr: false });
const BuildCLI = dynamic(() => import("./graphics/BuildCLI"), { ssr: false });
const SystemsFlow = dynamic(() => import("./graphics/SystemsFlow"), { ssr: false });

/* ──────────────────────────────────────────────────────────────
   Service data — same four disciplines as homepage
   ────────────────────────────────────────────────────────────── */
const services = [
  {
    num: "01",
    title: "Websites",
    desc:
      "We design and build websites as structured systems that guide people, remove friction, and turn attention into action.",
    includes: [
      "Strategy and user flow",
      "Custom design and layout",
      "Responsive across devices",
      "Conversion focused pages",
    ],
    bg: "#e85d2f",
    bgDark: "#b8431f",
    graphic: "websites" as const,
  },
  {
    num: "02",
    title: "Brand",
    desc:
      "We create visual identities that are clear, consistent, and built to be recognized instantly across digital and physical touchpoints.",
    includes: [
      "Brand direction and positioning",
      "Visual identity systems",
      "Typography and color",
      "Core brand assets",
    ],
    bg: "#5d4bf0",
    bgDark: "#3f2fc7",
    graphic: "brand" as const,
  },
  {
    num: "03",
    title: "Systems",
    desc:
      "We define how everything connects, so your website is not just designed, but structured to perform.",
    includes: [
      "Audience and messaging clarity",
      "Information architecture",
      "User journeys and flows",
      "Prototypes and validation",
    ],
    bg: "#1fa67e",
    bgDark: "#138660",
    graphic: "systems" as const,
  },
  {
    num: "04",
    title: "Build & Growth",
    desc:
      "We build and optimize digital products to perform in the real world, from websites to full scale web applications.",
    includes: [
      "Custom development and CMS",
      "Shopify and ecommerce",
      "Web applications and platforms",
      "SEO and AI search readiness",
    ],
    bg: "#1a1a2e",
    bgDark: "#0d0d1f",
    graphic: "build" as const,
  },
];

/* ──────────────────────────────────────────────────────────────
   Hero
   ────────────────────────────────────────────────────────────── */
function ServicesHero() {
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const lines = el.querySelectorAll(".sp-hero-line");
      gsap.set(lines, { yPercent: 110, opacity: 0 });
      gsap.to(lines, {
        yPercent: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power4.out",
        stagger: 0.12,
        delay: 0.85,
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      style={{
        background: "#02021e",
        padding:
          "clamp(140px, 14vw, 220px) clamp(20px, 6vw, 112px) clamp(48px, 6vw, 96px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "12%",
          right: "-10%",
          width: "60vw",
          height: "60vw",
          maxWidth: "900px",
          maxHeight: "900px",
          background:
            "radial-gradient(circle, rgba(93,75,240,0.22) 0%, rgba(93,75,240,0) 60%)",
          filter: "blur(40px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: "-10%",
          left: "-5%",
          width: "50vw",
          height: "50vw",
          maxWidth: "700px",
          maxHeight: "700px",
          background:
            "radial-gradient(circle, rgba(241,119,82,0.18) 0%, rgba(241,119,82,0) 60%)",
          filter: "blur(40px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Meta row */}
      <div
        data-transition-reveal
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "14px",
          marginBottom: "clamp(28px, 3vw, 48px)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
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
              fontFamily: "'PP Neue Montreal', sans-serif",
              fontSize: "13px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.75)",
            }}
          >
            Services — 0{services.length} Disciplines
          </span>
        </div>
      </div>

      <div ref={headingRef} data-transition-reveal style={{ position: "relative", zIndex: 1 }}>
        <div style={{ overflow: "hidden" }}>
          <h1
            className="sp-hero-line"
            style={{
              fontFamily: "'PP Neue Montreal', 'Inter', system-ui, sans-serif",
              fontSize: "clamp(64px, 13vw, 220px)",
              fontWeight: 500,
              lineHeight: 0.92,
              letterSpacing: "-0.04em",
              color: "#fff",
              margin: 0,
              willChange: "transform",
            }}
          >
            Built to move,
          </h1>
        </div>
        <div style={{ overflow: "hidden", paddingBottom: "0.1em" }}>
          <h1
            className="sp-hero-line"
            style={{
              fontFamily: "'PP Neue Montreal', 'Inter', system-ui, sans-serif",
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
            driven by design.
          </h1>
        </div>
      </div>

      <div
        data-transition-reveal
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.2fr)",
          gap: "clamp(32px, 6vw, 96px)",
          marginTop: "clamp(48px, 6vw, 96px)",
          alignItems: "start",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.18)",
            paddingTop: "clamp(16px, 1.5vw, 22px)",
            fontFamily: "'PP Neue Montreal', sans-serif",
            fontSize: "12px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          <div style={{ marginBottom: "8px" }}>What we do</div>
          <div style={{ color: "rgba(255,255,255,0.85)", letterSpacing: "0.04em", textTransform: "none", fontSize: "14px" }}>
            Four disciplines. One continuous system.
          </div>
        </div>
        <p
          style={{
            fontFamily: "'PP Neue Montreal', sans-serif",
            fontSize: "clamp(16px, 1.35vw, 22px)",
            lineHeight: 1.5,
            color: "rgba(255,255,255,0.75)",
            margin: 0,
            maxWidth: "620px",
            borderTop: "1px solid rgba(255,255,255,0.18)",
            paddingTop: "clamp(16px, 1.5vw, 22px)",
          }}
        >
          We help brands and product teams go from idea to digital experience —
          with strategy, design, and engineering built into one continuous
          system.
        </p>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   Card graphic — reuses homepage per-card visuals
   ────────────────────────────────────────────────────────────── */
function CardGraphic({ type }: { type: "websites" | "brand" | "systems" | "build" }) {
  if (type === "websites") {
    return (
      <>
        <WebsiteBoxPattern />
        <img
          src="/images/websites-laptop.png"
          alt=""
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-52%, -38%)",
            width: "165%",
            height: "auto",
            maxWidth: "none",
            display: "block",
            zIndex: 2,
          }}
        />
      </>
    );
  }
  if (type === "brand") {
    return (
      <>
        <BrandBoxPattern />
        <img
          src="/images/brand-showcase.png"
          alt=""
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: "88%",
            height: "auto",
            maxHeight: "90%",
            objectFit: "contain",
            display: "block",
            zIndex: 2,
          }}
        />
      </>
    );
  }
  if (type === "systems") return <SystemsFlow />;
  return <BuildCLI />;
}

/* ──────────────────────────────────────────────────────────────
   Service cards — flat layout (no sticky stacking), one per row
   Each card: big colored block with title/list on left, graphic on right
   ────────────────────────────────────────────────────────────── */
function ServicesBlocks() {
  return (
    <section
      style={{
        background: "#02021e",
        padding:
          "clamp(40px, 5vw, 80px) clamp(20px, 5vw, 80px) clamp(100px, 12vw, 180px)",
        display: "flex",
        flexDirection: "column",
        gap: "clamp(20px, 2.5vw, 32px)",
      }}
    >
      {services.map((s) => (
        <article
          key={s.num}
          className="service-card"
          style={{
            position: "relative",
            borderRadius: "clamp(20px, 2.5vw, 28px)",
            overflow: "hidden",
            background: `linear-gradient(135deg, ${s.bg} 0%, ${s.bgDark} 100%)`,
            minHeight: "clamp(460px, 58vh, 620px)",
            padding: "clamp(44px, 5vw, 80px) clamp(36px, 5vw, 80px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: "0 20px 60px -20px rgba(2,2,30,0.25)",
          }}
        >
          {/* Graphic — right side on desktop */}
          <div
            className="service-card-graphic hidden md:block"
            style={{
              position: "absolute",
              top: "clamp(28px, 3vw, 44px)",
              right: "clamp(28px, 3vw, 44px)",
              bottom: "clamp(28px, 3vw, 44px)",
              width: "clamp(480px, 50%, 820px)",
              background:
                s.graphic === "systems"
                  ? "linear-gradient(135deg, #1a8c68 0%, #0f6b4f 100%)"
                  : s.graphic === "build"
                  ? "linear-gradient(135deg, #22223a 0%, #14142a 100%)"
                  : s.bg,
              borderRadius: "clamp(14px, 1.6vw, 22px)",
              overflow: "hidden",
              zIndex: 1,
              pointerEvents: "none",
            }}
          >
            <CardGraphic type={s.graphic} />
          </div>

          {/* Top-left — number + title */}
          <div
            className="service-card-head"
            style={{
              position: "relative",
              zIndex: 2,
              display: "flex",
              flexDirection: "column",
              gap: "clamp(12px, 1.2vw, 18px)",
              maxWidth: "min(640px, 48%)",
            }}
          >
            <span
              style={{
                fontFamily: "'PP Neue Montreal', sans-serif",
                fontSize: "clamp(13px, 1vw, 15px)",
                letterSpacing: "0.14em",
                color: "rgba(255,255,255,0.55)",
                textTransform: "uppercase",
              }}
            >
              {s.num} / Service
            </span>
            <h3
              style={{
                fontFamily: "'PP Neue Montreal', 'Inter', system-ui, sans-serif",
                fontSize: "clamp(44px, 5.4vw, 96px)",
                fontWeight: 500,
                color: "#fff",
                lineHeight: 0.95,
                margin: 0,
                letterSpacing: "-0.03em",
              }}
            >
              {s.title}
            </h3>
          </div>

          {/* Bottom-left — desc + list */}
          <div
            className="service-card-body"
            style={{
              position: "relative",
              zIndex: 2,
              maxWidth: "min(640px, 48%)",
              marginTop: "clamp(36px, 5vw, 64px)",
            }}
          >
            <p
              style={{
                fontFamily: "'PP Neue Montreal', sans-serif",
                fontSize: "clamp(16px, 1.3vw, 20px)",
                color: "rgba(255,255,255,0.8)",
                lineHeight: 1.6,
                margin: "0 0 clamp(20px, 2.5vw, 32px)",
                fontWeight: 400,
              }}
            >
              {s.desc}
            </p>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                borderTop: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              {s.includes.map((item) => (
                <li
                  key={item}
                  style={{
                    padding: "18px 4px",
                    borderBottom: "1px solid rgba(255,255,255,0.2)",
                    fontFamily: "'PP Neue Montreal', sans-serif",
                    fontSize: "clamp(15px, 1.15vw, 18px)",
                    fontWeight: 400,
                    color: "#fff",
                    letterSpacing: "0.005em",
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </article>
      ))}

      <style>{`
        @media (max-width: 900px) {
          .service-card-head,
          .service-card-body {
            max-width: 100% !important;
          }
        }
      `}</style>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   Main
   ────────────────────────────────────────────────────────────── */
export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <ServicesBlocks />
    </>
  );
}
