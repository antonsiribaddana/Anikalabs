"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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
  const [projectType, setProjectType] = useState("");
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
        background: "linear-gradient(180deg, #0C042A 0%, #110837 30%, #1a1040 55%, #f5f1ea 100%)",
        color: "#fff",
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Large low-contrast background word */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "clamp(60px, 8vw, 120px)",
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          pointerEvents: "none",
          zIndex: 0,
          overflow: "hidden",
        }}
      >
        <span
          style={{
            fontFamily: "'PP Neue Montreal', 'Inter', system-ui, sans-serif",
            fontSize: "clamp(120px, 20vw, 280px)",
            fontWeight: 500,
            letterSpacing: "-0.04em",
            color: "transparent",
            WebkitTextStroke: "1px rgba(255,255,255,0.06)",
            whiteSpace: "nowrap",
            userSelect: "none",
            lineHeight: 1,
          }}
        >
          CONTACT
        </span>
      </div>

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding: "clamp(140px, 14vw, 200px) clamp(20px, 6vw, 112px) clamp(80px, 10vw, 140px)",
          maxWidth: "1320px",
          margin: "0 auto",
        }}
      >

        {/* ── INTRO ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: "clamp(40px, 6vw, 80px)",
            alignItems: "start",
            marginBottom: "clamp(80px, 10vw, 140px)",
            paddingBottom: "clamp(80px, 10vw, 140px)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {/* Left label */}
          <div style={{ paddingTop: "8px" }}>
            <p
              style={{
                fontFamily: "'PP Neue Montreal', sans-serif",
                fontSize: "13px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.4)",
                margin: 0,
              }}
            >
              Get in touch
            </p>
          </div>

          {/* Right — main intro text */}
          <div>
            <p
              style={{
                fontFamily: "'PP Neue Montreal', 'Inter', system-ui, sans-serif",
                fontSize: "clamp(22px, 2.4vw, 36px)",
                fontWeight: 400,
                lineHeight: 1.5,
                letterSpacing: "-0.4px",
                color: "rgba(255,255,255,0.88)",
                margin: "0 0 clamp(24px, 3vw, 36px)",
                maxWidth: "680px",
              }}
            >
              Have a project in mind? We&apos;d love to hear more. Tell us what you&apos;re building and we&apos;ll help you structure it properly from the start.
            </p>
            <p
              style={{
                fontFamily: "'PP Neue Montreal', sans-serif",
                fontSize: "14px",
                letterSpacing: "0.06em",
                color: "rgba(255,255,255,0.35)",
                margin: 0,
                textTransform: "uppercase",
              }}
            >
              hello@anikalabs.com
            </p>
          </div>
        </div>

        {/* ── FORM ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: "clamp(40px, 6vw, 80px)",
            alignItems: "start",
          }}
        >
          {/* Left — form label */}
          <div style={{ paddingTop: "8px" }}>
            <p
              style={{
                fontFamily: "'PP Neue Montreal', sans-serif",
                fontSize: "13px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.4)",
                margin: "0 0 20px",
              }}
            >
              Project brief
            </p>
            <p
              style={{
                fontFamily: "'PP Neue Montreal', 'Inter', system-ui, sans-serif",
                fontSize: "clamp(18px, 1.8vw, 24px)",
                fontWeight: 400,
                lineHeight: 1.45,
                letterSpacing: "-0.3px",
                color: "rgba(255,255,255,0.5)",
                margin: 0,
                maxWidth: "260px",
              }}
            >
              Fill in what you know — we&apos;ll figure out the rest together.
            </p>
          </div>

          {/* Right — form */}
          {submitted ? (
            <SuccessCard />
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "clamp(32px, 3.5vw, 48px)" }}>
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
                <ChipGroup label="Budget" options={BUDGETS} value={budget} onChange={setBudget} />
                <ChipGroup label="Timeline" options={TIMELINES} value={timeline} onChange={setTimeline} />
              </Row>

              <TextArea label="About the project" name="message" required placeholder="What are you trying to build, fix, or figure out?" />

              <label
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "12px",
                  color: "rgba(255,255,255,0.4)",
                  fontFamily: "'PP Neue Montreal', sans-serif",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                <input type="checkbox" required style={{ accentColor: "#f17752", width: "15px", height: "15px" }} />
                I agree to Anika Labs&apos; privacy policy.
              </label>

              <div>
                <button
                  type="submit"
                  style={{
                    background: "#f17752",
                    color: "#fff",
                    border: "none",
                    borderRadius: "100px",
                    padding: "18px 40px",
                    fontFamily: "'PP Neue Montreal', sans-serif",
                    fontSize: "17px",
                    fontWeight: 500,
                    letterSpacing: "0.2px",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "10px",
                    transition: "opacity 0.2s ease, transform 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "0.88";
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
                      flexShrink: 0,
                    }}
                  />
                  Start the project
                </button>
              </div>
            </form>
          )}
        </div>

        {/* ── FAQ ── */}
        <div style={{ marginTop: "clamp(120px, 14vw, 180px)" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr",
              gap: "clamp(40px, 6vw, 80px)",
              alignItems: "start",
              marginBottom: "clamp(40px, 5vw, 64px)",
            }}
          >
            <div style={{ paddingTop: "8px" }}>
              <p
                style={{
                  fontFamily: "'PP Neue Montreal', sans-serif",
                  fontSize: "13px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(10,10,30,0.4)",
                  margin: 0,
                }}
              >
                FAQ
              </p>
            </div>
            <h2
              style={{
                fontFamily: "'PP Neue Montreal', 'Inter', system-ui, sans-serif",
                fontSize: "clamp(32px, 4vw, 56px)",
                fontWeight: 500,
                lineHeight: 1.05,
                letterSpacing: "-1.2px",
                color: "#0a0a1e",
                margin: 0,
              }}
            >
              Questions we hear a lot.
            </h2>
          </div>

          <div style={{ borderTop: "1px solid rgba(10,10,30,0.1)" }}>
            {FAQS.map((item, i) => {
              const open = openFaq === i;
              return (
                <div key={i} style={{ borderBottom: "1px solid rgba(10,10,30,0.1)" }}>
                  <button
                    onClick={() => setOpenFaq(open ? null : i)}
                    style={{
                      all: "unset",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "24px",
                      padding: "clamp(22px, 2.4vw, 30px) 0",
                      width: "100%",
                      fontFamily: "'PP Neue Montreal', 'Inter', system-ui, sans-serif",
                      fontSize: "clamp(17px, 1.6vw, 22px)",
                      fontWeight: 500,
                      color: "#0a0a1e",
                      letterSpacing: "-0.4px",
                    }}
                  >
                    <span>{item.q}</span>
                    <span
                      style={{
                        color: "#f17752",
                        transform: open ? "rotate(45deg)" : "rotate(0deg)",
                        transition: "transform 0.3s ease",
                        display: "inline-flex",
                        flexShrink: 0,
                      }}
                    >
                      <Plus size={18} />
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
                          fontSize: "clamp(15px, 1.2vw, 17px)",
                          lineHeight: 1.7,
                          color: "rgba(10,10,30,0.6)",
                          margin: "0 0 clamp(22px, 2.4vw, 30px)",
                          maxWidth: "680px",
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
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "clamp(24px, 3vw, 40px)",
      }}
    >
      {children}
    </div>
  );
}

