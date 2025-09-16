// app/api/website-content/appointmentForm/fetchContent/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/app/utils/dbConnect";
import AppointmentFormModel from "@/app/model/website-content/AppointmentForm.model";

const defaultAppointmentForm = {
  title: "Schedule Your Design Consultation",
  description:
    "Fill out the form below and our design team will contact you to discuss your project",
  fields: {
    name: { label: "Name", placeholder: "Your full name" },
    email: { label: "Email", placeholder: "your.email@example.com" },
    contactNumber: { label: "Contact Number", placeholder: "+91 123 456 7890" },
    message: { label: "Message", placeholder: "Tell us about your project..." },
  },
  buttonText: "Request Appointment",
};

export async function GET() {
  try {
    await dbConnect();

    let appointmentForm = await AppointmentFormModel.findOne().lean();

    if (!appointmentForm) {
      const createdForm = await AppointmentFormModel.create(
        defaultAppointmentForm
      );
      appointmentForm = createdForm.toObject(); // ensure plain object
    }

    return NextResponse.json(appointmentForm);
  } catch (error) {
    console.error("Error fetching appointment form content:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointment form content" },
      { status: 500 }
    );
  }
}
