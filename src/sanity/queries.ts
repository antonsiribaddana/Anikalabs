import { sanityClient } from "./client";

export type PostListItem = {
  _id: string;
  kind: "article" | "guide" | "case-insight";
  title: string;
  slug: string;
  summary?: string;
  publishedAt: string;
  readingTime?: number;
  thumbnail?: { asset: { _ref: string }; alt?: string };
  category?: { title: string; slug: string; order?: number; description?: string };
  topics?: string[];
  featured?: boolean;
  featureOrder?: number;
  author?: { name: string; role?: string; avatar?: { asset: { _ref: string } } };
};

export type PostFull = PostListItem & {
  body: unknown;
  seoTitle?: string;
  seoDescription?: string;
};

const listProjection = `{
  _id,
  kind,
  title,
  "slug": slug.current,
  summary,
  publishedAt,
  readingTime,
  thumbnail,
  "category": category->{ title, "slug": slug.current, order, description },
  topics,
  featured,
  featureOrder,
  "author": author->{ name, role, avatar }
}`;

export async function getAllPosts(): Promise<PostListItem[]> {
  return sanityClient.fetch(
    `*[_type == "post" && defined(slug.current)] | order(featured desc, featureOrder asc, publishedAt desc) ${listProjection}`
  );
}

export async function getPostSlugs(): Promise<{ slug: string }[]> {
  return sanityClient.fetch(
    `*[_type == "post" && defined(slug.current)]{ "slug": slug.current }`
  );
}

export async function getPostBySlug(slug: string): Promise<PostFull | null> {
  return sanityClient.fetch(
    `*[_type == "post" && slug.current == $slug][0]{
      _id,
      kind,
      title,
      "slug": slug.current,
      summary,
      publishedAt,
      readingTime,
      thumbnail,
      body,
      seoTitle,
      seoDescription,
      "category": category->{ title, "slug": slug.current, order, description },
      topics,
      featured,
      featureOrder,
      "author": author->{ name, role, avatar }
    }`,
    { slug }
  );
}

export async function getCategories(): Promise<{ title: string; slug: string; order?: number; description?: string }[]> {
  return sanityClient.fetch(
    `*[_type == "category"] | order(order asc, title asc){ title, "slug": slug.current, order, description }`
  );
}
