// app/api/website-content/testimonialPage/updateContent/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/app/utils/dbConnect";
import TestimonialPageModel from "@/app/model/website-content/TestimonialPage.model";

export async function PUT(request: Request) {
  try {
    await dbConnect();

    const content = await request.json();

    // Find existing content or create new
    let testimonialContent = await TestimonialPageModel.findOne();

    if (!testimonialContent) {
      testimonialContent = new TestimonialPageModel(content);
    } else {
      testimonialContent.set(content);
    }

    // Save to database
    await testimonialContent.save();

    return NextResponse.json({
      success: true,
      message: "Testimonial page content updated successfully",
      data: testimonialContent,
    });
  } catch (error) {
    console.error("Error updating testimonial page content:", error);
    return NextResponse.json(
      { error: "Failed to update testimonial page content" },
      { status: 500 }
    );
  }
}
