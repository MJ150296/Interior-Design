import type { Metadata } from "next";
import { buildPublicMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPublicMetadata({
  title: "Authentication Redirect",
  description: "Private authentication redirect page.",
  path: "/redirectPage",
  noIndex: true,
});

export default function RedirectPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
