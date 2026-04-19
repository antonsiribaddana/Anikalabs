"use client";

import { useState } from "react";

const PROJECT_TYPES = [
  "Full System Build",
  "Website System",
  "Brand System",
  "E-commerce System",
  "Web Application",
  "Automation & AI",
  "Design & Creative",
  "Ongoing Growth",
  "Not sure yet",
];

const BUDGETS = [
  "$2,500–$5,000",
  "$5,000–$10,000",
  "$10,000–$20,000",
  "Above $20,000",
  "Not sure yet",
];

const TIMELINES = ["ASAP", "1–3 months", "Flexible"];

export default function ContactUs() {
  const [projectTypes, setProjectTypes] = useState<string[]>([]);
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Field values + touched state for silent inline validation
  const [name, setName] = useState("");
  const [nameTouched, setNameTouched] = useState(false);
  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNameTouched(true);
    setEmailTouched(true);
    if (!name.trim() || !emailValid) return;
    setSubmitted(true);
  };

  return (
    <section
      style={{
        position: "relative",
        background:
          "linear-gradient(180deg, #02021e 0%, #0a0532 20%, #140a4a 40%, #1f1066 58%, #2d167f 72%, #3a1d95 85%, #4423a8 100%)",
        color: "#fff",
        minHeight: "100vh",
        overflowX: "clip",
      }}
    >
      {/* Ambient — top right */}
      <div aria-hidden style={{ position:"absolute", top:"-200px", right:"-200px", width:"900px", height:"900px", borderRadius:"50%", background:"radial-gradient(circle, rgba(90,40,200,0.3) 0%, transparent 65%)", pointerEvents:"none", zIndex:0 }} />
      {/* Ambient — bottom left */}
      <div aria-hidden style={{ position:"absolute", bottom:"-400px", left:"-400px", width:"1000px", height:"1000px", borderRadius:"50%", background:"radial-gradient(circle, rgba(241,119,82,0.14) 0%, transparent 60%)", pointerEvents:"none", zIndex:0 }} />
      {/* Ambient — bottom right */}
      <div aria-hidden style={{ position:"absolute", bottom:"-250px", right:"-150px", width:"800px", height:"800px", borderRadius:"50%", background:"radial-gradient(circle, rgba(140,80,255,0.22) 0%, transparent 65%)", pointerEvents:"none", zIndex:0 }} />

      <div
        style={{
          position: "relative",
          width: "100%",
          padding: "clamp(140px, 14vw, 200px) clamp(20px, 6vw, 112px) clamp(80px, 10vw, 140px)",
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.1fr)",
            gap: "clamp(48px, 6vw, 96px)",
            alignItems: "start",
            position: "relative",
          }}
          className="contact-grid"
        >

          {/* ── LEFT: sticky ── */}
          <aside
            style={{
              position: "sticky",
              top: "clamp(100px, 12vw, 140px)",
              display: "flex",
              flexDirection: "column",
              gap: "clamp(28px, 3.5vw, 40px)",
            }}
            className="contact-sidebar"
          >
            <h1 data-transition-reveal style={{
              fontFamily: "'PP Neue Montreal', 'Inter', system-ui, sans-serif",
              fontSize: "clamp(44px, 5.5vw, 88px)",
              fontWeight: 500,
              lineHeight: 1,
              letterSpacing: "-2px",
              color: "#fff",
              margin: 0,
            }}>
              Share Your<br />Idea With Us
            </h1>

            <p style={{
              fontFamily: "'PP Neue Montreal', sans-serif",
              fontSize: "clamp(16px, 1.2vw, 18px)",
              lineHeight: 1.65,
              color: "rgba(255,255,255,0.55)",
              margin: 0,
              maxWidth: "520px",
            }}>
              Have a project in mind? Tell us what you&apos;re building. We&apos;ll
              help shape it into something clear, structured, and ready to perform.
            </p>

            {/* Availability — separated by hairline, deemphasised */}
            <div style={{
              paddingTop: "clamp(20px, 2.4vw, 28px)",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{
                  width: "6px", height: "6px", borderRadius: "50%",
                  background: "#6bff9e",
                  display: "inline-block", flexShrink: 0,
                }} />
                <span style={{
                  fontFamily: "'PP Neue Montreal', sans-serif",
                  fontSize: "12px",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.45)",
                }}>
                  2 spots available
                </span>
              </div>

              <p style={{
                fontFamily: "'PP Neue Montreal', sans-serif",
                fontSize: "clamp(14px, 1.1vw, 16px)",
                lineHeight: 1.6,
                color: "rgba(255,255,255,0.5)",
                margin: 0,
                maxWidth: "480px",
              }}>
                We take on a limited number of projects each quarter to stay focused and deliver with care.
                Every inquiry is reviewed personally.
              </p>
            </div>

            {/* Direct email */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={{
                fontFamily: "'PP Neue Montreal', sans-serif",
                fontSize: "11px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.28)",
              }}>
                Prefer email?
              </span>
              <a
                href="mailto:hello@anikalabs.com"
                style={{
                  fontFamily: "'PP Neue Montreal', sans-serif",
                  fontSize: "17px",
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.8)",
                  textDecoration: "none",
                  borderBottom: "1px solid rgba(255,255,255,0.15)",
                  paddingBottom: "3px",
                  alignSelf: "flex-start",
                  transition: "color 0.2s ease, border-color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#f17752";
                  e.currentTarget.style.borderBottomColor = "#f17752";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(255,255,255,0.8)";
                  e.currentTarget.style.borderBottomColor = "rgba(255,255,255,0.15)";
                }}
              >
                hello@anikalabs.com
              </a>
            </div>
          </aside>

          {/* ── RIGHT: scrolling form ── */}
          <div style={{ paddingTop: "4px" }} className="contact-form-col">
            {submitted ? (
              <SuccessCard />
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "clamp(52px, 6vw, 72px)",
                }}
              >
                {/* What are you looking for — multi select */}
                <div>
                  <SectionLabel>What are you looking for?</SectionLabel>
                  <MultiOptionGroup
                    options={PROJECT_TYPES}
                    value={projectTypes}
                    onChange={setProjectTypes}
                    cols={3}
                  />
                </div>

                {/* Budget */}
                <div>
                  <SectionLabel>Estimated budget</SectionLabel>
                  <OptionGroup
                    options={BUDGETS}
                    value={budget}
                    onChange={setBudget}
                    cols={3}
                  />
                </div>

                {/* Timeline */}
                <div>
                  <SectionLabel>Timeline</SectionLabel>
                  <OptionGroup
                    options={TIMELINES}
                    value={timeline}
                    onChange={setTimeline}
                    cols={3}
                  />
                </div>

                {/* Contact fields */}
                <div>
                  <SectionLabel>How can we contact you?</SectionLabel>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                      gap: "0 24px",
                      marginTop: "24px",
                    }}
                    className="contact-fields"
                  >
                    <FieldInput
                      placeholder="Your name"
                      value={name}
                      onChange={(v) => { setName(v); }}
                      onBlur={() => setNameTouched(true)}
                      error={nameTouched && !name.trim() ? "Let us know your name" : ""}
                    />
                    <FieldInput
                      placeholder="Company"
                      value={company}
                      onChange={setCompany}
                    />
                    <FieldInput
                      placeholder="Email address"
                      type="email"
                      value={email}
                      onChange={(v) => { setEmail(v); }}
                      onBlur={() => setEmailTouched(true)}
                      error={emailTouched && email && !emailValid ? "Check the email format" : ""}
                    />
                    <FieldInput
                      placeholder="Phone"
                      value={phone}
                      onChange={setPhone}
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <SectionLabel>Tell us more about the project</SectionLabel>
                  <textarea
                    rows={5}
                    placeholder="What are you trying to build, fix, or figure out?"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={{
                      width: "100%",
                      marginTop: "24px",
                      background: "transparent",
                      border: "none",
                      borderBottom: "1px solid rgba(255,255,255,0.12)",
                      color: "#fff",
                      fontFamily: "'PP Neue Montreal', sans-serif",
                      fontSize: "15px",
                      padding: "14px 0",
                      outline: "none",
                      resize: "none",
                      lineHeight: 1.7,
                      transition: "border-color 0.2s ease",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderBottomColor = "rgba(255,255,255,0.35)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderBottomColor = "rgba(255,255,255,0.12)";
                    }}
                  />
                </div>

                {/* Submit */}
                <div>
                  <button
                    type="submit"
                    style={{
                      background: "#f17752",
                      color: "#fff",
                      border: "none",
                      borderRadius: "100px",
                      padding: "17px 40px",
                      fontFamily: "'PP Neue Montreal', sans-serif",
                      fontSize: "16px",
                      fontWeight: 500,
                      letterSpacing: "0.2px",
                      cursor: "pointer",
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
                    Start the project
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .contact-form-col {
          border-left: 1px solid rgba(255,255,255,0.07);
          padding-left: clamp(32px, 4vw, 64px);
        }
        @media (max-width: 900px) {
          .contact-grid { grid-template-columns: 1fr !important; gap: 64px !important; }
          .contact-form-col { border-left: none !important; padding-left: 0 !important; }
          .contact-sidebar { position: relative !important; top: auto !important; }
          .contact-fields { grid-template-columns: 1fr !important; }
          .option-group { grid-template-columns: repeat(2, minmax(0,1fr)) !important; }
        }
        ::placeholder { color: rgba(255,255,255,0.28); }

        /* Ticker border animation on hover */
        .ticker-btn {
          --p: 0%;
          background-image: none;
        }
        .ticker-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 8px;
          padding: 1px;
          background: conic-gradient(
            from 0deg,
            rgba(241,119,82,0.9) var(--p),
            rgba(255,255,255,0.08) var(--p)
          );
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.15s ease;
        }
        .ticker-btn:hover::before {
          opacity: 1;
          animation: borderTick 0.6s linear forwards;
        }
        .ticker-active::before {
          opacity: 1 !important;
          animation: none !important;
          background: conic-gradient(
            from 0deg,
            rgba(241,119,82,0.7) 100%,
            rgba(241,119,82,0.7) 100%
          ) !important;
        }
        @keyframes borderTick {
          from { --p: 0%; }
          to   { --p: 100%; }
        }
        @property --p {
          syntax: '<percentage>';
          inherits: false;
          initial-value: 0%;
        }
      `}</style>
    </section>
  );
}

/* ─── Section label ─── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 style={{
      fontFamily: "'PP Neue Montreal', 'Inter', system-ui, sans-serif",
      fontSize: "clamp(22px, 1.8vw, 28px)",
      fontWeight: 500,
      color: "#fff",
      letterSpacing: "-0.3px",
      margin: 0,
      lineHeight: 1.2,
    }}>
      {children}
    </h3>
  );
}

/* ─── Option buttons (single-select) with ticker hover ─── */

function OptionGroup({
  options,
  value,
  onChange,
  cols = 3,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  cols?: number;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gap: "8px",
        marginTop: "18px",
      }}
      className="option-group"
    >
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(active ? "" : opt)}
            className={`ticker-btn${active ? " ticker-active" : ""}`}
            style={{
              padding: "13px 16px",
              borderRadius: "8px",
              border: active
                ? "1px solid rgba(241,119,82,0.55)"
                : "1px solid rgba(255,255,255,0.08)",
              background: active
                ? "rgba(241,119,82,0.1)"
                : "rgba(255,255,255,0.02)",
              color: active ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.48)",
              fontFamily: "'PP Neue Montreal', sans-serif",
              fontSize: "15px",
              fontWeight: active ? 500 : 400,
              cursor: "pointer",
              transition: "color 0.15s ease, background 0.15s ease",
              textAlign: "center",
              lineHeight: 1.3,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

/* ─── Multi-select option group (project type) with ticker hover ─── */

function MultiOptionGroup({
  options,
  value,
  onChange,
  cols = 3,
}: {
  options: string[];
  value: string[];
  onChange: (v: string[]) => void;
  cols?: number;
}) {
  const toggle = (opt: string) => {
    onChange(value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt]);
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gap: "8px",
        marginTop: "18px",
      }}
      className="option-group"
    >
      {options.map((opt) => {
        const active = value.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            aria-pressed={active}
            onClick={() => toggle(opt)}
            className={`ticker-btn${active ? " ticker-active" : ""}`}
            style={{
              padding: "13px 16px",
              borderRadius: "8px",
              border: active
                ? "1px solid rgba(241,119,82,0.55)"
                : "1px solid rgba(255,255,255,0.08)",
              background: active
                ? "rgba(241,119,82,0.1)"
                : "rgba(255,255,255,0.02)",
              color: active ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.48)",
              fontFamily: "'PP Neue Montreal', sans-serif",
              fontSize: "15px",
              fontWeight: active ? 500 : 400,
              cursor: "pointer",
              transition: "color 0.15s ease, background 0.15s ease",
              textAlign: "center",
              lineHeight: 1.3,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

/* ─── Underline text input with silent inline error ─── */

function FieldInput({
  placeholder,
  type = "text",
  value,
  onChange,
  onBlur,
  error,
}: {
  placeholder?: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  error?: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", marginBottom: "28px" }}>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        style={{
          background: "transparent",
          border: "none",
          borderBottom: `1px solid ${error ? "rgba(241,119,82,0.5)" : "rgba(255,255,255,0.12)"}`,
          color: "#fff",
          fontFamily: "'PP Neue Montreal', sans-serif",
          fontSize: "15px",
          padding: "12px 0",
          outline: "none",
          width: "100%",
          transition: "border-color 0.2s ease",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderBottomColor = error
            ? "rgba(241,119,82,0.6)"
            : "rgba(255,255,255,0.35)";
        }}
        onBlurCapture={(e) => {
          e.currentTarget.style.borderBottomColor = error
            ? "rgba(241,119,82,0.5)"
            : "rgba(255,255,255,0.12)";
        }}
      />
      {error && (
        <span style={{
          fontFamily: "'PP Neue Montreal', sans-serif",
          fontSize: "12px",
          color: "rgba(241,119,82,0.7)",
          marginTop: "6px",
          letterSpacing: "0.01em",
        }}>
          {error}
        </span>
      )}
    </div>
  );
}

/* ─── Success state ─── */

function SuccessCard() {
  return (
    <div style={{ paddingTop: "clamp(24px, 3vw, 40px)" }}>
      <p style={{
        fontFamily: "'PP Neue Montreal', sans-serif",
        fontSize: "12px",
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.35)",
        margin: "0 0 24px",
      }}>
        Received
      </p>
      <h3 style={{
        fontFamily: "'PP Neue Montreal', 'Inter', system-ui, sans-serif",
        fontSize: "clamp(32px, 4vw, 52px)",
        fontWeight: 500,
        lineHeight: 1.05,
        letterSpacing: "-1.2px",
        color: "#fff",
        margin: "0 0 20px",
      }}>
        Your brief landed safely.
      </h3>
      <p style={{
        fontFamily: "'PP Neue Montreal', sans-serif",
        fontSize: "17px",
        lineHeight: 1.7,
        color: "rgba(255,255,255,0.55)",
        margin: 0,
        maxWidth: "480px",
      }}>
        We&apos;ll read it properly and reply within one business day — usually
        sooner. If it&apos;s urgent, reach us at hello@anikalabs.com directly.
      </p>
    </div>
  );
}
