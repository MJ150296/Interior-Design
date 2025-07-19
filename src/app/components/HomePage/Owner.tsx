import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const Owner: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-amber-50 to-white w-full">
      <div className="max-w-7xl mx-auto px-12 flex flex-col md:flex-row gap-12 items-center">
        <motion.div
          className="w-full md:w-1/3 relative rounded-3xl overflow-hidden shadow-2xl h-[500px]"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Image
            src="/Riddhi Interior Design/owner.jpg"
            alt="Founder - John Doe"
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
          <h2 className="text-3xl md:text-4xl font-serif font-bold italic text-amber-900 mb-4">
            Meet Our Founder & Lead Designer
          </h2>
          <h3 className="text-xl text-amber-600 italic mb-6">John Doe</h3>

          <p className="mb-6 text-lg text-gray-700">
            <strong className="text-amber-700">John Doe</strong>, the visionary
            behind <strong className="text-amber-700">Riddhi Interiors</strong>,
            brings over a decade of experience in transforming ordinary spaces
            into extraordinary interiors.
          </p>

          <p className="mb-6 text-lg text-gray-700">
            Specializing in{" "}
            <strong className="text-amber-700">modern minimalism</strong>,{" "}
            <strong className="text-amber-700">classic luxury interiors</strong>
            , and personalized renovation strategies, John works closely with
            clients to understand their aspirations.
          </p>

          <div className="my-8 p-6 bg-amber-50 rounded-xl border border-amber-200">
            <p className="text-lg text-gray-700 italic border-l-4 border-amber-600 pl-4">
              &quot;Design is not just about what you see. It&apos;s how you live in the
              space. My goal is to create interiors that feel as good as they
              look.&quot;
            </p>
          </div>

          <div className="flex flex-wrap gap-4 mt-6">
            <Button className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 px-8 rounded-full transition-colors">
              Get in Touch
            </Button>
            <Button className="bg-white border-2 border-amber-600 text-amber-700 hover:bg-amber-50 font-bold py-4 px-8 rounded-full transition-colors">
              Explore His Work
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Owner;
