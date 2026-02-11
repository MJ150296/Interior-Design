import type { Metadata } from "next";
import { buildPublicMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPublicMetadata({
  title: "Luxury Interiors",
  description:
    "Premium luxury interior design solutions by Riddhi Interiors for elegant and bespoke living spaces.",
  path: "/services/luxury-interiors",
  keywords: [
    "luxury interior designers",
    "premium home interiors Dehradun",
    "bespoke interior design",
  ],
});

export default function LuxuryInteriorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