function Field({
  label, name, type = "text", placeholder, required,
}: {
  label: string; name: string; type?: string; placeholder?: string; required?: boolean;
}) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <span
        style={{
          fontFamily: "'PP Neue Montreal', sans-serif",
          fontSize: "11px",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.4)",
        }}
      >
        {label}{required && <span style={{ color: "#f17752", marginLeft: "3px" }}>*</span>}
      </span>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        style={{
          background: "transparent",
          border: "none",
          borderBottom: "1px solid rgba(255,255,255,0.15)",
          color: "#fff",
          fontFamily: "'PP Neue Montreal', sans-serif",
          fontSize: "18px",
          padding: "14px 0",
          outline: "none",
          transition: "border-color 0.2s ease",
          width: "100%",
        }}
        onFocus={(e) => (e.currentTarget.style.borderBottomColor = "#f17752")}
        onBlur={(e) => (e.currentTarget.style.borderBottomColor = "rgba(255,255,255,0.15)")}
      />
    </label>
  );
}

function Select({
  label, options, value, onChange, placeholder = "Select one…", required,
}: {
  label: string; options: string[]; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} style={{ display: "flex", flexDirection: "column", gap: "12px", position: "relative" }}>
      <span
        style={{
          fontFamily: "'PP Neue Montreal', sans-serif",
          fontSize: "11px",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.4)",
        }}
      >
        {label}{required && <span style={{ color: "#f17752", marginLeft: "3px" }}>*</span>}
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
          borderBottom: open ? "1px solid #f17752" : "1px solid rgba(255,255,255,0.15)",
          color: value ? "#fff" : "rgba(255,255,255,0.35)",
          fontFamily: "'PP Neue Montreal', sans-serif",
          fontSize: "18px",
          padding: "14px 0",
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
            color: "rgba(255,255,255,0.4)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.25s ease",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            right: 0,
            zIndex: 20,
            background: "rgba(14,6,38,0.97)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "14px",
            padding: "6px",
            boxShadow: "0 32px 64px rgba(0,0,0,0.5)",
            maxHeight: "300px",
            overflowY: "auto",
          }}
        >
          {options.map((opt) => {
            const active = opt === value;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => { onChange(opt); setOpen(false); }}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "13px 16px",
                  borderRadius: "10px",
                  border: "none",
                  background: active ? "rgba(241,119,82,0.15)" : "transparent",
                  color: active ? "#f17752" : "rgba(255,255,255,0.85)",
                  fontFamily: "'PP Neue Montreal', sans-serif",
                  fontSize: "15px",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "background 0.15s ease",
                }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
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
  label, name, placeholder, required,
}: {
  label: string; name: string; placeholder?: string; required?: boolean;
}) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <span
        style={{
          fontFamily: "'PP Neue Montreal', sans-serif",
          fontSize: "11px",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.4)",
        }}
      >
        {label}{required && <span style={{ color: "#f17752", marginLeft: "3px" }}>*</span>}
      </span>
      <textarea
        name={name}
        placeholder={placeholder}
        required={required}
        rows={6}
        style={{
          background: "transparent",
          border: "none",
          borderBottom: "1px solid rgba(255,255,255,0.15)",
          color: "#fff",
          fontFamily: "'PP Neue Montreal', sans-serif",
          fontSize: "18px",
          padding: "14px 0",
          outline: "none",
          resize: "none",
          transition: "border-color 0.2s ease",
          lineHeight: 1.6,
        }}
        onFocus={(e) => (e.currentTarget.style.borderBottomColor = "#f17752")}
        onBlur={(e) => (e.currentTarget.style.borderBottomColor = "rgba(255,255,255,0.15)")}
      />
    </label>
  );
}

