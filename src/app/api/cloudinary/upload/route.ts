// src/app/api/cloudinary/upload/route.ts

import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { requireRoles } from "@/app/api/_utils/requireRoles";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  const guard = await requireRoles(["SuperAdmin", "clientAdmin"]);
  if (!guard.ok) {
    return guard.response;
  }

  const formData = await request.formData();
  const file = formData.get("file") as File;
  const folderPath = formData.get("folderPath") as string;
  const identifier = formData.get("identifier") as string;

  if (!file || !folderPath) {
    return NextResponse.json(
      { error: "Missing file or folderPath" },
      { status: 400 }
    );
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");
    const dataURI = `data:${file.type};base64,${base64}`;

    // 1. Delete ALL files in the specified folder
    const deleteResult = await cloudinary.api.delete_resources_by_prefix(
      `${folderPath}/`,
      {
        resource_type: "image",
        type: "upload",
        invalidate: true,
      }
    );

    console.log("Deleted files:", deleteResult);

    // 2. Upload new file
    const uploadResult = await cloudinary.uploader.upload(dataURI, {
      folder: folderPath,
      public_id: identifier,
      resource_type: "auto",
      overwrite: true,
      unique_filename: false,
      use_filename: true,
    });

    return NextResponse.json({
      secure_url: uploadResult.secure_url,
    });
  } catch (error: unknown) {
    console.error("Upload error:", error);

    const message = error instanceof Error ? error.message : "Upload failed";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
