"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { projects, WorkCard } from "./Work";

const CATEGORIES = ["All", "Design", "Development", "Strategy", "Branding"];

export default function WorkPage() {
  const [filter, setFilter] = useState<string>("All");
  const headingRef = useRef<HTMLDivElement>(null);

  /* ── Heading reveal ── */
  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const lines = el.querySelectorAll(".hero-line");
      gsap.set(lines, { yPercent: 110, opacity: 0 });
      gsap.to(lines, {
        yPercent: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power4.out",
        stagger: 0.12,
        // Delay to sync with page transition curtain exit (0.65s) + settle (0.15s)
        delay: 0.85,
      });
    }, el);
    return () => ctx.revert();
  }, []);

  /* ── Filter projects ── */
  const filtered =
    filter === "All"
      ? projects
      : projects.filter((p) => p.tags.some((t) => t.toLowerCase().includes(filter.toLowerCase())));

  /* ── Rebuild rows pattern from filtered list (alternate full + half-pair) ── */
  const rows: (typeof projects[number][])[] = [];
  let i = 0;
  while (i < filtered.length) {
    if (filtered[i].size === "full") {
      rows.push([filtered[i]]);
      i++;
    } else {
      rows.push([filtered[i], filtered[i + 1]].filter(Boolean));
      i += 2;
    }
  }

  return (
    <section
      style={{
        background: "#02021e",
        position: "relative",
        overflow: "hidden",
        paddingBottom: "clamp(80px, 10vw, 160px)",
      }}
    >
      {/* ── Hero ── */}
      <div
        style={{
          padding:
            "clamp(140px, 14vw, 220px) clamp(20px, 6vw, 112px) clamp(48px, 6vw, 96px)",
          position: "relative",
          zIndex: 1,
          overflow: "hidden",
        }}
      >
        {/* Ambient glow */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "10%",
            left: "-10%",
            width: "60vw",
            height: "60vw",
            maxWidth: "900px",
            maxHeight: "900px",
            background:
              "radial-gradient(circle, rgba(241,119,82,0.18) 0%, rgba(241,119,82,0) 60%)",
            filter: "blur(40px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />


        {/* Huge title */}
        <div ref={headingRef} data-transition-reveal style={{ position: "relative", zIndex: 1 }}>
          <div style={{ overflow: "hidden" }}>
            <h1
              className="hero-line"
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
              Work that
            </h1>
          </div>
          <div style={{ overflow: "hidden", paddingBottom: "0.1em" }}>
            <h1
              className="hero-line"
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
              moves things.
            </h1>
          </div>
        </div>

        {/* Intro row — label + paragraph */}
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
            <div style={{ marginBottom: "8px" }}>Index</div>
            <div style={{ color: "rgba(255,255,255,0.85)", letterSpacing: "0.04em", textTransform: "none", fontSize: "14px" }}>
              Case studies, live projects, and experiments.
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
            A collection of systems, products, and brand worlds designed and built
            with intent — each one shaped around how real people use, feel, and
            remember them.
          </p>
        </div>
      </div>

      {/* ── Filter bar ── */}
      <div
        style={{
          padding: "0 clamp(20px, 6vw, 112px)",
          marginBottom: "clamp(32px, 4vw, 56px)",
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {CATEGORIES.map((cat) => {
            const active = filter === cat;
            return (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                style={{
                  padding: "10px 20px",
                  borderRadius: "999px",
                  border: active
                    ? "1px solid #fff"
                    : "1px solid rgba(255,255,255,0.22)",
                  background: active ? "#fff" : "transparent",
                  color: active ? "#02021e" : "rgba(255,255,255,0.85)",
                  fontFamily: "'PP Neue Montreal', sans-serif",
                  fontSize: "13px",
                  fontWeight: 500,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "background 0.25s, color 0.25s, border-color 0.25s",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.6)";
                    e.currentTarget.style.color = "#fff";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.85)";
                  }
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <span
          style={{
            fontFamily: "'PP Neue Montreal', sans-serif",
            fontSize: "12px",
            color: "rgba(255,255,255,0.5)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {filtered.length.toString().padStart(2, "0")} / {projects.length.toString().padStart(2, "0")}
        </span>
      </div>

      {/* ── Project grid ── */}
      <div
        style={{
          padding: "0 clamp(20px, 6vw, 112px)",
          display: "flex",
          flexDirection: "column",
          gap: "clamp(10px, 1.2vw, 16px)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {rows.length === 0 ? (
          <div
            style={{
              padding: "clamp(60px, 8vw, 120px) 0",
              textAlign: "center",
              fontFamily: "'PP Neue Montreal', sans-serif",
              fontSize: "18px",
              color: "rgba(255,255,255,0.55)",
            }}
          >
            No projects match this filter yet.
          </div>
        ) : (
          rows.map((row, ri) => (
            <div
              key={ri}
              className="work-row"
              style={{ display: "flex", gap: "clamp(10px, 1.2vw, 16px)" }}
            >
              {row.map((project, pi) => (
                <WorkCard key={`${ri}-${pi}`} project={project} />
              ))}
            </div>
          ))
        )}
      </div>

    </section>
  );
}
