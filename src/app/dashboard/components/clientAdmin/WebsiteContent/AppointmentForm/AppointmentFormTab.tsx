import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AppointmentFormData } from "@/app/redux/slices/appointmentFormSlice";

interface AppointmentFormTabProps {
  appointmentFormData: AppointmentFormData;
  handleAppointmentInputChange: (path: string, value: string) => void;
}

const AppointmentFormTab: React.FC<AppointmentFormTabProps> = ({
  appointmentFormData,
  handleAppointmentInputChange,
}) => {
  return (
    <Card className="bg-white dark:bg-slate-800 border-lime-200 dark:border-slate-700 overflow-hidden">
      <CardHeader className="bg-lime-50 dark:bg-slate-700">
        <CardTitle className="text-lime-900 dark:text-lime-100">
          Appointment Form Section
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div>
            <Label>Section Title</Label>
            <Input
              value={appointmentFormData?.title || ""}
              onChange={(e) =>
                handleAppointmentInputChange("title", e.target.value)
              }
              className="mt-1 focus:ring-lime-500 focus:border-lime-500"
            />
          </div>

          <div>
            <Label>Section Description</Label>
            <Textarea
              value={appointmentFormData?.description || ""}
              onChange={(e) =>
                handleAppointmentInputChange("description", e.target.value)
              }
              rows={3}
              className="mt-1 focus:ring-lime-500 focus:border-lime-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Name Field Label</Label>
              <Input
                value={appointmentFormData?.fields.name.label || ""}
                onChange={(e) =>
                  handleAppointmentInputChange(
                    "fields.name.label",
                    e.target.value
                  )
                }
                className="mt-1 focus:ring-lime-500 focus:border-lime-500"
              />
            </div>
            <div>
              <Label>Name Field Placeholder</Label>
              <Input
                value={appointmentFormData?.fields.name.placeholder || ""}
                onChange={(e) =>
                  handleAppointmentInputChange(
                    "fields.name.placeholder",
                    e.target.value
                  )
                }
                className="mt-1 focus:ring-lime-500 focus:border-lime-500"
              />
            </div>

            <div>
              <Label>Email Field Label</Label>
              <Input
                value={appointmentFormData?.fields.email.label || ""}
                onChange={(e) =>
                  handleAppointmentInputChange(
                    "fields.email.label",
                    e.target.value
                  )
                }
                className="mt-1 focus:ring-lime-500 focus:border-lime-500"
              />
            </div>
            <div>
              <Label>Email Field Placeholder</Label>
              <Input
                value={appointmentFormData?.fields.email.placeholder || ""}
                onChange={(e) =>
                  handleAppointmentInputChange(
                    "fields.email.placeholder",
                    e.target.value
                  )
                }
                className="mt-1 focus:ring-lime-500 focus:border-lime-500"
              />
            </div>

            <div>
              <Label>Contact Number Field Label</Label>
              <Input
                value={appointmentFormData?.fields.contactNumber.label || ""}
                onChange={(e) =>
                  handleAppointmentInputChange(
                    "fields.contactNumber.label",
                    e.target.value
                  )
                }
                className="mt-1 focus:ring-lime-500 focus:border-lime-500"
              />
            </div>
            <div>
              <Label>Contact Number Field Placeholder</Label>
              <Input
                value={
                  appointmentFormData?.fields.contactNumber.placeholder || ""
                }
                onChange={(e) =>
                  handleAppointmentInputChange(
                    "fields.contactNumber.placeholder",
                    e.target.value
                  )
                }
                className="mt-1 focus:ring-lime-500 focus:border-lime-500"
              />
            </div>

            <div>
              <Label>Message Field Label</Label>
              <Input
                value={appointmentFormData?.fields.message.label || ""}
                onChange={(e) =>
                  handleAppointmentInputChange(
                    "fields.message.label",
                    e.target.value
                  )
                }
                className="mt-1 focus:ring-lime-500 focus:border-lime-500"
              />
            </div>
            <div>
              <Label>Message Field Placeholder</Label>
              <Input
                value={appointmentFormData?.fields.message.placeholder || ""}
                onChange={(e) =>
                  handleAppointmentInputChange(
                    "fields.message.placeholder",
                    e.target.value
                  )
                }
                className="mt-1 focus:ring-lime-500 focus:border-lime-500"
              />
            </div>
          </div>

          <div>
            <Label>Button Text</Label>
            <Input
              value={appointmentFormData?.buttonText || ""}
              onChange={(e) =>
                handleAppointmentInputChange("buttonText", e.target.value)
              }
              className="mt-1 focus:ring-lime-500 focus:border-lime-500"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentFormTab;
