// app/api/about/route.ts
import AboutUsPageModel from "@/app/model/website-content/AboutUsPage.model";
import dbConnect from "@/app/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const content = await AboutUsPageModel.findOne();
    return NextResponse.json(content ?? null, { status: 200 });
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch content" },
      { status: 500 }
    );
  }
}


