"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

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
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
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

const projects = [
  {
    title: "For Your Party",
    tags: ["Branding", "Design"],
    color: "#c9c4f0",
    size: "full",
    image: "/images/laptop-mockup.png",
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
    title: "Gotta Tennis",
    tags: ["Strategy", "Web Design", "SEO"],
    color: "#d4e8c4",
    size: "full",
  },
  {
    title: "Wander Women",
    tags: ["Branding", "Web Site"],
    color: "#f0d4c4",
    size: "half",
  },
  {
    title: "GoSage Lawn Care",
    tags: ["UX/UI Design", "Webflow"],
    color: "#c4e8e0",
    size: "half",
  },
  {
    title: "Camprodest",
    tags: ["Web Design", "Strategy", "UX/UI Design"],
    color: "#ddc4f0",
    size: "full",
  },
  {
    title: "Sleeq",
    tags: ["Branding", "Web Design"],
    color: "#e8ebc4",
    size: "half",
  },
  {
    title: "BMA Design & Build",
    tags: ["Strategy", "UX/UI Design", "Webflow"],
    color: "#c4cfe8",
    size: "half",
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

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
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
    draw();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
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

function WorkCard({ project }: { project: typeof projects[number] }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const posRef = useRef({ cx: 0, cy: 0, tx: 0, ty: 0, visible: false });

  useEffect(() => {
    const card = cardRef.current;
    const circle = circleRef.current;
    if (!card || !circle) return;

    const SIZE = 64;

    const onEnter = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      posRef.current.tx = e.clientX - rect.left;
      posRef.current.ty = e.clientY - rect.top;
      posRef.current.cx = posRef.current.tx;
      posRef.current.cy = posRef.current.ty;
      posRef.current.visible = true;
      gsap.killTweensOf(circle);
      gsap.to(circle, { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" });
    };

    const onLeave = () => {
      posRef.current.visible = false;
      gsap.to(circle, { opacity: 0, scale: 0.6, duration: 0.4, ease: "power2.in" });
    };

    const onMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      posRef.current.tx = e.clientX - rect.left;
      posRef.current.ty = e.clientY - rect.top;
    };

    const tick = () => {
      posRef.current.cx += (posRef.current.tx - posRef.current.cx) * 0.12;
      posRef.current.cy += (posRef.current.ty - posRef.current.cy) * 0.12;
      circle.style.transform = `translate(${posRef.current.cx - SIZE / 2}px, ${posRef.current.cy - SIZE / 2}px) scale(${circle.style.opacity === "0" ? 0.6 : 1})`;
      rafRef.current = requestAnimationFrame(tick);
    };

    card.addEventListener("mouseenter", onEnter);
    card.addEventListener("mouseleave", onLeave);
    card.addEventListener("mousemove", onMove);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      card.removeEventListener("mouseenter", onEnter);
      card.removeEventListener("mouseleave", onLeave);
      card.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="work-card"
      style={{
        flex: 1,
        position: "relative",
        overflow: "hidden",
        cursor: "none",
        borderRadius: "12px",
        background: project.color,
        aspectRatio: project.size === "full" ? "16/7" : "4/3",
        display: "flex",
        alignItems: "flex-end",
        padding: "clamp(20px, 2.5vw, 32px) clamp(20px, 2.5vw, 36px)",
      }}
    >
      {/* Animated background */}
      <CardBackground baseColor="#0a1a3a" />

      {/* Magnetic circle cursor */}
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

      {/* Pill group: project name + tags */}
      <div
        style={{
          position: "absolute",
          ...(project.size === "full"
            ? { top: "clamp(16px, 1.8vw, 24px)", left: "clamp(16px, 1.8vw, 24px)" }
            : { bottom: "clamp(16px, 1.8vw, 24px)", left: "clamp(16px, 1.8vw, 24px)" }),
          display: "flex",
          gap: "6px",
          zIndex: 3,
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 12px",
            borderRadius: "6px",
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(6px)",
            fontFamily: "'PP Neue Montreal', sans-serif",
            fontSize: "11px",
            fontWeight: 600,
            color: "#fffbf2",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#f17752" }} />
          {project.title}
        </span>
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
  );
}

export default function Work() {
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
      <OrganicBlob />

      {/* Heading + tagline */}
      <div style={{ padding: "0 clamp(20px, 5vw, 80px)", marginBottom: "clamp(36px, 5vw, 72px)", position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h2 style={{
            fontFamily: "var(--font-inter), 'Inter', sans-serif",
            fontSize: "clamp(36px, 5.5vw, 88px)",
            fontWeight: 200,
            lineHeight: 1.0,
            color: "#02021e",
            margin: 0,
          }}>
            Selected work
          </h2>
          <h2 style={{
            fontFamily: "var(--font-inter), 'Inter', sans-serif",
            fontSize: "clamp(36px, 5.5vw, 88px)",
            fontWeight: 200,
            lineHeight: 1.0,
            color: "#02021e",
            opacity: 0.15,
            margin: 0,
          }}>
            & projects
          </h2>
        </div>

        {/* Tagline + smiley — desktop only */}
        <div className="hidden md:flex" style={{ alignItems: "center", gap: "16px", maxWidth: "380px", marginTop: "8px" }}>
          <p style={{
            fontFamily: "var(--font-inter), 'Inter', sans-serif",
            fontSize: "clamp(16px, 1.5vw, 22px)",
            fontWeight: 300,
            lineHeight: 1.45,
            color: "#02021e",
            margin: 0,
          }}>
            Yep, We&apos;re Designers. But Above All, We&apos;re Thinkers, Explorers, And Storytellers
          </p>
          {/* Smiley */}
          <img src="/images/smiley.svg" alt="" width={56} height={60} style={{ flexShrink: 0 }} />
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

      {/* Show All */}
      <div style={{ padding: "0 clamp(20px, 5vw, 80px)", marginTop: "clamp(48px, 6vw, 80px)", position: "relative", zIndex: 1, display: "flex", justifyContent: "center" }}>
        <a
          href="#"
          style={{
            display: "inline-flex",
            alignItems: "baseline",
            gap: "14px",
            textDecoration: "none",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.5")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          <span style={{
            fontFamily: "var(--font-inter), 'Inter', sans-serif",
            fontSize: "clamp(52px, 9vw, 140px)",
            fontWeight: 200,
            color: "#02021e",
            lineHeight: 1,
            letterSpacing: "-3px",
            textTransform: "uppercase",
          }}>
            Show All
          </span>
          {/* Circled count */}
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "clamp(36px, 3.5vw, 56px)",
            height: "clamp(36px, 3.5vw, 56px)",
            borderRadius: "50%",
            border: "2px solid #02021e",
            fontFamily: "'PP Neue Montreal', sans-serif",
            fontSize: "clamp(13px, 1.2vw, 18px)",
            fontWeight: 500,
            color: "#02021e",
            flexShrink: 0,
            marginBottom: "clamp(6px, 0.8vw, 12px)",
          }}>
            {projects.length}
          </span>
        </a>
      </div>
    </section>
  );
}
