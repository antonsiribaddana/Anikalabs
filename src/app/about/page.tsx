import AboutPage from "@/components/AboutPage";
import Footer from "@/components/Footer";

export const metadata = {
  title: "About — Anika Labs",
  description:
    "A small studio of designers and engineers building digital systems that feel considered, work well, and hold up over time.",
};

export default function About() {
  return (
    <main style={{ background: "#02021e", minHeight: "100vh" }}>
      <AboutPage />
      <Footer />
    </main>
  );
}
