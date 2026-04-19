import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import PortableBody from "@/components/PortableBody";
import { TransitionLink } from "@/components/PageTransitionProvider";
import { urlFor } from "@/sanity/client";
import { getAllPosts, getPostBySlug, getPostSlugs } from "@/sanity/queries";

export const dynamicParams = false;

export async function generateStaticParams() {
  try {
    const slugs = await getPostSlugs();
    if (!slugs || slugs.length === 0) {
      // Placeholder so static export doesn't fail when no posts exist yet.
      return [{ slug: "__placeholder__" }];
    }
    return slugs.map((s) => ({ slug: s.slug }));
  } catch {
    return [{ slug: "__placeholder__" }];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Not found" };
  return {
    title: `${post.seoTitle || post.title} — Anika Labs`,
    description: post.seoDescription || post.summary,
  };
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function heroSrc(img: unknown) {
  try {
    return urlFor(img).width(2400).auto("format").quality(88).url();
  } catch {
    return "";
  }
}

function thumbSrc(img: unknown) {
  try {
    return urlFor(img).width(800).height(450).auto("format").quality(85).url();
  } catch {
    return "";
  }
}

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug === "__placeholder__") notFound();
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const all = await getAllPosts();
  const related = all.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <main style={{ background: "#02021e", minHeight: "100vh", color: "#fff" }}>
      <article>
        {/* Header */}
        <header
          style={{
            padding: "clamp(140px, 14vw, 200px) clamp(20px, 6vw, 112px) clamp(40px, 5vw, 72px)",
            maxWidth: 1100,
            margin: "0 auto",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24, fontFamily: "'PP Neue Montreal', sans-serif", fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)" }}>
            {post.category?.title && <span style={{ color: "#f17752" }}>{post.category.title}</span>}
            {post.category?.title && <span>·</span>}
            <time dateTime={post.publishedAt}>{fmtDate(post.publishedAt)}</time>
            {post.readingTime ? <><span>·</span><span>{post.readingTime} min read</span></> : null}
          </div>

          <h1
            style={{
              margin: 0,
              fontFamily: "'PP Neue Montreal', 'Inter', sans-serif",
              fontSize: "clamp(40px, 6vw, 84px)",
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
              fontWeight: 500,
              color: "#fff",
            }}
          >
            {post.title}
          </h1>

          {post.summary && (
            <p style={{ margin: "clamp(24px, 3vw, 36px) 0 0", maxWidth: 760, fontFamily: "'PP Neue Montreal', sans-serif", fontSize: "clamp(18px, 1.5vw, 22px)", lineHeight: 1.55, color: "rgba(255,255,255,0.75)" }}>
              {post.summary}
            </p>
          )}

          {post.author && (
            <div style={{ marginTop: "clamp(32px, 4vw, 48px)", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#0a0a24", border: "1px solid rgba(255,255,255,0.15)", overflow: "hidden" }}>
                {post.author.avatar && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={urlFor(post.author.avatar).width(120).height(120).fit("crop").auto("format").url()} alt={post.author.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                )}
              </div>
              <div>
                <div style={{ fontSize: 14, color: "#fff", fontFamily: "'PP Neue Montreal', sans-serif" }}>{post.author.name}</div>
                {post.author.role && <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", fontFamily: "'PP Neue Montreal', sans-serif" }}>{post.author.role}</div>}
              </div>
            </div>
          )}
        </header>

        {/* Cover */}
        {post.thumbnail && (
          <div style={{ padding: "0 clamp(20px, 6vw, 112px)", marginBottom: "clamp(48px, 6vw, 88px)" }}>
            <div style={{ maxWidth: 1400, margin: "0 auto", borderRadius: 16, overflow: "hidden", background: "#0a0a24", aspectRatio: "16 / 9" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={heroSrc(post.thumbnail)} alt={post.thumbnail.alt || post.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
          </div>
        )}

        {/* Body */}
        <div style={{ padding: "0 clamp(20px, 6vw, 112px)", maxWidth: 820, margin: "0 auto" }}>
          <PortableBody value={post.body} />
        </div>

        {/* Tags */}
        {post.topics && post.topics.length > 0 && (
          <div style={{ padding: "clamp(48px, 6vw, 80px) clamp(20px, 6vw, 112px) 0", maxWidth: 820, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 8 }}>
            {post.topics.map((t) => (
              <span key={t} style={{ padding: "6px 14px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.2)", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)", fontFamily: "'PP Neue Montreal', sans-serif" }}>
                {t}
              </span>
            ))}
          </div>
        )}
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section style={{ padding: "clamp(100px, 12vw, 160px) clamp(20px, 6vw, 112px) clamp(80px, 10vw, 120px)", borderTop: "1px solid rgba(255,255,255,0.08)", marginTop: "clamp(80px, 10vw, 120px)" }}>
          <div style={{ fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 32, fontFamily: "'PP Neue Montreal', sans-serif" }}>
            Keep reading
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "clamp(20px, 2.4vw, 36px)" }}>
            {related.map((p) => (
              <TransitionLink key={p._id} href={`/resources/${p.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                <article style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ aspectRatio: "16 / 9", borderRadius: 12, overflow: "hidden", background: "#0a0a24", border: "1px solid rgba(255,255,255,0.08)" }}>
                    {p.thumbnail && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={thumbSrc(p.thumbnail)} alt={p.thumbnail.alt || p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    )}
                  </div>
                  <h3 style={{ margin: 0, fontSize: 18, lineHeight: 1.3, color: "#fff", fontFamily: "'PP Neue Montreal', sans-serif", fontWeight: 500 }}>{p.title}</h3>
                </article>
              </TransitionLink>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
