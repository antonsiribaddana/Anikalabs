"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Systems card — custom landscape circuit board.
 * Fills the entire card edge-to-edge. Every trace is either:
 *   (a) a tag-to-tag route, or
 *   (b) an ambient route that starts at one card edge and ends at another.
 * Nothing floats. Nothing breaks. Tags mask the circuit underneath.
 */

// Landscape aspect — matches the stage box proportions
const VB_W = 900;
const VB_H = 560;

const TAG_W = 120;
const TAG_H = 38;

type Tag = {
  id: string;
  label: string;
  cx: number;
  cy: number;
  hue: string;     // primary glass tint
  glow: string;    // bright inner highlight colour
  dot: string;     // pulsing orb colour
};

const TAGS: Tag[] = [
  { id: "audience",  label: "Audience",  cx: 150, cy: 320, hue: "#7fe7ff", glow: "#d6f6ff", dot: "#4fd1ff" },
  { id: "messaging", label: "Messaging", cx: 340, cy: 160, hue: "#a9f0c8", glow: "#e3fff0", dot: "#5fe39c" },
  { id: "structure", label: "Structure", cx: 450, cy: 320, hue: "#ffffff", glow: "#ffffff", dot: "#b6ffd9" },
  { id: "pages",     label: "Pages",     cx: 620, cy: 160, hue: "#a9c4ff", glow: "#dde8ff", dot: "#6a8dff" },
  { id: "outcomes",  label: "Outcomes",  cx: 760, cy: 320, hue: "#8af0d6", glow: "#dcfff1", dot: "#3fd6a8" },
  { id: "actions",   label: "Actions",   cx: 620, cy: 480, hue: "#c8b6ff", glow: "#e8e0ff", dot: "#8e78ff" },
];

const tagById = (id: string) => TAGS.find((t) => t.id === id)!;
const leftOf   = (t: Tag) => ({ x: t.cx - TAG_W / 2, y: t.cy });
const rightOf  = (t: Tag) => ({ x: t.cx + TAG_W / 2, y: t.cy });
const topOf    = (t: Tag) => ({ x: t.cx, y: t.cy - TAG_H / 2 });
const bottomOf = (t: Tag) => ({ x: t.cx, y: t.cy + TAG_H / 2 });

// Orthogonal path with rounded bends
function ortho(points: { x: number; y: number }[], r = 12): string {
  if (points.length < 2) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length - 1; i++) {
    const p = points[i - 1];
    const c = points[i];
    const n = points[i + 1];
    const inDx = Math.sign(c.x - p.x);
    const inDy = Math.sign(c.y - p.y);
    const outDx = Math.sign(n.x - c.x);
    const outDy = Math.sign(n.y - c.y);
    const segIn = Math.hypot(c.x - p.x, c.y - p.y);
    const segOut = Math.hypot(n.x - c.x, n.y - c.y);
    const rr = Math.min(r, segIn / 2, segOut / 2);
    d += ` L ${c.x - inDx * rr} ${c.y - inDy * rr}`;
    d += ` Q ${c.x} ${c.y} ${c.x + outDx * rr} ${c.y + outDy * rr}`;
  }
  const last = points[points.length - 1];
  d += ` L ${last.x} ${last.y}`;
  return d;
}

