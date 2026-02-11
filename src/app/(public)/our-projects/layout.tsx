import type { Metadata } from "next";
import { buildPublicMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPublicMetadata({
  title: "Our Projects",
  description:
    "Explore completed residential and commercial interior design projects by Riddhi Interiors across Uttarakhand.",
  path: "/our-projects",
  keywords: [
    "interior design portfolio",
    "Dehradun interior projects",
    "residential interior projects",
    "commercial interior projects",
  ],
});

export default function OurProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
