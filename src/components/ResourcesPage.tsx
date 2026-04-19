"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { TransitionLink } from "@/components/PageTransitionProvider";
import { urlFor } from "@/sanity/client";
import type { PostListItem } from "@/sanity/queries";

function thumb(img: unknown, w = 1200) {
  try {
    return urlFor(img).width(w).height(Math.round((w * 9) / 16)).auto("format").quality(85).url();
  } catch {
    return "";
  }
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const KIND_LABEL: Record<string, string> = {
  article: "Article",
  guide: "Guide",
  "case-insight": "Case Insight",
};

const editorialShell: React.CSSProperties = {
  width: "min(1440px, calc(100vw - 40px))",
  margin: "0 auto",
};

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        borderRadius: 999,
        border: active ? "1px solid rgba(241,119,82,0.65)" : "1px solid rgba(255,255,255,0.1)",
        background: active ? "linear-gradient(135deg, rgba(241,119,82,0.26), rgba(255,178,138,0.14))" : "rgba(255,255,255,0.04)",
        color: active ? "#fff4ef" : "rgba(255,255,255,0.72)",
        padding: "12px 16px",
        cursor: "pointer",
        fontFamily: "'PP Neue Montreal', sans-serif",
        fontSize: 12,
        fontWeight: 500,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        transition: "all 0.22s ease",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        boxShadow: active ? "0 18px 40px rgba(241,119,82,0.14)" : "none",
      }}
    >
      {children}
    </button>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        minWidth: 140,
        padding: "20px 22px",
        borderRadius: 22,
        background: "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
        border: "1px solid rgba(255,255,255,0.1)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
      }}
    >
      <div
        style={{
          marginBottom: 10,
          fontFamily: "'PP Neue Montreal', sans-serif",
          fontSize: 11,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.42)",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "'PP Neue Montreal', sans-serif",
          fontSize: "clamp(26px, 3vw, 40px)",
          lineHeight: 0.95,
          letterSpacing: "-0.04em",
          color: "#fff",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function PostCard({ p, large = false }: { p: PostListItem; large?: boolean }) {
  const imageUrl = p.thumbnail ? thumb(p.thumbnail, large ? 2000 : 1200) : "";

  return (
    <TransitionLink
      href={`/resources/${p.slug}`}
      style={{ textDecoration: "none", color: "inherit", display: "block", height: "100%" }}
    >
      <article
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          borderRadius: large ? 30 : 26,
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.1)",
          background: "linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.03))",
          boxShadow: "0 24px 80px rgba(0,0,0,0.28)",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: large ? "1.4 / 1" : "16 / 10",
            overflow: "hidden",
            background: "linear-gradient(135deg, #11153e, #050816)",
          }}
        >
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={p.thumbnail?.alt || p.title}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : null}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(4,8,28,0.06) 0%, rgba(4,8,28,0.18) 40%, rgba(4,8,28,0.88) 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 18,
              left: 18,
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            {p.kind && (
              <span
                style={{
                  padding: "8px 12px",
                  borderRadius: 999,
                  background: "rgba(241,119,82,0.2)",
                  border: "1px solid rgba(241,119,82,0.35)",
                  fontSize: 11,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#ffd5c4",
                  fontFamily: "'PP Neue Montreal', sans-serif",
                }}
              >
                {KIND_LABEL[p.kind] || p.kind}
              </span>
            )}
            {p.category?.title && (
              <span
                style={{
                  padding: "8px 12px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  fontSize: 11,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.8)",
                  fontFamily: "'PP Neue Montreal', sans-serif",
                }}
              >
                {p.category.title}
              </span>
            )}
          </div>
        </div>

        <div style={{ padding: large ? "28px 28px 30px" : "22px 22px 24px", display: "grid", gap: 14, flex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
              fontFamily: "'PP Neue Montreal', sans-serif",
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.45)",
            }}
          >
            {p.publishedAt ? <time dateTime={p.publishedAt}>{fmtDate(p.publishedAt)}</time> : null}
            {p.readingTime ? <span>{p.readingTime} min read</span> : null}
            {p.author?.name ? <span>{p.author.name}</span> : null}
          </div>

          <div>
            <h3
              style={{
                margin: 0,
                fontFamily: "'PP Neue Montreal', sans-serif",
                fontSize: large ? "clamp(26px, 2.5vw, 38px)" : "clamp(22px, 2vw, 30px)",
                lineHeight: 1.1,
                fontWeight: 500,
                color: "#fff",
                letterSpacing: "-0.03em",
              }}
            >
              {p.title}
            </h3>
            {p.summary ? (
              <p
                style={{
                  margin: "12px 0 0",
                  fontFamily: "'Aeonik', sans-serif",
                  fontSize: large ? 17 : 15,
                  lineHeight: 1.65,
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                {p.summary}
              </p>
            ) : null}
          </div>

          {p.topics?.length ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: "auto" }}>
              {p.topics.slice(0, large ? 4 : 3).map((topic) => (
                <span
                  key={topic}
                  style={{
                    padding: "7px 10px",
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    fontFamily: "'PP Neue Montreal', sans-serif",
                    fontSize: 11,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.62)",
                  }}
                >
                  {topic}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </article>
    </TransitionLink>
  );
}

function FeaturedSlider({ items }: { items: PostListItem[] }) {
  const [index, setIndex] = useState(0);
  const count = items.length;

  useEffect(() => {
    if (count <= 1) return;
    const id = setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, 6500);
    return () => clearInterval(id);
  }, [count]);

  const current = items[index];

  if (!current) return null;

  const imageUrl = current.thumbnail ? thumb(current.thumbnail, 2400) : "";

  return (
    <div
      style={{
        position: "relative",
        borderRadius: 34,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.12)",
        minHeight: 580,
        background: "linear-gradient(135deg, #11153e, #030613)",
        boxShadow: "0 30px 110px rgba(0,0,0,0.38)",
      }}
    >
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt={current.thumbnail?.alt || current.title}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      ) : null}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(115deg, rgba(4,7,20,0.16) 0%, rgba(4,7,20,0.55) 48%, rgba(4,7,20,0.96) 100%)",
        }}
      />
      <div
        className="resources-featured-grid"
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: 580,
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.2fr) minmax(280px, 0.8fr)",
          gap: 24,
          alignItems: "end",
          padding: "clamp(28px, 4vw, 44px)",
        }}
      >
        <div style={{ maxWidth: 860 }}>
          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              marginBottom: 20,
              fontFamily: "'PP Neue Montreal', sans-serif",
              fontSize: 11,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
            }}
          >
            <span style={{ color: "#ffbe9f" }}>Featured Story</span>
            {current.category?.title ? <span style={{ color: "rgba(255,255,255,0.74)" }}>{current.category.title}</span> : null}
            {current.readingTime ? <span style={{ color: "rgba(255,255,255,0.74)" }}>{current.readingTime} min read</span> : null}
          </div>

          <h3
            style={{
              margin: 0,
              fontFamily: "'PP Neue Montreal', sans-serif",
              fontSize: "clamp(38px, 5vw, 74px)",
              lineHeight: 0.96,
              letterSpacing: "-0.05em",
              fontWeight: 500,
              color: "#fff",
              maxWidth: 920,
            }}
          >
            {current.title}
          </h3>

          {current.summary ? (
            <p
              style={{
                margin: "20px 0 0",
                maxWidth: 680,
                fontFamily: "'Aeonik', sans-serif",
                fontSize: "clamp(15px, 1.3vw, 19px)",
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.78)",
              }}
            >
              {current.summary}
            </p>
          ) : null}
        </div>

        <div
          style={{
            justifySelf: "stretch",
            alignSelf: "stretch",
            display: "grid",
            alignContent: "space-between",
            gap: 18,
            borderRadius: 26,
            padding: "24px",
            background: "linear-gradient(180deg, rgba(255,255,255,0.09), rgba(255,255,255,0.04))",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
          }}
        >
          <div>
            <div
              style={{
                marginBottom: 12,
                fontFamily: "'PP Neue Montreal', sans-serif",
                fontSize: 11,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.45)",
              }}
            >
              Why it matters
            </div>
            <div
              style={{
                fontFamily: "'PP Neue Montreal', sans-serif",
                fontSize: 24,
                lineHeight: 1.15,
                letterSpacing: "-0.03em",
                color: "#fff",
              }}
            >
              Practical thinking with enough signal to turn into action.
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 12,
            }}
          >
            <div style={{ paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.12)" }}>
              <div style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", fontFamily: "'PP Neue Montreal', sans-serif" }}>
                Published
              </div>
              <div style={{ marginTop: 8, color: "#fff", fontFamily: "'Aeonik', sans-serif", fontSize: 14 }}>
                {current.publishedAt ? fmtDate(current.publishedAt) : "Recently"}
              </div>
            </div>
            <div style={{ paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.12)" }}>
              <div style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", fontFamily: "'PP Neue Montreal', sans-serif" }}>
                Author
              </div>
              <div style={{ marginTop: 8, color: "#fff", fontFamily: "'Aeonik', sans-serif", fontSize: 14 }}>
                {current.author?.name || "Anika Labs"}
              </div>
            </div>
          </div>

          {count > 1 ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
              <div style={{ display: "flex", gap: 8 }}>
                {items.map((item, itemIndex) => (
                  <button
                    key={item._id}
                    onClick={() => setIndex(itemIndex)}
                    aria-label={`Go to slide ${itemIndex + 1}`}
                    style={{
                      width: itemIndex === index ? 28 : 9,
                      height: 9,
                      borderRadius: 999,
                      border: "none",
                      cursor: "pointer",
                      background: itemIndex === index ? "#f17752" : "rgba(255,255,255,0.3)",
                      transition: "all 0.24s ease",
                      padding: 0,
                    }}
                  />
                ))}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setIndex((index - 1 + count) % count)} aria-label="Previous" style={sliderButtonStyle}>
                  Prev
                </button>
                <button onClick={() => setIndex((index + 1) % count)} aria-label="Next" style={sliderButtonStyle}>
                  Next
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

const sliderButtonStyle: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.08)",
  color: "#fff",
  cursor: "pointer",
  fontFamily: "'PP Neue Montreal', sans-serif",
  fontSize: 11,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
};

