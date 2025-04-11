// app/services/[slug]/page.tsx

import React from "react";
import { notFound } from "next/navigation";
import { getROContentBySlug } from "@/lib/getROContent";
import SinglaROSection from "@/app/components/Services/SinglaROsection";

export const dynamic = "force-dynamic";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props) {
  // Await params so that its properties can be used safely
  const { slug } = await Promise.resolve(params);
  const content = await getROContentBySlug(slug);

  if (!content) {
    return {
      title: "Service Not Found | Singla RO Mart",
    };
  }

  return {
    title: `${content.title} | Classic RO Solutions`,
    description:
      content.sections[0]?.paragraphs[0] || "Professional RO services",
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  // Await params before using its properties
  const { slug } = await Promise.resolve(params);
  const content = await getROContentBySlug(slug);

  if (!content) return notFound();

  return <SinglaROSection data={[content]} />;
}
