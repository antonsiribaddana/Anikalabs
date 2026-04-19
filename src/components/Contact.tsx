"use client";

import { useState } from "react";

const PROJECT_TYPES = [
  "Website",
  "Brand",
  "Website and Brand",
  "E-commerce",
  "Web application",
  "Automation & AI",
  "Ongoing support",
  "Not sure yet",
];

const BUDGETS = [
  "$2,500–$5,000",
  "$5,000–$10,000",
  "$10,000–$20,000",
  "Above $20,000",
  "Not sure yet",
];

const TIMELINES = ["ASAP", "1–2 months", "3–6 months", "Flexible"];

export default function Contact() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  // Step 1
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [projectType, setProjectType] = useState("");

  // Step 2
  const [project, setProject] = useState("");
  const [unclear, setUnclear] = useState("");
  const [direction, setDirection] = useState("");

  // Step 3
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");

  const canContinue1 = name.trim() && email.trim() && projectType;
  const canContinue2 = project.trim();
  const canSubmit = budget && timeline;

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
      {/* Ambient glow — top right */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "-200px",
          right: "-200px",
          width: "900px",
          height: "900px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(90,40,200,0.35) 0%, transparent 65%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      {/* Ambient glow — bottom left (orange warmth) */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: "-300px",
          left: "-200px",
          width: "1000px",
          height: "1000px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(241,119,82,0.18) 0%, transparent 60%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      {/* Ambient glow — bottom right (vibrant purple) */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: "-250px",
          right: "-150px",
          width: "800px",
          height: "800px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(140,80,255,0.28) 0%, transparent 65%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: "relative",
          width: "100%",
          padding:
            "clamp(140px, 14vw, 200px) clamp(24px, 5vw, 96px) clamp(80px, 10vw, 140px)",
          zIndex: 1,
        }}
      >
        {/* ── Top block: headline + copy ── */}
        <div
          data-transition-reveal
          style={{
            maxWidth: "780px",
            margin: "0 auto clamp(48px, 6vw, 80px)",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "'PP Neue Montreal', sans-serif",
              fontSize: "13px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.45)",
              margin: "0 0 20px",
            }}
          >
            Intake
          </p>
          <h1
            style={{
              fontFamily:
                "'PP Neue Montreal', 'Inter', system-ui, sans-serif",
              fontSize: "clamp(44px, 5.5vw, 88px)",
              fontWeight: 500,
              lineHeight: 1,
              letterSpacing: "-2px",
              color: "#fff",
              margin: "0 0 24px",
            }}
          >
            Let&apos;s begin
          </h1>
          <p
            style={{
              fontFamily: "'PP Neue Montreal', sans-serif",
              fontSize: "clamp(16px, 1.25vw, 18px)",
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.65)",
              margin: 0,
              maxWidth: "560px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            A few focused questions to understand your project. We&apos;ll
            review and get back to you within 24 hours.
          </p>
        </div>

        {/* ── Form card ── */}
        <div
          data-transition-reveal
          style={{
            maxWidth: "820px",
            margin: "0 auto",
            padding: "clamp(32px, 4vw, 56px)",
            borderRadius: "28px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(14px)",
          }}
        >
          {submitted ? (
            <SuccessCard />
          ) : (
            <>
              {/* Step indicator */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "clamp(32px, 4vw, 48px)",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <span
                    style={{
                      fontFamily: "'PP Neue Montreal', sans-serif",
                      fontSize: "12px",
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.45)",
                    }}
                  >
                    Step {step} of 3
                  </span>
                  <span
                    style={{
                      fontFamily: "'PP Neue Montreal', sans-serif",
                      fontSize: "15px",
                      fontWeight: 500,
                      color: "#fff",
                      letterSpacing: "-0.2px",
                    }}
                  >
                    {step === 1 ? "Basics" : step === 2 ? "Project" : "Scope"}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "6px" }}>
                  {[1, 2, 3].map((i) => (
                    <span
                      key={i}
                      style={{
                        width: "24px",
                        height: "2px",
                        background:
                          i <= step ? "#f17752" : "rgba(255,255,255,0.15)",
                        transition: "background 0.3s ease",
                      }}
                    />
                  ))}
                </div>
              </div>

              <form
                onSubmit={handleSubmit}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "clamp(32px, 4vw, 48px)",
                }}
              >
                {step === 1 && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "clamp(28px, 3.5vw, 40px)",
                      animation: "fadeIn 0.35s ease",
                    }}
                  >
                    <div>
                      <QuestionLabel
                        label="How can we reach you?"
                        hint="Required"
                      />
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                          gap: "14px",
                          marginTop: "20px",
                        }}
                        className="lb-fields"
                      >
                        <PillInput
                          value={name}
                          onChange={setName}
                          placeholder="Your name"
                          required
                        />
                        <PillInput
                          value={email}
                          onChange={setEmail}
                          placeholder="Email address"
                          type="email"
                          required
                        />
                        <div style={{ gridColumn: "1 / -1" }}>
                          <PillInput
                            value={company}
                            onChange={setCompany}
                            placeholder="Company or project name"
                          />
                        </div>
                      </div>
                    </div>

                    <CardGroup
                      label="What are you looking for?"
                      hint="Required"
                      options={PROJECT_TYPES}
                      value={projectType}
                      onChange={setProjectType}
                    />
                  </div>
                )}

                {step === 2 && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "clamp(28px, 3.5vw, 40px)",
                      animation: "fadeIn 0.35s ease",
                    }}
                  >
                    <TextAreaField
                      label="Tell us about your project"
                      hint="Required"
                      helper="What the company does and what you want to achieve."
                      value={project}
                      onChange={setProject}
                      placeholder="Briefly describe the business and the outcome you're after."
                      required
                    />
                    <TextAreaField
                      label="What feels unclear right now?"
                      hint="Optional"
                      helper="What feels disconnected, confusing, or missing."
                      value={unclear}
                      onChange={setUnclear}
                      placeholder="Friction points, open questions, or things that aren't working."
                    />
                    <TextAreaField
                      label="What direction are you drawn to?"
                      hint="Optional"
                      helper="References, links, or examples you like."
                      value={direction}
                      onChange={setDirection}
                      placeholder="Share anything that captures the feel you're after."
                    />
                  </div>
                )}

                {step === 3 && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "clamp(28px, 3.5vw, 40px)",
                      animation: "fadeIn 0.35s ease",
                    }}
                  >
                    <CardGroup
                      label="Estimated budget"
                      hint="Required"
                      options={BUDGETS}
                      value={budget}
                      onChange={setBudget}
                    />
                    <CardGroup
                      label="Timeline"
                      hint="Required"
                      options={TIMELINES}
                      value={timeline}
                      onChange={setTimeline}
                    />
                  </div>
                )}

                {/* Nav buttons */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: "clamp(8px, 1vw, 16px)",
                    gap: "16px",
                    flexWrap: "wrap",
                  }}
                >
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={handleBack}
                      style={{
                        background: "transparent",
                        border: "1px solid rgba(255,255,255,0.15)",
                        color: "rgba(255,255,255,0.7)",
                        borderRadius: "100px",
                        padding: "16px 32px",
                        fontFamily: "'PP Neue Montreal', sans-serif",
                        fontSize: "15px",
                        fontWeight: 500,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor =
                          "rgba(255,255,255,0.3)";
                        e.currentTarget.style.color = "#fff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor =
                          "rgba(255,255,255,0.15)";
                        e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                      }}
                    >
                      ← Back
                    </button>
                  ) : (
                    <span />
                  )}

                  {step < 3 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={
                        (step === 1 && !canContinue1) ||
                        (step === 2 && !canContinue2)
                      }
                      style={{
                        background: "#f17752",
                        color: "#fff",
                        border: "none",
                        borderRadius: "100px",
                        padding: "18px 40px",
                        fontFamily: "'PP Neue Montreal', sans-serif",
                        fontSize: "16px",
                        fontWeight: 500,
                        letterSpacing: "0.3px",
                        cursor:
                          (step === 1 && !canContinue1) ||
                          (step === 2 && !canContinue2)
                            ? "not-allowed"
                            : "pointer",
                        opacity:
                          (step === 1 && !canContinue1) ||
                          (step === 2 && !canContinue2)
                            ? 0.4
                            : 1,
                        transition: "opacity 0.2s ease, transform 0.2s ease",
                        marginLeft: "auto",
                      }}
                    >
                      Continue →
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={!canSubmit}
                      style={{
                        background: "#f17752",
                        color: "#fff",
                        border: "none",
                        borderRadius: "100px",
                        padding: "18px 40px",
                        fontFamily: "'PP Neue Montreal', sans-serif",
                        fontSize: "16px",
                        fontWeight: 500,
                        letterSpacing: "0.3px",
                        cursor: canSubmit ? "pointer" : "not-allowed",
                        opacity: canSubmit ? 1 : 0.4,
                        transition: "opacity 0.2s ease, transform 0.2s ease",
                        marginLeft: "auto",
                      }}
                    >
                      Start the project
                    </button>
                  )}
                </div>
              </form>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 640px) {
          .lb-fields {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

/* ─── Primitives ─── */

function QuestionLabel({ label, hint }: { label: string; hint?: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: "10px",
        flexWrap: "wrap",
      }}
    >
      <h3
        style={{
          fontFamily: "'PP Neue Montreal', 'Inter', system-ui, sans-serif",
          fontSize: "clamp(20px, 1.8vw, 26px)",
          fontWeight: 500,
          color: "#fff",
          letterSpacing: "-0.4px",
          margin: 0,
          lineHeight: 1.2,
        }}
      >
        {label}
      </h3>
      {hint && (
        <span
          style={{
            fontFamily: "'PP Neue Montreal', sans-serif",
            fontSize: "13px",
            color:
              hint.toLowerCase() === "required"
                ? "#f17752"
                : "rgba(255,255,255,0.4)",
          }}
        >
          {hint.toLowerCase() === "required" && (
            <span style={{ marginRight: "3px" }}>*</span>
          )}
          {hint}
        </span>
      )}
    </div>
  );
}

