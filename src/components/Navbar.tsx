"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const lastScrollY = useRef(0);
  const btnRef = useRef<HTMLAnchorElement>(null);
  const blobRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const btn = btnRef.current;
    const blob = blobRef.current;
    if (!btn || !blob) return;

    const onMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      gsap.to(blob, { x: x - 40, y: y - 40, duration: 0.3, ease: "power2.out" });
    };

    const onEnter = () => gsap.to(blob, { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" });
    const onLeave = () => gsap.to(blob, { opacity: 0, scale: 0.6, duration: 0.4, ease: "power2.in" });

    btn.addEventListener("mousemove", onMove);
    btn.addEventListener("mouseenter", onEnter);
    btn.addEventListener("mouseleave", onLeave);
    return () => {
      btn.removeEventListener("mousemove", onMove);
      btn.removeEventListener("mouseenter", onEnter);
      btn.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      const atTop = current < 80;

      if (atTop) {
        setScrolled(false);
      } else {
        setScrolled(true);
      }

      lastScrollY.current = current;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <nav
        className="pointer-events-auto flex items-center justify-between transition-all duration-500 ease-in-out"
        style={{
          width: scrolled ? "min(1400px, 95vw)" : "100%",
          margin: scrolled ? "16px auto 0" : "0",
          padding: scrolled ? "12px 24px" : "28px 112px",
          borderRadius: scrolled ? "999px" : "0px",
          background: scrolled ? "rgba(10,10,30,0.55)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
          border: scrolled ? "1px solid rgba(255,255,255,0.12)" : "1px solid transparent",
          boxShadow: scrolled ? "0 8px 32px rgba(0,0,0,0.3)" : "none",
        }}
      >
        {/* Logo */}
        <Image
          src="/images/logo.svg"
          alt="Anika Labs"
          width={200}
          height={60}
          className="w-auto transition-all duration-500"
          style={{ height: scrolled ? "44px" : "60px" }}
          priority
        />

        {/* Nav links */}
        <div className="hidden lg:flex items-center gap-8">
          {["Services", "Projects", "About Us", "Contact Us"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(" ", "-")}`}
              className="text-white font-medium hover:opacity-60 transition-opacity duration-200"
              style={{
                fontSize: scrolled ? "16px" : "18px",
                letterSpacing: "0.4px",
                fontFamily: "'PP Neue Montreal', sans-serif",
              }}
            >
              {item}
            </a>
          ))}
        </div>

        {/* CTA */}
        <a
          ref={btnRef}
          href="#contact"
          className="hidden lg:inline-flex items-center justify-center text-white font-medium rounded-full transition-all duration-500 relative overflow-hidden"
          style={{
            background: "#f17752",
            fontSize: scrolled ? "15px" : "18px",
            padding: scrolled ? "10px 24px" : "16px 36px",
            letterSpacing: "0.4px",
            fontFamily: "'PP Neue Montreal', sans-serif",
          }}
        >
          <span
            ref={blobRef}
            className="pointer-events-none absolute"
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,255,255,0.35) 0%, transparent 70%)",
              opacity: 0,
              scale: "0.6",
              transform: "translate(0px, 0px)",
            }}
          />
          <span className="relative z-10">Book a Call</span>
        </a>
      </nav>
    </div>
  );
}
