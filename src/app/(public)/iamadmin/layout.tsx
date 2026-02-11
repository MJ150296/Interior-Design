import type { Metadata } from "next";
import { buildPublicMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPublicMetadata({
  title: "Admin Setup",
  description: "Private admin setup page.",
  path: "/iamadmin",
  noIndex: true,
});

export default function IamAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
