"use client";

import { useEffect, useState } from "react";

export default function Hero() {
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const ok =
      window.matchMedia("(min-width: 768px)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setShowVideo(ok);
  }, []);

  return (
    <section className="relative w-full bg-[#02021e] overflow-hidden">

      {/* ── Hero Top: Navbar + Headline + Description ── */}
      <div className="relative" style={{ minHeight: "100svh", maxHeight: "1000px" }}>

        {/* Background video */}
        {showVideo ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/images/hero-bg.png"
            className="absolute inset-0 h-full w-full object-cover scale-x-[-1]"
          >
            <source src="/images/hero-bg.mp4" type="video/mp4" />
          </video>
        ) : (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/hero-bg.png')", transform: "scaleX(-1)" }}
          />
        )}

        {/* Dark overlay on video */}
        <div className="absolute inset-0 bg-[#02021e]/60" />

        {/* Purple glow — top right */}
        <div
          className="pointer-events-none absolute rounded-full"
          style={{
            right: "-200px",
            top: "-200px",
            width: "900px",
            height: "900px",
            opacity: 0.5,
            background: "radial-gradient(circle, rgba(90,40,200,0.6) 0%, transparent 60%)",
          }}
        />

        {/* Navbar is fixed — rendered in layout */}
        <div className="h-[116px]" />

        {/* ── Hero Content ── */}
        <div className="relative z-10 flex items-center" style={{ minHeight: "calc(min(100vh, 1000px) - 140px)", padding: "0 clamp(20px, 6vw, 112px)" }}>
          {/* Headline — true vertical center */}
          <h1
            className="text-white leading-[1.02] tracking-[-2px]"
            style={{ fontSize: "clamp(36px, 6.5vw, 100px)", fontFamily: "'PP Neue Montreal', 'Inter', system-ui, sans-serif", fontWeight: 500 }}
          >
            We Build Digital
            <br />
            Systems That
            <br />
            Convert
          </h1>

          {/* Description — absolute bottom right on desktop, static on mobile */}
          <div className="absolute bottom-16 max-w-[450px] hidden md:block" style={{ right: "clamp(20px, 6vw, 112px)" }}>
            <p
              className="text-white/80 font-medium leading-[1.65] text-right"
              style={{ fontSize: "clamp(16px, 1.8vw, 20px)", fontFamily: "'PP Neue Montreal', sans-serif" }}
            >
              Websites, brand identities, and digital systems built to guide
              people, remove confusion, and turn attention into action, creating
              clear paths from first impression to real results.
            </p>
          </div>
        </div>

        {/* Description — mobile only, below headline area */}
        <div className="md:hidden relative z-10 pb-12" style={{ padding: "0 clamp(20px, 6vw, 112px) 48px" }}>
          <p
            className="text-white/80 font-medium leading-[1.65]"
            style={{ fontSize: "16px", fontFamily: "'PP Neue Montreal', sans-serif", maxWidth: "400px" }}
          >
            Websites, brand identities, and digital systems built to guide
            people, remove confusion, and turn attention into action, creating
            clear paths from first impression to real results.
          </p>
        </div>

        {/* Scroll indicator */}
        <div
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

        <style>{`
          @keyframes scrollPulse {
            0%, 100% { opacity: 0.4; transform: scaleY(1); }
            50% { opacity: 1; transform: scaleY(1.3); }
          }
        `}</style>
      </div>

    </section>
  );
}
