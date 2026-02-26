import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Owner: React.FC = () => {
  return (
    <section className="py-16 bg-linear-to-b from-lime-50 to-white w-full">
      <div className="max-w-7xl mx-auto px-12 flex flex-col-reverse md:flex-row gap-12 items-center">
        <motion.div
          className="w-full md:w-1/3 relative rounded-3xl overflow-hidden shadow-2xl h-125"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Image
            src="/Riddhi Interior Design/owner.jpg"
            alt="Founder - Pankaj Chauhan"
            width={500}
            height={500}
            className="transition-transform duration-500 hover:scale-110 object-cover"
          />
        </motion.div>

        <motion.div
          className="w-full md:w-2/3"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold italic text-lime-900 mb-4">
            Meet Our Founder & Lead Designer
          </h2>
          <h3 className="text-xl text-lime-600 italic mb-6">Pankaj Chauhan</h3>

          <p className="mb-6 text-lg text-gray-700">
            <strong className="text-lime-700">John Doe</strong>, the visionary
            behind <strong className="text-lime-700">Riddhi Interiors</strong>,
            brings over a decade of experience in transforming ordinary spaces
            into extraordinary interiors.
          </p>

          <p className="mb-6 text-lg text-gray-700">
            Specializing in{" "}
            <strong className="text-lime-700">modern minimalism</strong>,{" "}
            <strong className="text-lime-700">classic luxury interiors</strong>
            , and personalized renovation strategies, John works closely with
            clients to understand their aspirations.
          </p>

          <div className="my-8 p-6 bg-lime-50 rounded-xl border border-lime-200">
            <p className="text-lg text-gray-700 italic border-l-4 border-lime-600 pl-4">
              &quot;Design is not just about what you see. It&apos;s how you live in the
              space. My goal is to create interiors that feel as good as they
              look.&quot;
            </p>
          </div>

          <div className="flex flex-wrap gap-4 mt-6">
            <a
              href="https://wa.me/919634705815"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="bg-lime-600 hover:bg-lime-700 text-white font-bold py-4 px-8 rounded-full transition-colors">
                Get in Touch
              </Button>
            </a>
            <Link href="/our-projects">
              <Button className="bg-white border-2 border-lime-600 text-lime-700 hover:bg-lime-50 font-bold py-4 px-8 rounded-full transition-colors">
                Explore His Work
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Owner;
