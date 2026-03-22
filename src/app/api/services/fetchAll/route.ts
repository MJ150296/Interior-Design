import ServiceModel from "@/app/model/Service.model";
import dbConnect from "@/app/utils/dbConnect";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  try {
    const services = await ServiceModel.find().lean();
    return NextResponse.json(services, { status: 200 });
  } catch (error) {
    console.error("Service fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}
