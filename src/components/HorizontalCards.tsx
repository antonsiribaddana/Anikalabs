"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const cards = [
  { src: "/images/card-party.jpg", alt: "For Your Party", mt: 0 },
  { src: "/images/card-party-2.png", alt: "For Your Party Full", mt: 40 },
  { src: "/images/card-tennis.png", alt: "Gotta Tennis", mt: 20 },
  { src: "/images/card-pools.png", alt: "Modern Pools", mt: 60 },
  { src: "/images/card-fashion.png", alt: "Limitless Style", mt: 0 },
  { src: "/images/card-1.jpg", alt: "Wander Women", mt: 40 },
  { src: "/images/card-web-1.png", alt: "Camprodest 3", mt: 20 },
  { src: "/images/card-gosage.png", alt: "GoSage Lawn Care", mt: 0 },
];

export default function HorizontalCards() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);
  const blueTintRef = useRef<HTMLDivElement>(null);
  const sunRef = useRef<SVGSVGElement>(null);
  const paraWrapRef = useRef<HTMLDivElement>(null);

  // Scroll-driven horizontal drift — no pinning
  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const getOverflow = () => (track.scrollWidth - window.innerWidth) * 0.4;

      gsap.to(track, {
        x: () => -getOverflow(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 1.5,
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

  // Sun mark: rotate + follow curved path into WhatWeDo section
  useEffect(() => {
    const sun = sunRef.current;
    const paraWrap = paraWrapRef.current;
    if (!sun || !paraWrap) return;

    const ctx = gsap.context(() => {
      // Continuous slow rotation (independent of scroll)
      gsap.to(sun, {
        rotation: 360,
        duration: 12,
        ease: "none",
        repeat: -1,
        transformOrigin: "50% 50%",
      });

      // Scroll-driven path animation: sun sweeps right and down into the dark section
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: paraWrap,
          start: "bottom 60%",
          end: "bottom -60%",
          scrub: 1.5,
        },
      });

      tl.to(sun, {
        motionPath: {
          path: [
            { x: 0, y: 0 },
            { x: 180, y: 120 },
            { x: 280, y: 340 },
            { x: 200, y: 560 },
          ],
          curviness: 1.5,
        },
        scale: 2.8,
        opacity: 0.25,
        ease: "power1.inOut",
        duration: 1,
      });

      // Fade out at the very end
      tl.to(sun, {
        opacity: 0,
        scale: 3.2,
        duration: 0.3,
      }, 0.75);
    });

    return () => ctx.revert();
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
              className="relative flex-shrink-0 overflow-hidden"
              style={{
                width: "clamp(280px, 35vw, 480px)",
                height: "clamp(280px, 35vw, 480px)",
                marginTop: `${card.mt}px`,
              }}
            >
              <picture>
                <source srcSet={card.src.replace(/\.(png|jpg|jpeg|webp)$/i, ".avif")} type="image/avif" />
                <img
                  src={card.src}
                  alt={card.alt}
                  loading={i < 2 ? "eager" : "lazy"}
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </picture>
            </div>
          ))}
        </div>
      </div>

      {/* ── Scroll-highlight paragraph ── */}
      <div ref={paraWrapRef} className="flex flex-col justify-center items-center" style={{ paddingTop: "clamp(60px, 8vw, 120px)", paddingBottom: "clamp(80px, 10vw, 160px)", paddingLeft: "clamp(20px, 4vw, 64px)", paddingRight: "clamp(20px, 4vw, 64px)" }}>
        {/* Anika Labs sun mark */}
        <svg ref={sunRef} width="54" height="54" viewBox="11 11 88 88" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: "40px", willChange: "transform, opacity" }}>
          <path d="M55 11C52.976 11 51.3333 11.055 51.3333 20.1667C51.3333 26.5563 52.1508 35.6094 53.3314 40.5052C51.8819 40.6739 50.4772 40.9936 49.1849 41.5579C47.7472 36.7201 43.9403 28.5157 40.7559 23.0026C36.1982 15.1083 34.7527 15.8819 33 16.8939C31.2473 17.9059 29.8531 18.7749 34.4108 26.6693C37.6047 32.1989 42.8289 39.6245 46.2988 43.2767C45.1511 44.1333 44.1333 45.1511 43.2767 46.2988C39.6245 42.8289 32.1989 37.6047 26.6693 34.4108C18.7749 29.8531 17.9059 31.2473 16.8939 33C15.8819 34.7527 15.1083 36.1982 23.0026 40.7559C28.5157 43.9403 36.7201 47.7472 41.5579 49.1849C40.9936 50.4772 40.6739 51.8819 40.5052 53.3314C35.6094 52.1508 26.5563 51.3333 20.1667 51.3333C11.055 51.3333 11 52.976 11 55C11 57.024 11.055 58.6667 20.1667 58.6667C26.5563 58.6667 35.6094 57.8492 40.5052 56.6686C40.6739 58.1181 40.9936 59.5228 41.5579 60.8151C36.7201 62.2528 28.5157 66.0598 23.0026 69.2441C15.1083 73.8018 15.8819 75.2473 16.8939 77C17.9059 78.7527 18.7786 80.1469 26.6693 75.5892C32.1989 72.3953 39.6245 67.1712 43.2767 63.7012C44.1333 64.8489 45.1511 65.8667 46.2988 66.7233C42.8289 70.3755 37.6047 77.8011 34.4108 83.3307C29.8531 91.2251 31.2473 92.0941 33 93.1061C34.7527 94.1181 36.1982 94.8881 40.7559 86.9974C43.9403 81.4843 47.7472 73.2799 49.1849 68.4421C50.4772 69.0064 51.8819 69.3261 53.3314 69.4948C52.1508 74.3906 51.3333 83.4437 51.3333 89.8333C51.3333 98.945 52.976 99 55 99C57.024 99 58.6667 98.945 58.6667 89.8333C58.6667 83.4437 57.8492 74.3906 56.6686 69.4948C58.1181 69.3261 59.5228 69.0064 60.8151 68.4421C62.2528 73.2799 66.0598 81.4843 69.2441 86.9974C73.8018 94.8881 75.2473 94.1181 77 93.1061C78.7527 92.0941 80.1469 91.2214 75.5892 83.3307C72.3953 77.8011 67.1712 70.3755 63.7012 66.7233C64.8489 65.8667 65.8667 64.8489 66.7233 63.7012C70.3755 67.1712 77.8011 72.3953 83.3307 75.5892C91.2214 80.1469 92.0941 78.7527 93.1061 77C94.1181 75.2473 94.8917 73.8018 86.9974 69.2441C81.4843 66.0598 73.2799 62.2528 68.4421 60.8151C69.0064 59.5228 69.3261 58.1181 69.4948 56.6686C74.3906 57.8492 83.4437 58.6667 89.8333 58.6667C98.945 58.6667 99 57.024 99 55C99 52.976 98.945 51.3333 89.8333 51.3333C83.4437 51.3333 74.3906 52.1508 69.4948 53.3314C69.3261 51.8819 69.0064 50.4772 68.4421 49.1849C73.2799 47.7472 81.4843 43.9403 86.9974 40.7559C94.8917 36.1982 94.1181 34.7527 93.1061 33C92.0941 31.2473 91.2214 29.8531 83.3307 34.4108C77.8011 37.6047 70.3755 42.8289 66.7233 46.2988C65.8667 45.1511 64.8489 44.1333 63.7012 43.2767C67.1712 39.6245 72.3953 32.1989 75.5892 26.6693C80.1469 18.7749 78.7527 17.9059 77 16.8939C75.2473 15.8819 73.8018 15.1119 69.2441 23.0026C66.0598 28.5157 62.2528 36.7201 60.8151 41.5579C59.5228 40.9936 58.1181 40.6739 56.6686 40.5052C57.8492 35.6094 58.6667 26.5563 58.6667 20.1667C58.6667 11.055 57.024 11 55 11ZM44.6732 12.2819C44.3259 12.3102 43.9781 12.3987 43.6133 12.4967C42.1466 12.8891 40.8954 13.2582 41.3574 17.1302C42.2008 18.2925 43.0519 19.6329 43.9355 21.1693C45.2812 23.5013 46.7117 26.2389 48.0391 29.0182C47.8007 25.9456 47.6667 22.858 47.6667 20.1667C47.6667 18.4837 47.706 16.847 47.86 15.3327C46.716 12.6899 45.7151 12.197 44.6732 12.2819ZM65.3268 12.2819C64.2849 12.197 63.284 12.6899 62.14 15.3327C62.294 16.847 62.3333 18.4837 62.3333 20.1667C62.3333 22.858 62.1993 25.9456 61.9609 29.0182C63.2883 26.2426 64.7188 23.5013 66.0645 21.1693C66.9481 19.6366 67.7992 18.2925 68.6426 17.1302C69.1046 13.2619 67.8497 12.8927 66.3867 12.4967C66.0219 12.3987 65.6741 12.3102 65.3268 12.2819ZM25.681 22.7949C24.9261 22.8641 24.4188 23.35 23.8835 23.8835C22.8091 24.9615 21.9125 25.9117 24.2702 29.054C25.5058 29.604 26.8563 30.2815 28.5026 31.2311C30.8126 32.5658 33.3957 34.2057 35.9147 35.929C33.3187 32.09 31.4218 28.8326 31.2311 28.5026C30.3915 27.0469 29.6058 25.6097 28.9824 24.2201C27.4406 23.0761 26.4359 22.7257 25.681 22.7949ZM84.3262 22.8021C83.5708 22.7324 82.5594 23.0814 81.0176 24.2272C80.3942 25.6095 79.6086 27.0469 78.7689 28.5026C78.5782 28.8326 76.6848 32.0935 74.0924 35.9362C76.6115 34.2129 79.1946 32.5693 81.5046 31.2383C83.1509 30.2886 84.4978 29.6112 85.7298 29.0612C88.0875 25.9189 87.1909 24.9686 86.1165 23.8906C85.583 23.3571 85.0815 22.8717 84.3262 22.8021ZM14.8099 41.3145C13.0776 41.5458 12.791 42.5188 12.4967 43.6133C12.1044 45.0726 11.809 46.3347 15.3327 47.86C16.847 47.706 18.4837 47.6667 20.1667 47.6667C22.8617 47.6667 25.9599 47.8007 29.0326 48.0391C25.9856 46.5761 23.1566 45.0832 21.1693 43.9355C19.7136 43.0959 18.3121 42.2413 17.0801 41.3503C16.1267 41.2403 15.3873 41.2373 14.8099 41.3145ZM95.1901 41.3145C94.6125 41.2373 93.8742 41.2403 92.9199 41.3503C91.6879 42.2413 90.2864 43.0959 88.8307 43.9355C86.8397 45.0832 84.0145 46.5761 80.9675 48.0391C84.0401 47.8007 87.1383 47.6667 89.8333 47.6667C91.5163 47.6667 93.153 47.706 94.6673 47.86C98.191 46.3347 97.8956 45.0726 97.5033 43.6133C97.209 42.5188 96.923 41.5458 95.1901 41.3145ZM55 47.6667C59.0935 47.6667 62.3333 50.9065 62.3333 55C62.3333 59.0935 59.0935 62.3333 55 62.3333C50.9065 62.3333 47.6667 59.0935 47.6667 55C47.6667 50.9065 50.9065 47.6667 55 47.6667ZM29.0326 61.9609C25.9599 62.1993 22.8617 62.3333 20.1667 62.3333C18.4837 62.3333 16.847 62.294 15.3327 62.14C11.809 63.6653 12.1044 64.9274 12.4967 66.3867C12.8891 67.8461 13.2631 69.0897 17.0801 68.6497C18.3121 67.7587 19.7136 66.9041 21.1693 66.0645C23.1603 64.9168 25.9856 63.4239 29.0326 61.9609ZM80.9675 61.9609C84.0145 63.4239 86.8397 64.9168 88.8307 66.0645C90.2864 66.9041 91.6879 67.7587 92.9199 68.6497C96.7333 69.0897 97.1109 67.8461 97.5033 66.3867C97.8956 64.9274 98.191 63.6653 94.6673 62.14C93.153 62.294 91.5163 62.3333 89.8333 62.3333C87.1383 62.3333 84.0401 62.1993 80.9675 61.9609ZM35.9076 74.0638C33.3886 75.7871 30.8054 77.4307 28.4954 78.7617C26.8491 79.7114 25.5022 80.3888 24.2702 80.9388C21.9125 84.0811 22.8091 85.0314 23.8835 86.1094C24.9615 87.1874 25.9117 88.0803 29.054 85.7227C29.6077 84.4943 30.2815 83.1437 31.2311 81.4974C31.4218 81.1637 33.3152 77.9028 35.9076 74.0638ZM74.0853 74.071C76.6776 77.91 78.5711 81.1709 78.7617 81.5046C79.7114 83.1509 80.3888 84.4978 80.9388 85.7298C84.0811 88.0875 85.0314 87.1909 86.1094 86.1165C87.1874 85.0422 88.0803 84.0883 85.7227 80.946C84.4943 80.3923 83.1437 79.7186 81.4974 78.7689C79.1874 77.4342 76.6043 75.7943 74.0853 74.071ZM48.0391 80.9818C46.7117 83.7574 45.2812 86.4987 43.9355 88.8307C43.0482 90.3634 42.2008 91.7075 41.3574 92.8698C40.8954 96.7381 42.1503 97.1073 43.6133 97.5033C45.0726 97.8956 46.3347 98.191 47.86 94.6673C47.706 93.153 47.6667 91.5163 47.6667 89.8333C47.6667 87.142 47.8007 84.0544 48.0391 80.9818ZM61.9609 80.9818C62.1993 84.0544 62.3333 87.142 62.3333 89.8333C62.3333 91.5163 62.294 93.153 62.14 94.6673C63.6653 98.191 64.9274 97.8956 66.3867 97.5033C67.8534 97.1109 69.1046 96.7418 68.6426 92.8698C67.7992 91.7075 66.9481 90.3671 66.0645 88.8307C64.7188 86.4987 63.2883 83.7611 61.9609 80.9818Z" fill="#F17752"/>
        </svg>
        <p
          ref={paraRef}
          className="text-center leading-[1.36] mx-auto"
          style={{
            fontSize: "clamp(22px, 3vw, 42px)",
            maxWidth: "clamp(300px, 70vw, 800px)",
            fontFamily: "'Neue Haas Grotesk', var(--font-geist-sans), sans-serif",
            fontWeight: 300,
            letterSpacing: "0px",
            color: "rgba(2,2,30,0.15)",
          }}
        >
          Every website is built around clear goals, defined audiences, and the
          position you want to own. Branding follows to bring consistency,
          recognition, and performance.
        </p>
      </div>

      </div>
  );
}
