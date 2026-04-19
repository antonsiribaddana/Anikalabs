import { defineField, defineType } from "sanity";

/**
 * `post` is our unified Resource document.
 * Use `kind` to distinguish Articles, Guides, and Case Insights.
 * Structure (not chronology) is the primary organizing principle:
 *   - `category` groups by thinking pillar (Systems, Structure, User Flow, …)
 *   - `topic` is a free-form taxonomy for cross-cutting themes
 *   - `featured` surfaces curated picks at the top of /resources
 */
export default defineType({
  name: "post",
  title: "Resource",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "structure", title: "Structure" },
    { name: "meta", title: "Meta & SEO" },
  ],
  fields: [
    defineField({
      name: "kind",
      title: "Type",
      type: "string",
      group: "content",
      options: {
        list: [
          { title: "Article", value: "article" },
          { title: "Guide", value: "guide" },
          { title: "Case Insight", value: "case-insight" },
        ],
        layout: "radio",
      },
      initialValue: "article",
      validation: (r) => r.required(),
    }),
    defineField({ name: "title", type: "string", group: "content", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      group: "content",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "thumbnail",
      type: "image",
      title: "Cover image",
      group: "content",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alt text" }],
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      group: "content",
      description: "Short summary for listing cards + SEO fallback.",
      validation: (r) => r.max(260),
    }),
    defineField({
      name: "body",
      title: "Content",
      type: "blockContent",
      group: "content",
    }),

    defineField({
      name: "category",
      title: "Category (pillar)",
      type: "reference",
      to: [{ type: "category" }],
      group: "structure",
      description: "Thinking pillar this resource belongs to.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "topics",
      title: "Topics",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      group: "structure",
      description: "Cross-cutting topics for filtering (e.g. information-architecture, onboarding).",
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      group: "structure",
      initialValue: false,
      description: "Show at the top of /resources as a curated pick.",
    }),
    defineField({
      name: "featureOrder",
      title: "Feature order",
      type: "number",
      group: "structure",
      description: "Lower = earlier. Only used when Featured is on.",
      hidden: ({ parent }) => !parent?.featured,
    }),
    defineField({
      name: "author",
      type: "reference",
      to: [{ type: "author" }],
      group: "structure",
    }),

    defineField({
      name: "publishedAt",
      type: "datetime",
      group: "meta",
      initialValue: () => new Date().toISOString(),
      validation: (r) => r.required(),
    }),
    defineField({
      name: "readingTime",
      title: "Reading time (min)",
      type: "number",
      group: "meta",
      description: "Estimated reading time in minutes.",
    }),
    defineField({
      name: "seoTitle",
      title: "SEO title",
      type: "string",
      group: "meta",
      description: "Overrides page <title>. Defaults to title.",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO description",
      type: "text",
      rows: 2,
      group: "meta",
      description: "Meta description. Defaults to summary.",
    }),
  ],
  orderings: [
    { title: "Featured first", name: "featured", by: [{ field: "featured", direction: "desc" }, { field: "featureOrder", direction: "asc" }, { field: "publishedAt", direction: "desc" }] },
    { title: "Newest", name: "newest", by: [{ field: "publishedAt", direction: "desc" }] },
    { title: "By category", name: "byCategory", by: [{ field: "category.title", direction: "asc" }, { field: "publishedAt", direction: "desc" }] },
  ],
  preview: {
    select: { title: "title", kind: "kind", cat: "category.title", media: "thumbnail", featured: "featured" },
    prepare: ({ title, kind, cat, media, featured }) => ({
      title: featured ? `★ ${title}` : title,
      subtitle: [kind, cat].filter(Boolean).join(" · "),
      media,
    }),
  },
});
