"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";

type AppointmentFormInputs = {
  name: string;
  email: string;
  contactNumber: string;
  subject: string;
  message: string;
};

interface BookAppointmentFormProps {
  onClose: () => void;
}

const BookAppointmentForm: React.FC<BookAppointmentFormProps> = ({
  onClose,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<AppointmentFormInputs>();

  const onSubmit: SubmitHandler<AppointmentFormInputs> = async (data) => {
    console.log("Appointment form submitted:", data);

    // Construct the message to send via WhatsApp
    const message = `
      *Appointment Request:*
      *Name:* ${data.name}
      *Email:* ${data.email}
      *Contact Number:* ${data.contactNumber}
      *Subject:* ${data.subject}
      *Message:* ${data.message}
    `;

    // URL encode the message
    const encodedMessage = encodeURIComponent(message);

    // Specify the WhatsApp number (you can replace this with a real number)
    const phoneNumber = "919711569405"; // Replace with the WhatsApp number you want to send to

    // Generate the WhatsApp link
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    // Redirect the user to WhatsApp
    window.open(whatsappUrl, "_blank");

    await new Promise((res) => setTimeout(res, 1500)); // Simulate API call
    reset();
    setTimeout(onClose, 2000); // Close popup after 2s
  };

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.animate(
        [
          { transform: "scale(0.5)", opacity: 0 },
          { transform: "scale(1.05)", opacity: 1 },
          { transform: "scale(1)", opacity: 1 },
        ],
        {
          duration: 600,
          easing: "ease-out",
          fill: "forwards",
        }
      );
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md relative"
    >
      <button
        onClick={onClose}
        className="absolute top-2 right-3 text-xl font-bold text-gray-600 hover:text-red-500"
      >
        ✕
      </button>

      <h2 className="text-2xl font-semibold mb-4 text-center">
        Book Appointment
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Name */}
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="Your Name"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && (
            <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Your Email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email address",
              },
            })}
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Contact Number */}
        <div>
          <Label htmlFor="contactNumber">Contact Number</Label>
          <Input
            id="contactNumber"
            type="tel"
            placeholder="Your Contact Number"
            {...register("contactNumber", {
              required: "Contact number is required",
              minLength: {
                value: 10,
                message: "Contact number must be at least 10 digits",
              },
            })}
          />
          {errors.contactNumber && (
            <p className="text-red-600 text-sm mt-1">
              {errors.contactNumber.message}
            </p>
          )}
        </div>

        {/* Subject */}
        <div>
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            placeholder="Subject"
            {...register("subject", { required: "Subject is required" })}
          />
          {errors.subject && (
            <p className="text-red-600 text-sm mt-1">
              {errors.subject.message}
            </p>
          )}
        </div>

        {/* Message */}
        <div>
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            placeholder="Your Message"
            rows={5}
            {...register("message", { required: "Message is required" })}
          />
          {errors.message && (
            <p className="text-red-600 text-sm mt-1">
              {errors.message.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Submit"}
        </Button>

        {isSubmitSuccessful && (
          <p className="text-green-600 text-center mt-3">
            Thank you! Your appointment request has been sent.
          </p>
        )}
      </form>
    </div>
  );
};

export default BookAppointmentForm;
