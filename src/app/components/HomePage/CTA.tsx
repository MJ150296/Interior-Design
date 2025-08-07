import React from "react";
import { Button } from "@/components/ui/button";
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-lime-500 hover:bg-lime-400 text-lime-900 font-bold py-4 px-8 rounded-full transition-colors shadow-lg text-lg">
              Book a Consultation
            </Button>
            <Button className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-bold py-4 px-8 rounded-full transition-colors text-lg">
              View Pricing
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;
