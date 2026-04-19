import Footer from "@/components/Footer";
import ResourcesPage from "@/components/ResourcesPage";
import { getAllPosts, getCategories } from "@/sanity/queries";

export const metadata = {
  title: "Resources — Anika Labs",
  description:
    "Essays, case notes, and field reports on design systems, digital products, and building things that work.",
};

export default async function Resources() {
  const [posts, categories] = await Promise.all([getAllPosts(), getCategories()]);
  return (
    <main style={{ background: "#02021e", minHeight: "100vh" }}>
      <ResourcesPage posts={posts} categories={categories} />
      <Footer />
    </main>
  );
}
