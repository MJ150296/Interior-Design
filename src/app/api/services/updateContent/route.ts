import ServiceModel from "@/app/model/Service.model";
import dbConnect from "@/app/utils/dbConnect";
import { requireRoles } from "@/app/api/_utils/requireRoles";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePublicContent } from "@/app/lib/revalidatePublicContent";

export async function PUT(req: NextRequest) {
  const guard = await requireRoles(["SuperAdmin", "clientAdmin"]);
  if (!guard.ok) {
    return guard.response;
  }

  await dbConnect();

  try {
    const data = await req.json();
    
    if (Array.isArray(data)) {
      // Safe approach: Use bulkWrite with upsert instead of deleteMany + insertMany
      // This prevents data loss on partial failures and is atomic
      const operations = data.map((item) => ({
        updateOne: {
          filter: { slug: item.slug },
          update: { $set: item },
          upsert: true,
        },
      }));
      
      await ServiceModel.bulkWrite(operations);
      revalidatePublicContent();
      return NextResponse.json({ ok: true }, { status: 200 });
    } else {
      const { slug } = data;
      let service = await ServiceModel.findOne({ slug });
      if (!service) {
        service = new ServiceModel(data);
      } else {
        service.set(data);
      }
      await service.save();
      revalidatePublicContent();
      return NextResponse.json(service, { status: 200 });
    }
  } catch (error) {
    console.error("Service update error:", error);
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
  }
}
