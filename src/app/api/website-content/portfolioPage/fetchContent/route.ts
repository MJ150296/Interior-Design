import PortfolioPage from "@/app/model/website-content/PortfolioPage.model";
import dbConnect from "@/app/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    let portfolioContent = await PortfolioPage.findOne();
    
    if (!portfolioContent) {
      // Create default if not found
      portfolioContent = new PortfolioPage({
        hero: {
          backgroundImageUrl: "/Riddhi Interior Design/Projects/cover.jpg",
          title: "Project Portfolio",
          subtitle: "We Have Solutions for All Your Space Related Issues!",
          preTitle: "OUR EXCLUSIVE CLIENT",
        },
        quotes: [
          {
            text: "“The details are not the details. They make the design.”",
            author: "- Charles Eames",
          },
        ],
        residentialProjects: [
          {
            id: 1,
            title: "Elegant Living",
            location: "Dehradun",
            category: "Living Room",
            imageUrl: "/Riddhi Interior Design/masonry-1.jpg",
            hoverTitle: "Elegant Living",
            hoverDescription: "Cozy and refined home interiors.",
          },
        ],
        commercialProjects: [
          {
            id: 1,
            title: "Corporate Class",
            location: "Haridwar",
            category: "Office",
            imageUrl: "/Riddhi Interior Design/masonry-4.jpg",
            hoverTitle: "Corporate Class",
            hoverDescription: "Workspaces that inspire productivity.",
          },
        ],
        stats: [
          { value: "250+", label: "Projects Completed" },
          { value: "98%", label: "Client Satisfaction" },
        ],
        cta: {
          title: "Ready to Start Your Project?",
          description: "Schedule a free consultation with our design experts",
        },
      });

      await portfolioContent.save();
    }

    return NextResponse.json(portfolioContent, { status: 200 });
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch portfolio content" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  await dbConnect();

  try {
    const contentData = await req.json();
    let portfolioContent = await PortfolioPage.findOne();

    if (!portfolioContent) {
      portfolioContent = new PortfolioPage(contentData);
    } else {
      portfolioContent.set(contentData);
    }

    await portfolioContent.save();
    return NextResponse.json(portfolioContent, { status: 200 });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: "Failed to update portfolio content" },
      { status: 500 }
    );
  }
}