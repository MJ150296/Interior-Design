import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const About = () => {
  return (
    <section className="py-16 px-12 bg-gradient-to-r from-lime-50 to-lime-100 w-full">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-12 items-center">
        <motion.div
          className="w-full md:w-2/3"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl md:text-4xl font-serif italic font-bold text-lime-900 mb-4">
            Crafting Dream Spaces with Elegance
          </h2>
          <h3 className="text-xl text-gray-600 italic mb-6">
            Riddhi Interiors - Tilak Road, Dehradun
          </h3>

          <p className="mb-4 text-lg text-gray-700">
            At <strong className="text-lime-700">Riddhi Interiors</strong>, we
            believe your space should be a reflection of your personality and
            lifestyle. Located at the heart of{" "}
            <strong className="text-lime-700">Tilak Road, Dehradun</strong>, we
            specialize in delivering tailored interior design solutions that
            bring comfort, beauty, and functionality to your home or workplace.
          </p>

          <p className="mb-8 text-lg">
            From{" "}
            <strong className="text-lime-700">
              end-to-end interior solutions
            </strong>{" "}
            and{" "}
            <strong className="text-lime-700">modular kitchen setups</strong>{" "}
            to elegant{" "}
            <strong className="text-lime-700">
              furniture and décor curation
            </strong>
            , our expert team combines creativity with craftsmanship to turn
            your vision into reality. Whether you&apos;re renovating, building
            new, or simply upgrading a room, we ensure a seamless and stylish
            transformation.
          </p>

          <div className="my-8 p-6 bg-lime-50 rounded-xl border border-lime-200">
            <p className="text-lg text-gray-700 italic border-l-4 border-lime-600 pl-4">
              “Your home, your style — elevated with personalized design and
              timeless craftsmanship.”
            </p>
          </div>

          <div className="flex flex-wrap gap-4 mt-6">
            <Button className="bg-lime-600 hover:bg-lime-700 text-white font-bold py-4 px-8 rounded-full transition-colors">
              Book a Free Consultation
            </Button>
            <Button className="bg-white border-2 border-lime-600 text-lime-700 hover:bg-lime-50 font-bold py-4 px-8 rounded-full transition-colors">
              View Our Portfolio
            </Button>
          </div>
        </motion.div>

        <motion.div
          className="w-full md:w-1/3 relative rounded-3xl overflow-hidden shadow-2xl"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Image
            src="/Riddhi Interior Design/masonry-1.jpg" // Make sure this image exists in the public folder
            alt="Interior design showcase"
            width={400}
            height={400}
            className="rounded-lg shadow-lg object-cover transition-transform duration-500 hover:scale-110"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default About;
