// app/api/auth/checkClientAdmin/route.ts
import { getClientAdminStatus } from "@/app/utils/globalStore";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const clientAdminExists = await getClientAdminStatus();
    return NextResponse.json({ clientAdminExists });
  } catch (error) {
    console.error("Error checking ClientAdmin status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
