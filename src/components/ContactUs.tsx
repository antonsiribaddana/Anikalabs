"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─── tiny glyphs ─── */
const Plus = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 1V13M1 7H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const PROJECT_TYPES = [
  "Full System Build",
  "Website System",
  "Brand System",
  "E-commerce System",
  "Web Application",
  "Automation & AI",
  "Ongoing Growth",
  "Not sure yet",
];

const BUDGETS = [
  "$2,500–$5,000",
  "$5,000–$10,000",
  "$10,000–$20,000",
  "Above $20,000",
];

const TIMELINES = [
  "ASAP",
  "1–2 months",
  "3–6 months",
  "Flexible",
];

const FAQS = [
  {
    q: "How soon will I hear back?",
    a: "Within one business day. We review every inquiry personally and reply with honest next steps — even if we're not the right fit.",
  },
  {
    q: "What does a typical engagement look like?",
    a: "Most projects run 4–10 weeks. We scope tightly around outcomes, not deliverables, and ship in weekly increments so you see progress constantly.",
  },
  {
    q: "Do you work with startups?",
    a: "Yes — early-stage teams are where we do some of our best work. We tailor scope and pricing to the stage you're at.",
  },
  {
    q: "Can you partner long-term?",
    a: "Absolutely. Our Creative Partnership™ model is designed for ongoing collaboration — one monthly rate, one team, everything you need to keep moving.",
  },
  {
    q: "Where is Anika Labs based?",
    a: "Headquartered in Colombo, Sri Lanka. We work remotely with clients across Europe, North America and Asia.",
  },
  {
    q: "What do you need from me to get started?",
    a: "A rough sense of what you're trying to build or change, who it's for, and any constraints (deadlines, existing systems). We take it from there.",
  },
];

