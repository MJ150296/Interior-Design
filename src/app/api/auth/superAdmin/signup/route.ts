import { NextResponse } from "next/server";
import UserModel from "@/app/model/User.model";
import superAdminModel from "@/app/model/superAdmin.model";
import dbConnect from "@/app/utils/dbConnect";
import { setSuperAdminStatus } from "@/app/utils/globalStore";
import { auth } from "@/app/auth";

// ✅ Define the expected structure of req.json()
interface SuperAdminRequest {
  email: string;
  password: string;
  role: string;
  fullName?: string;
  contactNumber?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
  };
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    // ✅ Explicitly type the parsed JSON
    const {
      email,
      password,
      fullName,
      contactNumber,
      address,
    }: SuperAdminRequest = await req.json();

    // ✅ Check if SuperAdmin already exists
    const existingSuperAdmin = await UserModel.findOne({ role: "SuperAdmin" });

    if (existingSuperAdmin) {
      const session = await auth();
      if (!session?.user || session.user.role !== "SuperAdmin") {
        return NextResponse.json(
          { error: "Forbidden" },
          { status: 403 }
        );
      }
      return NextResponse.json(
        { error: "SuperAdmin already exists." },
        { status: 400 }
      );
    }

    // ✅ Create User First
    const user = new UserModel({ email, password, role: "SuperAdmin" });
    await user.save();

    // ✅ Create SuperAdmin linked to User
    const superAdmin = new superAdminModel({
      userId: user._id,
      fullName: fullName ?? "Super Admin", // Default if not provided
      contactNumber: contactNumber ?? "0000000000",
      address: address ?? { street: "", city: "", state: "", postalCode: "" },
    });

    await superAdmin.save();

    // ✅ Persist the status in MongoDB
    await setSuperAdminStatus(true);

    return NextResponse.json(
      { message: "SuperAdmin created successfully.", user, superAdmin },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating SuperAdmin:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
