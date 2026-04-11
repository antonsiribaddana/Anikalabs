"use client";

import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative w-full bg-[#02021e] overflow-hidden">

      {/* ── Hero Top: Navbar + Headline + Description ── */}
      <div className="relative" style={{ minHeight: "100svh" }}>

        {/* Background video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
        >
          <source src="/images/hero-bg.mp4" type="video/mp4" />
        </video>

        {/* Dark overlay on video */}
        <div className="absolute inset-0 bg-[#02021e]/60" />

        {/* Purple glow — top right */}
        <div
          className="pointer-events-none absolute -right-[200px] -top-[200px] w-[900px] h-[900px] rounded-full opacity-50"
          style={{ background: "radial-gradient(circle, rgba(90,40,200,0.6) 0%, transparent 60%)" }}
        />

        {/* Navbar is fixed — rendered in layout */}
        <div className="h-[116px]" />

        {/* ── Hero Content ── */}
        <div className="relative z-10 flex items-center px-28" style={{ minHeight: "calc(100vh - 140px)" }}>
          {/* Headline — true vertical center */}
          <h1
            className="text-white font-bold leading-[1.02] tracking-[-2px]"
            style={{ fontSize: "clamp(48px, 6.5vw, 100px)", fontFamily: "'NN Nouvelle Grotesk', sans-serif" }}
          >
            We Build Digital
            <br />
            Systems That
            <br />
            Convert
          </h1>

          {/* Description — absolute bottom right */}
          <div className="absolute bottom-16 right-28 max-w-[450px]">
            <p
              className="text-white/80 font-medium leading-[1.65] text-right"
              style={{ fontSize: "20px", fontFamily: "'PP Neue Montreal', sans-serif" }}
            >
              Websites, brand identities, and digital systems built to guide
              people, remove confusion, and turn attention into action, creating
              clear paths from first impression to real results.
            </p>
          </div>
        </div>
      </div>

    </section>
  );
}
