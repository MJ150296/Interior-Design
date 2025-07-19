"use client"; // Use this for client-side rendering

import React, { useState } from "react";
import "animate.css";

type FormData = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

const BookAppointmentForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [showSuccess, setShowSuccess] = useState(false);


  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    } else if (formData.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Email is invalid.";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required.";
    } else if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      console.log("Form Data Submitted:", formData);
      setShowSuccess(true);

      // Prepare WhatsApp message with form data for dentist appointment
      const whatsappMessage = `Hello, I would like to book a dental appointment. Here are my details:
        - Name: ${formData.name}
        - Email: ${formData.email}
        - Phone: ${formData.phone}
        - Message: ${formData.message}
        
        Please let me know the available slots for an appointment.`;

      const whatsappURL = `https://wa.me/+918368847831?text=${encodeURIComponent(
        whatsappMessage
      )}`;

      // Open WhatsApp with the message
      window.open(whatsappURL, "_blank");

      // Reset form after success
      setTimeout(() => {
        setFormData({ name: "", email: "", phone: "", message: "" });
        setErrors({});
        setShowSuccess(false);
      }, 3000);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-gradient-to-br from-blue-100 to-white shadow-xl rounded-lg animate__animated animate__fadeIn">
      <h2 className="text-3xl font-bold text-center text-green-600 animate__animated animate__fadeInDown">
        Book an Appointment
      </h2>

      {showSuccess && (
        <div className="bg-green-100 text-green-800 px-4 py-3 mt-4 rounded-md shadow animate__animated animate__fadeIn">
          <p>Thank you! Your appointment request has been submitted.</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-4 animate__animated animate__zoomIn"
      >
        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full mt-1 p-3 border ${
              errors.name ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:ring focus:ring-blue-200 transition duration-200`}
            placeholder="Your Name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full mt-1 p-3 border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:ring focus:ring-blue-200 transition duration-200`}
            placeholder="Your Email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full mt-1 p-3 border ${
              errors.phone ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:ring focus:ring-blue-200 transition duration-200`}
            placeholder="Your Phone Number"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        {/* Message Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Message
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            className={`w-full mt-1 p-3 border ${
              errors.message ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:ring focus:ring-blue-200 transition duration-200`}
            placeholder="Your Message"
            rows={5}
          ></textarea>
          {errors.message && (
            <p className="text-red-500 text-sm mt-1">{errors.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 shadow-md animate__animated animate__pulse"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default BookAppointmentForm;
