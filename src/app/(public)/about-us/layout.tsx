import type { Metadata } from "next";
import { buildPublicMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPublicMetadata({
  title: "About Us",
  description:
    "Learn about Riddhi Interiors, our design philosophy, team, and interior design journey in Dehradun.",
  path: "/about-us",
  keywords: [
    "about Riddhi Interiors",
    "interior design firm Dehradun",
    "interior design team Uttarakhand",
  ],
});

export default function AboutUsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
