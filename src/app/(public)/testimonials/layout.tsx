import type { Metadata } from "next";
import { buildPublicMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPublicMetadata({
  title: "Testimonials",
  description:
    "Read client testimonials and reviews for Riddhi Interiors from residential and commercial interior projects.",
  path: "/testimonials",
  keywords: [
    "Riddhi Interiors reviews",
    "interior design testimonials",
    "client feedback interior design",
  ],
});

export default function TestimonialsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
