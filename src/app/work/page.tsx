import WorkPage from "@/components/WorkPage";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Work — Anika Labs",
  description: "Selected projects — systems, products, and brand worlds designed and built with intent.",
};

export default function Work() {
  return (
    <main style={{ background: "#fffbf2", minHeight: "100vh" }}>
      <WorkPage />
      <Footer />
    </main>
  );
}
