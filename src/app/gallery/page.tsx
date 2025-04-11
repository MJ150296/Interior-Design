import Image from "next/image";
import React from "react";

const OurGallery: React.FC = () => {
  const images = [
    "/RO/ro1.png",
    "/RO/ro1.png",
    "/RO/ro1.png",
    "/RO/ro1.png",
    "/RO/ro1.png",
  ];

  return (
    <section className="w-full py-12 px-4 md:px-12 rounded-xl">
      <h2 className="text-3xl font-semibold text-center text-gray-800 dark:text-white mb-8">
        Our Gallery
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 justify-items-center">
        {images.map((src, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
          >
            <Image
              src={src}
              alt={`Gallery image ${index + 1}`}
              width={300}
              height={300}
              loading="lazy"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default OurGallery;