// --- Primary tag-to-tag routes ---
const PRIMARY_ROUTES: { id: string; d: string }[] = [
  {
    id: "aud-msg",
    d: ortho([
      topOf(tagById("audience")),
      { x: 150, y: 230 },
      { x: 260, y: 230 },
      { x: 260, y: 160 },
      leftOf(tagById("messaging")),
    ]),
  },
  {
    id: "msg-str",
    d: ortho([
      bottomOf(tagById("messaging")),
      { x: 340, y: 240 },
      { x: 450, y: 240 },
      topOf(tagById("structure")),
    ]),
  },
  {
    id: "aud-str",
    d: ortho([rightOf(tagById("audience")), leftOf(tagById("structure"))]),
  },
  {
    id: "str-pag",
    d: ortho([
      topOf(tagById("structure")),
      { x: 450, y: 240 },
      { x: 540, y: 240 },
      { x: 540, y: 160 },
      leftOf(tagById("pages")),
    ]),
  },
  {
    id: "str-act",
    d: ortho([
      bottomOf(tagById("structure")),
      { x: 450, y: 400 },
      { x: 540, y: 400 },
      { x: 540, y: 480 },
      leftOf(tagById("actions")),
    ]),
  },
  {
    id: "pag-out",
    d: ortho([
      rightOf(tagById("pages")),
      { x: 700, y: 160 },
      { x: 700, y: 240 },
      { x: 760, y: 240 },
      topOf(tagById("outcomes")),
    ]),
  },
  {
    id: "act-out",
    d: ortho([
      rightOf(tagById("actions")),
      { x: 700, y: 480 },
      { x: 700, y: 400 },
      { x: 760, y: 400 },
      bottomOf(tagById("outcomes")),
    ]),
  },
  {
    id: "str-out",
    d: ortho([rightOf(tagById("structure")), leftOf(tagById("outcomes"))]),
  },
];

// --- Ambient routes: each starts at a card edge and ends at a card edge (or a bend).
//     These fill the background with texture but never end in empty space near a tag.
// Every ambient route must enter AND exit at a card edge. Endpoints sit well
// beyond the viewBox (-80 or VB+80) so nothing looks snipped.
const OFF_T = -80;
const OFF_B = VB_H + 80;
const OFF_L = -80;
const OFF_R = VB_W + 80;

const AMBIENT_ROUTES: string[] = [
  // Top edge → side edge (long U-bends along the top)
  ortho([{ x: 80, y: OFF_T }, { x: 80, y: 90 }, { x: 260, y: 90 }, { x: 260, y: OFF_T }]),
  ortho([{ x: 420, y: OFF_T }, { x: 420, y: 70 }, { x: 520, y: 70 }, { x: 520, y: OFF_T }]),
  ortho([{ x: 700, y: OFF_T }, { x: 700, y: 60 }, { x: 840, y: 60 }, { x: 840, y: OFF_T }]),

  // Left edge weaving
  ortho([{ x: OFF_L, y: 110 }, { x: 110, y: 110 }, { x: 110, y: 200 }, { x: OFF_L, y: 200 }]),
  ortho([{ x: OFF_L, y: 260 }, { x: 70, y: 260 }, { x: 70, y: 390 }, { x: OFF_L, y: 390 }]),
  ortho([{ x: OFF_L, y: 450 }, { x: 90, y: 450 }, { x: 90, y: 540 }, { x: OFF_L, y: 540 }]),

  // Right edge weaving
  ortho([{ x: OFF_R, y: 80 }, { x: 860, y: 80 }, { x: 860, y: 180 }, { x: OFF_R, y: 180 }]),
  ortho([{ x: OFF_R, y: 250 }, { x: 830, y: 250 }, { x: 830, y: 360 }, { x: OFF_R, y: 360 }]),
  ortho([{ x: OFF_R, y: 430 }, { x: 870, y: 430 }, { x: 870, y: 520 }, { x: OFF_R, y: 520 }]),

  // Bottom edge U-bends
  ortho([{ x: 120, y: OFF_B }, { x: 120, y: 500 }, { x: 280, y: 500 }, { x: 280, y: OFF_B }]),
  ortho([{ x: 420, y: OFF_B }, { x: 420, y: 525 }, { x: 540, y: 525 }, { x: 540, y: OFF_B }]),
  ortho([{ x: 760, y: OFF_B }, { x: 760, y: 505 }, { x: 880, y: 505 }, { x: 880, y: OFF_B }]),

  // Long sweepers — one edge clear across to another
  ortho([{ x: 240, y: OFF_T }, { x: 240, y: 40 }, { x: 380, y: 40 }, { x: 380, y: 110 }, { x: OFF_L, y: 110 }]),
  ortho([{ x: 680, y: OFF_T }, { x: 680, y: 50 }, { x: OFF_R, y: 50 }]),
  ortho([{ x: OFF_L, y: 40 }, { x: 30, y: 40 }, { x: 30, y: OFF_T }]),
  ortho([{ x: OFF_R, y: 540 }, { x: 890, y: 540 }, { x: 890, y: OFF_B }]),
  ortho([{ x: OFF_L, y: 580 }, { x: 40, y: 580 }, { x: 40, y: OFF_B }]),
];

