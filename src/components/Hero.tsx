"use client";

import { useEffect, useRef, useState } from "react";

export default function Hero() {
  const [showVideo, setShowVideo] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const modalVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [modalOpen]);

  useEffect(() => {
    if (!modalOpen) return;
    const video = modalVideoRef.current;
    if (!video) return;
    const src = "/videos/hls/playlist.m3u8";
    let hls: { destroy: () => void } | null = null;

    const tryPlay = () => {
      video.play().catch(() => {
        video.muted = true;
        video.play().catch(() => {});
      });
    };

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      video.addEventListener("loadedmetadata", tryPlay, { once: true });
    } else {
      let cancelled = false;
      import("hls.js").then(({ default: Hls }) => {
        if (cancelled) return;
        if (Hls.isSupported()) {
          const instance = new Hls({ enableWorker: true, lowLatencyMode: false });
          instance.loadSource(src);
          instance.attachMedia(video);
          instance.on(Hls.Events.MANIFEST_PARSED, tryPlay);
          hls = instance;
        } else {
          video.src = src;
          video.addEventListener("loadedmetadata", tryPlay, { once: true });
        }
      });
      return () => {
        cancelled = true;
        if (hls) hls.destroy();
      };
    }
    return () => {
      if (hls) (hls as { destroy: () => void }).destroy();
    };
  }, [modalOpen]);

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
            <source src="/images/hero-bg.webm" type="video/webm" />
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
            <div className="flex justify-end mb-5">
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                aria-label="Play showreel"
                className="group inline-flex items-center gap-3 text-white/90 hover:text-white transition-colors"
                style={{ fontFamily: "'PP Neue Montreal', sans-serif", cursor: "pointer" }}
              >
                <span
                  className="relative inline-flex items-center justify-center rounded-full"
                  style={{
                    width: "52px",
                    height: "52px",
                    background: "rgba(241,119,82,0.15)",
                    border: "1px solid rgba(241,119,82,0.6)",
                    backdropFilter: "blur(6px)",
                  }}
                >
                  <span
                    className="absolute inset-0 rounded-full"
                    style={{
                      border: "1px solid rgba(241,119,82,0.5)",
                      animation: "playPulse 2.2s ease-out infinite",
                    }}
                  />
                  <svg width="14" height="16" viewBox="0 0 14 16" fill="none" style={{ marginLeft: "2px" }}>
                    <path d="M0 0L14 8L0 16V0Z" fill="#F17752" />
                  </svg>
                </span>
                <span style={{ fontSize: "13px", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase" }}>
                  Watch Reel
                </span>
              </button>
            </div>
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
          @keyframes playPulse {
            0% { transform: scale(1); opacity: 0.8; }
            100% { transform: scale(1.6); opacity: 0; }
          }
        `}</style>
      </div>

      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Showreel video"
          onClick={() => setModalOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(2,2,30,0.85)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "clamp(16px, 4vw, 48px)",
            animation: "modalFade 0.25s ease-out",
          }}
        >
          <button
            type="button"
            onClick={() => setModalOpen(false)}
            aria-label="Close video"
            style={{
              position: "absolute",
              top: "24px",
              right: "24px",
              width: "44px",
              height: "44px",
              borderRadius: "9999px",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2L14 14M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "1200px",
              aspectRatio: "16 / 9",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
              background: "#000",
            }}
          >
            <video
              ref={modalVideoRef}
              autoPlay
              controls
              playsInline
              style={{ width: "100%", height: "100%", display: "block", objectFit: "contain", background: "#000" }}
            />
          </div>
          <style>{`
            @keyframes modalFade {
              from { opacity: 0; }
              to { opacity: 1; }
            }
          `}</style>
        </div>
      )}

    </section>
  );
}
