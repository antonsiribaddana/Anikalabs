import Contact from "@/components/Contact";

export const metadata = {
  title: "Let's Begin — Anika Labs",
  description: "Tell us about your project and we'll get back to you within 24 hours.",
};

export default function LetsBegin() {
  return (
    <main style={{ background: "#fff", minHeight: "100vh" }}>
      <Contact />
    </main>
  );
}
