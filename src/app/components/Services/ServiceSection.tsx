"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ROContentItem } from "@/app/data/roContent";
import Image from "next/image";
import { motion } from "framer-motion";

interface Props {
  data: ROContentItem[];
}

const ServiceSection: React.FC<Props> = ({ data }) => {
  return (
    <div className="min-h-screen bg-linear-to-b from-lime-50 to-white">
      {/* Main Service Content */}
      {data.map((item) => (
        <div key={item.id}>
          {/* Hero Section */}
          <div className="relative w-full h-125 flex flex-col items-center justify-center text-center overflow-hidden">
            <div className="absolute inset-0 z-0">
              <Image
                src={item.backgroundImage || "/default-bg.jpg"}
                alt={item.title}
                fill
                className="object-cover brightness-90"
              />
              <div className="absolute inset-0 bg-linear-to-t from-lime-900/50 to-transparent" />
              {/* <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-repeat opacity-10" /> */}
            </div>

            <motion.div
              className="relative z-10 px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1
                className="text-4xl md:text-6xl font-serif font-bold text-white tracking-wide mb-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.7 }}
              >
                {item.title}
              </motion.h1>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Link href={item.button.link}>
                  <Button
                    size="lg"
                    className="bg-lime-600 hover:bg-lime-700 text-white font-bold text-lg px-8 py-6 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300"
                  >
                    {item.button.text}
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Service Details */}
          <div className="max-w-7xl mx-auto px-4 py-16">
            {item.sections.map((section, sectionIndex) => {
              const isImageLeft = sectionIndex % 2 !== 0;

              return (
                <motion.div
                  key={sectionIndex}
                  className={`flex flex-col md:flex-row items-center gap-10 mb-20 ${isImageLeft ? "md:flex-row-reverse" : ""
                    }`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: sectionIndex * 0.2 + 0.2,
                    duration: 0.6,
                  }}
                >
                  {/* Content */}
                  <div className="w-full md:w-1/2">
                    <h3 className="text-2xl md:text-3xl font-serif font-bold mb-6 text-lime-900">
                      {section.heading}
                    </h3>
                    <div className="space-y-4 mb-6">
                      {section.paragraphs.map((para, idx) => (
                        <p key={idx} className="text-gray-700 leading-relaxed">
                          {para}
                        </p>
                      ))}
                    </div>
                    <a
                      href={section.highlightedLink.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-lime-700 font-semibold hover:text-lime-900 transition-colors"
                    >
                      {section.highlightedLink.text}
                      <svg
                        className="w-4 h-4 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </a>
                  </div>

                  {/* Image */}
                  <div className="w-full md:w-1/2 relative">
                    <div className="relative rounded-xl overflow-hidden shadow-xl">
                      <Image
                        src={section.image.src}
                        alt={section.image.alt}
                        width={600}
                        height={400}
                        className="w-full h-auto object-cover"
                      />
                      <div className="absolute inset-0 border-8 border-white opacity-20 pointer-events-none"></div>
                    </div>
                    <div
                      className={`absolute -z-10 w-full h-full rounded-xl bg-lime-200 ${isImageLeft ? "-left-6 -bottom-6" : "-right-6 -bottom-6"
                        }`}
                    ></div>
                  </div>
                </motion.div>
              );
            })}

            {/* Features Grid */}
            <motion.div
              className="mt-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <h3 className="text-2xl md:text-3xl font-serif font-bold mb-10 text-center text-lime-900">
                Why Choose Our {item.title} Service
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    title: "Expert Design Team",
                    description:
                      "Our certified designers bring years of experience and creative vision to every project.",
                  },
                  {
                    title: "Premium Materials",
                    description:
                      "We use only the highest quality, sustainable materials from trusted suppliers.",
                  },
                  {
                    title: "On-Time Delivery",
                    description:
                      "We respect your time with strict project timelines and completion guarantees.",
                  },
                ].map((feature, idx) => (
                  <motion.div
                    key={idx}
                    className="bg-white rounded-xl shadow-lg p-6 border border-lime-100 hover:shadow-xl transition-shadow"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 + 0.7, duration: 0.5 }}
                  >
                    <div className="w-12 h-12 rounded-full bg-lime-100 flex items-center justify-center mb-4">
                      <div className="w-6 h-6 rounded-full bg-lime-500"></div>
                    </div>
                    <h4 className="text-xl font-bold text-lime-900 mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-gray-600">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      ))}

      {/* Consultation CTA */}
      <section className="py-16 bg-linear-to-r from-lime-700 to-lime-900">
        <div className="max-w-4xl mx-auto text-center px-4">
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl md:text-3xl font-serif font-bold text-lime-900 mb-4">
              Ready to Transform Your Space?
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Schedule a free consultation with our design experts to discuss
              your project
            </p>
            <div className="flex flex-wrap gap-4 mt-8 justify-center">
              <motion.a
                href="/contact-us"
                className="px-8 py-4 bg-lime-600 text-white font-bold rounded-xl shadow-lg hover:bg-lime-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Book A Consultation
              </motion.a>
              <motion.a
                href="/our-projects"
                className="px-8 py-4 bg-white border-2 border-lime-600 text-lime-700 font-bold rounded-xl shadow-lg hover:bg-lime-50 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Pricing
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ServiceSection;
