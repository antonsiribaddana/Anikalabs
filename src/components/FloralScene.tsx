"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function FloralScene({ triggerProgress }: { triggerProgress: number }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (triggerProgress < 0.15 || hasAnimated.current) return;
    hasAnimated.current = true;

    const svg = svgRef.current;
    if (!svg) return;

    const stems = svg.querySelectorAll(".stem-line");
    const leaves = svg.querySelectorAll(".leaf");
    const flowers = svg.querySelectorAll(".flower");
    const buds = svg.querySelectorAll(".bud");
    const orbs = svg.querySelectorAll(".orb");

    // Stems grow upward — slow and graceful
    stems.forEach((stem, i) => {
      const path = stem as SVGPathElement;
      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 3.5 + i * 0.5,
        delay: i * 0.4,
        ease: "power1.out",
      });
    });

    // Leaves unfurl slowly from stem
    leaves.forEach((leaf, i) => {
      gsap.set(leaf, { scale: 0, opacity: 0, transformOrigin: "50% 100%" });
      gsap.to(leaf, {
        scale: 1,
        opacity: 1,
        duration: 1.8,
        delay: 1.5 + i * 0.35,
        ease: "power2.out",
      });
      // Gentle continuous sway
      gsap.to(leaf, {
        rotation: -3 + Math.random() * 6,
        duration: 4 + Math.random() * 2,
        delay: 3.5 + i * 0.35,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        transformOrigin: "50% 100%",
      });
    });

    // Flowers bloom — slow, soft elastic
    flowers.forEach((flower, i) => {
      gsap.set(flower, { scale: 0, opacity: 0, transformOrigin: "50% 50%" });
      gsap.to(flower, {
        scale: 1,
        opacity: 1,
        duration: 2.2,
        delay: 2.0 + i * 0.5,
        ease: "elastic.out(0.6, 0.4)",
      });
      // Very gentle breathing
      gsap.to(flower, {
        scale: 1.03,
        duration: 3.5 + Math.random() * 1.5,
        delay: 4.5 + i * 0.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    });

    // Buds emerge slowly
    buds.forEach((bud, i) => {
      gsap.set(bud, { scale: 0, opacity: 0, transformOrigin: "50% 100%" });
      gsap.to(bud, {
        scale: 1,
        opacity: 1,
        duration: 1.6,
        delay: 1.8 + i * 0.4,
        ease: "power2.out",
      });
    });

    // Orbs fade in gently + slow floating
    orbs.forEach((orb, i) => {
      gsap.set(orb, { scale: 0, opacity: 0 });
      gsap.to(orb, {
        scale: 1,
        opacity: 1,
        duration: 1.4,
        delay: 2.8 + i * 0.3,
        ease: "power2.out",
      });
      // Slow dreamy float
      gsap.to(orb, {
        y: -4 + Math.random() * 8,
        x: -3 + Math.random() * 6,
        duration: 4 + Math.random() * 3,
        delay: 4.2 + i * 0.3,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    });
  }, [triggerProgress]);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 500 700"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%", overflow: "visible" }}
    >
      <defs>
        {/* Blue-purple petal gradient */}
        <linearGradient id="petalGrad1" x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="50%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#3b5bdb" />
        </linearGradient>
        {/* Blue petal gradient */}
        <linearGradient id="petalGrad2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
        {/* Pink-purple top petal */}
        <linearGradient id="petalGrad3" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#e9b0ff" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        {/* Leaf gradient — blue to purple-gold */}
        <linearGradient id="leafGrad1" x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="60%" stopColor="#4338ca" />
          <stop offset="100%" stopColor="#c9a227" />
        </linearGradient>
        <linearGradient id="leafGrad2" x1="0.5" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#3b5bdb" />
        </linearGradient>
        {/* Yellow orb */}
        <radialGradient id="orbYellow" cx="0.4" cy="0.35">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#f59e0b" />
        </radialGradient>
        {/* Pink orb */}
        <radialGradient id="orbPink" cx="0.4" cy="0.35">
          <stop offset="0%" stopColor="#f0abfc" />
          <stop offset="100%" stopColor="#c084fc" />
        </radialGradient>
        {/* Bud gradient */}
        <linearGradient id="budGrad" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#4338ca" />
        </linearGradient>
        {/* Flower center highlight */}
        <radialGradient id="centerGlow" cx="0.5" cy="0.5">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="70%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </radialGradient>
      </defs>

      {/* ══════ STEM LINES ══════ */}
      {/* Main center stem */}
      <path className="stem-line" d="M250 700 Q245 550 260 420 Q270 350 250 280" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      {/* Right tall stem */}
      <path className="stem-line" d="M380 700 Q375 550 370 400 Q365 300 385 180 Q390 130 380 90" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      {/* Left stem */}
      <path className="stem-line" d="M120 700 Q130 600 110 480 Q100 420 115 350" stroke="#a78bfa" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
      {/* Right branch from center */}
      <path className="stem-line" d="M260 420 Q300 380 340 350 Q370 330 400 340" stroke="#6366f1" strokeWidth="1" strokeLinecap="round" opacity="0.35" />
      {/* Left branch */}
      <path className="stem-line" d="M250 350 Q200 300 160 310" stroke="#a78bfa" strokeWidth="1" strokeLinecap="round" opacity="0.35" />
      {/* Small right wispy stem */}
      <path className="stem-line" d="M430 700 Q440 620 425 540" stroke="#6366f1" strokeWidth="1" strokeLinecap="round" opacity="0.3" />

      {/* ══════ LEAVES ══════ */}
      {/* Right large leaf pair */}
      <g className="leaf" transform="translate(390, 390)">
        <ellipse cx="-20" cy="-30" rx="28" ry="48" transform="rotate(-25)" fill="url(#leafGrad1)" opacity="0.9" />
        <ellipse cx="15" cy="-25" rx="24" ry="42" transform="rotate(15)" fill="url(#leafGrad2)" opacity="0.8" />
      </g>
      {/* Center-left leaf */}
      <g className="leaf" transform="translate(200, 450)">
        <ellipse cx="0" cy="-25" rx="22" ry="40" transform="rotate(-35)" fill="url(#leafGrad1)" opacity="0.85" />
      </g>
      {/* Bottom right leaf pair */}
      <g className="leaf" transform="translate(420, 540)">
        <ellipse cx="-15" cy="-22" rx="26" ry="44" transform="rotate(-20)" fill="url(#leafGrad2)" opacity="0.85" />
        <ellipse cx="18" cy="-18" rx="22" ry="38" transform="rotate(25)" fill="url(#leafGrad1)" opacity="0.75" />
      </g>
      {/* Left lower leaf */}
      <g className="leaf" transform="translate(100, 480)">
        <ellipse cx="10" cy="-20" rx="20" ry="36" transform="rotate(20)" fill="url(#leafGrad2)" opacity="0.8" />
      </g>
      {/* Top right small leaf */}
      <g className="leaf" transform="translate(400, 260)">
        <ellipse cx="0" cy="-18" rx="16" ry="30" transform="rotate(10)" fill="url(#leafGrad1)" opacity="0.7" />
      </g>

      {/* ══════ CENTER FLOWER (large) ══════ */}
      <g className="flower" transform="translate(250, 270)">
        {/* Back petals */}
        <ellipse cx="-28" cy="-15" rx="30" ry="42" transform="rotate(-30)" fill="url(#petalGrad2)" opacity="0.85" />
        <ellipse cx="28" cy="-15" rx="30" ry="42" transform="rotate(30)" fill="url(#petalGrad2)" opacity="0.85" />
        <ellipse cx="-15" cy="15" rx="28" ry="38" transform="rotate(-55)" fill="url(#petalGrad1)" opacity="0.8" />
        <ellipse cx="15" cy="15" rx="28" ry="38" transform="rotate(55)" fill="url(#petalGrad1)" opacity="0.8" />
        {/* Top petals — lighter */}
        <ellipse cx="-18" cy="-25" rx="26" ry="36" transform="rotate(-15)" fill="url(#petalGrad3)" opacity="0.9" />
        <ellipse cx="18" cy="-25" rx="26" ry="36" transform="rotate(15)" fill="url(#petalGrad3)" opacity="0.9" />
        <ellipse cx="0" cy="-30" rx="22" ry="32" fill="url(#petalGrad3)" opacity="0.95" />
        {/* Center */}
        <circle cx="0" cy="0" r="14" fill="url(#centerGlow)" />
      </g>

      {/* ══════ TOP RIGHT FLOWER (open bloom) ══════ */}
      <g className="flower" transform="translate(375, 120)">
        {/* Petals fanning upward — lotus style */}
        <ellipse cx="-22" cy="5" rx="18" ry="35" transform="rotate(-40)" fill="url(#petalGrad2)" opacity="0.8" />
        <ellipse cx="22" cy="5" rx="18" ry="35" transform="rotate(40)" fill="url(#petalGrad2)" opacity="0.8" />
        <ellipse cx="-12" cy="-8" rx="16" ry="30" transform="rotate(-20)" fill="url(#petalGrad3)" opacity="0.9" />
        <ellipse cx="12" cy="-8" rx="16" ry="30" transform="rotate(20)" fill="url(#petalGrad3)" opacity="0.9" />
        <ellipse cx="0" cy="-12" rx="12" ry="26" fill="url(#petalGrad3)" opacity="0.95" />
        {/* Stamen */}
        <line x1="-5" y1="-30" x2="-8" y2="-45" stroke="#c084fc" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="5" y1="-30" x2="8" y2="-45" stroke="#c084fc" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="0" y1="-32" x2="0" y2="-48" stroke="#c084fc" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="-8" cy="-47" r="4" fill="url(#orbPink)" />
        <circle cx="8" cy="-47" r="4" fill="url(#orbPink)" />
        <circle cx="0" cy="-50" r="3.5" fill="url(#orbYellow)" />
      </g>

      {/* ══════ BOTTOM LEFT FLOWER (half bloom) ══════ */}
      <g className="flower" transform="translate(110, 350)">
        <ellipse cx="-15" cy="5" rx="16" ry="28" transform="rotate(-35)" fill="url(#petalGrad2)" opacity="0.75" />
        <ellipse cx="15" cy="5" rx="16" ry="28" transform="rotate(35)" fill="url(#petalGrad2)" opacity="0.75" />
        <ellipse cx="-8" cy="-5" rx="14" ry="24" transform="rotate(-15)" fill="url(#petalGrad3)" opacity="0.85" />
        <ellipse cx="8" cy="-5" rx="14" ry="24" transform="rotate(15)" fill="url(#petalGrad3)" opacity="0.85" />
        <ellipse cx="0" cy="-8" rx="10" ry="20" fill="url(#petalGrad3)" opacity="0.9" />
        {/* Stamen */}
        <line x1="-3" y1="-22" x2="-5" y2="-34" stroke="#a78bfa" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="3" y1="-22" x2="5" y2="-34" stroke="#a78bfa" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="-5" cy="-36" r="3" fill="url(#orbPink)" />
        <circle cx="5" cy="-36" r="3" fill="url(#orbPink)" />
      </g>

      {/* ══════ BUDS ══════ */}
      {/* Top center bud (teardrop) */}
      <g className="bud" transform="translate(310, 100)">
        <path d="M0 0 Q-10 -20 0 -38 Q10 -20 0 0Z" fill="url(#budGrad)" opacity="0.9" />
      </g>
      {/* Small bud left */}
      <g className="bud" transform="translate(160, 310)">
        <path d="M0 0 Q-7 -14 0 -26 Q7 -14 0 0Z" fill="url(#budGrad)" opacity="0.8" />
      </g>
      {/* Right bud */}
      <g className="bud" transform="translate(440, 480)">
        <path d="M0 0 Q-8 -16 0 -30 Q8 -16 0 0Z" fill="url(#budGrad)" opacity="0.75" />
      </g>

      {/* ══════ FLOATING ORBS ══════ */}
      <circle className="orb" cx="170" cy="420" r="12" fill="url(#orbYellow)" />
      <circle className="orb" cx="310" cy="310" r="10" fill="url(#orbYellow)" />
      <circle className="orb" cx="395" cy="230" r="9" fill="url(#orbYellow)" />
      <circle className="orb" cx="85" cy="530" r="11" fill="url(#orbYellow)" />
      <circle className="orb" cx="350" cy="160" r="8" fill="url(#orbPink)" />
      <circle className="orb" cx="440" cy="350" r="10" fill="url(#orbPink)" />
      <circle className="orb" cx="220" cy="480" r="7" fill="url(#orbYellow)" />
    </svg>
  );
}
