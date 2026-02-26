"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";

// Zod schema
const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  contactNumber: z
    .string()
    .min(10, "Contact number must be at least 10 digits")
    .max(15, "Contact number is too long"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type AppointmentFormInputs = z.infer<typeof contactFormSchema>;

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
  } = useForm<AppointmentFormInputs>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: AppointmentFormInputs) => {
    console.log("Appointment form submitted:", data);

    const message = `
      *Appointment Request:*
      *Name:* ${data.name}
      *Email:* ${data.email}
      *Contact Number:* ${data.contactNumber}
      *Message:* ${data.message}
    `;

    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = "917895927366";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");

    await new Promise((res) => setTimeout(res, 1500));
    reset();
    setTimeout(onClose, 2000);
  };

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    containerRef.current?.animate(
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
  }, []);

  return (
    <div
      ref={containerRef}
      className="bg-lime-100 dark:bg-[#1a1a1a] text-[#3a3632] dark:text-[#e8e6e3] p-8 rounded-xl shadow-lg w-full max-w-md relative border border-[#e8e2d9] dark:border-[#2d2a26]"
      style={{
        backgroundImage: "radial-gradient(#e8e2d9 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      <button
        onClick={onClose}
        className="absolute top-10 right-4 text-xl font-light text-[#8a8379] dark:text-[#8a8379] hover:text-[#c8a97e] dark:hover:text-[#c8a97e] transition-colors duration-300"
      >
        ✕
      </button>

      <div className="text-center mb-6">
        <div className="mx-auto w-16 h-1 bg-lime-700 mb-3 rounded-full"></div>
        <h2 className="text-2xl text-lime-900 font-medium tracking-wide font-serif">
          Book Consultation
        </h2>
        <p className="text-sm font-serif italic tracking-wide text-gray-800 dark:text-[#8a8379] mt-1">
          Let&apos;s create your dream space together
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Name Field */}
        <div>
          <Label
            htmlFor="name"
            className="font-medium text-lime-900 dark:text-[#e8e6e3] mb-1 block pl-1"
          >
            Name
          </Label>
          <Input
            id="name"
            className="bg-lime-50 dark:bg-lime-50 border-[#d9d2c5] dark:border-[#3a3632] focus:border-[#c8a97e] focus:ring-1 focus:ring-[#c8a97e] rounded-lg py-5 px-4 transition-all duration-300 placeholder-[#a0988c]"
            {...register("name")}
            placeholder="Your full name"
          />
          {errors.name && (
            <p className="text-red-600 text-sm mt-1 pl-1">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <Label
            htmlFor="email"
            className="font-medium text-lime-900 dark:text-[#e8e6e3] mb-1 block pl-1"
          >
            Email
          </Label>
          <Input
            id="email"
            type="email"
            className="bg-lime-50 dark:bg-lime-50 border-[#d9d2c5] dark:border-[#3a3632] focus:border-[#c8a97e] focus:ring-1 focus:ring-[#c8a97e] rounded-lg py-5 px-4 transition-all duration-300 placeholder-[#a0988c]"
            {...register("email")}
            placeholder="your.email@example.com"
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1 pl-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Contact Number Field */}
        <div>
          <Label
            htmlFor="contactNumber"
            className="font-medium text-lime-900 dark:text-[#e8e6e3] mb-1 block pl-1"
          >
            Contact Number
          </Label>
          <Input
            id="contactNumber"
            type="tel"
            className="bg-lime-50 dark:bg-[#23201c] border-[#d9d2c5] dark:border-[#3a3632] focus:border-[#c8a97e] focus:ring-1 focus:ring-[#c8a97e] rounded-lg py-5 px-4 transition-all duration-300 placeholder-[#a0988c]"
            {...register("contactNumber")}
            placeholder="+91 123 456 7890"
          />
          {errors.contactNumber && (
            <p className="text-red-600 text-sm mt-1 pl-1">
              {errors.contactNumber.message}
            </p>
          )}
        </div>

        {/* Message Field */}
        <div>
          <Label
            htmlFor="message"
            className="font-medium text-lime-900 dark:text-[#e8e6e3] mb-1 block pl-1"
          >
            Message
          </Label>
          <Textarea
            id="message"
            rows={5}
            className="bg-lime-50 dark:bg-[#23201c] border-[#d9d2c5] dark:border-[#3a3632] focus:border-[#c8a97e] focus:ring-1 focus:ring-[#c8a97e] rounded-lg py-4 px-4 transition-all duration-300 placeholder-[#a0988c] min-h-30"
            {...register("message")}
            placeholder="Tell us about your project..."
          />
          {errors.message && (
            <p className="text-red-600 text-sm mt-1 pl-1">
              {errors.message.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-lime-600 hover:bg-lime-700 hover:cursor-pointer text-white font-medium tracking-wide py-5 rounded-lg transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#c8a97e] focus:ring-opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </span>
          ) : (
            "Request Appointment"
          )}
        </Button>

        {isSubmitSuccessful && (
          <div className="bg-[#f0ede8] dark:bg-[#23201c] border border-[#d9d2c5] dark:border-[#3a3632] p-3 rounded-lg mt-4 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-[#c8a97e] mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-[#8a8379] dark:text-[#8a8379]">
              Thank you! We&apos;ll contact you shortly to confirm.
            </span>
          </div>
        )}
      </form>
    </div>
  );
};

export default BookAppointmentForm;
