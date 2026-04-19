"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";

type Project = {
  title: string;
  tags: string[];
  color: string;
  size: "full" | "half";
  image?: string;
  scrollSlices?: string[];
  previewAlign?: "center" | "right";
  leftGraphic?: string;
};

function OrganicBlob() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    let t = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    // Simple smooth noise using sin waves
    const noise = (x: number, y: number, t: number) => {
      return (
        Math.sin(x * 1.2 + t * 0.5) * 0.5 +
        Math.sin(y * 1.4 + t * 0.4) * 0.5 +
        Math.sin((x + y) * 0.9 + t * 0.3) * 0.5 +
        Math.sin((x - y) * 1.1 + t * 0.6) * 0.5
      ) / 4;
    };

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Draw multiple organic blobs
      const blobs = [
        { bx: 0.65, by: 0.25, r: 0.55, speed: 0.18, color: "rgba(241,119,82,0.45)" },
        { bx: 0.85, by: 0.12, r: 0.40, speed: 0.22, color: "rgba(255,160,60,0.35)" },
        { bx: 0.50, by: 0.40, r: 0.35, speed: 0.15, color: "rgba(220,80,200,0.18)" },
      ];

      blobs.forEach(({ bx, by, r, speed, color }) => {
        const cx = bx * W + noise(bx * 3, by * 2, t * speed) * W * 0.08;
        const cy = by * H + noise(bx * 2, by * 3, t * speed + 1) * H * 0.12;
        const radius = r * Math.min(W, H);

        // Morph the blob using multiple gradient stops
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        grad.addColorStop(0, color);
        grad.addColorStop(0.4, color.replace(/[\d.]+\)$/, "0.2)"));
        grad.addColorStop(0.7, color.replace(/[\d.]+\)$/, "0.08)"));
        grad.addColorStop(1, "rgba(0,0,0,0)");

        // Draw warped blob using bezier path
        ctx.save();
        ctx.beginPath();
        const pts = 8;
        for (let i = 0; i <= pts; i++) {
          const angle = (i / pts) * Math.PI * 2;
          const warp = 1 + noise(Math.cos(angle) * 2, Math.sin(angle) * 2, t * speed + i) * 0.35;
          const px = cx + Math.cos(angle) * radius * warp;
          const py = cy + Math.sin(angle) * radius * warp;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.filter = "blur(0px)";
        ctx.fill();
        ctx.restore();
      });

      t += 0.008;
      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: "-60px",
        right: "-40px",
        width: "70%",
        height: "500px",
        pointerEvents: "none",
        zIndex: 0,
        opacity: 1,
        filter: "blur(30px)",
      }}
    />
  );
}

export const projects: Project[] = [
  {
    title: "SEC Recruiting Agency",
    tags: ["Design", "Development", "SEO Services"],
    color: "#0a1a3a",
    size: "full",
    image: "/images/gotta-preview-bg.webp",
    scrollSlices: [
      "/images/gotta-slice-1.png",
      "/images/gotta-slice-2.png",
      "/images/gotta-slice-3.png",
      "/images/gotta-slice-4.png",
      "/images/gotta-slice-5.png",
    ],
  },
  {
    title: "Young Billionaires",
    tags: ["UX/UI Design", "Strategy"],
    color: "#e8d5c4",
    size: "half",
    image: "/images/limitless-laptop.png",
  },
  {
    title: "Morgan Consulting",
    tags: ["Web Design", "Branding"],
    color: "#c4d9e8",
    size: "half",
    image: "/images/morgan-consulting.png",
  },
  {
    title: "PopUp Sports",
    tags: ["Strategy", "Web Design", "SEO"],
    color: "#1a2a1a",
    size: "full",
    image: "/images/tennis-preview-bg.webp",
    scrollSlices: [
      "/images/tennis-slice-1.png",
      "/images/tennis-slice-2.png",
      "/images/tennis-slice-3.png",
      "/images/tennis-slice-4.png",
    ],
    previewAlign: "right" as const,
    leftGraphic: "/images/tennis-left-graphic.webp",
  },
  {
    title: "Camprodest",
    tags: ["Design", "Development", "Strategy"],
    color: "#f0d4c4",
    size: "half",
    image: "/images/wander-women.webp",
  },
  {
    title: "Gotta Tennis",
    tags: ["UX/UI Design", "Webflow"],
    color: "#c4e8e0",
    size: "half",
    image: "/images/gosage-lawn.webp",
  },
  {
    title: "Fresh Code",
    tags: ["UI Design", "UX Design", "Development"],
    color: "#1a1a2e",
    size: "full",
    image: "/images/camprodest-bg.webp",
  },
  {
    title: "ModernXPools",
    tags: ["Design", "Development", "SEO"],
    color: "#e8ebc4",
    size: "half",
    image: "/images/sleeq-card.webp",
  },
  {
    title: "GoSage",
    tags: ["Design", "Development"],
    color: "#c4cfe8",
    size: "half",
    image: "/images/bma-card.webp",
  },
];

