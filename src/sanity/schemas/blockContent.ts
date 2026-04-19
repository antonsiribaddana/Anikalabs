import { defineArrayMember, defineType } from "sanity";

/**
 * Rich text body for posts.
 * Supports headings, quotes, lists, inline formatting, images with captions,
 * image pairs (side-by-side), pull quotes, callouts, stats, video embeds, dividers.
 */
export default defineType({
  name: "blockContent",
  title: "Body",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "H2", value: "h2" },
        { title: "H3", value: "h3" },
        { title: "H4", value: "h4" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
          { title: "Code", value: "code" },
          { title: "Underline", value: "underline" },
        ],
        annotations: [
          {
            name: "link",
            type: "object",
            title: "Link",
            fields: [
              { name: "href", type: "url", title: "URL" },
              { name: "blank", type: "boolean", title: "Open in new tab", initialValue: true },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: "image",
      options: { hotspot: true },
      fields: [
        { name: "alt", type: "string", title: "Alt text" },
        { name: "caption", type: "string", title: "Caption" },
        {
          name: "size",
          type: "string",
          title: "Size",
          options: {
            list: [
              { title: "Inline (content width)", value: "inline" },
              { title: "Wide (breaks margin)", value: "wide" },
              { title: "Full bleed", value: "full" },
            ],
            layout: "radio",
          },
          initialValue: "inline",
        },
      ],
    }),
    defineArrayMember({
      name: "imagePair",
      type: "object",
      title: "Image pair (side-by-side)",
      fields: [
        { name: "left", type: "image", options: { hotspot: true }, fields: [{ name: "alt", type: "string" }] },
        { name: "right", type: "image", options: { hotspot: true }, fields: [{ name: "alt", type: "string" }] },
        { name: "caption", type: "string" },
      ],
      preview: { select: { media: "left" }, prepare: () => ({ title: "Image pair" }) },
    }),
    defineArrayMember({
      name: "gallery",
      type: "object",
      title: "Gallery",
      fields: [
        {
          name: "images",
          type: "array",
          of: [{ type: "image", options: { hotspot: true }, fields: [{ name: "alt", type: "string" }] }],
        },
        {
          name: "columns",
          type: "number",
          options: { list: [2, 3, 4] },
          initialValue: 3,
        },
      ],
      preview: { prepare: () => ({ title: "Gallery" }) },
    }),
    defineArrayMember({
      name: "pullQuote",
      type: "object",
      title: "Pull quote",
      fields: [
        { name: "text", type: "text", rows: 3, validation: (r) => r.required() },
        { name: "attribution", type: "string" },
      ],
      preview: { select: { title: "text" }, prepare: ({ title }) => ({ title: `“${title}”` }) },
    }),
    defineArrayMember({
      name: "stat",
      type: "object",
      title: "Stat",
      fields: [
        { name: "value", type: "string", title: "Big number / value", description: "e.g. 73%" },
        { name: "label", type: "string", description: "e.g. reduction in support tickets" },
      ],
      preview: { select: { title: "value", subtitle: "label" } },
    }),
    defineArrayMember({
      name: "callout",
      type: "object",
      title: "Callout",
      fields: [
        {
          name: "tone",
          type: "string",
          options: { list: ["info", "tip", "warning"], layout: "radio" },
          initialValue: "info",
        },
        { name: "text", type: "text", rows: 3, validation: (r) => r.required() },
      ],
      preview: { select: { title: "text", subtitle: "tone" } },
    }),
    defineArrayMember({
      name: "video",
      type: "object",
      title: "Video embed",
      fields: [
        { name: "url", type: "url", title: "YouTube / Vimeo URL", validation: (r) => r.required() },
        { name: "caption", type: "string" },
      ],
      preview: { select: { title: "url" } },
    }),
    defineArrayMember({
      name: "code",
      type: "object",
      title: "Code block",
      fields: [
        { name: "language", type: "string", options: { list: ["ts", "tsx", "js", "jsx", "css", "html", "bash", "json"] } },
        { name: "code", type: "text", rows: 8 },
      ],
      preview: { select: { title: "language" }, prepare: ({ title }) => ({ title: `<${title || "code"}>` }) },
    }),
    defineArrayMember({
      name: "divider",
      type: "object",
      title: "Divider",
      fields: [{ name: "spacer", type: "boolean", initialValue: true }],
      preview: { prepare: () => ({ title: "— divider —" }) },
    }),
  ],
});
