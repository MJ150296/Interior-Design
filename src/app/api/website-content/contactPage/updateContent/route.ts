// app/api/website-content/contactPage/updateContent/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/app/utils/dbConnect";
import ContactPageModel from "@/app/model/website-content/ContactPage.model";

export async function PUT(request: Request) {
  try {
    await dbConnect();

    const content = await request.json();

    // Clean up the data to ensure it matches the ContactPage model schema
    const contentToSave = {
      hero: content.hero || {
        title: "",
        subtitle: "",
        buttonText: "",
      },
      whyChooseUs: content.whyChooseUs || {
        title: "",
        description: "",
        tabs: [],
        features: [],
      },
      projects: content.projects || {
        title: "",
        description: "",
        items: [],
      },
      contactInfo: content.contactInfo || {
        items: [],
      },
    };

    // Ensure all required fields are present in the tabs
    if (contentToSave.whyChooseUs.tabs) {
      contentToSave.whyChooseUs.tabs = contentToSave.whyChooseUs.tabs.map(
        (tab: any) => ({
          title: tab.title || "",
          icon: tab.icon || "star",
          contentTitle: tab.contentTitle || tab.title || "",
          description: tab.description || "",
        })
      );
    }

    // Ensure all required fields are present in the features
    if (contentToSave.whyChooseUs.features) {
      contentToSave.whyChooseUs.features =
        contentToSave.whyChooseUs.features.map((feature: any) => ({
          icon: feature.icon || "star",
          title: feature.title || "",
          description: feature.description || "",
        }));
    }

    // Ensure all required fields are present in the projects
    if (contentToSave.projects.items) {
      contentToSave.projects.items = contentToSave.projects.items.map(
        (project: any) => ({
          title: project.title || "",
          imageUrl: project.imageUrl || "",
          category: project.category || "",
          description: project.description || "",
        })
      );
    }

    // Ensure all required fields are present in the contact info
    if (contentToSave.contactInfo.items) {
      contentToSave.contactInfo.items = contentToSave.contactInfo.items.map(
        (item: any) => ({
          icon: item.icon || "star",
          title: item.title || "",
          details: item.details || "",
        })
      );
    }

    // Find the existing document or create a new one if it doesn't exist
    let contactContent = await ContactPageModel.findOne();

    if (contactContent) {
      // Update existing document with new content
      contactContent.set(contentToSave);
      await contactContent.save();
    } else {
      // Create new document
      contactContent = await ContactPageModel.create(contentToSave);
    }

    // Return the saved content in the same format as fetchContent
    return NextResponse.json({
      hero: contactContent.hero,
      whyChooseUs: contactContent.whyChooseUs,
      projects: contactContent.projects,
      contactInfo: contactContent.contactInfo,
      // Note: appointmentForm is not included here as it's handled separately
    });
  } catch (error) {
    console.error("Error updating contact page content:", error);
    return NextResponse.json(
      { error: "Failed to update contact page content" },
      { status: 500 }
    );
  }
}
