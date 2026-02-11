// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { auth } from "./auth";
import { metadataBase, SITE_NAME, DEFAULT_OG_IMAGE } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase,
  applicationName: SITE_NAME,
  title: {
    default: "Interior Designers in Dehradun",
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Riddhi Interiors delivers luxury, modular, and full-home interior design services in Dehradun and across Uttarakhand.",
  keywords: [
    "Riddhi Interiors",
    "interior designers Dehradun",
    "home interior design Uttarakhand",
    "modular interiors",
    "luxury interiors",
    "renovation services",
  ],
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    title: "Interior Designers in Dehradun",
    description:
      "Transform your home or commercial space with Riddhi Interiors in Dehradun.",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Riddhi Interiors",
    description:
      "Interior design services in Dehradun: luxury interiors, modular interiors, renovations, and full-home solutions.",
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth(); // Get server-side session

  return (
    <html lang="en">
      <body className="antialiased text-foreground dark:bg-black dark:text-white transition-colors bg-lime-100">
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  );
}
