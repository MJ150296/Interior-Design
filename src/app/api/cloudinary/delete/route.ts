// src/app/api/cloudinaryDeleteFolder/route.ts
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(request: NextRequest) {
  try {
    const { folderPath }: { folderPath: string } = await request.json();

    console.log("Delete request for folderPath:", folderPath);

    if (!folderPath) {
      return NextResponse.json(
        { error: "Missing folderPath parameter" },
        { status: 400 }
      );
    }

    // Find all resources in the given "folder" (prefix)
    const resources = await cloudinary.api.resources({
      type: "upload",
      prefix: folderPath,
      max_results: 500,
    });

    console.log(
      `Found ${resources.resources.length} resources in folder ${folderPath}`
    );

    if (resources.resources.length > 0) {
      const publicIds = resources.resources.map((r: any) => r.public_id);
      const deleteResult = await cloudinary.api.delete_resources(publicIds);

      console.log("Delete resources result:", deleteResult);
      return NextResponse.json({
        message: `Deleted ${publicIds.length} assets from ${folderPath}`,
        result: deleteResult,
      });
    }

    return NextResponse.json({
      message: `No resources found in ${folderPath}`,
    });
  } catch (error: unknown) {
    console.error("Delete error:", error);
    const message = error instanceof Error ? error.message : "Delete failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
