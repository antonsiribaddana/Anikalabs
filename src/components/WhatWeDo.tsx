"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BloomScene = dynamic(() => import("./BloomScene"), { ssr: false });

export default function WhatWeDo() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);
  const [bloomProgress, setBloomProgress] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const inner = innerRef.current;
    const heading = headingRef.current;
    const para = paraRef.current;
    if (!section || !inner || !heading || !para) return;

    const ctx = gsap.context(() => {

      // Section slides up + fades in
      gsap.fromTo(
        inner,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 90%",
            end: "top 40%",
            scrub: 1,
          },
        }
      );

      // Heading fades up first
      gsap.fromTo(
        heading,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 55%",
            end: "top 25%",
            scrub: 1,
          },
        }
      );

      // Paragraph fades up after
      gsap.fromTo(
        para,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 45%",
            end: "top 15%",
            scrub: 1,
          },
        }
      );

      // Geo grid trigger
      ScrollTrigger.create({
        trigger: section,
        start: "top 60%",
        end: "top -5%",
        scrub: 1.5,
        onUpdate: (self) => {
          setBloomProgress(self.progress);
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      style={{
        background: "#fffbf2",
        paddingTop: "0",
      }}
    >
      <div
        ref={innerRef}
        className="relative overflow-hidden"
        style={{
          minHeight: "100vh",
          background: "linear-gradient(160deg, #02021e 0%, #080830 50%, #0c0c45 100%)",
          borderRadius: "0",
          opacity: 0,
        }}
      >
        {/* Geometric grid — right side */}
        <BloomScene triggerProgress={bloomProgress} />

        {/* Content — left side */}
        <div
          className="relative z-10 flex flex-col justify-center px-28"
          style={{
            minHeight: "100vh",
            paddingTop: "84px",
            paddingBottom: "140px",
            maxWidth: "50%",
          }}
        >
          <h2
            ref={headingRef}
            className="text-white"
            style={{
              fontSize: "clamp(40px, 5vw, 80px)",
              fontFamily: "'Aeonik', sans-serif",
              fontWeight: 700,
              letterSpacing: "-1px",
              marginBottom: "32px",
              opacity: 0,
              maxWidth: "700px",
            }}
          >
            What We Do
          </h2>

          <p
            ref={paraRef}
            className="text-white/75 leading-[1.6]"
            style={{
              fontSize: "clamp(18px, 2.1vw, 26px)",
              fontFamily: "'PP Neue Montreal', sans-serif",
              maxWidth: "720px",
              opacity: 0,
            }}
          >
            We take your ideas and shape them into something clear and intentional.
            Not just something that looks good, but something people understand,
            connect with, and remember. Built to guide, convert, and perform, not
            something people scroll past.
          </p>
        </div>
      </div>
    </div>
  );
}
