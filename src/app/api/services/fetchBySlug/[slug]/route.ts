import ServiceModel from "@/app/model/Service.model";
import dbConnect from "@/app/utils/dbConnect";
import { NextResponse } from "next/server";

interface Params {
  params: { slug: string };
}

export async function GET(_req: Request, { params }: Params) {
  await dbConnect();
  try {
    const { slug } = await params;
    const service = await ServiceModel.findOne({ slug }).lean();
    return NextResponse.json(service ?? null, { status: 200 });
  } catch (error) {
    console.error("Service slug fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch service" }, { status: 500 });
  }
}
