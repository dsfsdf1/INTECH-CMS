import type { MetadataRoute } from "next";
import { getSeoCenter } from "@/lib/cms-content";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const seo = await getSeoCenter();
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api"] }],
    sitemap: `${seo.siteUrl ?? "http://localhost:3000"}/sitemap.xml`,
    host: seo.siteUrl,
  };
}
