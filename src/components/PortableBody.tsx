"use client";

import { PortableText, type PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import { urlFor } from "@/sanity/client";

type SanityImg = { asset?: unknown; alt?: string; caption?: string; size?: "inline" | "wide" | "full" };

function imgSrc(img: unknown, w = 1600) {
  try {
    return urlFor(img).width(w).auto("format").quality(85).url();
  } catch {
    return "";
  }
}

const components: PortableTextComponents = {
  types: {
    image: ({ value }: { value: SanityImg }) => {
      const size = value.size || "inline";
      const width = size === "full" ? 2400 : size === "wide" ? 1800 : 1200;
      const src = imgSrc(value, width);
      if (!src) return null;
      return (
        <figure
          style={{
            margin: `clamp(40px, 5vw, 72px) ${size === "full" ? "calc(50% - 50vw)" : size === "wide" ? "-8%" : "0"}`,
          }}
        >
          <div style={{ position: "relative", width: "100%", borderRadius: size === "full" ? 0 : 12, overflow: "hidden", background: "#0a0a24" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={value.alt || ""} style={{ display: "block", width: "100%", height: "auto" }} loading="lazy" />
          </div>
          {value.caption && (
            <figcaption style={{ marginTop: 14, fontSize: 13, color: "rgba(255,255,255,0.5)", fontFamily: "'PP Neue Montreal', sans-serif", textAlign: "center" }}>
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    imagePair: ({ value }: { value: { left: SanityImg; right: SanityImg; caption?: string } }) => (
      <figure style={{ margin: "clamp(40px, 5vw, 72px) -8%" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[value.left, value.right].map((img, i) => {
            const src = imgSrc(img, 1400);
            if (!src) return null;
            return (
              <div key={i} style={{ borderRadius: 12, overflow: "hidden", background: "#0a0a24" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={img.alt || ""} style={{ width: "100%", height: "auto", display: "block" }} loading="lazy" />
              </div>
            );
          })}
        </div>
        {value.caption && (
          <figcaption style={{ marginTop: 14, fontSize: 13, color: "rgba(255,255,255,0.5)", textAlign: "center", fontFamily: "'PP Neue Montreal', sans-serif" }}>
            {value.caption}
          </figcaption>
        )}
      </figure>
    ),
    gallery: ({ value }: { value: { images: SanityImg[]; columns?: number } }) => (
      <div style={{ margin: "clamp(40px, 5vw, 72px) -8%", display: "grid", gridTemplateColumns: `repeat(${value.columns || 3}, 1fr)`, gap: 12 }}>
        {value.images?.map((img, i) => {
          const src = imgSrc(img, 1000);
          if (!src) return null;
          return (
            <div key={i} style={{ borderRadius: 10, overflow: "hidden", background: "#0a0a24" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={img.alt || ""} style={{ width: "100%", height: "auto", display: "block" }} loading="lazy" />
            </div>
          );
        })}
      </div>
    ),
    pullQuote: ({ value }: { value: { text: string; attribution?: string } }) => (
      <figure style={{ margin: "clamp(48px, 6vw, 88px) 0", padding: "0 clamp(8px, 4vw, 48px)" }}>
        <blockquote
          style={{
            fontFamily: "'PP Neue Montreal', 'Inter', serif",
            fontSize: "clamp(26px, 3.2vw, 44px)",
            lineHeight: 1.18,
            letterSpacing: "-0.01em",
            fontWeight: 500,
            color: "#fff",
            margin: 0,
            fontStyle: "italic",
          }}
        >
          “{value.text}”
        </blockquote>
        {value.attribution && (
          <figcaption style={{ marginTop: 20, fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase", color: "#f17752", fontFamily: "'PP Neue Montreal', sans-serif" }}>
            — {value.attribution}
          </figcaption>
        )}
      </figure>
    ),
    stat: ({ value }: { value: { value: string; label: string } }) => (
      <div style={{ margin: "clamp(32px, 4vw, 56px) 0", padding: "clamp(28px, 4vw, 48px)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16, background: "rgba(255,255,255,0.02)" }}>
        <div style={{ fontSize: "clamp(48px, 7vw, 96px)", fontWeight: 500, letterSpacing: "-0.03em", lineHeight: 1, background: "linear-gradient(135deg, #f17752 0%, #ffb28a 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", fontFamily: "'PP Neue Montreal', sans-serif" }}>
          {value.value}
        </div>
        <div style={{ marginTop: 12, fontSize: 15, color: "rgba(255,255,255,0.75)", fontFamily: "'PP Neue Montreal', sans-serif" }}>{value.label}</div>
      </div>
    ),
    callout: ({ value }: { value: { tone: string; text: string } }) => {
      const tones: Record<string, { bg: string; border: string; accent: string }> = {
        info: { bg: "rgba(90,40,200,0.12)", border: "rgba(120,80,230,0.35)", accent: "#b6a2ff" },
        tip: { bg: "rgba(241,119,82,0.10)", border: "rgba(241,119,82,0.38)", accent: "#f17752" },
        warning: { bg: "rgba(234,110,62,0.14)", border: "rgba(234,110,62,0.45)", accent: "#ff9c6e" },
      };
      const t = tones[value.tone] || tones.info;
      return (
        <aside style={{ margin: "clamp(32px, 4vw, 48px) 0", padding: "clamp(20px, 2.4vw, 28px)", background: t.bg, border: `1px solid ${t.border}`, borderRadius: 14, borderLeft: `3px solid ${t.accent}` }}>
          <div style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: t.accent, marginBottom: 10, fontFamily: "'PP Neue Montreal', sans-serif" }}>{value.tone}</div>
          <p style={{ margin: 0, color: "rgba(255,255,255,0.88)", fontSize: 16, lineHeight: 1.6, fontFamily: "'PP Neue Montreal', sans-serif" }}>{value.text}</p>
        </aside>
      );
    },
    video: ({ value }: { value: { url: string; caption?: string } }) => {
      const yt = value.url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/);
      const vm = value.url.match(/vimeo\.com\/(\d+)/);
      const embed = yt ? `https://www.youtube.com/embed/${yt[1]}` : vm ? `https://player.vimeo.com/video/${vm[1]}` : null;
      if (!embed) return null;
      return (
        <figure style={{ margin: "clamp(40px, 5vw, 72px) -8%" }}>
          <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", borderRadius: 12, overflow: "hidden", background: "#0a0a24" }}>
            <iframe src={embed} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
          </div>
          {value.caption && <figcaption style={{ marginTop: 14, fontSize: 13, color: "rgba(255,255,255,0.5)", textAlign: "center" }}>{value.caption}</figcaption>}
        </figure>
      );
    },
    code: ({ value }: { value: { language?: string; code: string } }) => (
      <pre style={{ margin: "clamp(28px, 3vw, 40px) 0", padding: 24, background: "#0a0a24", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, overflowX: "auto", fontSize: 13.5, lineHeight: 1.65, color: "#e7e7f7", fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>
        <code>{value.code}</code>
      </pre>
    ),
    divider: () => (
      <hr style={{ margin: "clamp(48px, 6vw, 80px) auto", width: 64, border: 0, borderTop: "1px solid rgba(255,255,255,0.25)" }} />
    ),
  },
  block: {
    normal: ({ children }) => <p style={{ margin: "0 0 1.25em", fontSize: "clamp(17px, 1.2vw, 19px)", lineHeight: 1.75, color: "rgba(255,255,255,0.82)", fontFamily: "'PP Neue Montreal', sans-serif" }}>{children}</p>,
    h2: ({ children }) => <h2 style={{ margin: "clamp(40px, 5vw, 64px) 0 0.6em", fontSize: "clamp(28px, 3vw, 40px)", lineHeight: 1.15, letterSpacing: "-0.02em", fontWeight: 500, color: "#fff", fontFamily: "'PP Neue Montreal', sans-serif" }}>{children}</h2>,
    h3: ({ children }) => <h3 style={{ margin: "clamp(32px, 4vw, 48px) 0 0.6em", fontSize: "clamp(22px, 2.2vw, 28px)", lineHeight: 1.25, fontWeight: 500, color: "#fff", fontFamily: "'PP Neue Montreal', sans-serif" }}>{children}</h3>,
    h4: ({ children }) => <h4 style={{ margin: "1.8em 0 0.5em", fontSize: "clamp(18px, 1.5vw, 21px)", fontWeight: 500, color: "#fff", fontFamily: "'PP Neue Montreal', sans-serif" }}>{children}</h4>,
    blockquote: ({ children }) => <blockquote style={{ margin: "clamp(32px, 4vw, 48px) 0", paddingLeft: 20, borderLeft: "2px solid #f17752", fontStyle: "italic", color: "rgba(255,255,255,0.9)", fontSize: "clamp(18px, 1.6vw, 22px)", lineHeight: 1.55 }}>{children}</blockquote>,
  },
  list: {
    bullet: ({ children }) => <ul style={{ margin: "0 0 1.4em", paddingLeft: 22, color: "rgba(255,255,255,0.82)", fontSize: "clamp(17px, 1.2vw, 19px)", lineHeight: 1.75, fontFamily: "'PP Neue Montreal', sans-serif" }}>{children}</ul>,
    number: ({ children }) => <ol style={{ margin: "0 0 1.4em", paddingLeft: 22, color: "rgba(255,255,255,0.82)", fontSize: "clamp(17px, 1.2vw, 19px)", lineHeight: 1.75, fontFamily: "'PP Neue Montreal', sans-serif" }}>{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li style={{ marginBottom: 8 }}>{children}</li>,
    number: ({ children }) => <li style={{ marginBottom: 8 }}>{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong style={{ color: "#fff", fontWeight: 600 }}>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    code: ({ children }) => <code style={{ padding: "2px 6px", background: "rgba(255,255,255,0.08)", borderRadius: 4, fontSize: "0.9em", fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>{children}</code>,
    underline: ({ children }) => <span style={{ textDecoration: "underline" }}>{children}</span>,
    link: ({ value, children }) => (
      <a href={value?.href} target={value?.blank ? "_blank" : undefined} rel={value?.blank ? "noopener noreferrer" : undefined} style={{ color: "#f17752", textDecoration: "underline", textUnderlineOffset: 3 }}>
        {children}
      </a>
    ),
  },
};

export default function PortableBody({ value }: { value: unknown }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <PortableText value={value as any} components={components} />;
}
