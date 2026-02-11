import type { Metadata } from "next";
import { buildPublicMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPublicMetadata({
  title: "Renovation Services",
  description:
    "Upgrade your home with professional interior renovation services from Riddhi Interiors in Dehradun.",
  path: "/services/renovations",
  keywords: [
    "home renovation Dehradun",
    "interior renovation services",
    "space makeover services",
  ],
});

export default function RenovationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
