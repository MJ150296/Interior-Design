// app/api/website-content/testimonialPage/fetchContent/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/app/utils/dbConnect";
import BlogPageModel from "@/app/model/website-content/BlogPage.model";

export async function GET() {
  await dbConnect();

  try {
    const content = await BlogPageModel.findOne();
    return NextResponse.json(content ?? null, { status: 200 });
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch content" },
      { status: 500 },
    );
  }
}
