import type { Metadata } from "next";
import { buildPublicMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPublicMetadata({
  title: "Modular Interiors",
  description:
    "Custom modular interior design for kitchens, wardrobes, and storage solutions by Riddhi Interiors.",
  path: "/services/modular-interiors",
  keywords: [
    "modular kitchen Dehradun",
    "modular wardrobes",
    "space saving interior solutions",
  ],
});

export default function ModularInteriorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
