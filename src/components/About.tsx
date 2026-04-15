"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─── Animated grain/mesh canvas background ─── */
function MeshBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    let t = 0;
    let mouseX = 0.5;
    let mouseY = 0.5;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) / rect.width;
      mouseY = (e.clientY - rect.top) / rect.height;
    };
    canvas.addEventListener("mousemove", onMouse);

    // Grid node positions
    const cols = 28;
    const rows = 16;

    const draw = () => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;

      ctx.clearRect(0, 0, W, H);

      // Draw animated mesh grid
      const cellW = W / (cols - 1);
      const cellH = H / (rows - 1);

      // Connection lines
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const baseX = c * cellW;
          const baseY = r * cellH;

          // Organic displacement
          const dx = Math.sin(c * 0.4 + t * 0.3) * 12 +
                     Math.sin(r * 0.3 + t * 0.2) * 8 +
                     Math.sin((c + r) * 0.25 + t * 0.15) * 6;
          const dy = Math.cos(r * 0.35 + t * 0.25) * 10 +
                     Math.cos(c * 0.45 + t * 0.18) * 7 +
                     Math.sin((c - r) * 0.3 + t * 0.22) * 5;

          // Mouse influence
          const distToMouse = Math.sqrt(
            Math.pow((baseX / W) - mouseX, 2) + Math.pow((baseY / H) - mouseY, 2)
          );
          const mouseInfluence = Math.max(0, 1 - distToMouse * 2.5);
          const mx = (mouseX - baseX / W) * mouseInfluence * -40;
          const my = (mouseY - baseY / H) * mouseInfluence * -40;

          const x = baseX + dx + mx;
          const y = baseY + dy + my;

          // Draw node dot
          const brightness = 0.08 + mouseInfluence * 0.15;
          const size = 1.2 + mouseInfluence * 2;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(241, 119, 82, ${brightness})`;
          ctx.fill();

          // Draw lines to neighbors
          if (c < cols - 1) {
            const nx = (c + 1) * cellW +
              Math.sin((c + 1) * 0.4 + t * 0.3) * 12 +
              Math.sin(r * 0.3 + t * 0.2) * 8 +
              Math.sin(((c + 1) + r) * 0.25 + t * 0.15) * 6;
            const ny = baseY +
              Math.cos(r * 0.35 + t * 0.25) * 10 +
              Math.cos((c + 1) * 0.45 + t * 0.18) * 7 +
              Math.sin(((c + 1) - r) * 0.3 + t * 0.22) * 5;

            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(nx, ny);
            ctx.strokeStyle = `rgba(241, 119, 82, ${0.03 + mouseInfluence * 0.06})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }

          if (r < rows - 1) {
            const nx = baseX +
              Math.sin(c * 0.4 + t * 0.3) * 12 +
              Math.sin((r + 1) * 0.3 + t * 0.2) * 8 +
              Math.sin((c + (r + 1)) * 0.25 + t * 0.15) * 6;
            const ny = (r + 1) * cellH +
              Math.cos((r + 1) * 0.35 + t * 0.25) * 10 +
              Math.cos(c * 0.45 + t * 0.18) * 7 +
              Math.sin((c - (r + 1)) * 0.3 + t * 0.22) * 5;

            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(nx, ny);
            ctx.strokeStyle = `rgba(241, 119, 82, ${0.025 + mouseInfluence * 0.05})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Floating particles
      for (let i = 0; i < 40; i++) {
        const px = (Math.sin(i * 1.7 + t * 0.1) * 0.5 + 0.5) * W;
        const py = (Math.cos(i * 2.3 + t * 0.08) * 0.5 + 0.5) * H;
        const pSize = 1 + Math.sin(i * 3.1 + t * 0.5) * 0.8;
        const pAlpha = 0.04 + Math.sin(i * 2.7 + t * 0.3) * 0.03;

        ctx.beginPath();
        ctx.arc(px, py, pSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${pAlpha})`;
        ctx.fill();
      }

      t += 0.008;
      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMouse);
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
        pointerEvents: "auto",
        zIndex: 0,
      }}
    />
  );
}

