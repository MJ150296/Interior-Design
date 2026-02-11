import type { Metadata } from "next";
import { buildPublicMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPublicMetadata({
  title: "Interior Design Services",
  description:
    "Explore interior design services from Riddhi Interiors including full-home interiors, luxury interiors, modular interiors, and renovations.",
  path: "/services",
  keywords: [
    "interior design services Dehradun",
    "modular interiors",
    "luxury interiors",
    "home renovation services",
  ],
});

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