function CardGroup({
  label,
  hint,
  options,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <QuestionLabel label={label} hint={hint} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "12px",
          marginTop: "20px",
        }}
      >
        {options.map((opt) => {
          const active = value === opt;
          return (
            <button
              key={opt}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(active ? "" : opt)}
              style={{
                padding: "18px 20px",
                borderRadius: "100px",
                border: active
                  ? "1px solid #f17752"
                  : "1px solid rgba(255,255,255,0.12)",
                background: active ? "#f17752" : "rgba(255,255,255,0.04)",
                color: active ? "#fff" : "rgba(255,255,255,0.85)",
                fontFamily: "'PP Neue Montreal', sans-serif",
                fontSize: "15px",
                fontWeight: 500,
                letterSpacing: "-0.1px",
                cursor: "pointer",
                transition: "all 0.18s ease",
                textAlign: "center",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.borderColor =
                    "rgba(255,255,255,0.22)";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                  e.currentTarget.style.borderColor =
                    "rgba(255,255,255,0.12)";
                }
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

function PillInput({
  value,
  onChange,
  type = "text",
  placeholder,
  required,
}: {
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "100px",
        color: "#fff",
        fontFamily: "'PP Neue Montreal', sans-serif",
        fontSize: "15px",
        padding: "16px 22px",
        outline: "none",
        width: "100%",
        transition: "border-color 0.2s ease, background 0.2s ease",
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = "#f17752";
        e.currentTarget.style.background = "rgba(255,255,255,0.06)";
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
        e.currentTarget.style.background = "rgba(255,255,255,0.04)";
      }}
    />
  );
}

function TextAreaField({
  label,
  hint,
  helper,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  hint?: string;
  helper?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <QuestionLabel label={label} hint={hint} />
      {helper && (
        <p
          style={{
            fontFamily: "'PP Neue Montreal', sans-serif",
            fontSize: "13px",
            color: "rgba(255,255,255,0.4)",
            margin: "8px 0 0",
          }}
        >
          {helper}
        </p>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        rows={4}
        style={{
          width: "100%",
          marginTop: "16px",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "20px",
          color: "#fff",
          fontFamily: "'PP Neue Montreal', sans-serif",
          fontSize: "15px",
          padding: "18px 22px",
          outline: "none",
          resize: "none",
          lineHeight: 1.6,
          transition: "border-color 0.2s ease, background 0.2s ease",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "#f17752";
          e.currentTarget.style.background = "rgba(255,255,255,0.06)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
          e.currentTarget.style.background = "rgba(255,255,255,0.04)";
        }}
      />
    </div>
  );
}

function SuccessCard() {
  return (
    <div style={{ padding: "clamp(24px, 3vw, 40px) 0" }}>
      <p
        style={{
          fontFamily: "'PP Neue Montreal', sans-serif",
          fontSize: "13px",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.45)",
          margin: "0 0 24px",
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
          color: "rgba(255,255,255,0.6)",
          margin: 0,
          maxWidth: "480px",
        }}
      >
        We&apos;ll read it properly and reply within 24 hours. If it&apos;s
        urgent, reach us at hello@anikalabs.com directly.
      </p>
    </div>
  );
}
