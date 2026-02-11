import type { MetadataRoute } from "next";
import { blogs } from "@/app/data/blogs";
import { siteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: Array<{
    path: string;
    priority: number;
    changeFrequency: "daily" | "weekly" | "monthly";
  }> = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/about-us", priority: 0.8, changeFrequency: "monthly" },
    { path: "/contact-us", priority: 0.9, changeFrequency: "monthly" },
    { path: "/our-projects", priority: 0.9, changeFrequency: "weekly" },
    { path: "/testimonials", priority: 0.7, changeFrequency: "monthly" },
    { path: "/blogs", priority: 0.8, changeFrequency: "weekly" },
    {
      path: "/services/full-home-interiors",
      priority: 0.8,
      changeFrequency: "monthly",
    },
    {
      path: "/services/luxury-interiors",
      priority: 0.8,
      changeFrequency: "monthly",
    },
    {
      path: "/services/modular-interiors",
      priority: 0.8,
      changeFrequency: "monthly",
    },
    {
      path: "/services/renovations",
      priority: 0.8,
      changeFrequency: "monthly",
    },
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const blogEntries: MetadataRoute.Sitemap = blogs.map((blog) => ({
    url: `${siteUrl}/blogs/${blog.id}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticEntries, ...blogEntries];
}
