"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    num: "01",
    title: "Define",
    desc: "We align on your brand, audience, and goals before a single pixel moves. Strategy first — always.",
    includes: ["Discovery Workshop", "Visual Moodboard", "Colors & Typography", "Design Direction"],
    bg: "#f17752",
    textColor: "#1a0e08",
    numColor: "rgba(0,0,0,0.06)",
    descColor: "rgba(0,0,0,0.5)",
    tagBorder: "rgba(0,0,0,0.12)",
    tagBg: "rgba(0,0,0,0.04)",
    tagText: "rgba(0,0,0,0.6)",
    labelBg: "#fff",
    labelText: "#1a0e08",
  },
  {
    num: "02",
    title: "Design",
    desc: "Interfaces that reflect your brand, speak to your audience, and are a pleasure to interact with.",
    includes: ["UI Design", "Motion Concepts", "Figma Prototype", "Digital Styleguide"],
    bg: "#a78bfa",
    textColor: "#0e0a1f",
    numColor: "rgba(0,0,0,0.06)",
    descColor: "rgba(0,0,0,0.5)",
    tagBorder: "rgba(0,0,0,0.12)",
    tagBg: "rgba(0,0,0,0.04)",
    tagText: "rgba(0,0,0,0.6)",
    labelBg: "#fff",
    labelText: "#0e0a1f",
  },
  {
    num: "03",
    title: "Develop",
    desc: "Clean, fast development with interactions, responsive design, SEO and accessibility from day one.",
    includes: ["Next.js / Webflow", "Micro-interactions", "Responsive Design", "SEO & Accessibility"],
    bg: "#34d399",
    textColor: "#082018",
    numColor: "rgba(0,0,0,0.06)",
    descColor: "rgba(0,0,0,0.5)",
    tagBorder: "rgba(0,0,0,0.12)",
    tagBg: "rgba(0,0,0,0.04)",
    tagText: "rgba(0,0,0,0.6)",
    labelBg: "#fff",
    labelText: "#082018",
  },
];

export default function Services() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wrappersRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const wrappers = wrappersRef.current.filter(Boolean);

    const ctx = gsap.context(() => {
      wrappers.forEach((wrapper, i) => {
        if (i === wrappers.length - 1) return;

        ScrollTrigger.create({
          trigger: wrapper,
          start: "top 72px",
          end: `+=${wrapper.offsetHeight * 0.8}`,
          scrub: true,
          onUpdate: (self) => {
            const p = self.progress;
            // Scale down into the background, darken
            gsap.set(wrapper, {
              scale: 1 - p * 0.04,
              filter: `brightness(${1 - p * 0.4})`,
            });
          },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} style={{ background: "#080818" }}>
      {/* Heading */}
      <div style={{
        padding: "clamp(100px, 12vw, 200px) clamp(20px, 6vw, 112px) clamp(48px, 5vw, 80px)",
        textAlign: "center",
      }}>
        <h2 style={{
          fontFamily: "'NN Nouvelle Grotesk', sans-serif",
          fontSize: "clamp(42px, 6vw, 96px)",
          fontWeight: 700,
          color: "#fff",
          lineHeight: 1.05,
          letterSpacing: "-1px",
          margin: 0,
        }}>
          What we&apos;re<br />
          <span style={{ color: "rgba(255,255,255,0.15)" }}>really good at</span>
        </h2>
      </div>

      {/* Sticky stacking cards — matched to site content width */}
      <div style={{
        padding: "0 clamp(20px, 5vw, 80px)",
        paddingBottom: "clamp(80px, 10vw, 160px)",
      }}>
        {services.map((s, i) => (
          <div
            key={i}
            ref={(el) => { if (el) wrappersRef.current[i] = el; }}
            style={{
              position: "sticky",
              top: `${72 + i * 16}px`,
              marginBottom: "24px",
              zIndex: i + 1,
              borderRadius: "clamp(20px, 2.5vw, 28px)",
              overflow: "hidden",
              willChange: "transform",
              transformOrigin: "center top",
            }}
          >
            <div
              style={{
                background: s.bg,
                minHeight: "clamp(420px, 50vh, 580px)",
                padding: "clamp(44px, 5vw, 80px) clamp(36px, 5vw, 80px)",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              {/* Giant number — top right */}
              <span style={{
                position: "absolute",
                top: "clamp(-20px, -2vw, -30px)",
                right: "clamp(20px, 4vw, 64px)",
                fontFamily: "'NN Nouvelle Grotesk', sans-serif",
                fontSize: "clamp(140px, 18vw, 300px)",
                fontWeight: 700,
                lineHeight: 1,
                color: s.numColor,
                userSelect: "none",
                pointerEvents: "none",
              }}>
                {s.num}
              </span>

              {/* Top content */}
              <div style={{ position: "relative", zIndex: 2 }}>
                {/* Expertise label */}
                <div style={{
                  display: "inline-block",
                  padding: "8px 18px",
                  background: s.labelBg,
                  borderRadius: "6px",
                  marginBottom: "clamp(24px, 3vw, 44px)",
                }}>
                  <span style={{
                    fontFamily: "'PP Neue Montreal', sans-serif",
                    fontSize: "13px",
                    fontWeight: 500,
                    letterSpacing: "0.06em",
                    color: s.labelText,
                  }}>
                    Expertise
                  </span>
                </div>

                {/* Title */}
                <h3 style={{
                  fontFamily: "'NN Nouvelle Grotesk', sans-serif",
                  fontSize: "clamp(52px, 7vw, 120px)",
                  fontWeight: 700,
                  color: s.textColor,
                  lineHeight: 0.95,
                  margin: 0,
                  letterSpacing: "-2px",
                }}>
                  {s.title}
                </h3>
              </div>

              {/* Bottom content — desc + pills */}
              <div style={{ position: "relative", zIndex: 2, marginTop: "clamp(36px, 5vw, 64px)" }}>
                <p style={{
                  fontFamily: "'PP Neue Montreal', sans-serif",
                  fontSize: "clamp(16px, 1.3vw, 20px)",
                  color: s.descColor,
                  lineHeight: "1.7",
                  margin: "0 0 clamp(20px, 2.5vw, 36px)",
                  maxWidth: "500px",
                  fontWeight: 500,
                }}>
                  {s.desc}
                </p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {s.includes.map((item, j) => (
                    <span
                      key={j}
                      style={{
                        padding: "10px 22px",
                        borderRadius: "100px",
                        border: `1px solid ${s.tagBorder}`,
                        background: s.tagBg,
                        fontFamily: "'PP Neue Montreal', sans-serif",
                        fontSize: "14px",
                        fontWeight: 500,
                        color: s.tagText,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