function CardBackground({ baseColor }: { baseColor: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let t = 0;
    let visible = false;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.max(1, canvas.offsetWidth);
      const h = Math.max(1, canvas.offsetHeight);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const blobs = [
      { x: 0.15, y: 0.3, r: 0.55, hue: "rgba(80, 160, 255, 0.95)", sx: 0.6, sy: 0.5 },
      { x: 0.85, y: 0.2, r: 0.50, hue: "rgba(120, 200, 255, 0.85)", sx: 0.7, sy: 0.4 },
      { x: 0.5, y: 0.9, r: 0.65, hue: "rgba(40, 100, 220, 0.95)", sx: 0.5, sy: 0.65 },
      { x: 0.75, y: 0.65, r: 0.45, hue: "rgba(180, 100, 255, 0.75)", sx: 0.8, sy: 0.55 },
      { x: 0.3, y: 0.7, r: 0.50, hue: "rgba(60, 220, 200, 0.70)", sx: 0.55, sy: 0.7 },
    ];

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";

      blobs.forEach((b, i) => {
        const cx = (b.x + Math.sin(t * b.sx + i) * 0.25) * W;
        const cy = (b.y + Math.cos(t * b.sy + i * 1.3) * 0.20) * H;
        const r = b.r * Math.max(W, H) * (0.85 + Math.sin(t * 0.8 + i) * 0.15);
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        grad.addColorStop(0, b.hue);
        grad.addColorStop(0.5, b.hue.replace(/[\d.]+\)$/, "0.25)"));
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);
      });

      ctx.globalCompositeOperation = "source-over";

      t += 0.02;
      raf = requestAnimationFrame(draw);
    };

    // IntersectionObserver gates animation — only run when visible
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting && !visible) {
          visible = true;
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(draw);
        } else if (!e.isIntersecting && visible) {
          visible = false;
          cancelAnimationFrame(raf);
        }
      }
    }, { threshold: 0.01 });
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        background: baseColor,
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}

