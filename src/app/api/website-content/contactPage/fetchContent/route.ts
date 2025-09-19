// app/api/website-content/contactPage/fetchContent/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/app/utils/dbConnect";

interface WhyChooseUsTab {
  title?: string;
  icon?: string;
  contentTitle?: string;
  description?: string;
  content?: string;
}

// Update default values to match the new structure
const defaultContactContent = {
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
        contentTitle: "Expert Consultation Process",
        description:
          "Our process begins with understanding your vision, preferences, and requirements through an in-depth consultation.",
      },
      {
        title: "Design Process",
        icon: "settings",
        contentTitle: "Innovative Design Approach",
        description:
          "We create detailed design concepts and 3D visualizations to bring your vision to life before implementation.",
      },
      {
        title: "Materials",
        icon: "award",
        contentTitle: "Premium Material Selection",
        description:
          "We source only the finest materials to ensure your interiors are both beautiful and durable.",
      },
      {
        title: "Execution",
        icon: "calendar",
        contentTitle: "Flawless Project Execution",
        description:
          "Our skilled craftsmen and project managers ensure flawless execution of your design vision.",
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
      {
        icon: "house",
        title: "End-to-End Project Management",
        description:
          "From concept to completion, we handle every detail so you can relax and enjoy the transformation.",
      },
      {
        icon: "calendar",
        title: "Personalized Solutions",
        description:
          "Every space is unique - we create custom solutions tailored to your specific needs and preferences.",
      },
    ],
  },
  appointmentForm: {
    title: "Schedule Your Design Consultation",
    description:
      "Fill out the form below and our design team will contact you to discuss your project",
    fields: {
      name: { label: "Name", placeholder: "Your full name" },
      email: { label: "Email", placeholder: "your.email@example.com" },
      contactNumber: {
        label: "Contact Number",
        placeholder: "+91 123 456 7890",
      },
      message: {
        label: "Message",
        placeholder: "Tell us about your project...",
      },
    },
    buttonText: "Request Appointment",
  },
  contactInfo: {
    items: [
      {
        icon: "phone",
        title: "Call Us",
        details: "+91 78959 27366",
      },
      {
        icon: "map-pin",
        title: "Visit Us",
        details: "Tilak Road, Dehradun",
      },
      {
        icon: "clock",
        title: "Working Hours",
        details: "Mon-Sat: 10AM - 7PM",
      },
    ],
  },
};

export async function GET() {
  try {
    await dbConnect();

    // Import the model dynamically to avoid server-side issues
    const ContactPageModel = (
      await import("@/app/model/website-content/ContactPage.model")
    ).default;

    // Try to find existing contact page content
    const contactContent = await ContactPageModel.findOne();

    // If no content exists, return default content
    if (!contactContent) {
      return NextResponse.json(defaultContactContent);
    }

    // Transform the data to match the new structure
    const transformedContent = {
      hero: {
        title: contactContent.hero?.title || defaultContactContent.hero.title,
        subtitle:
          contactContent.hero?.subtitle || defaultContactContent.hero.subtitle,
        buttonText:
          contactContent.hero?.buttonText ||
          defaultContactContent.hero.buttonText,
      },
      whyChooseUs: {
        title:
          contactContent.whyChooseUs?.title ||
          defaultContactContent.whyChooseUs.title,
        description:
          contactContent.whyChooseUs?.description ||
          defaultContactContent.whyChooseUs.description,
        tabs: contactContent.whyChooseUs?.tabs
          ? contactContent.whyChooseUs.tabs.map((tab: WhyChooseUsTab) => ({
              title: tab.title || "",
              icon: tab.icon || "star",
              contentTitle: tab.contentTitle || tab.title || "",
              description: tab.description || tab.content || "",
            }))
          : defaultContactContent.whyChooseUs.tabs,
        features:
          contactContent.whyChooseUs?.features ||
          defaultContactContent.whyChooseUs.features,
      },
      appointmentForm: {
        title:
          contactContent.appointmentForm?.title ||
          defaultContactContent.appointmentForm.title,
        description:
          contactContent.appointmentForm?.description ||
          defaultContactContent.appointmentForm.description,
        fields: {
          name:
            contactContent.appointmentForm?.fields?.name ||
            defaultContactContent.appointmentForm.fields.name,
          email:
            contactContent.appointmentForm?.fields?.email ||
            defaultContactContent.appointmentForm.fields.email,
          contactNumber:
            contactContent.appointmentForm?.fields?.contactNumber ||
            defaultContactContent.appointmentForm.fields.contactNumber,
          message:
            contactContent.appointmentForm?.fields?.message ||
            defaultContactContent.appointmentForm.fields.message,
        },
        buttonText:
          contactContent.appointmentForm?.buttonText ||
          defaultContactContent.appointmentForm.buttonText,
      },
      contactInfo: {
        items:
          contactContent.contactInfo?.items ||
          defaultContactContent.contactInfo.items,
      },
    };

    return NextResponse.json(transformedContent);
  } catch (error) {
    console.error("Error fetching contact page content:", error);
    return NextResponse.json(
      { error: "Failed to fetch contact page content" },
      { status: 500 }
    );
  }
}