/* ─── Film grain overlay ─── */
function GrainOverlay() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: 0.35,
        mixBlendMode: "overlay",
        pointerEvents: "none",
        zIndex: 1,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "128px 128px",
      }}
    />
  );
}

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const heading = headingRef.current;
    const text = textRef.current;
    if (!heading || !text) return;

    const ctx = gsap.context(() => {
      // Heading lines reveal
      const lines = heading.querySelectorAll(".about-line");
      lines.forEach((line, i) => {
        gsap.fromTo(line,
          { y: 80, opacity: 0, rotateX: 40 },
          {
            y: 0, opacity: 1, rotateX: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: heading,
              start: `top ${80 - i * 5}%`,
              end: `top ${50 - i * 5}%`,
              scrub: 1,
            },
          }
        );
      });

      // Text fade in
      gsap.fromTo(text, { y: 40, opacity: 0 }, {
        y: 0, opacity: 1,
        scrollTrigger: { trigger: text, start: "top 85%", end: "top 55%", scrub: 1 },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        background: "#0a0a0a",
        overflow: "hidden",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {/* Animated mesh background */}
      <MeshBackground />

      {/* Film grain */}
      <GrainOverlay />

      {/* Radial glow accents */}
      <div style={{
        position: "absolute",
        top: "-20%",
        left: "-10%",
        width: "60%",
        height: "60%",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(241,119,82,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
        zIndex: 1,
      }} />
      <div style={{
        position: "absolute",
        bottom: "-15%",
        right: "-10%",
        width: "50%",
        height: "50%",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(167,139,250,0.04) 0%, transparent 70%)",
        pointerEvents: "none",
        zIndex: 1,
      }} />

      {/* Content */}
      <div style={{
        position: "relative",
        zIndex: 2,
        padding: "clamp(80px, 12vw, 180px) clamp(20px, 5vw, 80px)",
      }}>
        {/* Top labels */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "clamp(48px, 6vw, 80px)",
        }}>
          <span style={{
            fontFamily: "'PP Neue Montreal', sans-serif",
            fontSize: "12px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.25)",
            fontWeight: 500,
          }}>
            Sri Lanka
          </span>
          <span style={{
            fontFamily: "'PP Neue Montreal', sans-serif",
            fontSize: "12px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.25)",
            fontWeight: 500,
          }}>
            [ Creative Design Studio ]
          </span>
          <span style={{
            fontFamily: "'PP Neue Montreal', sans-serif",
            fontSize: "12px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.25)",
            fontWeight: 500,
          }}>
            International
          </span>
        </div>

        {/* Giant headline */}
        <div
          ref={headingRef}
          style={{
            perspective: "800px",
            marginBottom: "clamp(48px, 6vw, 80px)",
          }}
        >
          <div className="about-line" style={{ overflow: "hidden" }}>
            <h2 style={{
              fontFamily: "'NN Nouvelle Grotesk', sans-serif",
              fontSize: "clamp(32px, 6vw, 100px)",
              fontWeight: 700,
              lineHeight: 1.0,
              color: "#f17752",
              margin: 0,
              letterSpacing: "-2px",
              textTransform: "uppercase",
            }}>
              We craft digital
            </h2>
          </div>
          <div className="about-line" style={{ overflow: "hidden" }}>
            <h2 style={{
              fontFamily: "'NN Nouvelle Grotesk', sans-serif",
              fontSize: "clamp(32px, 6vw, 100px)",
              fontWeight: 700,
              lineHeight: 1.0,
              color: "#f17752",
              margin: 0,
              letterSpacing: "-2px",
              textTransform: "uppercase",
            }}>
              experiences that
            </h2>
          </div>
          <div className="about-line" style={{ overflow: "hidden" }}>
            <h2 style={{
              fontFamily: "'NN Nouvelle Grotesk', sans-serif",
              fontSize: "clamp(32px, 6vw, 100px)",
              fontWeight: 700,
              lineHeight: 1.0,
              color: "#f17752",
              margin: 0,
              letterSpacing: "-2px",
              textTransform: "uppercase",
            }}>
              captivate &amp; convert
            </h2>
          </div>
        </div>

        {/* Description */}
        <div ref={textRef} style={{ maxWidth: "640px" }}>
          <p style={{
            fontFamily: "'PP Neue Montreal', sans-serif",
            fontSize: "clamp(17px, 1.5vw, 22px)",
            lineHeight: 1.7,
            color: "rgba(255,255,255,0.45)",
            margin: "0 0 24px",
            fontWeight: 400,
          }}>
            We&apos;re a creative studio obsessed with building brands and digital products that
            actually perform. Every pixel, every interaction, every line of code exists to serve
            one purpose — making people stop scrolling and start paying attention.
          </p>
          <p style={{
            fontFamily: "'PP Neue Montreal', sans-serif",
            fontSize: "clamp(17px, 1.5vw, 22px)",
            lineHeight: 1.7,
            color: "rgba(255,255,255,0.45)",
            margin: 0,
            fontWeight: 400,
          }}>
            From brand identity to full-stack development, we partner with ambitious founders
            and forward-thinking teams who refuse to blend in.
          </p>
        </div>

        {/* Bottom brand signature */}
        <div style={{
          marginTop: "clamp(64px, 8vw, 120px)",
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}>
          <div style={{
            width: "40px",
            height: "1px",
            background: "rgba(255,255,255,0.15)",
          }} />
          <span style={{
            fontFamily: "'PP Neue Montreal', sans-serif",
            fontSize: "14px",
            color: "rgba(255,255,255,0.25)",
            fontWeight: 500,
            letterSpacing: "0.06em",
          }}>
            Anika Labs — Design &amp; Development Studio
          </span>
        </div>
      </div>
    </section>
  );
}
