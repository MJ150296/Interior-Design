import React from "react";
import { motion } from "framer-motion";

const serviceCards = [
  {
    title: "10+",
    description: "Flexible payment options to suit your budget.",
  },
  {
    title: "45",
    description: "Days Move-In Guarentee.",
  },
  {
    title: "120+",
    description: "Quality Checks",
  },
  {
    title: "30+",
    description: "Cities Served",
  },
];

const WhyChooseUs: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-amber-700 to-amber-900 text-white w-full">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Why Choose Riddhi Interiors
            <p>
              <span className="text-3xl mr-2">#</span>
              <span className="text-2xl italic mr-2">No.1</span>
              <span className="text-lg">Interior Design </span>
              <span className="text-lg">Company in </span>
              <span className="text-lg">UTTARAKHAND</span>
            </p>
          </motion.h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {serviceCards.map((service, index) => (
            <motion.div
              key={index}
              className="text-center py-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <div className="text-4xl md:text-5xl font-bold text-amber-300 mb-2">
                {service.title}
              </div>
              <div className="text-amber-100">{service.description}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
