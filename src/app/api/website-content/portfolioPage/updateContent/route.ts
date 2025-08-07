import PortfolioPageModel from "@/app/model/website-content/PortfolioPage.model";
import dbConnect from "@/app/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  await dbConnect();

  try {
    const contentData = await req.json();
    let content = await PortfolioPageModel.findOne();

    if (!content) {
      content = new PortfolioPageModel(contentData);
    } else {
      content.set(contentData);
    }

    await content.save();
    return NextResponse.json(content, { status: 200 });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: "Failed to update portfolio content" },
      { status: 500 }
    );
  }
}