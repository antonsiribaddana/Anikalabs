"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * System Blossom — a node-diagram that blooms into a radial composition.
 * Not a flower. A system resolving into clarity.
 *
 * Composition:
 *   - central core (small disc + inner ring)
 *   - 10 refined radial blades (outlined geometric "petals")
 *   - 10 connector lines from core to each blade base
 *   - 10 outer micro-nodes at the blade tips
 *   - 2 secondary inner arcs that close in after the bloom settles
 *
 * Motion:
 *   1. Core fades up + inner ring draws
 *   2. Connector lines extend outward (spiral order)
 *   3. Blades scale from base outward with slight rotation settle
 *   4. Tip nodes pop in
 *   5. Inner accent arcs draw in
 *   6. Idle: whole group breathes 1.5%, slow light-sweep rotation
 *   7. Parallax on mouse move within the container
 */

const VB = 520;
const CX = VB / 2;
const CY = VB / 2;

const BLADE_COUNT = 10;
const BLADE_INNER = 78;   // base distance from center
const BLADE_OUTER = 220;  // tip distance from center
const BLADE_WIDTH = 22;   // half-width of blade at its widest

// Spiral reveal order — every-other-plus-one, so petals don't reveal in simple sequence
const REVEAL_ORDER = [0, 3, 6, 9, 2, 5, 8, 1, 4, 7];

