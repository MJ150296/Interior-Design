import PortfolioPageModel, {
  IPortfolioPage,
  IProject,
} from "@/app/model/website-content/PortfolioPage.model";
import dbConnect from "@/app/utils/dbConnect";
import { requireRoles } from "@/app/api/_utils/requireRoles";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const guard = await requireRoles(["SuperAdmin", "clientAdmin"]);
  if (!guard.ok) {
    return guard.response;
  }

  await dbConnect();

  try {
    const contentData: IPortfolioPage = await req.json();
    let content = await PortfolioPageModel.findOne();

    if (!content) {
      content = new PortfolioPageModel(contentData);
    } else {
      // Ensure exploreLink field exists for all projects
      if (contentData.residentialProjects) {
        contentData.residentialProjects.forEach((project: IProject) => {
          if (!project.exploreLink) project.exploreLink = "";
        });
      }

      if (contentData.commercialProjects) {
        contentData.commercialProjects.forEach((project: IProject) => {
          if (!project.exploreLink) project.exploreLink = "";
        });
      }

      content.set(contentData);
    }

    await content.save();
    return NextResponse.json(content, { status: 200 });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: "Failed to update portfolio content" },
      { status: 500 }
    );
  }
}
