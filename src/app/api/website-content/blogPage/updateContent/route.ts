import { NextResponse } from "next/server";
import dbConnect from "@/app/utils/dbConnect";
import BlogPageModel from "@/app/model/website-content/BlogPage.model";

export async function PUT(request: Request) {
  try {
    await dbConnect();

    const content = await request.json();

    // Update or create the blog page content
    const updatedContent = await BlogPageModel.findOneAndUpdate(
      {},
      { ...content },
      { new: true, upsert: true, runValidators: true }
    );

    return NextResponse.json(updatedContent);
  } catch (error) {
    console.error("Error updating blog page content:", error);
    return NextResponse.json(
      { error: "Failed to update blog page content" },
      { status: 500 }
    );
  }
}