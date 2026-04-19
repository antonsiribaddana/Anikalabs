import ServicesPage from "@/components/ServicesPage";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Services — Anika Labs",
  description: "Strategy, design, and engineering built into one continuous system — from rough brief to something that ships.",
};

export default function Services() {
  return (
    <main style={{ background: "#fffbf2", minHeight: "100vh" }}>
      <ServicesPage />
      <Footer />
    </main>
  );
}
