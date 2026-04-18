"use client";

import { useState } from "react";

export default function Contact() {
  const [projectType, setProjectType] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact-us" style={{ background: "#fff", padding: "clamp(80px, 10vw, 160px) clamp(20px, 6vw, 112px)" }}>
      <div style={{ maxWidth: "680px", margin: "0 auto" }}>

        {/* Heading */}
        <h2 style={{
          fontFamily: "'PP Neue Montreal', 'Inter', system-ui, sans-serif",
          fontSize: "clamp(42px, 6vw, 88px)",
          fontWeight: 500,
          color: "#111",
          lineHeight: 1.02,
          letterSpacing: "-1.5px",
          marginBottom: "clamp(20px, 2.5vw, 32px)",
        }}>
          Let's begin.
        </h2>

        {/* Intro */}
        <p style={{
          fontFamily: "'PP Neue Montreal', sans-serif",
          fontSize: "clamp(15px, 1.4vw, 18px)",
          color: "#888",
          lineHeight: 1.7,
          marginBottom: "clamp(48px, 6vw, 80px)",
          fontWeight: 400,
        }}>
          A few quick questions to get clarity.<br />
          We'll review and get back to you within 24 hours.
        </p>

        {submitted ? (
          <div style={{ padding: "48px 0" }}>
            <p style={{
              fontFamily: "'PP Neue Montreal', 'Inter', system-ui, sans-serif",
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: 500,
              color: "#111",
              lineHeight: 1.1,
              marginBottom: "16px",
            }}>
              We got it.
            </p>
            <p style={{
              fontFamily: "'PP Neue Montreal', sans-serif",
              fontSize: "17px",
              color: "#888",
              fontWeight: 400,
            }}>
              We'll be in touch within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "clamp(40px, 5vw, 64px)" }}>

            {/* Name */}
            <div style={fieldWrap}>
              <label style={labelStyle}>What should we call you?</label>
              <input required type="text" placeholder="Your name" style={inputStyle} />
            </div>

            {/* Email */}
            <div style={fieldWrap}>
              <label style={labelStyle}>Where can we reach you?</label>
              <input required type="email" placeholder="your@email.com" style={inputStyle} />
            </div>

            {/* Company */}
            <div style={fieldWrap}>
              <label style={labelStyle}>What are we working on?</label>
              <input type="text" placeholder="Company or project name" style={inputStyle} />
            </div>

            {/* Project type */}
            <div style={fieldWrap}>
              <label style={labelStyle}>What are you looking for?</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "4px" }}>
                {["Website", "Branding", "Both", "Not sure yet"].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setProjectType(opt)}
                    style={{
                      padding: "12px 24px",
                      borderRadius: "100px",
                      border: projectType === opt ? "1.5px solid #111" : "1.5px solid #ddd",
                      background: projectType === opt ? "#111" : "#fff",
                      color: projectType === opt ? "#fff" : "#555",
                      fontFamily: "'PP Neue Montreal', sans-serif",
                      fontSize: "15px",
                      fontWeight: 500,
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div style={fieldWrap}>
              <label style={labelStyle}>Tell us a bit about it</label>
              <p style={helperStyle}>What does your company do and what are you trying to achieve?</p>
              <textarea rows={4} placeholder="Describe your project..." style={textareaStyle} />
            </div>

            {/* Problem clarity */}
            <div style={fieldWrap}>
              <label style={labelStyle}>What feels unclear right now?</label>
              <p style={helperStyle}>What's not working, confusing, or missing?</p>
              <textarea rows={4} placeholder="Describe the problem..." style={textareaStyle} />
            </div>

            {/* Creative direction */}
            <div style={fieldWrap}>
              <label style={labelStyle}>What kind of direction are you drawn to?</label>
              <p style={helperStyle}>Mood, references, or anything you like. Links are welcome.</p>
              <textarea rows={4} placeholder="References, links, vibes..." style={textareaStyle} />
            </div>

            {/* Timeline */}
            <div style={fieldWrap}>
              <label style={labelStyle}>When would you like this ready?</label>
              <input type="text" placeholder="e.g. End of May, Q3, ASAP..." style={inputStyle} />
            </div>

            {/* Submit */}
            <div style={{ paddingTop: "8px" }}>
              <button
                type="submit"
                style={{
                  background: "#f17752",
                  color: "#fff",
                  border: "none",
                  borderRadius: "100px",
                  padding: "18px 48px",
                  fontFamily: "'PP Neue Montreal', sans-serif",
                  fontSize: "17px",
                  fontWeight: 600,
                  cursor: "pointer",
                  letterSpacing: "-0.01em",
                  transition: "opacity 0.15s ease",
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
              >
                Send →
              </button>
            </div>

          </form>
        )}
      </div>
    </section>
  );
}

const fieldWrap: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const labelStyle: React.CSSProperties = {
  fontFamily: "'Neue Haas Grotesk', sans-serif",
  fontSize: "clamp(20px, 2.5vw, 28px)",
  fontWeight: 300,
  color: "#111",
  lineHeight: 1.2,
  letterSpacing: "-0.3px",
};

const helperStyle: React.CSSProperties = {
  fontFamily: "'PP Neue Montreal', sans-serif",
  fontSize: "14px",
  color: "#aaa",
  margin: 0,
  fontWeight: 400,
  lineHeight: 1.5,
};

const inputStyle: React.CSSProperties = {
  border: "none",
  borderBottom: "1.5px solid #e5e5e5",
  borderRadius: 0,
  padding: "14px 0",
  fontFamily: "'PP Neue Montreal', sans-serif",
  fontSize: "16px",
  color: "#111",
  background: "transparent",
  outline: "none",
  width: "100%",
  fontWeight: 400,
  transition: "border-color 0.15s ease",
};

const textareaStyle: React.CSSProperties = {
  border: "none",
  borderBottom: "1.5px solid #e5e5e5",
  borderRadius: 0,
  padding: "14px 0",
  fontFamily: "'PP Neue Montreal', sans-serif",
  fontSize: "16px",
  color: "#111",
  background: "transparent",
  outline: "none",
  width: "100%",
  fontWeight: 400,
  resize: "none",
  lineHeight: 1.6,
};