export default function ContactUs() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const [projectType, setProjectType] = useState("");
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const heading = headingRef.current;
    if (!heading) return;
    const ctx = gsap.context(() => {
      const lines = heading.querySelectorAll(".contact-line");
      lines.forEach((line, i) => {
        gsap.fromTo(
          line,
          { y: 80, opacity: 0, rotateX: 40 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: heading,
              start: `top ${85 - i * 4}%`,
              end: `top ${55 - i * 4}%`,
              scrub: 1,
            },
          }
        );
      });
    });
    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section
      id="contact-us"
      ref={sectionRef}
      style={{
        position: "relative",
        // Dark → light vertical fade so the glassy floating navbar stays legible at the top
        background:
          "linear-gradient(180deg, #0C042A 0%, #0C042A 18%, #1a0f3d 34%, #3b2f5f 52%, #a79bc7 70%, #f5f1ea 88%, #f5f1ea 100%)",
        color: "#fff",
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Ambient glows behind the dark portion */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(60% 45% at 20% 18%, rgba(107,92,255,0.28) 0%, rgba(12,4,42,0) 60%), radial-gradient(50% 40% at 85% 28%, rgba(241,119,82,0.22) 0%, rgba(12,4,42,0) 65%)",
        }}
      />

      {/* Subtle noise on the dark portion */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: "60%",
          pointerEvents: "none",
          opacity: 0.22,
          mixBlendMode: "overlay",
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: "160px 160px",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding: "clamp(140px, 14vw, 220px) clamp(20px, 6vw, 112px) clamp(60px, 8vw, 120px)",
          maxWidth: "1320px",
          margin: "0 auto",
        }}
      >
        {/* ── HERO ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "clamp(24px, 2.5vw, 32px)" }}>
          <span
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "#6bff9e",
              boxShadow: "0 0 12px rgba(107,255,158,0.7)",
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontFamily: "'PP Neue Montreal', sans-serif",
              fontSize: "13px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.7)",
            }}
          >
            Taking new projects · Next opening: Feb 2026
          </span>
        </div>

        <div
          ref={headingRef}
          style={{
            perspective: "800px",
            marginBottom: "clamp(28px, 3vw, 40px)",
          }}
        >
          {["Let's build something", "worth the effort."].map((line, i) => (
            <div key={i} className="contact-line" style={{ overflow: "hidden" }}>
              <h1
                style={{
                  fontFamily: "'PP Neue Montreal', 'Inter', system-ui, sans-serif",
                  fontSize: "clamp(48px, 8vw, 128px)",
                  fontWeight: 500,
                  lineHeight: 1,
                  letterSpacing: "-2.5px",
                  color: "#fff",
                  margin: 0,
                }}
              >
                {line}
              </h1>
            </div>
          ))}
        </div>

        <p
          style={{
            fontFamily: "'PP Neue Montreal', sans-serif",
            fontSize: "clamp(17px, 1.5vw, 22px)",
            lineHeight: 1.5,
            color: "rgba(255,255,255,0.65)",
            margin: "0 0 clamp(56px, 7vw, 96px)",
            maxWidth: "620px",
          }}
        >
          Tell us about your project. Whether it&apos;s a full digital system, a brand refresh, or just
          &quot;we&apos;re not sure what&apos;s broken&quot; — we&apos;ll read every word and reply within one business day.
        </p>

        {/* ── FORM ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.4fr)",
            gap: "clamp(40px, 5vw, 80px)",
            alignItems: "start",
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "'PP Neue Montreal', sans-serif",
                fontSize: "12px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.45)",
                margin: "0 0 16px",
              }}
            >
              <Plus /> &nbsp; Project brief
            </p>
            <h2
              style={{
                fontFamily: "'PP Neue Montreal', 'Inter', system-ui, sans-serif",
                fontSize: "clamp(28px, 3vw, 44px)",
                fontWeight: 500,
                lineHeight: 1.1,
                letterSpacing: "-1px",
                color: "#fff",
                margin: 0,
                maxWidth: "320px",
              }}
            >
              Fill in what you know — we&apos;ll figure out the rest together.
            </h2>
          </div>

          {submitted ? (
            <SuccessCard />
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "clamp(18px, 1.8vw, 24px)" }}>
              <Row>
                <Field label="Name" name="name" required placeholder="Jane Doe" />
                <Field label="Company" name="company" placeholder="Optional" />
              </Row>

              <Field label="Email" name="email" type="email" required placeholder="jane@company.com" />

              <Select
                label="Project type"
                options={PROJECT_TYPES}
                value={projectType}
                onChange={setProjectType}
                placeholder="Select one…"
                required
              />

              <Row>
                <ChipGroup label="Budget" options={BUDGETS} value={budget} onChange={setBudget} wrap />
                <ChipGroup label="Timeline" options={TIMELINES} value={timeline} onChange={setTimeline} wrap />
              </Row>

              <TextArea label="Tell us about the project" name="message" required placeholder="What are you trying to build, fix, or figure out?" />

              <label
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  color: "rgba(255,255,255,0.55)",
                  fontFamily: "'PP Neue Montreal', sans-serif",
                  fontSize: "13px",
                }}
              >
                <input type="checkbox" required style={{ accentColor: "#f17752" }} />
                I agree to Anika Labs&apos; privacy policy.
              </label>

              <button
                type="submit"
                style={{
                  alignSelf: "flex-start",
                  marginTop: "8px",
                  background: "#f17752",
                  color: "#fff",
                  border: "none",
                  borderRadius: "100px",
                  padding: "18px 36px",
                  fontFamily: "'PP Neue Montreal', sans-serif",
                  fontSize: "18px",
                  fontWeight: 500,
                  letterSpacing: "0.4px",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  transition: "opacity 0.2s ease, transform 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "0.9";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "1";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <span
                  style={{
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    background: "#fff",
                    opacity: 0.9,
                    display: "inline-block",
                  }}
                />
                Send project brief
              </button>
            </form>
          )}
        </div>

        {/* ── FAQ ── */}
        <div style={{ marginTop: "clamp(120px, 14vw, 200px)" }}>
          <p
            style={{
              fontFamily: "'PP Neue Montreal', sans-serif",
              fontSize: "12px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(10,10,30,0.55)",
              margin: "0 0 16px",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span style={{ color: "#f17752" }}>
              <Plus />
            </span>
            FAQ
          </p>
          <h2
            style={{
              fontFamily: "'PP Neue Montreal', 'Inter', system-ui, sans-serif",
              fontSize: "clamp(36px, 5vw, 64px)",
              fontWeight: 500,
              lineHeight: 1.05,
              letterSpacing: "-1.5px",
              color: "#0a0a1e",
              margin: "0 0 clamp(40px, 5vw, 64px)",
              maxWidth: "640px",
            }}
          >
            Questions we hear a lot.
          </h2>

          <div
            style={{
              borderTop: "1px solid rgba(10,10,30,0.12)",
            }}
          >
            {FAQS.map((item, i) => {
              const open = openFaq === i;
              return (
                <div
                  key={i}
                  style={{
                    borderBottom: "1px solid rgba(10,10,30,0.12)",
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(open ? null : i)}
                    style={{
                      all: "unset",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "24px",
                      padding: "clamp(20px, 2.2vw, 28px) 0",
                      width: "100%",
                      fontFamily: "'PP Neue Montreal', 'Inter', system-ui, sans-serif",
                      fontSize: "clamp(18px, 1.8vw, 24px)",
                      fontWeight: 500,
                      color: "#0a0a1e",
                      letterSpacing: "-0.5px",
                    }}
                  >
                    <span>{item.q}</span>
                    <span
                      style={{
                        color: "#f17752",
                        transform: open ? "rotate(45deg)" : "rotate(0deg)",
                        transition: "transform 0.3s ease",
                        display: "inline-flex",
                      }}
                    >
                      <Plus size={20} />
                    </span>
                  </button>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateRows: open ? "1fr" : "0fr",
                      transition: "grid-template-rows 0.4s ease",
                    }}
                  >
                    <div style={{ overflow: "hidden" }}>
                      <p
                        style={{
                          fontFamily: "'PP Neue Montreal', sans-serif",
                          fontSize: "clamp(15px, 1.2vw, 18px)",
                          lineHeight: 1.6,
                          color: "rgba(10,10,30,0.65)",
                          margin: "0 0 clamp(20px, 2.2vw, 28px)",
                          maxWidth: "640px",
                        }}
                      >
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Form primitives ─── */
function Row({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "clamp(18px, 2vw, 24px)",
      }}
    >
      {children}
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <span
        style={{
          fontFamily: "'PP Neue Montreal', sans-serif",
          fontSize: "12px",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.5)",
        }}
      >
        {label} {required && <span style={{ color: "#f17752" }}>*</span>}
      </span>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        style={{
          background: "transparent",
          border: "none",
          borderBottom: "1px solid rgba(255,255,255,0.2)",
          color: "#fff",
          fontFamily: "'PP Neue Montreal', sans-serif",
          fontSize: "17px",
          padding: "12px 0",
          outline: "none",
          transition: "border-color 0.2s ease",
        }}
        onFocus={(e) => (e.currentTarget.style.borderBottomColor = "#f17752")}
        onBlur={(e) => (e.currentTarget.style.borderBottomColor = "rgba(255,255,255,0.2)")}
      />
    </label>
  );
}

function Select({
  label,
  options,
  value,
  onChange,
  placeholder = "Select one…",
  required,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} style={{ display: "flex", flexDirection: "column", gap: "8px", position: "relative" }}>
      <span
        style={{
          fontFamily: "'PP Neue Montreal', sans-serif",
          fontSize: "12px",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.5)",
        }}
      >
        {label} {required && <span style={{ color: "#f17752" }}>*</span>}
      </span>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          background: "transparent",
          border: "none",
          borderBottom: open ? "1px solid #f17752" : "1px solid rgba(255,255,255,0.2)",
          color: value ? "#fff" : "rgba(255,255,255,0.45)",
          fontFamily: "'PP Neue Montreal', sans-serif",
          fontSize: "17px",
          padding: "12px 0",
          outline: "none",
          cursor: "pointer",
          textAlign: "left",
          transition: "border-color 0.2s ease",
        }}
      >
        <span>{value || placeholder}</span>
        <span
          style={{
            display: "inline-flex",
            color: "rgba(255,255,255,0.6)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.25s ease",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            zIndex: 20,
            background: "rgba(20,10,50,0.95)",
            backdropFilter: "blur(14px)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "14px",
            padding: "6px",
            boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
            maxHeight: "280px",
            overflowY: "auto",
          }}
        >
          {options.map((opt) => {
            const active = opt === value;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "12px 14px",
                  borderRadius: "10px",
                  border: "none",
                  background: active ? "rgba(241,119,82,0.18)" : "transparent",
                  color: active ? "#f17752" : "#fff",
                  fontFamily: "'PP Neue Montreal', sans-serif",
                  fontSize: "15px",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "background 0.15s ease, color 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.background = "transparent";
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TextArea({
  label,
  name,
  placeholder,
  required,
}: {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <span
        style={{
          fontFamily: "'PP Neue Montreal', sans-serif",
          fontSize: "12px",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.5)",
        }}
      >
        {label} {required && <span style={{ color: "#f17752" }}>*</span>}
      </span>
      <textarea
        name={name}
        placeholder={placeholder}
        required={required}
        rows={5}
        style={{
          background: "transparent",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: "14px",
          color: "#fff",
          fontFamily: "'PP Neue Montreal', sans-serif",
          fontSize: "17px",
          padding: "16px 18px",
          outline: "none",
          resize: "vertical",
          transition: "border-color 0.2s ease",
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = "#f17752")}
        onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)")}
      />
    </label>
  );
}

function ChipGroup({
  label,
  options,
  value,
  onChange,
  wrap = false,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  wrap?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <span
        style={{
          fontFamily: "'PP Neue Montreal', sans-serif",
          fontSize: "12px",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.5)",
        }}
      >
        {label}
      </span>
      <div style={{ display: "flex", flexWrap: wrap ? "wrap" : "wrap", gap: "8px" }}>
        {options.map((opt) => {
          const active = value === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(active ? "" : opt)}
              style={{
                padding: "9px 16px",
                borderRadius: "100px",
                border: active ? "1px solid #f17752" : "1px solid rgba(255,255,255,0.18)",
                background: active ? "#f17752" : "transparent",
                color: "#fff",
                fontFamily: "'PP Neue Montreal', sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                cursor: "pointer",
                transition: "background 0.2s ease, border-color 0.2s ease",
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SuccessCard() {
  return (
    <div
      style={{
        padding: "clamp(32px, 4vw, 56px)",
        borderRadius: "22px",
        background: "rgba(107,92,255,0.1)",
        border: "1px solid rgba(107,92,255,0.4)",
        color: "#fff",
      }}
    >
      <p
        style={{
          fontFamily: "'PP Neue Montreal', sans-serif",
          fontSize: "12px",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "#6bff9e",
          margin: "0 0 14px",
        }}
      >
        Got it ✦ Thanks
      </p>
      <h3
        style={{
          fontFamily: "'PP Neue Montreal', 'Inter', system-ui, sans-serif",
          fontSize: "clamp(28px, 3vw, 40px)",
          fontWeight: 500,
          lineHeight: 1.1,
          letterSpacing: "-1px",
          color: "#fff",
          margin: "0 0 16px",
        }}
      >
        Your brief landed safely.
      </h3>
      <p
        style={{
          fontFamily: "'PP Neue Montreal', sans-serif",
          fontSize: "17px",
          lineHeight: 1.6,
          color: "rgba(255,255,255,0.7)",
          margin: 0,
        }}
      >
        We&apos;ll read it properly and reply within one business day — usually sooner. If it&apos;s urgent, email
        hello@anikalabs.com directly.
      </p>
    </div>
  );
}
