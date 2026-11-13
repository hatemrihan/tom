import type { MetadataRoute } from "next";
import { registry } from "@/components/library/registry";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: site.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/work`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    ...registry.map((e) => ({
      url: `${site.url}/components/${e.slug}`,
      lastModified: new Date(e.added),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
