"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

const cards = [
  { src: "/images/card-3.jpg", alt: "Shawarmaz", w: 520, h: 293, mt: 0 },
  { src: "/images/card-2.jpg", alt: "In Space Design", w: 560, h: 315, mt: 40 },
  { src: "/images/card-1.jpg", alt: "Wander Women", w: 500, h: 281, mt: 0 },
  { src: "/images/card-5.jpg", alt: "Rays", w: 540, h: 304, mt: 50 },
  { src: "/images/card-4.jpg", alt: "In Space Collateral", w: 520, h: 293, mt: 20 },
  { src: "/images/card-3.jpg", alt: "Shawarmaz 2", w: 560, h: 315, mt: 0 },
  { src: "/images/card-1.jpg", alt: "Wander 2", w: 500, h: 281, mt: 30 },
  { src: "/images/card-2.jpg", alt: "In Space 2", w: 540, h: 304, mt: 0 },
];

export default function HorizontalCards() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);
  const blueTintRef = useRef<HTMLDivElement>(null);

  // Scroll-driven horizontal drift — no pinning
  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const getOverflow = () => track.scrollWidth - window.innerWidth;

      gsap.to(track, {
        x: () => -getOverflow(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  // Word-by-word scroll highlight
  useEffect(() => {
    const para = paraRef.current;
    if (!para) return;

    const split = new SplitType(para, { types: "words" });
    const words = split.words;
    if (!words) return;

    gsap.fromTo(
      words,
      { color: "rgba(2,2,30,0.15)" },
      {
        color: "rgba(2,2,30,1)",
        stagger: 0.05,
        ease: "none",
        scrollTrigger: {
          trigger: para,
          start: "top 80%",
          end: "bottom 30%",
          scrub: 1,
        },
      }
    );

    return () => split.revert();
  }, []);

  // Blue tint creeping in at the bottom
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const tint = blueTintRef.current;
    if (!wrapper || !tint) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        tint,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          ease: "power2.in",
          scrollTrigger: {
            trigger: wrapper,
            start: "bottom 130%",
            end: "bottom 30%",
            scrub: 1.5,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapperRef} className="relative" style={{ background: "#fffbf2" }}>
      {/* Blue tint that creeps in from the bottom */}
      <div
        ref={blueTintRef}
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: "350px",
          background: "linear-gradient(to top, rgba(8,8,48,0.25) 0%, rgba(8,8,48,0.08) 40%, transparent 100%)",
          opacity: 0,
        }}
      />

      {/* ── One row, scroll-driven horizontal drift ── */}
      <div
        ref={sectionRef}
        style={{ overflow: "hidden", padding: "80px 0" }}
      >
        <div
          ref={trackRef}
          style={{
            display: "flex",
            gap: "16px",
            alignItems: "flex-start",
            width: "max-content",
            willChange: "transform",
          }}
        >
          {cards.map((card, i) => (
            <div
              key={i}
              className="relative flex-shrink-0 rounded-2xl overflow-hidden"
              style={{
                width: `${card.w}px`,
                height: `${card.h}px`,
                marginTop: `${card.mt}px`,
              }}
            >
              <Image src={card.src} alt={card.alt} fill className="object-cover" />
            </div>
          ))}
        </div>
      </div>

      {/* ── Scroll-highlight paragraph ── */}
      <div className="px-16 flex justify-center items-center" style={{ paddingTop: "120px", paddingBottom: "160px" }}>
        <p
          ref={paraRef}
          className="text-center leading-[1.36] mx-auto"
          style={{
            fontSize: "clamp(22px, 3vw, 42px)",
            maxWidth: "55vw",
            fontFamily: "'Aeonik', sans-serif",
            fontWeight: 700,
            color: "rgba(2,2,30,0.15)",
          }}
        >
          Every brand we build starts from first principles, shaped by your goals,
          your audience, and the space you want to own. We turn what makes you
          different into a clear, consistent system that performs.
        </p>
      </div>

      </div>
  );
}
