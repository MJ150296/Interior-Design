"use client";
import { motion } from "framer-motion";
import { Rocket, Sparkles } from "lucide-react";

export default function ComingSoonDashboard() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center text-gray-900 p-6">
      {/* Animated Icon */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="flex items-center justify-center mb-6"
      >
        <Rocket
          size={80}
          className="text-lime-500 animate-bounce drop-shadow-lg"
        />
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="text-4xl md:text-6xl font-bold mb-4 flex items-center gap-2"
      >
        Dashboard
        <Sparkles className="text-lime-500 animate-pulse" />
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="text-lg md:text-xl text-gray-600 max-w-xl text-center"
      >
        We’re crafting something amazing for you. Stay tuned for your all-new
        interactive dashboard experience!
      </motion.p>
    </div>
  );
}
