"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    num: "01",
    title: "Define",
    desc: "We get clear on what you're trying to say and who it's for before anything starts. Everything is shaped around your goals so the direction is simple and focused.",
    includes: ["Brand direction", "Audience focus", "Visual references", "Clear plan"],
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
    desc: "We shape everything into something that looks right and makes sense. Every decision is made to keep things clear, consistent, and easy to follow.",
    includes: ["Page design", "Brand visuals", "Layout and flow", "Prototypes"],
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
    title: "Build",
    desc: "We bring it to life using the right tools so it works smoothly everywhere. It's set up to be responsive, easy to manage, and ready to grow with you.",
    includes: ["Websites and pages", "Responsive setup", "Simple interactions", "Easy updates"],
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
    <div ref={sectionRef} style={{ background: "#080818", position: "relative", overflow: "hidden" }}>
      {/* Decorative background blobs — right corner */}
      <div style={{
        position: "absolute",
        top: "-10%",
        right: "-8%",
        width: "clamp(400px, 45vw, 800px)",
        height: "clamp(400px, 45vw, 800px)",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(161,130,255,0.12) 0%, rgba(161,130,255,0.04) 40%, transparent 70%)",
        filter: "blur(60px)",
        pointerEvents: "none",
        zIndex: 0,
      }} />
      <div style={{
        position: "absolute",
        top: "5%",
        right: "5%",
        width: "clamp(250px, 28vw, 500px)",
        height: "clamp(250px, 28vw, 500px)",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(241,119,82,0.1) 0%, rgba(241,119,82,0.03) 45%, transparent 70%)",
        filter: "blur(50px)",
        pointerEvents: "none",
        zIndex: 0,
      }} />
      <div style={{
        position: "absolute",
        top: "15%",
        right: "15%",
        width: "clamp(120px, 14vw, 260px)",
        height: "clamp(120px, 14vw, 260px)",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(52,211,153,0.08) 0%, transparent 60%)",
        filter: "blur(40px)",
        pointerEvents: "none",
        zIndex: 0,
      }} />

      {/* Heading */}
      <div style={{
        padding: "clamp(70px, 8vw, 140px) clamp(20px, 6vw, 112px) clamp(48px, 5vw, 80px)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "clamp(24px, 4vw, 64px)",
        flexWrap: "wrap",
        position: "relative",
        zIndex: 1,
      }}>
        {/* Left — heading + subtext */}
        <div style={{ flex: "1 1 500px" }}>
          <h2 style={{
            fontFamily: "'Neue Haas Grotesk', sans-serif",
            fontSize: "clamp(42px, 6vw, 96px)",
            fontWeight: 200,
            color: "#fff",
            lineHeight: 1.05,
            letterSpacing: "-1px",
            margin: 0,
            textAlign: "left",
          }}>
            Clarity-first digital work
          </h2>
          <p style={{
            fontFamily: "'PP Neue Montreal', sans-serif",
            fontSize: "clamp(16px, 1.8vw, 20px)",
            fontWeight: 500,
            color: "rgba(255,255,255,0.8)",
            lineHeight: 1.65,
            margin: "clamp(16px, 2vw, 28px) 0 0",
            maxWidth: "700px",
            textAlign: "left",
          }}>
          We turn ideas into structured digital experiences, shaping design, brand, and interaction into something clear, intentional, and easy to understand.
        </p>
        </div>

      </div>

      {/* Sticky stacking cards — matched to site content width */}
      <div style={{
        padding: "0 clamp(20px, 5vw, 80px)",
        paddingBottom: "clamp(80px, 10vw, 160px)",
        position: "relative",
        zIndex: 1,
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

              {/* Top content — label */}
              <div style={{ position: "relative", zIndex: 2 }}>
                <div style={{
                  display: "inline-block",
                  padding: "8px 18px",
                  background: s.labelBg,
                  borderRadius: "6px",
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
              </div>

              {/* Main content — title left, desc + pills right */}
              <div style={{
                position: "relative",
                zIndex: 2,
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                gap: "clamp(32px, 4vw, 64px)",
                flexWrap: "wrap",
                marginTop: "auto",
              }}>
                {/* Left — title */}
                <div style={{ flex: "0 0 auto" }}>
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

                {/* Right — desc + pills */}
                <div style={{ flex: "1 1 300px", maxWidth: "500px" }}>
                  <p style={{
                    fontFamily: "'PP Neue Montreal', sans-serif",
                    fontSize: "clamp(15px, 1.2vw, 18px)",
                    color: s.descColor,
                    lineHeight: "1.7",
                    margin: "0 0 clamp(16px, 2vw, 28px)",
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
          </div>
        ))}
      </div>
    </div>
  );
}
