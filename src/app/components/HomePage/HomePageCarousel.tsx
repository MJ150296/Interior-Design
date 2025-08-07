"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function HomePageCarousel() {
  return (
    <div className="relative w-full h-screen">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-lime-900/50 to-transparent z-10" />

      {/* Pattern background */}
      {/* <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-repeat opacity-10 z-0" /> */}

      {/* Video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/Riddhi Interior Design/Home/carousel_video.jpeg"
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source
          src="/Riddhi Interior Design/videos/video1.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* Content */}
      <div className="content relative z-20 max-w-7xl h-full flex justify-center items-center px-8 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full flex items-end justify-center"
        >
          <div className="w-full md:w-2/3 px-4 md:px-10 mb-10 flex">
            <motion.h1
              className="text-6xl md:text-7xl font-inter font-bold text-lime-50 italic tracking-wide mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Transform Your <span className="text-lime-700">Living </span>
              Space
            </motion.h1>
          </div>

          <div className="hidden md:flex justify-start items-center">
            <motion.div
              className="w-96 bg-black/40 p-6 rounded-lg backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.7 }}
            >
              <p className="text-xl font-serif italic text-lime-200 mb-3">
                Our Recent Projects
              </p>
              <div className="w-16 h-1 bg-lime-700 mb-4" />
              <p className="text-lg text-white mb-6">
                Explore our projects to see how we can transform your space and
                boost your well-being.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="bg-lime-600 hover:bg-lime-700 hover:cursor-pointer text-white font-bold py-6 px-8 text-lg">
                  View Our Projects
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