function ScrollingPreview({ align = "center", stitchedSrc, stops: customStops }: { slices: string[]; align?: "center" | "right"; stitchedSrc?: string; stops?: number[] }) {
  const stitched = stitchedSrc || "/images/gotta-stitched.webp";
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    const container = containerRef.current;
    if (!track || !container) return;

    const HOLD_DUR = 2.0;
    const PX_PER_SEC = 30;

    const STOPS = customStops || [
      0.0000, 0.2997, 0.4540, 0.6102, 0.7850, 0.8747,
    ];

    /* ── Build the auto-scroll timeline ── */
    const buildTimeline = (startY: number) => {
      const h = track.scrollHeight;
      if (h <= 0) return null;
      const singleH = h / 2;

      // Figure out which stop we're closest to (or past)
      const currentFrac = Math.abs(startY) / singleH;
      let startIdx = 0;
      for (let i = STOPS.length - 1; i >= 0; i--) {
        if (currentFrac >= STOPS[i] - 0.01) { startIdx = i; break; }
      }

      gsap.set(track, { y: startY, force3D: true });
      const tl = gsap.timeline({ repeat: -1 });

      // Start from current position — drift to next stop first
      for (let loop = 0; loop < 2; loop++) { // 2 full cycles to fill repeat buffer
        for (let i = 0; i < STOPS.length; i++) {
          const idx = (startIdx + i) % STOPS.length;
          const slideTop = -singleH * STOPS[idx];
          const slideBottom = idx < STOPS.length - 1
            ? -singleH * STOPS[idx + 1]
            : -singleH;

          // On the very first segment, skip to current Y
          if (loop === 0 && i === 0) {
            const distPx = Math.abs(slideBottom - startY);
            const driftDur = distPx / PX_PER_SEC;
            if (driftDur > 0.1) {
              tl.to(track, { y: slideBottom, duration: driftDur, ease: "none" });
            }
            if (idx === STOPS.length - 1) tl.set(track, { y: 0 });
            continue;
          }

          tl.to(track, { y: slideTop, duration: HOLD_DUR });
          const distPx = Math.abs(slideBottom - slideTop);
          const driftDur = distPx / PX_PER_SEC;
          tl.to(track, { y: slideBottom, duration: driftDur, ease: "none" });
          if (idx === STOPS.length - 1) tl.set(track, { y: 0 });
        }
        startIdx = 0; // second loop always starts from 0
      }

      return tl;
    };

    const startAutoScroll = (fromY?: number) => {
      if (tlRef.current) { tlRef.current.kill(); tlRef.current = null; }
      const h = track.scrollHeight;
      const singleH = h / 2;
      const y = fromY !== undefined ? fromY : 0;
      // Clamp to single image range
      const clampedY = singleH > 0 ? Math.max(-singleH, Math.min(0, y)) : 0;
      tlRef.current = buildTimeline(clampedY);
    };

    /* ── Drag support ── */
    let isDragging = false;
    let dragStartY = 0;
    let trackStartY = 0;

    const getTrackY = () => {
      const transform = track.style.transform;
      const match = transform.match(/matrix.*,\s*([-\d.]+)\)/);
      if (match) return parseFloat(match[1]);
      // Fallback: gsap.getProperty
      return Number(gsap.getProperty(track, "y")) || 0;
    };

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      dragStartY = e.clientY;
      trackStartY = getTrackY();

      // Pause auto-scroll
      if (tlRef.current) tlRef.current.pause();
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);

      container.setPointerCapture(e.pointerId);
      container.style.cursor = "grabbing";
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const delta = e.clientY - dragStartY;
      const h = track.scrollHeight;
      const singleH = h / 2;
      let newY = trackStartY + delta;
      // Clamp to full single image height (user can scroll through everything)
      newY = Math.max(-singleH, Math.min(0, newY));
      gsap.set(track, { y: newY, force3D: true });
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!isDragging) return;
      isDragging = false;
      container.releasePointerCapture(e.pointerId);
      container.style.cursor = "grab";

      // Resume auto-scroll from current position after 3 seconds
      const currentY = getTrackY();
      resumeTimerRef.current = setTimeout(() => {
        startAutoScroll(currentY);
      }, 3000);
    };

    container.addEventListener("pointerdown", onPointerDown);
    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerup", onPointerUp);
    container.addEventListener("pointercancel", onPointerUp);

    /* ── Wait for images then start ── */
    const imgs = Array.from(track.querySelectorAll("img"));
    let remaining = imgs.length;
    const init = () => startAutoScroll(0);
    if (remaining === 0) init();
    else {
      imgs.forEach((img) => {
        if (img.complete && img.naturalHeight > 0) {
          if (--remaining === 0) init();
        } else {
          const done = () => { if (--remaining === 0) init(); };
          img.addEventListener("load", done, { once: true });
          img.addEventListener("error", done, { once: true });
        }
      });
    }

    return () => {
      if (tlRef.current) tlRef.current.kill();
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("pointercancel", onPointerUp);
      gsap.killTweensOf(track);
    };
  }, [customStops]);

  const widthClamp = "min(66%, 920px)";

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        top: "48%",
        ...(align === "right"
          ? { right: "clamp(20px, 3vw, 48px)", transform: "translateY(-50%)" }
          : { left: "50%", transform: "translate(-50%, -50%)" }),
        width: widthClamp,
        aspectRatio: "16/9.5",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
        zIndex: 2,
        cursor: "grab",
        touchAction: "none",
      }}
    >
      <div
        ref={trackRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          willChange: "transform",
          backfaceVisibility: "hidden",
        }}
      >
        <img src={stitched} alt="" draggable={false} style={{ display: "block", width: "100%", height: "auto", userSelect: "none", pointerEvents: "none" }} />
        <img src={stitched} alt="" draggable={false} aria-hidden="true" style={{ display: "block", width: "100%", height: "auto", userSelect: "none", pointerEvents: "none" }} />
      </div>
    </div>
  );
}