export default function SystemsFlow() {
  const rootRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = svgRef.current;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const primaryEls = Array.from(svg.querySelectorAll<SVGPathElement>("[data-primary]"));
    const ambientEls = Array.from(svg.querySelectorAll<SVGPathElement>("[data-ambient]"));
    const shimmerEls = Array.from(svg.querySelectorAll<SVGPathElement>("[data-shimmer]"));
    const tagEls = Array.from(svg.querySelectorAll<SVGGElement>("[data-tag]"));

    primaryEls.forEach((p) => {
      const len = p.getTotalLength();
      p.style.strokeDasharray = `${len}`;
      p.style.strokeDashoffset = `${len}`;
    });
    ambientEls.forEach((p) => {
      const len = p.getTotalLength();
      p.style.strokeDasharray = `${len}`;
      p.style.strokeDashoffset = `${len}`;
    });
    const shimmerMeta = shimmerEls.map((p) => {
      const len = p.getTotalLength();
      const lit = 80;
      p.style.strokeDasharray = `${lit} ${len}`;
      p.style.strokeDashoffset = `${lit + len}`;
      p.style.opacity = "0";
      return { el: p, len, lit };
    });

    gsap.set(tagEls, { opacity: 0, scale: 0.9, transformOrigin: "50% 50%" });


    if (prefersReduced) {
      [...primaryEls, ...ambientEls].forEach((p) => { p.style.strokeDashoffset = "0"; });
      primaryEls.forEach((p) => { p.style.strokeDasharray = "5 5"; p.style.strokeDashoffset = "0"; });
      gsap.set(tagEls, { opacity: 1, scale: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      // 1) Ambient circuit draws in
      ambientEls.forEach((p, i) => {
        gsap.to(p, {
          strokeDashoffset: 0,
          duration: 1.2,
          ease: "power2.out",
          delay: 0.1 + i * 0.04,
        });
      });

      // 2) Tags reveal in order, with their incoming routes drawing alongside
      const order = ["audience", "messaging", "structure", "pages", "actions", "outcomes"];
      const incoming: Record<string, string[]> = {
        audience: [],
        messaging: ["aud-msg"],
        structure: ["aud-str", "msg-str"],
        pages: ["str-pag"],
        actions: ["str-act"],
        outcomes: ["pag-out", "act-out", "str-out"],
      };

      order.forEach((id, i) => {
        const tagEl = svg.querySelector<SVGGElement>(`[data-tag-id="${id}"]`);
        const delay = 0.9 + i * 0.28;
        if (tagEl) {
          gsap.to(tagEl, {
            opacity: 1,
            scale: 1,
            duration: 0.45,
            ease: "back.out(1.6)",
            delay,
          });
        }
        incoming[id].forEach((rid) => {
          const p = svg.querySelector<SVGPathElement>(`[data-primary="${rid}"]`);
          if (!p) return;
          gsap.to(p, {
            strokeDashoffset: 0,
            duration: 0.75,
            ease: "power2.inOut",
            delay: delay - 0.4,
            onComplete: () => {
              p.style.strokeDasharray = "6 6";
              const state = { v: 0 };
              gsap.to(state, {
                v: -24,
                duration: 1.4,
                ease: "none",
                repeat: -1,
                onUpdate: () => { p.style.strokeDashoffset = `${state.v}`; },
              });
            },
          });
        });
      });

      // 3) Shimmer pulses on ambient routes
      const fireShimmer = () => {
        if (shimmerMeta.length === 0) return;
        const m = shimmerMeta[Math.floor(Math.random() * shimmerMeta.length)];
        const dur = gsap.utils.random(1.4, 2.2);
        const state = { v: m.lit + m.len };
        gsap.set(m.el, { opacity: 0.9 });
        gsap.to(state, {
          v: 0,
          duration: dur,
          ease: "power2.inOut",
          onUpdate: () => {
            m.el.style.strokeDashoffset = `${state.v}`;
            const p = 1 - state.v / (m.lit + m.len);
            const fade = p < 0.15 ? p / 0.15 : p > 0.85 ? (1 - p) / 0.15 : 1;
            m.el.style.opacity = `${0.85 * fade}`;
          },
          onComplete: () => { m.el.style.opacity = "0"; },
        });
      };
      const schedule = () => {
        const wait = gsap.utils.random(0.4, 1.0);
        gsap.delayedCall(wait, () => {
          fireShimmer();
          schedule();
        });
      };
      gsap.delayedCall(2.0, () => {
        fireShimmer();
        gsap.delayedCall(0.5, fireShimmer);
        schedule();
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      style={{
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(ellipse at 50% 45%, #1ea078 0%, #138660 55%, #0c6148 100%)",
        overflow: "hidden",
      }}
    >
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", position: "absolute", inset: 0 }}
      >
        <defs>
          {/* Mask that punches tag rectangles out of all circuit layers */}
          <mask id="tagMask" maskUnits="userSpaceOnUse" x={-40} y={-40} width={VB_W + 80} height={VB_H + 80}>
            <rect x={-40} y={-40} width={VB_W + 80} height={VB_H + 80} fill="white" />
            {TAGS.map((n) => (
              <rect
                key={`m-${n.id}`}
                x={n.cx - TAG_W / 2 - 3}
                y={n.cy - TAG_H / 2 - 3}
                width={TAG_W + 6}
                height={TAG_H + 6}
                rx={12}
                fill="black"
              />
            ))}
          </mask>

        </defs>

        {/* Ambient background circuit */}
        <g mask="url(#tagMask)">
          {AMBIENT_ROUTES.map((d, i) => (
            <path
              key={`a-${i}`}
              data-ambient
              d={d}
              stroke="rgba(255,255,255,0.15)"
              strokeWidth={1}
              fill="none"
            />
          ))}
        </g>

        {/* Shimmer pulses on ambient routes */}
        <g mask="url(#tagMask)">
          {AMBIENT_ROUTES.map((d, i) => (
            <path
              key={`s-${i}`}
              data-shimmer
              d={d}
              stroke="#b6ffd9"
              strokeWidth={2.2}
              strokeLinecap="round"
              fill="none"
              opacity={0}
              style={{ filter: "blur(0.5px)" }}
            />
          ))}
        </g>

        {/* Primary tag-to-tag routes — dashed flow after draw-in */}
        <g mask="url(#tagMask)">
          {PRIMARY_ROUTES.map((r) => (
            <path
              key={r.id}
              data-primary={r.id}
              d={r.d}
              stroke="rgba(182, 255, 217, 0.85)"
              strokeWidth={1.6}
              strokeLinecap="round"
              fill="none"
            />
          ))}
        </g>

        {/* Tags — 2D frosted glass: translucent fill, thin coloured border, label only */}
        {TAGS.map((n) => {
          const x = n.cx - TAG_W / 2;
          const y = n.cy - TAG_H / 2;
          const rx = 8;
          return (
            <g key={n.id} data-tag data-tag-id={n.id}>
              {/* Frosted glass base — coloured but low-saturation */}
              <rect
                x={x}
                y={y}
                width={TAG_W}
                height={TAG_H}
                rx={rx}
                fill={n.hue}
                fillOpacity={0.14}
              />
              {/* Thin coloured border */}
              <rect
                x={x + 0.5}
                y={y + 0.5}
                width={TAG_W - 1}
                height={TAG_H - 1}
                rx={rx}
                fill="none"
                stroke={n.hue}
                strokeOpacity={0.7}
                strokeWidth={1}
              />
              {/* Label */}
              <text
                x={n.cx}
                y={n.cy + 0.5}
                fill="#ffffff"
                fontFamily="'PP Neue Montreal', 'Inter', system-ui, sans-serif"
                fontSize={12.5}
                fontWeight={500}
                letterSpacing="0.01em"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {n.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
