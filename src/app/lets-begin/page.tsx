import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Let's Begin — Anika Labs",
  description: "Tell us about your project and we'll get back to you within 24 hours.",
};

export default function LetsBegin() {
  return (
    <main style={{ background: "#02021e", minHeight: "100vh" }}>
      <Contact />
      <Footer />
    </main>
  );
}
