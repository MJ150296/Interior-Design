// src/app/(public)/layout.tsx
import Navbar from "../components/Header/Navbar";
import Footer from "../components/Footer/Footer";
import GlobalOverlay from "../components/GlobalOverlay";
import { PublicContentProvider } from "./PublicContentProvider";
import { getPublicContentBundle } from "@/app/lib/publicContent.server";
import type { Metadata } from "next";
import { buildPublicMetadata, SITE_NAME, siteUrl } from "@/lib/seo";

export const runtime = "nodejs";
export const revalidate = 300;
export const metadata: Metadata = buildPublicMetadata({
  title: "Interior Designers in Dehradun",
  description:
    "Riddhi Interiors offers premium interior design services for homes and commercial spaces in Dehradun.",
  path: "/",
  keywords: [
    "interior designers Dehradun",
    "Riddhi Interiors",
    "home interiors",
    "commercial interiors",
    "Uttarakhand interior design",
  ],
});

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = await getPublicContentBundle();
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "InteriorDesigner",
    name: SITE_NAME,
    url: siteUrl,
    image: new URL("/Riddhi Interior Design/Logo.png", siteUrl).toString(),
    telephone: "+91 78959 27366",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Tilak Road",
      addressLocality: "Dehradun",
      addressRegion: "Uttarakhand",
      postalCode: "248001",
      addressCountry: "IN",
    },
    areaServed: ["Dehradun", "Mussoorie", "Haridwar", "Rishikesh", "Roorkee"],
    sameAs: ["https://www.facebook.com", "https://www.instagram.com"],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <PublicContentProvider value={content}>
        <header className="w-full flex flex-col fixed z-30">
          <Navbar />
        </header>
        <main className="pt-24">{children}</main>
        <footer>
          <Footer />
        </footer>
        <GlobalOverlay />
      </PublicContentProvider>
    </>
  );
}