function SectionHeader({
  eyebrow,
  title,
  description,
  meta,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  meta?: string;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) auto",
        gap: 24,
        alignItems: "end",
        marginBottom: "clamp(28px, 3vw, 40px)",
      }}
    >
      <div>
        <div
          style={{
            marginBottom: 14,
            fontFamily: "'PP Neue Montreal', sans-serif",
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#ffbe9f",
          }}
        >
          {eyebrow}
        </div>
        <h2
          style={{
            margin: 0,
            fontFamily: "'PP Neue Montreal', sans-serif",
            fontSize: "clamp(30px, 4vw, 54px)",
            lineHeight: 0.98,
            letterSpacing: "-0.04em",
            fontWeight: 500,
            color: "#fff",
          }}
        >
          {title}
        </h2>
        {description ? (
          <p
            style={{
              margin: "14px 0 0",
              maxWidth: 700,
              fontFamily: "'Aeonik', sans-serif",
              fontSize: 16,
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.68)",
            }}
          >
            {description}
          </p>
        ) : null}
      </div>

      {meta ? (
        <div
          style={{
            justifySelf: "start",
            whiteSpace: "nowrap",
            fontFamily: "'PP Neue Montreal', sans-serif",
            fontSize: 11,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.42)",
          }}
        >
          {meta}
        </div>
      ) : null}
    </div>
  );
}

