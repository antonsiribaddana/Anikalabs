"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BLIND_COUNT = 30;
const SVG_NS = "http://www.w3.org/2000/svg";

export default function ScrollTransition() {
  const stageRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const blindsGroupRef = useRef<SVGGElement>(null);
  const [vbH, setVbH] = useState(56.25); // default 16:9

  useEffect(() => {
    setVbH((window.innerHeight / window.innerWidth) * 100);
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    const blindsGroup = blindsGroupRef.current;
    if (!stage || !blindsGroup) return;

    // Clear any previous rects
    blindsGroup.innerHTML = "";

    const vbHeight = (window.innerHeight / window.innerWidth) * 100;
    const stripH = vbHeight / BLIND_COUNT;

    // Build blind strips — white rects in a black mask
    // White = visible → reveals the colored rect beneath
    // Starts at height 0 (nothing visible), grows to full strip height
    const blinds: { top: SVGRectElement; bottom: SVGRectElement; centerY: number; halfH: number }[] = [];

    for (let i = 0; i < BLIND_COUNT; i++) {
      const centerY = i * stripH + stripH / 2;
      const halfH = stripH / 2;

      const rectTop = document.createElementNS(SVG_NS, "rect");
      const rectBot = document.createElementNS(SVG_NS, "rect");

      [rectTop, rectBot].forEach((r) => {
        r.setAttribute("x", "0");
        r.setAttribute("width", "100");
        r.setAttribute("fill", "white");
        r.setAttribute("shape-rendering", "crispEdges");
        r.setAttribute("y", String(centerY));
        r.setAttribute("height", "0");
      });

      blindsGroup.appendChild(rectTop);
      blindsGroup.appendChild(rectBot);
      blinds.push({ top: rectTop, bottom: rectBot, centerY, halfH });
    }

    // Build timeline: each blind staggered
    const tl = gsap.timeline({ paused: true });

    blinds.forEach((b, i) => {
      const staggerStart = (i / BLIND_COUNT) * 0.55;
      // Top half grows upward
      tl.to(b.top, {
        attr: { y: b.centerY - b.halfH, height: b.halfH + 0.05 },
        ease: "power2.inOut",
        duration: 0.45,
      }, staggerStart);
      // Bottom half grows downward
      tl.to(b.bottom, {
        attr: { y: b.centerY, height: b.halfH + 0.05 },
        ease: "power2.inOut",
        duration: 0.45,
      }, staggerStart);
    });

    const trigger = ScrollTrigger.create({
      trigger: stage,
      start: "top top",
      end: "bottom bottom",
      scrub: 1.5,
      animation: tl,
    });

    return () => {
      trigger.kill();
      blindsGroup.innerHTML = "";
    };
  }, [vbH]);

  return (
    <div ref={stageRef} style={{ height: "300vh", position: "relative" }}>
      <div
        ref={stickyRef}
        style={{
          position: "sticky",
          top: 0,
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {/* Bottom layer: what's being revealed */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "#fffbf2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        />

        {/* Top layer: dark WhatWeDo bg that gets cut away */}
        <svg
          ref={svgRef}
          viewBox={`0 0 100 ${vbH}`}
          preserveAspectRatio="none"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            zIndex: 1,
          }}
        >
          <defs>
            <mask id="st-mask">
              {/* Fully black background = top layer fully covers */}
              <rect x="0" y="0" width="100" height={vbH + 10} fill="black" />
              {/* White rects punch holes = reveals bottom layer */}
              <g ref={blindsGroupRef} />
            </mask>
          </defs>
          {/* The dark overlay being masked away */}
          <rect
            x="0"
            y="0"
            width="100"
            height={vbH + 10}
            fill="#02021e"
            mask="url(#st-mask)"
          />
        </svg>
      </div>
    </div>
  );
}