export default function SystemBlossom() {
  const rootRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const groupRef = useRef<SVGGElement>(null);
  const sweepRef = useRef<SVGRectElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const group = groupRef.current;
    if (!svg || !group) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const blades = Array.from(svg.querySelectorAll<SVGPathElement>("[data-blade]"));
    const connectors = Array.from(svg.querySelectorAll<SVGLineElement>("[data-connector]"));
    const tips = Array.from(svg.querySelectorAll<SVGCircleElement>("[data-tip]"));
    const arcs = Array.from(svg.querySelectorAll<SVGPathElement>("[data-arc]"));
    const coreDisc = svg.querySelector<SVGCircleElement>("[data-core-disc]");
    const coreRing = svg.querySelector<SVGCircleElement>("[data-core-ring]");

    // Initialize dash-based draw-ins
    connectors.forEach((c) => {
      const len = c.getTotalLength();
      c.style.strokeDasharray = `${len}`;
      c.style.strokeDashoffset = `${len}`;
    });
    arcs.forEach((a) => {
      const len = a.getTotalLength();
      a.style.strokeDasharray = `${len}`;
      a.style.strokeDashoffset = `${len}`;
    });
    if (coreRing) {
      const len = coreRing.getTotalLength();
      coreRing.style.strokeDasharray = `${len}`;
      coreRing.style.strokeDashoffset = `${len}`;
    }

    gsap.set(blades, { scale: 0, opacity: 0, transformOrigin: `${CX}px ${CY}px` });
    gsap.set(tips, { scale: 0, opacity: 0, transformOrigin: "center" });
    gsap.set(coreDisc, { scale: 0, opacity: 0, transformOrigin: "center" });

    if (prefersReduced) {
      gsap.set(blades, { scale: 1, opacity: 1 });
      gsap.set(tips, { scale: 1, opacity: 1 });
      gsap.set(coreDisc, { scale: 1, opacity: 1 });
      connectors.forEach((c) => (c.style.strokeDashoffset = "0"));
      arcs.forEach((a) => (a.style.strokeDashoffset = "0"));
      if (coreRing) coreRing.style.strokeDashoffset = "0";
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      // 1. Core
      tl.to(coreDisc, {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
      })
        .to(
          coreRing,
          {
            strokeDashoffset: 0,
            duration: 0.8,
            ease: "power2.inOut",
          },
          "-=0.4"
        )

        // 2 + 3. Connectors + blades reveal in spiral order
        .add(() => {
          REVEAL_ORDER.forEach((idx, i) => {
            const delay = i * 0.09;
            const connector = connectors[idx];
            const blade = blades[idx];
            const tip = tips[idx];

            gsap.to(connector, {
              strokeDashoffset: 0,
              duration: 0.55,
              ease: "power2.out",
              delay,
            });
            gsap.to(blade, {
              scale: 1,
              opacity: 1,
              duration: 0.7,
              ease: "power3.out",
              delay: delay + 0.12,
            });
            gsap.fromTo(
              blade,
              { rotate: -4 },
              {
                rotate: 0,
                duration: 0.9,
                ease: "power2.out",
                delay: delay + 0.12,
                transformOrigin: `${CX}px ${CY}px`,
              }
            );
            gsap.to(tip, {
              scale: 1,
              opacity: 1,
              duration: 0.35,
              ease: "power2.out",
              delay: delay + 0.5,
            });
          });
        });

      const bloomEnd = 0.2 + 0.6 + (REVEAL_ORDER.length - 1) * 0.09 + 0.85;

      // 4. Inner accent arcs fade/draw in
      tl.to(
        arcs,
        {
          strokeDashoffset: 0,
          duration: 1.2,
          ease: "power2.inOut",
          stagger: 0.15,
        },
        bloomEnd
      );

      // 5. Idle breathing
      tl.add(() => {
        gsap.to(group, {
          scale: 1.018,
          duration: 2.6,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          transformOrigin: `${CX}px ${CY}px`,
        });
      }, bloomEnd + 0.3);

      // 6. Slow light sweep across the blades
      if (sweepRef.current) {
        gsap.set(sweepRef.current, { x: -VB });
        gsap.to(sweepRef.current, {
          x: VB,
          duration: 6,
          ease: "sine.inOut",
          repeat: -1,
          repeatDelay: 2.5,
          delay: bloomEnd + 1,
        });
      }
    }, rootRef);

    // Parallax on mouse move
    const root = rootRef.current;
    const onMove = (e: MouseEvent) => {
      if (!root || !group) return;
      const r = root.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(group, {
        x: nx * 14,
        y: ny * 14,
        duration: 1.2,
        ease: "power2.out",
        overwrite: "auto",
      });
    };
    root?.addEventListener("mousemove", onMove);

    return () => {
      root?.removeEventListener("mousemove", onMove);
      ctx.revert();
    };
  }, []);

  // Geometry — build blade path as a refined elongated leaf
  const bladePath = (() => {
    const x0 = CX;
    const yBase = CY - BLADE_INNER;
    const yTip = CY - BLADE_OUTER;
    const yMid = (yBase + yTip) / 2;
    const w = BLADE_WIDTH;
    // Rounded spindle — narrow at base, widest at ~40% up, tapers to rounded tip
    return `
      M ${x0} ${yBase}
      C ${x0 + w * 0.6} ${yBase - 8}, ${x0 + w} ${yMid + 14}, ${x0 + w * 0.55} ${yTip + 18}
      Q ${x0} ${yTip - 4}, ${x0 - w * 0.55} ${yTip + 18}
      C ${x0 - w} ${yMid + 14}, ${x0 - w * 0.6} ${yBase - 8}, ${x0} ${yBase}
      Z
    `.trim();
  })();

  return (
    <div
      ref={rootRef}
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "auto",
      }}
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VB} ${VB}`}
        width="100%"
        height="100%"
        style={{ maxWidth: "min(100%, 560px)", maxHeight: "100%", overflow: "visible" }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Soft warm core glow */}
          <radialGradient id="bl-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffb37a" stopOpacity={0.9} />
            <stop offset="55%" stopColor="#e07a42" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#e85d2f" stopOpacity={0} />
          </radialGradient>
          {/* Blade translucent fill */}
          <linearGradient id="bl-blade" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="#3a2b21" stopOpacity={0.22} />
            <stop offset="55%" stopColor="#57443a" stopOpacity={0.10} />
            <stop offset="100%" stopColor="#6a5548" stopOpacity={0.02} />
          </linearGradient>
          {/* Light-sweep gradient used by the rotating sweep rect */}
          <linearGradient id="bl-sweep" x1="0" y1="0.5" x2="1" y2="0.5">
            <stop offset="0%" stopColor="#ffffff" stopOpacity={0} />
            <stop offset="50%" stopColor="#ffffff" stopOpacity={0.18} />
            <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
          </linearGradient>
          <mask id="bl-blade-mask" maskUnits="userSpaceOnUse" x={0} y={0} width={VB} height={VB}>
            {Array.from({ length: BLADE_COUNT }).map((_, i) => {
              const angle = (360 / BLADE_COUNT) * i;
              return (
                <path
                  key={`m-${i}`}
                  d={bladePath}
                  fill="white"
                  transform={`rotate(${angle} ${CX} ${CY})`}
                />
              );
            })}
          </mask>
        </defs>

        {/* Soft core halo — behind everything */}
        <circle cx={CX} cy={CY} r={110} fill="url(#bl-core)" opacity={0.75} />

        <g ref={groupRef}>
          {/* Connector lines from core to blade bases */}
          {Array.from({ length: BLADE_COUNT }).map((_, i) => {
            const angle = ((360 / BLADE_COUNT) * i - 90) * (Math.PI / 180);
            const x1 = CX + Math.cos(angle) * 24;
            const y1 = CY + Math.sin(angle) * 24;
            const x2 = CX + Math.cos(angle) * BLADE_INNER;
            const y2 = CY + Math.sin(angle) * BLADE_INNER;
            return (
              <line
                key={`c-${i}`}
                data-connector
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="rgba(74, 58, 48, 0.55)"
                strokeWidth={0.8}
                strokeLinecap="round"
              />
            );
          })}

          {/* Blades — 10 radial geometric segments */}
          {Array.from({ length: BLADE_COUNT }).map((_, i) => {
            const angle = (360 / BLADE_COUNT) * i;
            return (
              <g
                key={`b-${i}`}
                data-blade
                transform={`rotate(${angle} ${CX} ${CY})`}
              >
                <path
                  d={bladePath}
                  fill="url(#bl-blade)"
                  stroke="rgba(58, 43, 33, 0.75)"
                  strokeWidth={0.9}
                  strokeLinejoin="round"
                />
              </g>
            );
          })}

          {/* Light sweep confined to the blade shapes via mask */}
          <g mask="url(#bl-blade-mask)">
            <rect
              ref={sweepRef}
              x={0}
              y={0}
              width={VB * 0.4}
              height={VB}
              fill="url(#bl-sweep)"
            />
          </g>

          {/* Tip micro-nodes */}
          {Array.from({ length: BLADE_COUNT }).map((_, i) => {
            const angle = ((360 / BLADE_COUNT) * i - 90) * (Math.PI / 180);
            const x = CX + Math.cos(angle) * (BLADE_OUTER - 2);
            const y = CY + Math.sin(angle) * (BLADE_OUTER - 2);
            return (
              <circle
                key={`t-${i}`}
                data-tip
                cx={x}
                cy={y}
                r={2.4}
                fill="#3a2b21"
              />
            );
          })}

          {/* Inner secondary arcs — drawn after bloom settles */}
          <path
            data-arc
            d={describeArc(CX, CY, 48, -70, 250)}
            stroke="rgba(224, 122, 66, 0.55)"
            strokeWidth={1}
            strokeLinecap="round"
            fill="none"
          />
          <path
            data-arc
            d={describeArc(CX, CY, 60, 110, -110)}
            stroke="rgba(224, 122, 66, 0.35)"
            strokeWidth={0.8}
            strokeLinecap="round"
            fill="none"
          />

          {/* Core — inner ring then bright disc */}
          <circle
            data-core-ring
            cx={CX}
            cy={CY}
            r={30}
            stroke="rgba(58, 43, 33, 0.75)"
            strokeWidth={1}
            fill="none"
          />
          <circle data-core-disc cx={CX} cy={CY} r={9} fill="#e85d2f" />
          <circle cx={CX} cy={CY} r={3.2} fill="#fff2e5" opacity={0.9} />
        </g>
      </svg>
    </div>
  );
}

// Polar→Cartesian arc path helper
function describeArc(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const toRad = (d: number) => ((d - 90) * Math.PI) / 180;
  const start = { x: cx + r * Math.cos(toRad(startDeg)), y: cy + r * Math.sin(toRad(startDeg)) };
  const end = { x: cx + r * Math.cos(toRad(endDeg)), y: cy + r * Math.sin(toRad(endDeg)) };
  const largeArc = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
  const sweep = endDeg > startDeg ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} ${sweep} ${end.x} ${end.y}`;
}
