import { unstable_cache } from "next/cache";
import dbConnect from "@/app/utils/dbConnect";
import AboutUsPageModel from "@/app/model/website-content/AboutUsPage.model";
import PortfolioPageModel from "@/app/model/website-content/PortfolioPage.model";
import ContactPageModel from "@/app/model/website-content/ContactPage.model";
import AppointmentFormModel from "@/app/model/website-content/AppointmentForm.model";
import TestimonialPageModel from "@/app/model/website-content/TestimonialPage.model";
import BlogPageModel from "@/app/model/website-content/BlogPage.model";
import type {
  AppointmentFormContent,
  ContactContent,
  PublicContentBundle,
  TestimonialContent,
  BlogContent,
} from "@/app/types/content/public";
import type { AboutContent } from "@/app/types/content/about";
import type { PortfolioContent } from "@/app/types/content/portfolio";

const defaultAbout: AboutContent = {
  hero: {
    upperTitle: "A FEW WORDS ABOUT",
    title: "Our Firm",
    subtitle: "Award Winning Interior Design Firm in UTTARAKHAND",
    backgroundImageUrl: "/Riddhi Interior Design/About/cover.jpg",
  },
  stats: [
    { value: "12+", label: "Years Experience" },
    { value: "250+", label: "Projects Completed" },
    { value: "98%", label: "Client Satisfaction" },
    { value: "25+", label: "Awards Received" },
  ],
  story: {
    title: "Our Story",
    subtitle: "Transforming Spaces with Elegance & Style",
    content: "At Riddhi Interiors, we believe every space tells a story...",
    content2: "At Riddhi Interiors, we believe every space tells a story...",
    quote: "Your trusted interior design partner in Dehradun...",
    imageUrl: "/Riddhi Interior Design/About/story.jpg",
    cities: "Dehradun, Mussoorie, Haridwar, Rishikesh, Roorkee",
  },
  coreValues: [
    {
      title: "Innovation",
      description:
        "We embrace new ideas and technologies to create unique spaces",
      icon: "💡",
    },
    {
      title: "Excellence",
      description: "We pursue perfection in every detail of our work",
      icon: "⭐",
    },
    {
      title: "Integrity",
      description: "We build relationships based on trust and transparency",
      icon: "🤝",
    },
    {
      title: "Sustainability",
      description: "We prioritize eco-friendly materials and practices",
      icon: "🌿",
    },
  ],
  teamMembers: [
    {
      name: "Riddhi Sharma",
      title: "Founder & Principal Designer",
      bio: "With over 15 years of experience in interior design...",
      imageUrl: "/Riddhi Interior Design/owner.jpg",
      tags: ["Residential Design", "Space Planning", "Color Theory"],
    },
  ],
  connect: {
    socialLinks: [],
    address: "Tilak Road, Dehradun, Uttarakhand 248001",
    hours: "Open Monday-Saturday: 9AM - 7PM",
    phone: "+91 78959 27366",
  },
};

const defaultPortfolio: PortfolioContent = {
  hero: {
    backgroundImageUrl: "/Riddhi Interior Design/Portfolio/cover.jpg",
    title: "Our Portfolio",
    subtitle: "Showcasing Excellence in Interior Design Across Uttarakhand",
    preTitle: "EXPLORE OUR WORK",
  },
  quotes: [
    {
      text: "Riddhi Interiors transformed our home into a masterpiece. Their attention to detail and creative solutions exceeded our expectations.",
      author: "Rajesh & Priya Sharma, Dehradun",
    },
  ],
  residentialProjects: [],
  commercialProjects: [],
  stats: [
    { value: "250+", label: "Projects Completed" },
    { value: "98%", label: "Client Satisfaction" },
  ],
  cta: {
    title: "Ready to Start Your Project?",
    description:
      "Let's discuss how we can transform your space into something extraordinary.",
  },
};

const defaultContact: ContactContent = {
  hero: {
    title: "Design Your Dream Space",
    subtitle:
      "Schedule a consultation with our expert interior designers to transform your home or office",
    buttonText: "Book Free Consultation",
  },
  whyChooseUs: {
    title: "Why Choose Riddhi Interiors?",
    description:
      "We combine creativity, expertise, and attention to detail to deliver exceptional interior solutions",
    tabs: [
      {
        title: "Consultation",
        icon: "phone",
        contentTitle: "Personalized Consultation",
        description:
          "Our process begins with understanding your vision, preferences, and requirements through an in-depth consultation.",
      },
      {
        title: "Design Process",
        icon: "palette",
        contentTitle: "Creative Design Process",
        description:
          "We create detailed design concepts and 3D visualizations to bring your vision to life before implementation.",
      },
    ],
    features: [
      {
        icon: "palette",
        title: "Expert Design Consultation",
        description:
          "Our experienced designers will work with you to create spaces that reflect your personality and lifestyle.",
      },
      {
        icon: "award",
        title: "Premium Quality Materials",
        description:
          "We source only the finest materials to ensure your interiors are both beautiful and durable.",
      },
    ],
  },
  contactInfo: {
    items: [
      { icon: "phone", title: "Call Us", details: "+91 78959 27366" },
      { icon: "map-pin", title: "Visit Us", details: "Tilak Road, Dehradun" },
      { icon: "clock", title: "Working Hours", details: "Mon-Sat: 10AM - 7PM" },
    ],
  },
};

