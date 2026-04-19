import { defineField, defineType } from "sanity";

/**
 * Category = thinking pillar.
 * Seed values: Systems, Structure, User Flow, Brand Thinking, Execution, Growth.
 */
export default defineType({
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
      description: "Lower numbers show first on /resources.",
      initialValue: 99,
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 2,
      description: "One-line descriptor shown under the category heading.",
    }),
  ],
  orderings: [{ title: "Display order", name: "order", by: [{ field: "order", direction: "asc" }] }],
});
