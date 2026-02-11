import type { Metadata } from "next";
import { buildPublicMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPublicMetadata({
  title: "Full Home Interiors",
  description:
    "End-to-end full-home interior design and execution services by Riddhi Interiors in Dehradun.",
  path: "/services/full-home-interiors",
  keywords: [
    "full home interiors",
    "home interior designers Dehradun",
    "complete interior solutions",
  ],
});

export default function FullHomeInteriorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
