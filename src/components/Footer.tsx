"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const wordmarkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wordmarkRef.current;
    if (!el) return;

    const svg = el.querySelector("svg");
    if (!svg) return;

    const ctx = gsap.context(() => {
      // Giant wordmark mask-wipe + rise reveal
      gsap.set(svg, {
        yPercent: 18,
        scale: 0.96,
        opacity: 0,
        transformOrigin: "50% 100%",
        filter: "blur(8px)",
        clipPath: "inset(100% 0% 0% 0%)",
      });

      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        end: "bottom 60%",
        onEnter: () =>
          gsap.to(svg, {
            yPercent: 0,
            scale: 1,
            opacity: 1,
            filter: "blur(0px)",
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.6,
            ease: "power4.out",
          }),
        onLeaveBack: () =>
          gsap.to(svg, {
            yPercent: 18,
            scale: 0.96,
            opacity: 0,
            filter: "blur(8px)",
            clipPath: "inset(100% 0% 0% 0%)",
            duration: 0.8,
            ease: "power3.in",
          }),
      });

    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <footer style={{
      background: "linear-gradient(180deg, #06031a 0%, #080425 20%, #0d0638 42%, #160b52 62%, #1f1070 78%, #2e1a96 90%, #3d22b8 100%)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Glow — bottom center, rising purple bloom */}
      <div aria-hidden style={{
        position: "absolute", bottom: "-200px", left: "50%", transform: "translateX(-50%)",
        width: "1200px", height: "700px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(120,60,255,0.32) 0%, rgba(80,30,200,0.18) 40%, transparent 70%)",
        pointerEvents: "none",
      }} />
      {/* Glow — bottom left accent */}
      <div aria-hidden style={{
        position: "absolute", bottom: "-100px", left: "-150px",
        width: "600px", height: "600px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(241,119,82,0.12) 0%, transparent 65%)",
        pointerEvents: "none",
      }} />
      {/* Glow — bottom right accent */}
      <div aria-hidden style={{
        position: "absolute", bottom: "-100px", right: "-150px",
        width: "600px", height: "600px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(100,50,255,0.18) 0%, transparent 65%)",
        pointerEvents: "none",
      }} />
      {/* ── Dark footer body ── */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          padding: "clamp(32px, 3.5vw, 56px) clamp(20px, 6vw, 112px) clamp(28px, 3vw, 44px)",
          color: "#fff",
        }}
      >
        {/* Subtle full-width divider + fast shimmer */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "1px",
            background: "rgba(255,255,255,0.06)",
            margin: "0 0 clamp(40px, 5vw, 72px)",
            overflow: "hidden",
          }}
        >
          <span
            aria-hidden
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              height: "1px",
              width: "22%",
              background:
                "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.7) 50%, rgba(241,119,82,0.9) 75%, rgba(255,255,255,0) 100%)",
              filter: "blur(0.4px)",
              animation: "anika-footer-shimmer 3.2s linear infinite",
              willChange: "transform",
            }}
          />
          <style>{`
            @keyframes anika-footer-shimmer {
              0%   { transform: translateX(-100%); }
              100% { transform: translateX(calc(100vw + 100%)); }
            }
          `}</style>
        </div>

        {/* Columns */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "clamp(32px, 4vw, 64px)",
            marginBottom: "clamp(56px, 7vw, 104px)",
          }}
        >
          {/* Services */}
          <FooterCol
            label="Services"
            items={["Design", "Build", "Automate", "Brand Systems", "Creative Partnership™"]}
          />
          {/* Company */}
          <FooterCol
            label="Company"
            items={["About", "Services", "Work", "Resources", "Contact"]}
          />
          {/* Offices */}
          <div>
            <p style={colLabelStyle}>Offices</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div>
                <a
                  href="https://maps.google.com/?q=Colombo+Sri+Lanka"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={colLinkStyle}
                >
                  Colombo (HQ)
                </a>
                <p style={addressStyle}>Sri Lanka</p>
              </div>
              <div>
                <a
                  href="https://maps.google.com/?q=Remote"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={colLinkStyle}
                >
                  Remote
                </a>
                <p style={addressStyle}>Worldwide</p>
              </div>
            </div>
          </div>
          {/* Socials */}
          <FooterCol
            label="Follow"
            items={["Dribbble", "Behance", "LinkedIn", "Facebook"]}
            external
          />
        </div>

        {/* Giant ANIKA wordmark — pulled from logo SVG, spread full width */}
        <div
          ref={wordmarkRef}
          style={{
            display: "block",
            width: "100%",
            margin: "0 0 clamp(32px, 4vw, 56px)",
            userSelect: "none",
            lineHeight: 0,
            overflow: "hidden",
          }}
        >
          <svg
            viewBox="124 15 173 48"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: "block", width: "100%", height: "auto" }}
            aria-label="ANIKA"
          >
            <path
              d="M141.507 15.197L148.677 15.197L165.818 63L158.579 63L145.126 25.2356L138.502 43.8105L144.921 43.8105C146.15 43.8105 147.197 44.0154 148.062 44.4251C148.973 44.7893 149.701 45.2901 150.248 45.9275C150.84 46.5193 151.272 47.2022 151.545 47.9762C151.864 48.7502 152.023 49.5241 152.023 50.2981V50.6395L136.043 50.6395L131.605 63L124.366 63L141.507 15.197ZM169.947 15.197L176.776 15.197L198.219 48.2494L198.219 15.197L205.048 15.197L205.048 63L198.219 63L176.776 29.9476L176.776 63L169.947 63L169.947 15.197ZM209.125 15.197L215.954 15.197L215.954 63L209.125 63L209.125 15.197ZM220.028 15.197L226.857 15.197L226.857 36.0254C226.948 34.8873 227.13 33.8174 227.403 32.8158C227.722 31.8142 228.245 30.8809 228.974 30.0159L241.403 15.197L250.212 15.197L231.296 37.9376L251.578 63L242.837 63L226.857 43.2642L226.857 63L220.028 63L220.028 15.197ZM272.813 15.197L279.983 15.197L297.124 63L289.885 63L276.432 25.2356L269.808 43.8105L276.227 43.8105C277.457 43.8105 278.504 44.0154 279.369 44.4251C280.279 44.7893 281.008 45.2901 281.554 45.9275C282.146 46.5193 282.578 47.2022 282.851 47.9762C283.17 48.7502 283.329 49.5241 283.329 50.2981V50.6395L267.35 50.6395L262.911 63L255.672 63L272.813 15.197Z"
              fill="white"
            />
          </svg>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            paddingTop: "clamp(20px, 2.5vw, 28px)",
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <p
            style={{
              fontFamily: "'PP Neue Montreal', sans-serif",
              fontSize: "13px",
              color: "rgba(255,255,255,0.45)",
              margin: 0,
            }}
          >
            &copy; {new Date().getFullYear()} Anika Labs. All rights reserved. Designed and engineered with care.
          </p>

          <div style={{ display: "flex", gap: "clamp(16px, 2vw, 28px)" }}>
            <a href="#privacy" style={legalLinkStyle}>Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─── Column helper ─── */
