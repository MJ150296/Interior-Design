import { Metadata } from "next";
import { getPublicContentBundle } from "@/app/lib/publicContent.server";
import { ServicesPageClient } from "./PageClient";

export const metadata: Metadata = {
  title: "Services - Admin Panel",
  description: "Manage services content for the website",
};

export default async function ServicesPage() {
  const content = await getPublicContentBundle();
  
  return (
    <div className="container mx-auto">
      <ServicesPageClient initialContent={content.services} />
    </div>
  );
}