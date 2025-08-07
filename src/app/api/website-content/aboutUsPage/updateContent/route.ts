import AboutUsPageModel from "@/app/model/website-content/AboutUsPage.model";
import dbConnect from "@/app/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  await dbConnect();

  try {
    const contentData = await req.json();
    let content = await AboutUsPageModel.findOne();

    if (!content) {
      content = new AboutUsPageModel(contentData);
    } else {
      content.set(contentData);
    }

    await content.save();
    return NextResponse.json(content, { status: 200 });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: "Failed to update content" },
      { status: 500 }
    );
  }
}