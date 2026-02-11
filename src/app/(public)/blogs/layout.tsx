import type { Metadata } from "next";
import { buildPublicMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPublicMetadata({
  title: "Interior Design Blog",
  description:
    "Read expert interior design tips, ideas, trends, and practical guides from Riddhi Interiors.",
  path: "/blogs",
  keywords: [
    "interior design blog",
    "home decor ideas",
    "interior trends 2026",
    "design tips",
  ],
});

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
