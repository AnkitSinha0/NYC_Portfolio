import type { MetadataRoute } from "next";
import { PROJECTS, REPORTS } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const page = (path: string, priority: number, changeFrequency: "daily" | "weekly" | "monthly" = "monthly") => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  });
  return [
    page("", 1, "daily"),
    page("/work", 0.9),
    ...PROJECTS.map((p) => page(`/work/${p.slug}`, 0.8)),
    page("/engineering", 0.8),
    ...REPORTS.map((r) => page(`/engineering/${r.slug}`, 0.7)),
    page("/markets", 0.7, "daily"),
    page("/writing", 0.6),
    page("/profile", 0.8),
    page("/photography", 0.4),
    page("/drawing", 0.4),
    page("/gaming", 0.4),
  ];
}
