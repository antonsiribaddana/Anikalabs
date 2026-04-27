import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const SITE_URL = "https://anikalabs.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = ["", "/about", "/services", "/work", "/resources", "/contact-us", "/lets-begin"];
  return routes.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