function FooterCol({ label, items, external = false }: { label: string; items: string[]; external?: boolean }) {
  return (
    <div>
      <p style={colLabelStyle}>{label}</p>
      <nav style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {items.map((item) => (
          <a
            key={item}
            href={external ? "#" : `#${item.toLowerCase().replace(/\s+/g, "-")}`}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            style={colLinkStyle}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#f17752")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
          >
            {item}
          </a>
        ))}
      </nav>
    </div>
  );
}

const colLabelStyle: React.CSSProperties = {
  fontFamily: "'PP Neue Montreal', sans-serif",
  fontSize: "15px",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#fff",
  margin: "0 0 22px",
};

const colLinkStyle: React.CSSProperties = {
  fontFamily: "'PP Neue Montreal', sans-serif",
  fontSize: "17px",
  fontWeight: 400,
  color: "rgba(255,255,255,0.55)",
  textDecoration: "none",
  transition: "color 0.2s",
};

const addressStyle: React.CSSProperties = {
  fontFamily: "'PP Neue Montreal', sans-serif",
  fontSize: "14px",
  color: "rgba(255,255,255,0.45)",
  margin: "4px 0 0",
};

const legalLinkStyle: React.CSSProperties = {
  fontFamily: "'PP Neue Montreal', sans-serif",
  fontSize: "13px",
  color: "rgba(255,255,255,0.45)",
  textDecoration: "none",
};
