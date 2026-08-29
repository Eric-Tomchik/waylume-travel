import type { MetadataRoute } from "next";
import { destinations } from "@/lib/destinations";
import { journalArticles } from "@/lib/journal";

const origin = "https://www.waylumetravel.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/destinations", "/journal", "/concierge", "/how-booking-works", "/smart-planner", "/deals"];
  return [
    ...staticRoutes.map((route) => ({ url: `${origin}${route}`, changeFrequency: route === "" ? "weekly" as const : "monthly" as const, priority: route === "" ? 1 : 0.8 })),
    ...destinations.map((destination) => ({ url: `${origin}/destinations/${destination.slug}`, changeFrequency: "monthly" as const, priority: 0.75 })),
    ...journalArticles.map((article) => ({ url: `${origin}/journal/${article.slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
