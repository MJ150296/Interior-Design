import { Metadata } from "next";
import { getPublicContentBundle } from "@/app/lib/publicContent.server";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "Testimonials - Admin Panel",
  description: "Manage testimonials page content for the website",
};

export default async function Page() {
  const content = await getPublicContentBundle();
  
  return (
    <div className="container mx-auto">
      <PageClient initialContent={content.testimonials} />
    </div>
  );
}
