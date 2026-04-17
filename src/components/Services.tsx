"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const OrganicBackground = dynamic(() => import("./OrganicBackground"), { ssr: false });
const WebsiteGraphic = dynamic(() => import("./graphics/WebsiteGraphic"), { ssr: false });
const WebsiteBoxPattern = dynamic(() => import("./graphics/WebsiteBoxPattern"), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    num: "01",
    title: "Websites",
    desc: "We design and build websites as structured systems that guide people, remove friction, and turn attention into action.",
    includes: ["Strategy and user flow", "Custom design and layout", "Responsive across devices", "Conversion focused pages"],
    bg: "#e85d2f",
    bgDark: "#b8431f",
    textColor: "#ffffff",
    numColor: "rgba(255,255,255,0.06)",
    descColor: "rgba(255,255,255,0.65)",
    tagBorder: "rgba(255,255,255,0.2)",
    tagBg: "rgba(255,255,255,0.06)",
    tagText: "rgba(255,255,255,0.8)",
    shapeColor: "#ffffff",
  },
  {
    num: "02",
    title: "Brand",
    desc: "We create visual identities that are clear, consistent, and built to be recognized instantly.",
    includes: ["Brand direction and positioning", "Visual identity systems", "Typography and color", "Core brand assets"],
    bg: "#5d4bf0",
    bgDark: "#3f2fc7",
    textColor: "#ffffff",
    numColor: "rgba(255,255,255,0.06)",
    descColor: "rgba(255,255,255,0.65)",
    tagBorder: "rgba(255,255,255,0.2)",
    tagBg: "rgba(255,255,255,0.06)",
    tagText: "rgba(255,255,255,0.8)",
    shapeColor: "#ffffff",
  },
  {
    num: "03",
    title: "Systems",
    desc: "We define how everything connects, so your website is not just designed, but structured to perform.",
    includes: ["Audience and messaging clarity", "Information architecture", "User journeys and flows", "Prototypes and validation"],
    bg: "#1fa67e",
    bgDark: "#138660",
    textColor: "#ffffff",
    numColor: "rgba(255,255,255,0.06)",
    descColor: "rgba(255,255,255,0.65)",
    tagBorder: "rgba(255,255,255,0.2)",
    tagBg: "rgba(255,255,255,0.06)",
    tagText: "rgba(255,255,255,0.8)",
    shapeColor: "#ffffff",
  },
  {
    num: "04",
    title: "Build & Growth",
    desc: "We build and optimize websites to perform in the real world, from search visibility to conversion and long term scalability.",
    includes: ["Custom development and CMS", "Shopify and ecommerce", "SEO and AI search readiness", "Integrations and performance"],
    bg: "#1a1a2e",
    bgDark: "#0d0d1f",
    textColor: "#ffffff",
    numColor: "rgba(255,255,255,0.06)",
    descColor: "rgba(255,255,255,0.65)",
    tagBorder: "rgba(255,255,255,0.2)",
    tagBg: "rgba(255,255,255,0.06)",
    tagText: "rgba(255,255,255,0.8)",
    shapeColor: "#ffffff",
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
    <div ref={sectionRef} style={{ background: "#080818" }}>

      {/* Heading with organic background */}
      <div style={{
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Organic shader background */}
        <OrganicBackground />

        {/* Dark gradient overlay for text readability + smooth fade to dark bottom */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(8,8,24,0) 0%, rgba(8,8,24,0) 85%, rgba(8,8,24,0.3) 96%, rgba(8,8,24,0.85) 100%)",
          zIndex: 1,
          pointerEvents: "none",
        }} />

        <div style={{
          padding: "clamp(70px, 8vw, 140px) clamp(20px, 6vw, 112px) clamp(48px, 5vw, 80px)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "clamp(24px, 4vw, 64px)",
          flexWrap: "wrap",
          position: "relative",
          zIndex: 2,
        }}>
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
      </div>

      {/* Sticky stacking cards */}
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
                background: `linear-gradient(135deg, ${s.bg} 0%, ${s.bgDark} 100%)`,
                minHeight: "clamp(420px, 50vh, 580px)",
                padding: "clamp(44px, 5vw, 80px) clamp(36px, 5vw, 80px)",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              {/* Websites card — laptop mockup inside its own box */}
              {i === 0 && (
                <div
                  className="hidden md:block"
                  style={{
                    position: "absolute",
                    top: "clamp(28px, 3vw, 44px)",
                    right: "clamp(28px, 3vw, 44px)",
                    bottom: "clamp(28px, 3vw, 44px)",
                    width: "clamp(520px, 54%, 840px)",
                    background: "#e85d2f",
                    borderRadius: "clamp(14px, 1.6vw, 22px)",
                    overflow: "hidden",
                    zIndex: 1,
                    pointerEvents: "none",
                  }}
                >
                  {/* Ribbon layer — behind laptop */}
                  <WebsiteBoxPattern />

                  <img
                    src="/images/websites-laptop.png"
                    alt=""
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "50%",
                      transform: "translate(-52%, -38%)",
                      width: "165%",
                      height: "auto",
                      maxWidth: "none",
                      display: "block",
                      zIndex: 2,
                    }}
                  />
                </div>
              )}

              {/* Top content — title */}
              <div style={{ position: "relative", zIndex: 2 }}>
                <h3 style={{
                  fontFamily: "'Neue Haas Grotesk', sans-serif",
                  fontSize: "clamp(44px, 5vw, 84px)",
                  fontWeight: 200,
                  color: s.textColor,
                  lineHeight: 0.95,
                  margin: 0,
                  letterSpacing: "-3px",
                }}>
                  {s.title}
                </h3>
              </div>

              {/* Bottom content — desc + pills */}
              <div style={{ position: "relative", zIndex: 2, marginTop: "clamp(36px, 5vw, 64px)" }}>
                <p style={{
                  fontFamily: "'PP Neue Montreal', sans-serif",
                  fontSize: "clamp(16px, 1.3vw, 20px)",
                  color: s.descColor,
                  lineHeight: "1.7",
                  margin: "0 0 clamp(20px, 2.5vw, 36px)",
                  maxWidth: "720px",
                  fontWeight: 500,
                }}>
                  {s.desc}
                </p>

                <ul style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  borderTop: `1px solid ${s.tagBorder}`,
                  maxWidth: "720px",
                }}>
                  {s.includes.map((item, j) => (
                    <li
                      key={j}
                      style={{
                        padding: "22px 4px",
                        borderBottom: `1px solid ${s.tagBorder}`,
                        fontFamily: "'PP Neue Montreal', sans-serif",
                        fontSize: "19px",
                        fontWeight: 400,
                        color: s.textColor,
                        letterSpacing: "0.005em",
                      }}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
