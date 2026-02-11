import type { Metadata } from "next";
import { buildPublicMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPublicMetadata({
  title: "Contact Us",
  description:
    "Book a consultation with Riddhi Interiors in Dehradun for home and commercial interior design projects.",
  path: "/contact-us",
  keywords: [
    "contact Riddhi Interiors",
    "interior consultation Dehradun",
    "book interior designer",
  ],
});

export default function ContactUsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
