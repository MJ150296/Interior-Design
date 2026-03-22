import { Metadata } from "next";
import { getPublicContentBundle } from "@/app/lib/publicContent.server";
import PageClient from "./PageClient";

export const metadata: Metadata = {
  title: "Contact - Admin Panel",
  description: "Manage contact page content for the website",
};

export default async function Page() {
  const content = await getPublicContentBundle();
  
  return (
    <div className="container mx-auto">
      <PageClient initialContent={content.contact} />
    </div>
  );
}
