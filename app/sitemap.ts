import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://multisow.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes = [
    { url: "/", priority: 1.0, changeFrequency: "weekly" as const },
    { url: "/dashboard", priority: 0.9, changeFrequency: "daily" as const },
    { url: "/designer", priority: 0.9, changeFrequency: "weekly" as const },
    { url: "/predict", priority: 0.8, changeFrequency: "weekly" as const },
    { url: "/crops", priority: 0.7, changeFrequency: "monthly" as const },
    { url: "/farm", priority: 0.7, changeFrequency: "weekly" as const },
    { url: "/optimize", priority: 0.7, changeFrequency: "weekly" as const },
    { url: "/strata", priority: 0.6, changeFrequency: "monthly" as const },
    { url: "/ai-advisor", priority: 0.6, changeFrequency: "monthly" as const },
    { url: "/research", priority: 0.5, changeFrequency: "monthly" as const },
    { url: "/docs", priority: 0.5, changeFrequency: "monthly" as const },
  ];

  return routes.map(({ url, priority, changeFrequency }) => ({
    url: `${BASE_URL}${url}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
