"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const heading = headingRef.current;
    const text = textRef.current;
    if (!heading || !text) return;

    const ctx = gsap.context(() => {
      const lines = heading.querySelectorAll(".about-line");
      lines.forEach((line, i) => {
        gsap.fromTo(
          line,
          { y: 80, opacity: 0, rotateX: 40 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: heading,
              start: `top ${80 - i * 5}%`,
              end: `top ${50 - i * 5}%`,
              scrub: 1,
            },
          }
        );
      });

      gsap.fromTo(
        text,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          scrollTrigger: { trigger: text, start: "top 85%", end: "top 55%", scrub: 1 },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  // Ensure autoplay works across browsers
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    const tryPlay = () => v.play().catch(() => {});
    tryPlay();
    v.addEventListener("canplay", tryPlay, { once: true });
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        background: "#0C042A",
        overflow: "hidden",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {/* Fallback gradient — renders instantly so nothing flashes while video loads */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          background:
            "radial-gradient(60% 50% at 15% 30%, rgba(107,92,255,0.25) 0%, rgba(12,4,42,0) 60%), radial-gradient(45% 45% at 85% 70%, rgba(241,119,82,0.18) 0%, rgba(12,4,42,0) 65%), #0C042A",
        }}
      />

      {/* Video background */}
      <video
        ref={videoRef}
        src="/about-bg.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 1,
          opacity: 0.65,
          mixBlendMode: "screen",
        }}
      />

      {/* Glass vignette + darkening overlay for text legibility */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
          background:
            "radial-gradient(80% 60% at 50% 50%, rgba(12,4,42,0) 0%, rgba(12,4,42,0.55) 100%), linear-gradient(90deg, rgba(12,4,42,0.85) 0%, rgba(12,4,42,0.55) 40%, rgba(12,4,42,0.2) 100%)",
        }}
      />

      {/* Subtle noise */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 3,
          opacity: 0.2,
          mixBlendMode: "overlay",
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: "160px 160px",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 4,
          padding: "clamp(80px, 12vw, 180px) clamp(20px, 5vw, 80px)",
        }}
      >
        <div
          ref={headingRef}
          style={{
            perspective: "800px",
            marginBottom: "clamp(20px, 2.5vw, 32px)",
          }}
        >
          {["The noise fades.", "The direction is clear.", "The next move is yours."].map((line) => (
            <div key={line} className="about-line" style={{ overflow: "hidden" }}>
              <h2
                style={{
                  fontFamily: "'PP Neue Montreal', 'Inter', system-ui, sans-serif",
                  fontSize: "clamp(42px, 6vw, 88px)",
                  fontWeight: 500,
                  lineHeight: 1.02,
                  color: "#fff",
                  margin: 0,
                  letterSpacing: "-1.5px",
                }}
              >
                {line}
              </h2>
            </div>
          ))}
        </div>

        <div ref={textRef} style={{ maxWidth: "640px" }}>
          <p
            style={{
              fontFamily: "'PP Neue Montreal', sans-serif",
              fontSize: "clamp(17px, 1.5vw, 22px)",
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.65)",
              margin: 0,
              fontWeight: 400,
            }}
          >
            Whatever stage you&apos;re at, we&apos;ll help you connect the pieces and move forward with clarity.
          </p>

          <a
            href="/lets-begin"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              marginTop: "clamp(32px, 4vw, 48px)",
              background: "#f17752",
              color: "#fff",
              textDecoration: "none",
              border: "none",
              borderRadius: "100px",
              padding: "16px 32px",
              fontFamily: "'PP Neue Montreal', sans-serif",
              fontSize: "16px",
              fontWeight: 600,
              letterSpacing: "-0.01em",
              transition: "opacity 0.2s ease, transform 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.9";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Let&apos;s begin <span style={{ fontSize: "18px" }}>→</span>
          </a>
        </div>
      </div>

      {/* Top + bottom edge fades for section seam */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: "120px",
          background: "linear-gradient(to bottom, #0C042A 0%, rgba(12,4,42,0) 100%)",
          zIndex: 5,
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "120px",
          background: "linear-gradient(to top, #0C042A 0%, rgba(12,4,42,0) 100%)",
          zIndex: 5,
          pointerEvents: "none",
        }}
      />
    </section>
  );
}
