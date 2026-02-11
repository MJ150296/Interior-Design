// app/api/website-content/appointmentForm/updateContent/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/app/utils/dbConnect";
import AppointmentFormModel from "@/app/model/website-content/AppointmentForm.model";
import { requireRoles } from "@/app/api/_utils/requireRoles";

export async function PUT(request: Request) {
  const guard = await requireRoles(["SuperAdmin", "clientAdmin"]);
  if (!guard.ok) {
    return guard.response;
  }

  try {
    await dbConnect();

    const formData = await request.json();

    let appointmentForm = await AppointmentFormModel.findOne();

    if (appointmentForm) {
      appointmentForm.title = formData.title || appointmentForm.title;
      appointmentForm.description =
        formData.description || appointmentForm.description;
      appointmentForm.fields = formData.fields || appointmentForm.fields;
      appointmentForm.buttonText =
        formData.buttonText || appointmentForm.buttonText;

      await appointmentForm.save();
    } else {
      appointmentForm = await AppointmentFormModel.create(formData);
    }

    return NextResponse.json(appointmentForm);
  } catch (error) {
    console.error("Error updating appointment form content:", error);
    return NextResponse.json(
      { error: "Failed to update appointment form content" },
      { status: 500 }
    );
  }
}
