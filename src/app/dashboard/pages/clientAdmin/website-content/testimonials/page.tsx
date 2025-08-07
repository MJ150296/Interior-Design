import React from "react";

const testimonials = [
  {
    name: "Amit Sharma",
    feedback:
      "Riddhi Interiors transformed our home beautifully. Highly recommended!",
    company: "Homeowner",
  },
  {
    name: "Priya Singh",
    feedback: "Professional team and excellent service. Loved the designs!",
    company: "Business Owner",
  },
  {
    name: "Rahul Verma",
    feedback: "Great attention to detail and timely delivery.",
    company: "Apartment Resident",
  },
];

export default function TestimonialsPage() {
  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Client Testimonials</h1>
      <div className="space-y-6">
        {testimonials.map((testimonial, idx) => (
          <div key={idx} className="bg-white shadow rounded p-4">
            <p className="text-lg italic">&quot;{testimonial.feedback}&quot;</p>
            <div className="mt-2 flex items-center justify-between">
              <span className="font-semibold">{testimonial.name}</span>
              <span className="text-sm text-gray-500">
                {testimonial.company}
              </span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
