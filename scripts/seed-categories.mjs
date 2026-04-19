import { createClient } from "@sanity/client";

const token = process.env.SANITY_WRITE_TOKEN;
if (!token) {
  console.error("Missing SANITY_WRITE_TOKEN env var");
  process.exit(1);
}

const client = createClient({
  projectId: "myj2exhy",
  dataset: "production",
  apiVersion: "2024-10-01",
  token,
  useCdn: false,
});

const categories = [
  { title: "Systems",        slug: "systems",         order: 10, description: "How pieces connect — the underlying architecture of a product." },
  { title: "Structure",      slug: "structure",       order: 20, description: "Information hierarchy and how people navigate." },
  { title: "User Flow",      slug: "user-flow",       order: 30, description: "Paths, friction, and the rhythm of interaction." },
  { title: "Brand Thinking", slug: "brand-thinking",  order: 40, description: "Identity, voice, and how a product feels." },
  { title: "Execution",      slug: "execution",       order: 50, description: "Craft, polish, and the detail that separates good from great." },
  { title: "Growth",         slug: "growth",          order: 60, description: "What compounds — building for momentum, not vanity." },
];

async function run() {
  const tx = client.transaction();
  for (const c of categories) {
    const _id = `category-${c.slug}`;
    tx.createOrReplace({
      _id,
      _type: "category",
      title: c.title,
      slug: { _type: "slug", current: c.slug },
      order: c.order,
      description: c.description,
    });
  }
  const res = await tx.commit();
  console.log(`Seeded ${res.results.length} categories.`);
}

run().catch((e) => { console.error(e); process.exit(1); });
