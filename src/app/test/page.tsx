"use client";

import { WorkCard, projects } from "@/components/Work";

export default function TestPage() {
  const gotta = projects.find((p) => p.title === "SEC Recruiting Agency")!;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#02021e",
        padding: "clamp(60px, 8vw, 120px) clamp(20px, 5vw, 80px)",
        color: "#fff",
        fontFamily: "'PP Neue Montreal', sans-serif",
      }}
    >
      {/* Exactly the same row layout as the homepage full-size card */}
      <div style={{ display: "flex", gap: "16px" }}>
        <WorkCard project={gotta} disableAnimatedBg />
      </div>
    </main>
  );
}
