"use client";

import React from "react";
import { roContent } from "@/app/data/roContent";
import ServiceSection from "@/app/components/Services/ServiceSection";

export default function ROServicesPage() {
  const data = roContent.find((item) => item.slug === "full-home-interiors");

  if (!data) return <div>Service not found</div>;

  return <ServiceSection data={[data]} />;
}