const defaultAppointmentForm: AppointmentFormContent = {
  title: "Schedule Your Design Consultation",
  description:
    "Fill out the form below and our design team will contact you to discuss your project",
  fields: {
    name: { label: "Name", placeholder: "Your full name" },
    email: { label: "Email", placeholder: "your.email@example.com" },
    contactNumber: { label: "Contact Number", placeholder: "+91 123 456 7890" },
    message: { label: "Message", placeholder: "Tell us about your project..." },
  },
  buttonText: "Request Appointment",
};

const defaultTestimonials: TestimonialContent = {
  hero: {
    backgroundImageUrl: "/Riddhi Interior Design/Testimonials/cover.jpg",
    preTitle: "CLIENT TESTIMONIALS",
    title: "What Our Clients Say",
    subtitle: "Real Stories from Satisfied Customers Across Uttarakhand",
  },
  categories: [{ name: "All" }],
  testimonials: [],
  stats: [
    { value: "98%", label: "Client Satisfaction Rate" },
    { value: "250+", label: "Projects Completed" },
  ],
  cta: {
    title: "Ready to Share Your Success Story?",
    description:
      "Join our growing family of satisfied clients. Let us transform your space and create an experience you'll love to share.",
  },
};

const defaultBlog: BlogContent = {
  hero: {
    backgroundImageUrl: "/Riddhi Interior Design/Projects/cover.jpg",
    preTitle: "INSIGHTS & INSPIRATION",
    title: "Design Journal",
    subtitle: "Explore Ideas, Trends, and Expert Advice on Beautiful Living Spaces.",
    searchPlaceholder: "Search blog posts...",
  },
  featured: {
    title: "Featured Inspiration",
    postIds: [],
  },
  categories: ["All"],
  articles: [],
  newsletter: {
    title: "Design Inspiration Delivered",
    description: "Join our newsletter and receive exclusive design tips, trend reports, and special offers.",
    placeholder: "Your email address",
    buttonText: "Subscribe",
    privacyText: "We respect your privacy. Unsubscribe at any time.",
  },
};

function toPlain<T>(value: unknown): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

const getPublicContentBundleCached = unstable_cache(
  async (): Promise<PublicContentBundle> => {
    try {
      await dbConnect();

      const [
        aboutRaw,
        portfolioRaw,
        contactRaw,
        appointmentRaw,
        testimonialsRaw,
        blogRaw,
      ] = await Promise.all([
        AboutUsPageModel.findOne().lean(),
        PortfolioPageModel.findOne().lean(),
        ContactPageModel.findOne().lean(),
        AppointmentFormModel.findOne().lean(),
        TestimonialPageModel.findOne().lean(),
        BlogPageModel.findOne().lean(),
      ]);

      return {
        about: aboutRaw ? toPlain<AboutContent>(aboutRaw) : defaultAbout,
        portfolio: portfolioRaw
          ? toPlain<PortfolioContent>(portfolioRaw)
          : defaultPortfolio,
        contact: contactRaw
          ? toPlain<ContactContent>(contactRaw)
          : defaultContact,
        appointmentForm: appointmentRaw
          ? toPlain<AppointmentFormContent>(appointmentRaw)
          : defaultAppointmentForm,
        testimonials: testimonialsRaw
          ? toPlain<TestimonialContent>(testimonialsRaw)
          : defaultTestimonials,
        blog: blogRaw ? toPlain<BlogContent>(blogRaw) : defaultBlog,
      };
    } catch (error) {
      console.error("Public content fallback due to data fetch error:", error);
      return {
        about: defaultAbout,
        portfolio: defaultPortfolio,
        contact: defaultContact,
        appointmentForm: defaultAppointmentForm,
        testimonials: defaultTestimonials,
        blog: defaultBlog,
      };
    }
  },
  ["public-content-bundle-v1"],
  { revalidate: 300, tags: ["public-content"] }
);

export async function getPublicContentBundle(): Promise<PublicContentBundle> {
  return getPublicContentBundleCached();
}
