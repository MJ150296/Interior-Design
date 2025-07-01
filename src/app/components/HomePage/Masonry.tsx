"use client";

import useInView from "@/app/hooks/useInView";
import Image from "next/image";

export default function MasonryGallery() {
  const { ref, isVisible } = useInView();
  return (
    <div
      className={`w-full flex flex-col py-5 justify-center font-serif transition-all duration-1000 ease-in-out transform ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      ref={ref}
    >
      <h3 className="text-lg text-gray-800 dark:text-white mb-2">
        <span className="text-4xl font-bold text-amber-950">
          Inspiration for Interior design ideas
        </span>
      </h3>
      <div className="w-60 border border-amber-500"></div>
      <h4 className="text-lg italic text-gray-600 dark:text-gray-400 mt-2 mb-5">
        Discover fresh inspiration for your home with beautifully curated
        interior design ideas tailored just for you.
      </h4>
      <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
        <div className="break-inside-avoid">
          <Image
            src="/Riddhi Interior Design/masonry-1.jpg"
            alt="Masonry Image 1"
            width={600}
            height={400}
            className="w-full h-auto rounded-lg"
            unoptimized
          />
        </div>
        <div className="break-inside-avoid">
          <Image
            src="/Riddhi Interior Design/masonry-2.jpg"
            alt="Masonry Image 2 - Image by user32212 from Pixabay"
            width={600}
            height={400}
            className="w-full h-auto rounded-lg"
            unoptimized
          />
        </div>
        <div className="break-inside-avoid">
          <Image
            src="/Riddhi Interior Design/masonry-3.jpg"
            alt="Masonry Image 3 - Image by Solomon Rodgers from Pixabay"
            width={600}
            height={400}
            className="w-full h-auto rounded-lg"
            unoptimized
          />
        </div>
        <div className="break-inside-avoid">
          <Image
            src="/Riddhi Interior Design/masonry-4.jpg"
            alt="Masonry Image 4 - Image by Anna Lisa from Pixabay"
            width={600}
            height={500}
            className="w-full h-auto rounded-lg"
            unoptimized
          />
        </div>
        <div className="break-inside-avoid">
          <Image
            src="/Riddhi Interior Design/masonry-5.jpg"
            alt="Masonry Image 5 - Image by THANH TUẤN NGUYỄN from Pixabay"
            width={600}
            height={800}
            className="w-full h-auto rounded-lg"
            unoptimized
          />
        </div>
        <div className="break-inside-avoid">
          <Image
            src="/Riddhi Interior Design/masonry-6.jpg"
            alt="Masonry Image 6 - Image by Pexels from Pixabay"
            width={600}
            height={600}
            className="w-full h-auto rounded-lg"
            unoptimized
          />
        </div>
      </div>
    </div>
  );
}