export default function ResourcesPage({
  posts,
  categories,
}: {
  posts: PostListItem[];
  categories: { title: string; slug: string; order?: number; description?: string }[];
}) {
  const headingRef = useRef<HTMLDivElement>(null);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [kindFilter, setKindFilter] = useState("All");
  const [topicFilter, setTopicFilter] = useState("All");

  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const lines = el.querySelectorAll(".hero-line");
      const details = el.querySelectorAll(".hero-fade");

      gsap.set(lines, { yPercent: 110, opacity: 0 });
      gsap.set(details, { y: 32, opacity: 0 });

      gsap.to(lines, {
        yPercent: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power4.out",
        stagger: 0.12,
        delay: 0.25,
      });
      gsap.to(details, {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.08,
        delay: 0.65,
      });
    }, el);

    return () => ctx.revert();
  }, []);

  const featured = useMemo(() => posts.filter((p) => p.featured), [posts]);
  const nonFeatured = useMemo(() => posts.filter((p) => !p.featured), [posts]);

  const allTopics = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => p.topics?.forEach((topic) => set.add(topic)));
    return Array.from(set).sort();
  }, [posts]);

  const anyFilterActive = categoryFilter !== "All" || kindFilter !== "All" || topicFilter !== "All";

  const filtered = useMemo(() => {
    return nonFeatured.filter((p) => {
      if (categoryFilter !== "All" && p.category?.slug !== categoryFilter) return false;
      if (kindFilter !== "All" && p.kind !== kindFilter) return false;
      if (topicFilter !== "All" && !p.topics?.includes(topicFilter)) return false;
      return true;
    });
  }, [nonFeatured, categoryFilter, kindFilter, topicFilter]);

  const grouped = useMemo(() => {
    const map: Record<string, PostListItem[]> = {};
    for (const p of posts) {
      const slug = p.category?.slug || "uncategorized";
      (map[slug] ||= []).push(p);
    }
    return map;
  }, [posts]);

  const visiblePosts = anyFilterActive ? filtered : nonFeatured;

  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        background:
          "radial-gradient(circle at top left, rgba(241,119,82,0.14), transparent 24%), radial-gradient(circle at 86% 12%, rgba(87,130,255,0.12), transparent 22%), linear-gradient(180deg, #02021e 0%, #030513 52%, #02020d 100%)",
        paddingBottom: "clamp(88px, 12vw, 160px)",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 100,
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(88vw, 1100px)",
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.08), rgba(255,255,255,0))",
          filter: "blur(70px)",
          pointerEvents: "none",
        }}
      />

      <div style={{ ...editorialShell, position: "relative", zIndex: 1 }}>
        <div
          ref={headingRef}
          className="resources-stack-hero"
          style={{
            padding: "clamp(130px, 14vw, 210px) 0 clamp(56px, 7vw, 92px)",
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.15fr) minmax(280px, 0.85fr)",
            gap: "clamp(28px, 5vw, 80px)",
            alignItems: "end",
          }}
        >
          <div>
            <div style={{ overflow: "hidden" }}>
              <div
                className="hero-line"
                style={{
                  marginBottom: 18,
                  fontFamily: "'PP Neue Montreal', sans-serif",
                  fontSize: 11,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                Resources
              </div>
            </div>
            <div style={{ overflow: "hidden" }}>
              <h1
                className="hero-line"
                style={{
                  margin: 0,
                  fontFamily: "'PP Neue Montreal', 'Inter', system-ui, sans-serif",
                  fontSize: "clamp(58px, 10vw, 148px)",
                  fontWeight: 500,
                  lineHeight: 0.9,
                  letterSpacing: "-0.065em",
                  color: "#fff",
                }}
              >
                Field notes for
              </h1>
            </div>
            <div style={{ overflow: "hidden", paddingBottom: "0.1em" }}>
              <h1
                className="hero-line"
                style={{
                  margin: 0,
                  fontFamily: "'PP Neue Montreal', 'Inter', system-ui, sans-serif",
                  fontSize: "clamp(58px, 10vw, 148px)",
                  fontWeight: 500,
                  lineHeight: 0.9,
                  letterSpacing: "-0.065em",
                  background: "linear-gradient(135deg, #f17752 0%, #ffd0b6 48%, #8db4ff 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                modern builders.
              </h1>
            </div>
          </div>

          <div className="hero-fade" style={{ justifySelf: "stretch" }}>
            <div
              style={{
                borderRadius: 30,
                padding: "26px",
                background: "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04))",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(18px)",
                WebkitBackdropFilter: "blur(18px)",
                boxShadow: "0 30px 90px rgba(0,0,0,0.24)",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontFamily: "'Aeonik', sans-serif",
                  fontSize: 17,
                  lineHeight: 1.75,
                  color: "rgba(255,255,255,0.76)",
                }}
              >
                Essays, guides, and case insights on product systems, execution, and the operational detail that
                turns sharp ideas into real work.
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                  gap: 14,
                  marginTop: 24,
                }}
              >
                <HeroStat label="Total Pieces" value={String(posts.length).padStart(2, "0")} />
                <HeroStat label="Categories" value={String(categories.length).padStart(2, "0")} />
                <HeroStat label="Featured" value={String(featured.length).padStart(2, "0")} />
              </div>
            </div>
          </div>
        </div>

        {posts.length === 0 ? (
          <div
            style={{
              padding: "clamp(64px, 8vw, 120px) 0",
              textAlign: "center",
              borderRadius: 30,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
            }}
          >
            <div
              style={{
                fontFamily: "'PP Neue Montreal', sans-serif",
                fontSize: "clamp(30px, 4vw, 48px)",
                lineHeight: 1,
                letterSpacing: "-0.04em",
                color: "#fff",
              }}
            >
              New pieces landing soon.
            </div>
          </div>
        ) : (
          <>
            {featured.length > 0 ? (
              <div style={{ marginBottom: "clamp(64px, 8vw, 110px)" }}>
                <SectionHeader
                  eyebrow="Spotlight"
                  title="Featured thinking with enough depth to shape the next move."
                  description="A rotating selection of pieces we’d put in front of a team before making a meaningful product or systems decision."
                />
                <FeaturedSlider items={featured} />
              </div>
            ) : null}

            <div
              style={{
                marginBottom: "clamp(56px, 7vw, 90px)",
                borderRadius: 30,
                padding: "clamp(22px, 3vw, 30px)",
                background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))",
                border: "1px solid rgba(255,255,255,0.09)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 1fr) auto",
                  gap: 24,
                  alignItems: "start",
                  marginBottom: 22,
                }}
              >
                <div>
                  <div
                    style={{
                      marginBottom: 10,
                      fontFamily: "'PP Neue Montreal', sans-serif",
                      fontSize: 11,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "#ffbe9f",
                    }}
                  >
                    Explore
                  </div>
                  <div
                    style={{
                      fontFamily: "'PP Neue Montreal', sans-serif",
                      fontSize: "clamp(28px, 3vw, 40px)",
                      lineHeight: 1,
                      letterSpacing: "-0.04em",
                      color: "#fff",
                    }}
                  >
                    Browse by track, format, or topic.
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: "'PP Neue Montreal', sans-serif",
                    fontSize: 11,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.45)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {String(visiblePosts.length).padStart(2, "0")} visible
                </div>
              </div>

              <div style={{ display: "grid", gap: 18 }}>
                <div style={{ display: "grid", gap: 10 }}>
                  <div style={filterLabelStyle}>Category</div>
                  <div style={filterRowStyle}>
                    <FilterChip active={categoryFilter === "All"} onClick={() => setCategoryFilter("All")}>
                      All
                    </FilterChip>
                    {categories.map((c) => (
                      <FilterChip key={c.slug} active={categoryFilter === c.slug} onClick={() => setCategoryFilter(c.slug)}>
                        {c.title}
                      </FilterChip>
                    ))}
                  </div>
                </div>

                <div style={{ display: "grid", gap: 10 }}>
                  <div style={filterLabelStyle}>Format</div>
                  <div style={filterRowStyle}>
                    <FilterChip active={kindFilter === "All"} onClick={() => setKindFilter("All")}>
                      All
                    </FilterChip>
                    <FilterChip active={kindFilter === "article"} onClick={() => setKindFilter("article")}>
                      Articles
                    </FilterChip>
                    <FilterChip active={kindFilter === "guide"} onClick={() => setKindFilter("guide")}>
                      Guides
                    </FilterChip>
                    <FilterChip active={kindFilter === "case-insight"} onClick={() => setKindFilter("case-insight")}>
                      Case Insights
                    </FilterChip>
                  </div>
                </div>

                {allTopics.length > 0 ? (
                  <div style={{ display: "grid", gap: 10 }}>
                    <div style={filterLabelStyle}>Topic</div>
                    <div style={filterRowStyle}>
                      <FilterChip active={topicFilter === "All"} onClick={() => setTopicFilter("All")}>
                        All
                      </FilterChip>
                      {allTopics.map((topic) => (
                        <FilterChip key={topic} active={topicFilter === topic} onClick={() => setTopicFilter(topic)}>
                          {topic}
                        </FilterChip>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            {anyFilterActive ? (
              <div>
                <SectionHeader
                  eyebrow="Filtered Results"
                  title={filtered.length === 0 ? "No pieces match that combination yet." : "A tighter view of the library."}
                  description={
                    filtered.length === 0
                      ? "Try widening the filters or switching to another topic."
                      : "These are the pieces that match your current selection."
                  }
                  meta={`${String(filtered.length).padStart(2, "0")} ${filtered.length === 1 ? "piece" : "pieces"}`}
                />

                {filtered.length === 0 ? (
                  <div
                    style={{
                      padding: "clamp(64px, 8vw, 120px)",
                      textAlign: "center",
                      borderRadius: 30,
                      border: "1px solid rgba(255,255,255,0.08)",
                      background: "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
                      color: "rgba(255,255,255,0.62)",
                      fontFamily: "'Aeonik', sans-serif",
                      fontSize: 17,
                    }}
                  >
                    Nothing here yet. Try a different filter.
                  </div>
                ) : (
                  <div style={cardsGridStyle}>
                    {filtered.map((p, index) => (
                      <PostCard key={p._id} p={p} large={index === 0} />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: "grid", gap: "clamp(70px, 9vw, 120px)" }}>
                {categories.map((cat, catIndex) => {
                  const list = grouped[cat.slug] || [];
                  if (list.length === 0) return null;

                  const lead = list[0];
                  const secondary = list.slice(1, 4);

                  return (
                    <section key={cat.slug}>
                      <SectionHeader
                        eyebrow={`Collection ${String(catIndex + 1).padStart(2, "0")}`}
                        title={cat.title}
                        description={cat.description || "A curated run of perspective, frameworks, and practical notes from the field."}
                        meta={`${String(list.length).padStart(2, "0")} pieces`}
                      />

                      <div
                        className="resources-stack-section"
                        style={{
                          display: "grid",
                          gridTemplateColumns: "minmax(0, 1.15fr) minmax(320px, 0.85fr)",
                          gap: "clamp(20px, 2vw, 28px)",
                          alignItems: "stretch",
                        }}
                      >
                        <PostCard p={lead} large />
                        <div style={{ display: "grid", gap: "clamp(18px, 1.6vw, 24px)" }}>
                          {secondary.map((p) => (
                            <PostCard key={p._id} p={p} />
                          ))}
                          {secondary.length === 0 ? (
                            <div
                              style={{
                                minHeight: 180,
                                borderRadius: 26,
                                border: "1px dashed rgba(255,255,255,0.12)",
                                background: "rgba(255,255,255,0.03)",
                                display: "grid",
                                placeItems: "center",
                                padding: 24,
                                color: "rgba(255,255,255,0.52)",
                                fontFamily: "'Aeonik', sans-serif",
                                fontSize: 15,
                                textAlign: "center",
                              }}
                            >
                              More in this category will appear here as the library grows.
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </section>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        @media (max-width: 1100px) {
          .resources-stack-hero,
          .resources-stack-section,
          .resources-featured-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

const filterLabelStyle: React.CSSProperties = {
  fontFamily: "'PP Neue Montreal', sans-serif",
  fontSize: 11,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.42)",
};

const filterRowStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 10,
};

const cardsGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "clamp(18px, 2vw, 28px)",
};
