import type { AboutContent } from "./about";
import type { PortfolioContent } from "./portfolio";

export interface BlogContent {
  hero: {
    backgroundImageUrl: string;
    preTitle: string;
    title: string;
    subtitle: string;
    searchPlaceholder: string;
  };
  featured: {
    title: string;
    postIds: string[];
  };
  categories: string[];
  articles: Array<{
    id: string;
    imageUrl: string;
    category: string;
    title: string;
    description: string;
    author: string;
    authorBio: string;
    date: string;
    content: {
      hero: {
        title: string;
        subtitle: string;
        imageUrl: string;
      };
      meta: {
        readTime: string;
      };
      body: Array<{
        type: string;
        text?: string;
        title?: string;
        url?: string;
        caption?: string;
        items?: string[];
      }>;
      features: string[];
      tips: string[];
    };
  }>;
  newsletter: {
    title: string;
    description: string;
    placeholder: string;
    buttonText: string;
    privacyText: string;
  };
}

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
  blog: BlogContent;
}
