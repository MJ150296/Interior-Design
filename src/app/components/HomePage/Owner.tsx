import useInView from "@/app/hooks/useInView";
import Image from "next/image";
import React from "react";

const Owner: React.FC = () => {
  const { ref, isVisible } = useInView();
  return (
    <div ref={ref} className="w-full p-5 overflow-x-hidden">
      {/* Owner Section */}
      <div className="px-5 py-8 flex flex-col md:flex-row w-full items-center">
        {/* Image Section */}
        <div
          className={`w-full md:w-1/3 flex justify-center items-center mb-6 md:mb-0 transition-all duration-1000 ease-in-out transform ${
            isVisible
              ? "translate-x-0 opacity-100"
              : "-translate-x-10 opacity-0"
          }`}
        >
          <Image
            src="/Riddhi Interior Design/owner.jpg" // Ensure this image exists
            alt="Owner - John Doe"
            width={400}
            height={400}
            className="rounded-lg shadow-lg object-cover"
          />
        </div>

        {/* Content Section */}
        <div
          className={`w-full md:w-2/3 pl-0 md:pl-20 transition-all duration-1400 ease-in-out transform ${
            isVisible ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"
          }`}
        >
          <h2 className="text-4xl font-semibold mb-4 text-amber-950 italic">
            Meet Our Founder & Lead Designer <br />
            <span className="text-amber-500">John Doe</span>
          </h2>

          <p className="mb-4 text-lg">
            <strong>John Doe</strong>, the visionary behind{" "}
            <strong>Riddhi Interiors</strong>, brings over a decade of
            experience in transforming ordinary spaces into extraordinary
            interiors. With a deep understanding of aesthetics, function, and
            form, John has successfully designed residential and commercial
            spaces that reflect both elegance and purpose.
          </p>

          <p className="mb-8 text-lg">
            Specializing in <strong>modern minimalism</strong>,{" "}
            <strong>classic luxury interiors</strong>, and personalized
            renovation strategies, John works closely with clients to understand
            their aspirations and lifestyle before creating tailor-made
            solutions. His designs seamlessly blend tradition with innovation,
            ensuring every project is unique and timeless.
          </p>

          <p className="mb-8 text-lg italic border-l-4 border-amber-500 pl-4">
            “Design is not just about what you see. It’s how you live in the
            space. My goal is to create interiors that feel as good as they
            look.”
          </p>

          <div className="flex flex-wrap gap-4 mt-6">
            <a
              href="/contact-us"
              className="px-6 py-3 bg-amber-500 text-white font-medium rounded-xl shadow hover:bg-amber-950 transition"
            >
              Get in Touch
            </a>
            <a
              href="/gallery"
              className="px-6 py-3 bg-amber-950 text-white font-medium rounded-xl shadow hover:bg-amber-500 transition"
            >
              Explore His Work
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Owner;
