import React from "react";
import { motion } from "framer-motion";

const CallToAction: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-lime-700 to-lime-900 text-white w-full">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.div
          className="bg-white/10 md:backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-2xl md:text-3xl font-serif font-bold mb-6">
            Ready to Transform Your Space?
          </h3>
          <p className="text-lime-100 mb-8 max-w-2xl mx-auto">
            Schedule a free consultation with our design experts to discuss your
            vision
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
  );
};

export default CallToAction;
