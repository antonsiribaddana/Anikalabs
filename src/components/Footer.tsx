"use client";

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 12L12 4M12 4H5.5M12 4V10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function Footer() {
  return (
    <footer style={{ background: "#0a0a0a", position: "relative" }}>

      {/* ── Orange CTA card — scrolls normally, reveals dark section behind ── */}
      <div style={{
        position: "relative",
        zIndex: 2,
        padding: "clamp(12px, 1.5vw, 20px)",
      }}>
        <div style={{
          background: "#f17752",
          borderRadius: "clamp(16px, 2vw, 24px)",
          padding: "clamp(48px, 6vw, 96px) clamp(36px, 5vw, 80px)",
          position: "relative",
          overflow: "hidden",
          minHeight: "clamp(400px, 70vh, 700px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}>
          {/* Top row — heading left, contact right */}
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: "clamp(24px, 4vw, 60px)",
          }}>
            <h2 style={{
              fontFamily: "'NN Nouvelle Grotesk', sans-serif",
              fontSize: "clamp(28px, 3.5vw, 48px)",
              fontWeight: 700,
              lineHeight: 1.15,
              color: "#fff",
              margin: 0,
              maxWidth: "400px",
            }}>
              Your never-ending creative partner
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "clamp(24px, 3vw, 40px)" }}>
              <div>
                <p style={{
                  fontFamily: "'PP Neue Montreal', sans-serif",
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.6)",
                  margin: "0 0 6px",
                }}>
                  Mail us
                </p>
                <a href="mailto:hello@anikalabs.com" style={{
                  fontFamily: "'PP Neue Montreal', sans-serif",
                  fontSize: "clamp(16px, 1.5vw, 22px)",
                  color: "#fff",
                  textDecoration: "none",
                  fontWeight: 500,
                }}>
                  hello@anikalabs.com
                </a>
              </div>
            </div>
          </div>

          {/* Giant brand name — bottom */}
          <div style={{
            marginTop: "clamp(40px, 6vw, 80px)",
            overflow: "hidden",
            lineHeight: 0.8,
          }}>
            <span style={{
              fontFamily: "'NN Nouvelle Grotesk', sans-serif",
              fontSize: "clamp(100px, 18vw, 320px)",
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "-6px",
              display: "block",
              lineHeight: 0.85,
              whiteSpace: "nowrap",
            }}>
              anika
            </span>
          </div>
        </div>
      </div>

      {/* ── Dark section — sticky behind the card, revealed as card scrolls away ── */}
      <div style={{
        position: "sticky",
        bottom: 0,
        zIndex: 1,
        background: "#0a0a0a",
        borderRadius: "clamp(16px, 2vw, 24px) clamp(16px, 2vw, 24px) 0 0",
        padding: "clamp(56px, 7vw, 96px) clamp(20px, 5vw, 80px)",
      }}>
        {/* Nav grid + socials */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: "clamp(32px, 4vw, 60px)",
        }}>
          {/* Col 1 — Company links */}
          <div style={{ flex: "1 1 240px", maxWidth: "400px" }}>
            <p style={{
              fontFamily: "'PP Neue Montreal', sans-serif",
              fontSize: "12px",
              color: "rgba(255,255,255,0.35)",
              margin: "0 0 24px",
            }}>
              Company
            </p>
            <nav style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {["Services", "Projects", "About Us", "Contact"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(" ", "-")}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    fontFamily: "'PP Neue Montreal', sans-serif",
                    fontSize: "clamp(16px, 1.5vw, 20px)",
                    fontWeight: 500,
                    color: "#fff",
                    textDecoration: "none",
                    padding: "16px 0",
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.6")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  <span style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: "#f17752",
                    color: "#fff",
                    flexShrink: 0,
                  }}>
                    <ArrowIcon />
                  </span>
                  {item}
                </a>
              ))}
            </nav>
          </div>

          {/* Col 2 — Work links */}
          <div style={{ flex: "1 1 200px", maxWidth: "400px" }}>
            <p style={{
              fontFamily: "'PP Neue Montreal', sans-serif",
              fontSize: "12px",
              color: "rgba(255,255,255,0.35)",
              margin: "0 0 24px",
            }}>
              Our work
            </p>
            <nav style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {["Cases", "Explore"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    fontFamily: "'PP Neue Montreal', sans-serif",
                    fontSize: "clamp(16px, 1.5vw, 20px)",
                    fontWeight: 500,
                    color: "#fff",
                    textDecoration: "none",
                    padding: "16px 0",
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.6")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  <span style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: "#f17752",
                    color: "#fff",
                    flexShrink: 0,
                  }}>
                    <ArrowIcon />
                  </span>
                  {item}
                </a>
              ))}
            </nav>
          </div>

          {/* Social pills — top right */}
          <div style={{ flex: "0 0 auto", display: "flex", gap: "10px", alignSelf: "flex-start" }}>
            {["Instagram", "LinkedIn"].map((s) => (
              <a
                key={s}
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: "10px 24px",
                  borderRadius: "100px",
                  border: "1px solid rgba(255,255,255,0.15)",
                  fontFamily: "'PP Neue Montreal', sans-serif",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#fff",
                  textDecoration: "none",
                  transition: "background 0.2s, border-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                }}
              >
                {s}
              </a>
            ))}
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          marginTop: "clamp(40px, 5vw, 72px)",
          paddingTop: "clamp(20px, 3vw, 28px)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}>
          <p style={{
            fontFamily: "'PP Neue Montreal', sans-serif",
            fontSize: "13px",
            color: "rgba(255,255,255,0.25)",
            margin: 0,
          }}>
            &copy; {new Date().getFullYear()} Anika Labs
          </p>

          <div style={{ display: "flex", gap: "clamp(16px, 2vw, 32px)" }}>
            {["Privacy", "Cookies", "Terms"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                style={{
                  fontFamily: "'PP Neue Montreal', sans-serif",
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.25)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
