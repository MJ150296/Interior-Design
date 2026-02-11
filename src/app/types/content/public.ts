import type { AboutContent } from "./about";
import type { PortfolioContent } from "./portfolio";

export interface ContactContent {
  hero: {
    title: string;
    subtitle: string;
    buttonText: string;
  };
  whyChooseUs: {
    title: string;
    description: string;
    tabs: Array<{
      title: string;
      icon: string;
      contentTitle: string;
      description: string;
    }>;
    features: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  };
  contactInfo: {
    items: Array<{
      icon: string;
      title: string;
      details: string;
    }>;
  };
}

export interface AppointmentFormContent {
  title: string;
  description: string;
  fields: {
    name: { label: string; placeholder: string };
    email: { label: string; placeholder: string };
    contactNumber: { label: string; placeholder: string };
    message: { label: string; placeholder: string };
  };
  buttonText: string;
}

export interface TestimonialContent {
  hero: {
    backgroundImageUrl: string;
    preTitle: string;
    title: string;
    subtitle: string;
  };
  categories: Array<{ name: string }>;
  testimonials: Array<{
    id: number;
    imageUrl: string;
    category: string;
    quote: string;
    author: string;
    role: string;
    rating: number;
  }>;
  stats: Array<{ value: string; label: string }>;
  cta: {
    title: string;
    description: string;
  };
}

export interface PublicContentBundle {
  about: AboutContent;
  portfolio: PortfolioContent;
  contact: ContactContent;
  appointmentForm: AppointmentFormContent;
  testimonials: TestimonialContent;
}