function ChipGroup({
  label, options, value, onChange,
}: {
  label: string; options: string[]; value: string; onChange: (v: string) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      <span
        style={{
          fontFamily: "'PP Neue Montreal', sans-serif",
          fontSize: "11px",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.4)",
        }}
      >
        {label}
      </span>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {options.map((opt) => {
          const active = value === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(active ? "" : opt)}
              style={{
                padding: "9px 18px",
                borderRadius: "100px",
                border: active ? "1px solid #f17752" : "1px solid rgba(255,255,255,0.15)",
                background: active ? "#f17752" : "transparent",
                color: active ? "#fff" : "rgba(255,255,255,0.65)",
                fontFamily: "'PP Neue Montreal', sans-serif",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.15s ease",
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
    <div style={{ padding: "clamp(40px, 5vw, 64px) 0" }}>
      <p
        style={{
          fontFamily: "'PP Neue Montreal', sans-serif",
          fontSize: "12px",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.4)",
          margin: "0 0 20px",
        }}
      >
        Received
      </p>
      <h3
        style={{
          fontFamily: "'PP Neue Montreal', 'Inter', system-ui, sans-serif",
          fontSize: "clamp(32px, 4vw, 52px)",
          fontWeight: 500,
          lineHeight: 1.05,
          letterSpacing: "-1.2px",
          color: "#fff",
          margin: "0 0 20px",
        }}
      >
        Your brief landed safely.
      </h3>
      <p
        style={{
          fontFamily: "'PP Neue Montreal', sans-serif",
          fontSize: "17px",
          lineHeight: 1.7,
          color: "rgba(255,255,255,0.55)",
          margin: 0,
          maxWidth: "480px",
        }}
      >
        We&apos;ll read it properly and reply within one business day — usually sooner. If it&apos;s urgent, reach us at hello@anikalabs.com directly.
      </p>
    </div>
  );
}