export function WorkCard({ project, disableAnimatedBg = false, previewAlign = "center" }: { project: Project; disableAnimatedBg?: boolean; previewAlign?: "center" | "right" }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const posRef = useRef({ cx: 0, cy: 0, tx: 0, ty: 0, visible: false });
  // Start both false on SSR+client, flip after mount — prevents hydration
  // mismatch on conditional children (cursor circle, ScrollingPreview).
  const [enableHoverFx, setEnableHoverFx] = useState(false);
  const [showInteractivePreview, setShowInteractivePreview] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      setEnableHoverFx(true);
    }
    if (!reduced && window.matchMedia("(min-width: 768px)").matches) {
      setShowInteractivePreview(true);
    }
  }, []);

  useEffect(() => {
    if (!enableHoverFx) return;

    const card = cardRef.current;
    const circle = circleRef.current;
    if (!card || !circle) return;

    const SIZE = 64;

    const tick = () => {
      posRef.current.cx += (posRef.current.tx - posRef.current.cx) * 0.12;
      posRef.current.cy += (posRef.current.ty - posRef.current.cy) * 0.12;
      circle.style.transform = `translate(${posRef.current.cx - SIZE / 2}px, ${posRef.current.cy - SIZE / 2}px) scale(${circle.style.opacity === "0" ? 0.6 : 1})`;
      // Keep ticking a few frames after leave so easing completes, then stop.
      const dx = posRef.current.tx - posRef.current.cx;
      const dy = posRef.current.ty - posRef.current.cy;
      const settled = Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1;
      if (posRef.current.visible || !settled) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = 0;
      }
    };

    const ensureTicking = () => {
      if (!rafRef.current) rafRef.current = requestAnimationFrame(tick);
    };

    const onEnter = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      posRef.current.tx = e.clientX - rect.left;
      posRef.current.ty = e.clientY - rect.top;
      posRef.current.cx = posRef.current.tx;
      posRef.current.cy = posRef.current.ty;
      posRef.current.visible = true;
      gsap.killTweensOf(circle);
      gsap.to(circle, { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" });
      ensureTicking();
    };

    const onLeave = () => {
      posRef.current.visible = false;
      gsap.to(circle, { opacity: 0, scale: 0.6, duration: 0.4, ease: "power2.in" });
      // let tick settle naturally; it will stop itself
    };

    const onMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      posRef.current.tx = e.clientX - rect.left;
      posRef.current.ty = e.clientY - rect.top;
      ensureTicking();
    };

    card.addEventListener("mouseenter", onEnter);
    card.addEventListener("mouseleave", onLeave);
    card.addEventListener("mousemove", onMove);
    // Don't start rAF here — only when the user actually hovers the card.

    return () => {
      card.removeEventListener("mouseenter", onEnter);
      card.removeEventListener("mouseleave", onLeave);
      card.removeEventListener("mousemove", onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [enableHoverFx]);

  return (
    <div
      ref={cardRef}
      className={`work-card${project.size === "full" ? " work-card-full" : ""}`}
      style={{
        flex: 1,
        position: "relative",
        overflow: "hidden",
        cursor: enableHoverFx ? "none" : "default",
        borderRadius: "12px",
        background: project.color,
        aspectRatio: project.size === "full" ? "16/7" : "4/3",
        display: "flex",
        alignItems: "flex-end",
        padding: "clamp(20px, 2.5vw, 32px) clamp(20px, 2.5vw, 36px)",
      }}
    >
      {/* Animated background — skip when card has its own image */}
      {!disableAnimatedBg && !project.image && <CardBackground baseColor="#0a1a3a" />}

      {/* Magnetic circle cursor */}
      {enableHoverFx && (
        <div
          ref={circleRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            background: "rgba(2,2,30,0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            opacity: 0,
            zIndex: 10,
            willChange: "transform",
          }}
        >
          <span style={{
            fontFamily: "'PP Neue Montreal', sans-serif",
            fontSize: "11px",
            fontWeight: 500,
            color: "#fff",
            letterSpacing: "0.06em",
            userSelect: "none",
          }}>
            View
          </span>
        </div>
      )}

      {/* Project image */}
      {project.image && (
        <img
          src={project.image}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
      )}

      {/* Left-side graphic (e.g. Gotta Tennis characters) */}
      {project.leftGraphic && (
        <img
          src={project.leftGraphic}
          alt=""
          style={{
            position: "absolute",
            left: "0",
            right: "55%",
            bottom: "clamp(60px, 8vw, 100px)",
            top: "10%",
            width: "auto",
            height: "auto",
            maxHeight: "calc(100% - clamp(60px, 8vw, 100px))",
            margin: "auto",
            objectFit: "contain",
            objectPosition: "center",
            zIndex: 3,
            pointerEvents: "none",
            userSelect: "none",
          }}
          draggable={false}
        />
      )}

      {/* Scrolling preview window */}
      {project.scrollSlices && showInteractivePreview && <ScrollingPreview slices={project.scrollSlices} align={project.previewAlign || previewAlign} stitchedSrc={project.title === "PopUp Sports" ? "/images/tennis-stitched.webp" : "/images/gotta-stitched.webp"} stops={project.title === "PopUp Sports" ? [0.0000, 0.3302, 0.5337, 0.7529] : undefined} />}

      {/* Bottom gradient overlay */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "40%",
        background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)",
        zIndex: 2,
        pointerEvents: "none",
      }} />

      {/* Project name + tags */}
      <div
        style={{
          position: "absolute",
          bottom: "clamp(16px, 1.8vw, 28px)",
          left: "clamp(16px, 1.8vw, 28px)",
          right: "clamp(16px, 1.8vw, 28px)",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          zIndex: 3,
          pointerEvents: "none",
        }}
      >
        {/* Name — bigger */}
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontFamily: "'PP Neue Montreal', sans-serif",
            fontSize: "clamp(16px, 1.4vw, 22px)",
            fontWeight: 600,
            color: "#fffbf2",
            letterSpacing: "0.02em",
          }}
        >
          {project.title}
        </span>

        {/* Tags — under the title */}
        <div style={{ display: "flex", gap: "6px" }}>
          {project.tags.map((tag) => (
            <span
              key={tag}
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "6px 12px",
                borderRadius: "6px",
                background: "rgba(255,255,255,0.06)",
                backdropFilter: "blur(6px)",
                fontFamily: "'PP Neue Montreal', sans-serif",
                fontSize: "11px",
                fontWeight: 500,
                color: "rgba(255,255,255,0.85)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
}

export default function Work() {
  // Initialize false on both SSR and client so first render matches; flip on
  // after mount. Prevents hydration mismatch on the conditional <OrganicBlob />.
  const [showOrganicBlob, setShowOrganicBlob] = useState(false);
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 1024px)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setShowOrganicBlob(true);
    }
  }, []);

  const rows: typeof projects[number][][] = [];
  let i = 0;
  while (i < projects.length) {
    if (projects[i].size === "full") {
      rows.push([projects[i]]);
      i++;
    } else {
      rows.push([projects[i], projects[i + 1]].filter(Boolean));
      i += 2;
    }
  }

  return (
    <section style={{ background: "#fffbf2", padding: "clamp(60px, 8vw, 120px) 0 clamp(80px, 10vw, 160px)", position: "relative", overflow: "hidden" }}>

      {/* Organic blob — top right */}
      {showOrganicBlob && <OrganicBlob />}

      {/* Heading + tagline */}
      <div style={{ padding: "0 clamp(20px, 5vw, 80px)", marginBottom: "clamp(36px, 5vw, 72px)", position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{
            fontFamily: "'PP Neue Montreal', 'Inter', system-ui, sans-serif",
            fontSize: "clamp(36px, 5.5vw, 88px)",
            fontWeight: 500,
            lineHeight: 1.05,
            color: "#02021e",
            margin: 0,
          }}>
            Structured design.
          </h2>
          <h2 style={{
            fontFamily: "'PP Neue Montreal', 'Inter', system-ui, sans-serif",
            fontSize: "clamp(36px, 5.5vw, 88px)",
            fontWeight: 500,
            lineHeight: 1.05,
            color: "#02021e",
            margin: 0,
          }}>
            Driven by intent.
          </h2>
        </div>

        {/* Tagline — aligned to bottom of heading */}
        <div className="hidden md:flex" style={{ flexDirection: "column", alignItems: "center", maxWidth: "420px" }}>
          <p style={{
            fontFamily: "'Neue Haas Grotesk', sans-serif",
            fontSize: "clamp(14px, 1.3vw, 20px)",
            fontWeight: 400,
            lineHeight: 1.4,
            color: "#02021e",
            margin: 0,
            textAlign: "center",
            textTransform: "uppercase",
            letterSpacing: "0.02em",
          }}>
            Yep, We&apos;re Designers. But Above All, We&apos;re Thinkers, Explorers, And Storytellers.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div style={{ padding: "0 clamp(20px, 5vw, 80px)", display: "flex", flexDirection: "column", gap: "clamp(10px, 1.2vw, 16px)", position: "relative", zIndex: 1 }}>
        {rows.map((row, ri) => (
          <div key={ri} className="work-row" style={{ display: "flex", gap: "clamp(10px, 1.2vw, 16px)" }}>
            {row.map((project, pi) => (
              <WorkCard key={pi} project={project} />
            ))}
          </div>
        ))}
      </div>

      {/* Show All — fat line + pill button */}
      <div style={{ padding: "0 clamp(20px, 5vw, 80px)", marginTop: "clamp(48px, 6vw, 80px)", position: "relative", zIndex: 1 }}>
        {/* Top fat line */}
        <div style={{ height: "2px", background: "#02021e", borderRadius: "1px" }} />

        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between" style={{ padding: "clamp(24px, 3vw, 48px) 0" }}>
          <span style={{ position: "relative", display: "inline-block" }}>
            <span style={{
              fontFamily: "'PP Neue Montreal', 'Inter', system-ui, sans-serif",
              fontSize: "clamp(52px, 9vw, 140px)",
              fontWeight: 500,
              color: "#02021e",
              lineHeight: 1,
              letterSpacing: "-3px",
              textTransform: "uppercase",
            }}>
              Show All
            </span>
          </span>

          {/* Pill button */}
          <a
            href="#"
            className="show-work-btn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "clamp(8px, 1vw, 14px)",
              padding: "clamp(14px, 1.5vw, 22px) clamp(24px, 2.5vw, 40px)",
              background: "#f17752",
              color: "#fff",
              borderRadius: "999px",
              textDecoration: "none",
              fontFamily: "'PP Neue Montreal', sans-serif",
              fontSize: "clamp(13px, 1.2vw, 18px)",
              fontWeight: 500,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              transition: "background 0.3s, transform 0.3s",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#e0603e"; e.currentTarget.style.transform = "scale(1.05)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#f17752"; e.currentTarget.style.transform = "scale(1)"; }}
          >
            Show Work
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>

        {/* Bottom fat line */}
        <div style={{ height: "2px", background: "#02021e", borderRadius: "1px" }} />
      </div>
    </section>
  );
}
