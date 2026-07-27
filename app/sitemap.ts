import type { MetadataRoute } from "next";
import { getSeoCenter } from "@/lib/cms-content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const seo = await getSeoCenter();
  const base = seo.siteUrl ?? "http://localhost:3000";
  return ["/", "/automation"].map((path) => ({ url: `${base}${path}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: path === "/" ? 1 : 0.8 }));
}
