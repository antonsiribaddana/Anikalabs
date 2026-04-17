"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Build & Growth card — live CLI-style panel.
 * A single "intent" line types out, then system setup steps appear one by
 * one with a soft glow pulse. Final status lines include a live indicator.
 *
 * Loops: after the full sequence completes, the panel fades, resets, and replays.
 */

const INTENT = "Build a system that captures leads, processes orders, and drives consistent growth.";

const STEPS = [
  "Traffic sources connected",
  "Platform and CMS configured",
  "Conversion paths defined",
  "Automations activated",
  "Tracking and optimization live",
  "Reporting scheduled",
];

const FINAL = [
  "System initialized",
  "Leads flowing",
  "Performance tracking active",
];

const ROTATING_STATUSES = [
  "Performance tracking active",
  "Syncing analytics",
  "Optimizing conversion paths",
  "Monitoring live sessions",
  "Indexing new content",
];

export default function BuildCLI() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const intentEl = root.querySelector<HTMLSpanElement>(".cli-intent");
    const caretEl = root.querySelector<HTMLSpanElement>(".cli-caret");
    const stepEls = root.querySelectorAll<HTMLDivElement>(".cli-step");
    const finalEls = root.querySelectorAll<HTMLDivElement>(".cli-final");
    const finalGroup = root.querySelector<HTMLDivElement>(".cli-final-group");
    const liveDot = root.querySelector<HTMLSpanElement>(".cli-live-dot");
    const rotatingTextEl = root.querySelector<HTMLSpanElement>(".cli-rotating-text");
    const metricsGroup = root.querySelector<HTMLDivElement>(".cli-metrics");
    const leadsEl = root.querySelector<HTMLSpanElement>(".cli-leads");
    const ordersEl = root.querySelector<HTMLSpanElement>(".cli-orders");

    if (!intentEl) return;

    const ctx = gsap.context(() => {
      const buildTimeline = () => {
        const tl = gsap.timeline();

        // Reset state
        tl.call(() => { intentEl.textContent = ""; });
        tl.set(stepEls, { opacity: 0, x: -8, filter: "blur(6px)" });
        tl.set(finalEls, { opacity: 0, y: 6 });
        tl.set(finalGroup, { opacity: 1 });
        tl.set(caretEl, { opacity: 1 });
        if (metricsGroup) tl.set(metricsGroup, { opacity: 0, y: 6 });
        if (liveDot) tl.set(liveDot, { opacity: 0, scale: 0.6 });

        // Typewriter effect for intent
        const chars = INTENT.split("");
        const perChar = reduce ? 0 : 0.018;
        chars.forEach((ch) => {
          tl.call(() => {
            intentEl.textContent = (intentEl.textContent || "") + ch;
          }, [], `+=${perChar}`);
        });

        // Brief pause after intent, caret stops blinking once steps begin
        tl.to({}, { duration: 0.5 });

        // Steps reveal one by one with glow pulse
        stepEls.forEach((el) => {
          const check = el.querySelector(".cli-check");
          tl.to(el, {
            opacity: 1,
            x: 0,
            filter: "blur(0px)",
            duration: 0.45,
            ease: "power2.out",
          });
          if (check) {
            tl.fromTo(
              check,
              { scale: 0.3, opacity: 0 },
              { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(2.2)" },
              "<0.05"
            );
          }
          // Soft glow pulse
          tl.to(
            el,
            {
              boxShadow: "inset 0 0 0 1px rgba(120,180,255,0.28), 0 0 24px -4px rgba(110,160,255,0.35)",
              duration: 0.25,
              yoyo: true,
              repeat: 1,
              ease: "sine.inOut",
            },
            "<"
          );
          tl.to({}, { duration: 0.35 });
        });

        // Gap before final status
        tl.to({}, { duration: 0.8 });

        // Final lines appear
        finalEls.forEach((el) => {
          tl.to(el, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "power2.out",
          });
          tl.to({}, { duration: 0.2 });
        });

        // Live dot appears and starts pulsing
        if (liveDot) {
          tl.to(liveDot, {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            ease: "back.out(2)",
          });
          tl.to(
            liveDot,
            {
              boxShadow: "0 0 0 6px rgba(80,220,140,0)",
              scale: 1.15,
              duration: 1.0,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            },
            "<"
          );
        }

        // Metrics row fades in after the live dot
        if (metricsGroup) {
          tl.to(metricsGroup, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
          }, "+=0.4");
        }

        // Kick off live-feel ambient loops (numbers + rotating status)
        tl.call(() => {
          startAmbientLoops();
        });

        return tl;
      };

      // --- Ambient live loops (run after the sequence completes) ---
      const ambientTweens: gsap.core.Tween[] = [];

      const startAmbientLoops = () => {
        // 1. Number tickers — leads and orders occasionally bump up
        const leadsState = { value: 24 };
        const ordersState = { value: 12 };

        const bumpLeads = () => {
          leadsState.value += 1;
          if (leadsEl) {
            gsap.fromTo(
              leadsEl,
              { color: "#7fe4a5" },
              { color: "#eaf1ff", duration: 1.4, ease: "power2.out" }
            );
            leadsEl.textContent = String(leadsState.value);
          }
          ambientTweens.push(
            gsap.delayedCall(gsap.utils.random(4.5, 8.5), bumpLeads) as unknown as gsap.core.Tween
          );
        };

        const bumpOrders = () => {
          ordersState.value += 1;
          if (ordersEl) {
            gsap.fromTo(
              ordersEl,
              { color: "#7fe4a5" },
              { color: "#eaf1ff", duration: 1.4, ease: "power2.out" }
            );
            ordersEl.textContent = String(ordersState.value);
          }
          ambientTweens.push(
            gsap.delayedCall(gsap.utils.random(7, 12), bumpOrders) as unknown as gsap.core.Tween
          );
        };

        ambientTweens.push(
          gsap.delayedCall(gsap.utils.random(3, 5), bumpLeads) as unknown as gsap.core.Tween,
          gsap.delayedCall(gsap.utils.random(5, 8), bumpOrders) as unknown as gsap.core.Tween
        );

        // 2. Rotating status line — cycle through variants
        let rotIdx = 0;
        const rotate = () => {
          rotIdx = (rotIdx + 1) % ROTATING_STATUSES.length;
          if (rotatingTextEl) {
            gsap.to(rotatingTextEl, {
              opacity: 0,
              y: -3,
              duration: 0.35,
              ease: "power2.in",
              onComplete: () => {
                rotatingTextEl.textContent = ROTATING_STATUSES[rotIdx];
                gsap.fromTo(
                  rotatingTextEl,
                  { opacity: 0, y: 3 },
                  { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
                );
              },
            });
          }
          ambientTweens.push(
            gsap.delayedCall(gsap.utils.random(4, 6), rotate) as unknown as gsap.core.Tween
          );
        };
        ambientTweens.push(
          gsap.delayedCall(3.5, rotate) as unknown as gsap.core.Tween
        );
      };

      buildTimeline();

      // Caret blink — independent of the main timeline
      if (caretEl) {
        gsap.to(caretEl, {
          opacity: 0,
          duration: 0.55,
          repeat: -1,
          yoyo: true,
          ease: "steps(1)",
        });
      }
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background:
          "radial-gradient(ellipse at 20% 0%, #252540 0%, #1a1a30 55%, #10101f 100%)",
        overflow: "hidden",
        padding: "clamp(20px, 2vw, 28px) clamp(22px, 2.2vw, 32px)",
        fontFamily: "'IBM Plex Mono', 'JetBrains Mono', ui-monospace, monospace",
        color: "#c9d5ee",
      }}
    >
      {/* Soft glow blob top-left */}
      <div
        style={{
          position: "absolute",
          top: "-30%",
          left: "-15%",
          width: "60%",
          height: "80%",
          background:
            "radial-gradient(circle at 40% 40%, rgba(80,130,220,0.18) 0%, rgba(80,130,220,0) 60%)",
          filter: "blur(30px)",
          pointerEvents: "none",
        }}
      />

      {/* Window chrome */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "clamp(16px, 1.6vw, 22px)",
        }}
      >
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <span
            key={c}
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: c,
              opacity: 0.85,
            }}
          />
        ))}
        <span
          style={{
            marginLeft: 14,
            fontSize: 11,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "rgba(180,200,230,0.55)",
          }}
        >
          Anika Labs · Build Console
        </span>
      </div>

      {/* Intent line */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 10,
          marginBottom: "clamp(18px, 1.8vw, 26px)",
          fontSize: "clamp(13px, 1vw, 15px)",
          lineHeight: 1.55,
          color: "#eaf1ff",
          letterSpacing: "-0.005em",
        }}
      >
        <span style={{ color: "#6ea7ff", flexShrink: 0, fontWeight: 500 }}>›</span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span className="cli-intent"></span>
          <span
            className="cli-caret"
            style={{
              display: "inline-block",
              width: 7,
              height: "1em",
              verticalAlign: "text-bottom",
              background: "#6ea7ff",
              marginLeft: 2,
              transform: "translateY(2px)",
            }}
          />
        </span>
      </div>

      {/* Steps */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {STEPS.map((step) => (
          <div
            key={step}
            className="cli-step"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 14px",
              borderRadius: 8,
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(120,160,220,0.08)",
              fontSize: "clamp(12px, 0.92vw, 14px)",
              color: "#b8c6e2",
              letterSpacing: "-0.005em",
            }}
          >
            <span
              className="cli-check"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: "rgba(80,220,140,0.14)",
                border: "1px solid rgba(80,220,140,0.4)",
                color: "#7fe4a5",
                fontSize: 10,
                flexShrink: 0,
                lineHeight: 1,
              }}
            >
              ✓
            </span>
            <span>{step}</span>
          </div>
        ))}
      </div>

      {/* Final status group */}
      <div
        className="cli-final-group"
        style={{
          marginTop: "clamp(18px, 1.8vw, 24px)",
          paddingTop: "clamp(14px, 1.4vw, 18px)",
          borderTop: "1px dashed rgba(120,160,220,0.16)",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        {FINAL.map((line, idx) => {
          const isLast = idx === FINAL.length - 1;
          return (
            <div
              key={line}
              className="cli-final"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: "clamp(12px, 0.92vw, 14px)",
                color: "#d9e4fa",
                fontWeight: 500,
                letterSpacing: "-0.005em",
              }}
            >
              <span style={{ color: "rgba(126,170,250,0.7)" }}>›</span>
              {isLast ? (
                <span
                  className="cli-rotating-text"
                  style={{ display: "inline-block" }}
                >
                  {line}
                </span>
              ) : (
                <span>{line}</span>
              )}
              {isLast && (
                <span
                  className="cli-live-dot"
                  style={{
                    display: "inline-block",
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#5cd68f",
                    marginLeft: 6,
                    boxShadow: "0 0 0 0 rgba(80,220,140,0.6)",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Live metrics — numbers tick up over time */}
      <div
        className="cli-metrics"
        style={{
          marginTop: "clamp(14px, 1.4vw, 20px)",
          paddingTop: "clamp(12px, 1.2vw, 16px)",
          borderTop: "1px dashed rgba(120,160,220,0.1)",
          display: "flex",
          gap: "clamp(24px, 3vw, 40px)",
          fontSize: "clamp(11px, 0.82vw, 13px)",
          color: "rgba(180,200,230,0.7)",
          letterSpacing: "-0.005em",
        }}
      >
        <div>
          Leads today:{" "}
          <span
            className="cli-leads"
            style={{ color: "#eaf1ff", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}
          >
            24
          </span>
        </div>
        <div>
          Orders processed:{" "}
          <span
            className="cli-orders"
            style={{ color: "#eaf1ff", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}
          >
            12
          </span>
        </div>
      </div>
    </div>
  );
}
