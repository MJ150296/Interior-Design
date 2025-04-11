// app/our-services/[slug]/page.tsx

import React from "react";
import { notFound } from "next/navigation";
import { roContent } from "@/app/data/roContent";
import SinglaROSection from "@/app/components/Services/SinglaROsection";

interface Props {
  params: {
    slug: string;
  };
}

const ServiceDetailPage = ({ params }: Props) => {
  const content = roContent.find((item) => item.slug === params.slug);

  if (!content) return notFound();

  return <SinglaROSection data={[content]} />;
};

export default ServiceDetailPage;
