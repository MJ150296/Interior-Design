// app/model/website-content/AppointmentForm.model.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IAppointmentForm extends Document {
  title: string;
  description: string;
  fields: {
    name: { label: string; placeholder: string };
    email: { label: string; placeholder: string };
    contactNumber: { label: string; placeholder: string };
    message: { label: string; placeholder: string };
  };
  buttonText: string;
}

const AppointmentFormSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  fields: {
    name: {
      label: { type: String, required: true },
      placeholder: { type: String, required: true },
    },
    email: {
      label: { type: String, required: true },
      placeholder: { type: String, required: true },
    },
    contactNumber: {
      label: { type: String, required: true },
      placeholder: { type: String, required: true },
    },
    message: {
      label: { type: String, required: true },
      placeholder: { type: String, required: true },
    },
  },
  buttonText: { type: String, required: true },
});

export default mongoose.models.AppointmentForm ||
  mongoose.model<IAppointmentForm>("AppointmentForm", AppointmentFormSchema);
