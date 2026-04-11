"use client";

export default function Hero() {
  return (
    <section className="relative min-h-screen w-full bg-[#02021e] overflow-hidden">
      {/* Background glow — top right */}
      <div
        className="pointer-events-none absolute right-[-10%] top-[-20%] w-[600px] h-[600px] rounded-full opacity-40"
        style={{
          background:
            "radial-gradient(circle, rgba(74,41,200,0.6) 0%, rgba(2,2,30,0) 70%)",
        }}
      />

      {/* Background glow — bottom left */}
      <div
        className="pointer-events-none absolute left-[-15%] bottom-[-10%] w-[700px] h-[700px] rounded-full opacity-30"
        style={{
          background:
            "radial-gradient(circle, rgba(74,41,200,0.5) 0%, rgba(2,2,30,0) 70%)",
        }}
      />

      {/* ── Navbar ── */}
      <nav className="relative z-10 flex items-center justify-between px-14 pt-10">
        {/* Logo */}
        <div className="flex flex-col leading-none">
          <span className="text-white text-[52px] font-black tracking-[3px] uppercase leading-none">
            ANIKA
          </span>
          <span className="text-white text-[18px] font-bold tracking-[4px] uppercase -mt-1">
            Labs
          </span>
        </div>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-10 text-white text-[17px] font-medium tracking-wide">
          <a href="#services" className="hover:opacity-70 transition-opacity">
            Services
          </a>
          <a href="#projects" className="hover:opacity-70 transition-opacity">
            Projects
          </a>
          <a href="#about" className="hover:opacity-70 transition-opacity">
            About Us
          </a>
          <a href="#contact" className="hover:opacity-70 transition-opacity">
            Contact Us
          </a>
        </div>

        {/* CTA */}
        <a
          href="#contact"
          className="hidden md:inline-flex items-center justify-center bg-[#f17752] text-white text-[17px] font-medium tracking-wide rounded-full px-7 py-3 hover:bg-[#d9623f] transition-colors"
        >
          Book a Call
        </a>
      </nav>

      {/* ── Hero Content ── */}
      <div className="relative z-10 flex flex-col lg:flex-row items-start justify-between px-14 pt-20 pb-16 gap-12">
        {/* Left — headline */}
        <div className="flex-1 max-w-3xl">
          <h1
            className="text-white font-black leading-[1.0] tracking-tight"
            style={{ fontSize: "clamp(64px, 8vw, 118px)" }}
          >
            We Build
            <br />
            Digital&nbsp;
            <br />
            Systems That
            <br />
            Convert
          </h1>
        </div>

        {/* Right — sub description */}
        <div className="lg:max-w-sm xl:max-w-md self-center lg:self-end pb-4">
          <p className="text-white/80 text-[18px] leading-[1.7] font-light text-right">
            Websites, brand identities, and digital systems built to guide
            people, remove confusion, and turn attention into action — creating
            clear paths from first impression to real results.
          </p>
        </div>
      </div>

      {/* ── Staggered Portfolio Preview Cards ── */}
      <div className="relative z-10 px-10 pb-20">
        <div className="flex items-end gap-4 overflow-x-auto no-scrollbar">
          {/* Card 1 — tallest, leftmost */}
          <div className="flex-shrink-0 w-[260px] h-[420px] rounded-2xl bg-gradient-to-br from-[#1a1a3e] to-[#0d0d2b] border border-white/10 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              Fiberglass Pool Website
            </div>
          </div>

          {/* Card 2 — slightly lower */}
          <div className="flex-shrink-0 w-[260px] h-[370px] rounded-2xl bg-gradient-to-br from-[#221a3e] to-[#0d0d2b] border border-white/10 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              B2B Growth Website
            </div>
          </div>

          {/* Card 3 — middle, lowest */}
          <div className="flex-shrink-0 w-[260px] h-[320px] rounded-2xl bg-gradient-to-br from-[#1a2a3e] to-[#0d0d2b] border border-white/10 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              Healthcare UX Design
            </div>
          </div>

          {/* Card 4 — rising again */}
          <div className="flex-shrink-0 w-[260px] h-[360px] rounded-2xl bg-gradient-to-br from-[#2a1a3e] to-[#0d0d2b] border border-white/10 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              Lawn Care SEO Design
            </div>
          </div>

          {/* Card 5 — tallest again */}
          <div className="flex-shrink-0 w-[260px] h-[400px] rounded-2xl bg-gradient-to-br from-[#1a3a3e] to-[#0d0d2b] border border-white/10 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              SaaS Platform Design
            </div>
          </div>
        </div>
      </div>

      {/* ── Subtle tagline / scroll cue ── */}
      <div className="relative z-10 flex justify-center pb-10">
        <div className="flex flex-col items-center gap-2 opacity-40">
          <span className="text-white text-xs tracking-[3px] uppercase">
            Scroll
          </span>
          <div className="w-px h-8 bg-white/50" />
        </div>
      </div>
    </section>
  );
}
