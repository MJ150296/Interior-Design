import useInView from "@/app/hooks/useInView";
import Image from "next/image";
import React from "react";

const About: React.FC = () => {
    const { ref, isVisible } = useInView();
  return (
    <div ref={ref} className={`w-full p-5 transition-all duration-700 ease-in-out transform ${
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
    }`}>
      {/* About content */}
      <div className="px-5 py-8 flex flex-col md:flex-row w-full">
        <div className="w-full md:w-2/3 pr-20">
          <h2 className="text-4xl font-semibold mb-4 text-amber-950 italic">
            Crafting Dream Spaces with Elegance <br />
            <span className="text-amber-500">Riddhi Interiors</span>{" "}
            <span className="text-lg"> - Tilak Road, Dehradun</span>
          </h2>

          <p className="mb-4 text-lg">
            At <strong>Riddhi Interiors</strong>, we believe your space should
            be a reflection of your personality and lifestyle. Located at the
            heart of <strong>Tilak Road, Dehradun</strong>, we specialize in
            delivering tailored interior design solutions that bring comfort,
            beauty, and functionality to your home or workplace.
          </p>

          <p className="mb-8 text-lg">
            From <strong>end-to-end interior solutions</strong> and{" "}
            <strong>modular kitchen setups</strong> to elegant{" "}
            <strong>furniture and décor curation</strong>, our expert team
            combines creativity with craftsmanship to turn your vision into
            reality. Whether you&apos;re renovating, building new, or simply
            upgrading a room, we ensure a seamless and stylish transformation.
          </p>

          <p className="mb-8 text-lg italic border-l-4 border-amber-500 pl-4">
            “Your home, your style — elevated with personalized design and
            timeless craftsmanship by Riddhi Interiors.”
          </p>

          <div className="flex flex-wrap gap-4 mt-6">
            <a
              href="/contact-us"
              className="px-6 py-3 bg-amber-500 text-white font-medium rounded-xl shadow hover:bg-amber-950 transition"
            >
              Book a Free Consultation
            </a>
            <a
              href="/gallery"
              className="px-6 py-3 bg-amber-950 text-white font-medium rounded-xl shadow hover:bg-amber-500 transition"
            >
              View Our Portfolio
            </a>
          </div>
        </div>

        <div className="w-full md:w-1/3 flex justify-center items-center">
          <Image
            src="/Riddhi Interior Design/masonry-1.jpg" // Make sure this image exists in the public folder
            alt="Interior design showcase"
            width={400}
            height={400}
            className="rounded-lg shadow-lg object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default About;
