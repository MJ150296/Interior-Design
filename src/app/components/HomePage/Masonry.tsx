"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

const masonryItems = [
  {
    imgUrl: "/Riddhi Interior Design/masonry-1.jpg",
    alt: "Masonry Image 1",
    title: "Design Inspiration 1",
    LinkURL: "#",
  },
  {
    imgUrl: "/Riddhi Interior Design/masonry-2.jpg",
    alt: "Masonry Image 2",
    title: "Design Inspiration 2",
    LinkURL: "#",
  },
  {
    imgUrl: "/Riddhi Interior Design/masonry-3.jpg",
    alt: "Masonry Image 3",
    title: "Design Inspiration 3",
    LinkURL: "#",
  },
  {
    imgUrl: "/Riddhi Interior Design/masonry-4.jpg",
    alt: "Masonry Image 4",
    title: "Design Inspiration 4",
    LinkURL: "#",
  },
  {
    imgUrl: "/Riddhi Interior Design/masonry-5.jpg",
    alt: "Masonry Image 5",
    title: "Design Inspiration 5",
    LinkURL: "#",
  },
  {
    imgUrl: "/Riddhi Interior Design/masonry-6.jpg",
    alt: "Masonry Image 6",
    title: "Design Inspiration 6",
    LinkURL: "#",
  },
];

export default function MasonryGallery() {
  return (
    <section className="py-16 px-4 w-full max-w-7xl mx-auto">
      <div className="text-center mb-16 flex flex-col items-center">
        <motion.h2
          className="text-3xl md:text-4xl font-serif font-bold italic mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center items-center gap-x-10">
            <Image
              src="/Riddhi Interior Design/About/hang-lamp.png"
              alt="hanging lamp"
              width={50}
              height={50}
              className="mx-auto"
            />
            <h2 className="text-4xl mb-1 font-bold text-lime-900 font-serif">
              Inspiration for Interior Design Ideas
            </h2>
            <Image
              src="/Riddhi Interior Design/About/hang-lamp.png"
              alt="hanging lamp"
              width={50}
              height={50}
              className="mx-auto"
            />
          </div>
        </motion.h2>
        <motion.p
          className="text-gray-600 italic max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Discover fresh inspiration for your home with beautifully curated
          interior design ideas
        </motion.p>
      </div>

      <div className="columns-2 md:columns-3 gap-6">
        {masonryItems.map((item, index) => (
          <motion.div
            key={index}
            className="mb-6 break-inside-avoid"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
          >
            <div className="relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
              <Link href={item.LinkURL}>
                <Image
                  src={item.imgUrl}
                  alt={item.alt}
                  width={600}
                  height={400}
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-4">
                  <h3 className="text-white font-bold">Project {index + 1}</h3>
                </div>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
