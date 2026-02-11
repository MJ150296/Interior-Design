import { NextResponse } from "next/server";
import UserModel from "@/app/model/User.model";
import clientAdminModel from "@/app/model/clientAdmin.model"; // Import client admin model
import dbConnect from "@/app/utils/dbConnect";
import { setClientAdminStatus } from "@/app/utils/globalStore";
import { requireRoles } from "@/app/api/_utils/requireRoles";

// ✅ Define request structure for Client Admin
interface ClientAdminRequest {
  email: string;
  password: string;
  role: string;
  fullName: string;
  contactNumber: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
  };
  permissions?: Record<string, boolean>;
}

export async function POST(req: Request) {
  const guard = await requireRoles(["SuperAdmin"]);
  if (!guard.ok) {
    return guard.response;
  }

  try {
    await dbConnect();
    const {
      email,
      password,
      fullName,
      contactNumber,
      address,
      permissions,
    }: ClientAdminRequest = await req.json();

    // ✅ Check if SuperAdmin exists
    const superAdminExists = await UserModel.findOne({ role: "SuperAdmin" });
    if (!superAdminExists) {
      return NextResponse.json(
        { error: "SuperAdmin must be created first." },
        { status: 403 }
      );
    }

    // ✅ Check for existing email
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered." },
        { status: 400 }
      );
    }

    // ✅ Create User
    const user = new UserModel({ email, password, role: "clientAdmin" });
    await user.save();

    // ✅ Create Client Admin profile
    const clientAdmin = new clientAdminModel({
      userId: user._id,
      fullName,
      contactNumber,
      address: address || {
        street: "",
        city: "",
        state: "",
        postalCode: "",
      },
      permissions: permissions || { canAddGuest: true },
    });

    await clientAdmin.save();

    // ✅ Persist the status in MongoDB
    await setClientAdminStatus(true);

    return NextResponse.json(
      {
        message: "Client Admin created successfully.",
        user,
        clientAdmin,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating Client Admin:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
