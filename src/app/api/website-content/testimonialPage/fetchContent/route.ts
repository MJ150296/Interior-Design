// app/api/website-content/testimonialPage/fetchContent/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/app/utils/dbConnect";
import TestimonialPageModel from "@/app/model/website-content/TestimonialPage.model";

// Default values for testimonial page
const defaultTestimonialContent = {
  hero: {
    backgroundImageUrl: "/Riddhi Interior Design/Projects/cover.jpg",
    preTitle: "CLIENT EXPERIENCES",
    title: "Designed with Trust",
    subtitle:
      "Stories of Spaces Transformed, Lives Touched, and Dreams Designed.",
  },
  categories: [
    { name: "All" },
    { name: "Residential" },
    { name: "Commercial" },
  ],
  testimonials: [
    {
      id: 1,
      imageUrl: "/Riddhi Interior Design/masonry-4.jpg",
      category: "Residential",
      quote:
        "Riddhi Interior Design turned our empty flat into a warm and stylish home. Their attention to detail is unmatched!",
      author: "Anita Sharma",
      role: "Homeowner, Noida",
      rating: 5,
    },
    {
      id: 2,
      imageUrl: "/Riddhi Interior Design/why-choose-us.jpg",
      category: "Commercial",
      quote:
        "Our office space reflects professionalism and creativity now — exactly what we wanted. Highly recommend their team.",
      author: "Rajeev Mehta",
      role: "Founder, Mehta & Co.",
      rating: 5,
    },
  ],
  stats: [
    { value: "250+", label: "Projects Completed" },
    { value: "98%", label: "Client Satisfaction" },
    { value: "15+", label: "Years Experience" },
    { value: "50+", label: "Awards Received" },
  ],
  cta: {
    title: "Ready to Transform Your Space?",
    description:
      "Join hundreds of satisfied clients who have experienced the Riddhi Interiors difference. Schedule your consultation today.",
  },
};

export async function GET() {
  try {
    await dbConnect();

    // Try to find existing testimonial page content
    let testimonialContent = await TestimonialPageModel.findOne();

    // If no content exists, return default content
    if (!testimonialContent) {
      return NextResponse.json(defaultTestimonialContent);
    }

    // Ensure the returned data matches the expected structure
    const formattedContent = {
      hero: {
        backgroundImageUrl:
          testimonialContent.hero?.backgroundImageUrl ||
          defaultTestimonialContent.hero.backgroundImageUrl,
        preTitle:
          testimonialContent.hero?.preTitle ||
          defaultTestimonialContent.hero.preTitle,
        title:
          testimonialContent.hero?.title ||
          defaultTestimonialContent.hero.title,
        subtitle:
          testimonialContent.hero?.subtitle ||
          defaultTestimonialContent.hero.subtitle,
      },
      categories:
        testimonialContent.categories || defaultTestimonialContent.categories,
      testimonials:
        testimonialContent.testimonials ||
        defaultTestimonialContent.testimonials,
      stats: testimonialContent.stats || defaultTestimonialContent.stats,
      cta: {
        title:
          testimonialContent.cta?.title || defaultTestimonialContent.cta.title,
        description:
          testimonialContent.cta?.description ||
          defaultTestimonialContent.cta.description,
      },
    };

    return NextResponse.json(formattedContent);
  } catch (error) {
    console.error("Error fetching testimonial page content:", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonial page content" },
      { status: 500 }
    );
  }
}
