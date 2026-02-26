"use client";

import Image from "next/image";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { QuoteIcon } from "lucide-react";
import { usePublicContent } from "../PublicContentProvider";
import Link from "next/link";

// Create a consolidated default content object
const defaultContent = {
  hero: {
    backgroundImageUrl: "/Riddhi Interior Design/Testimonials/cover.jpg",
    preTitle: "CLIENT TESTIMONIALS",
    title: "What Our Clients Say",
    subtitle: "Real Stories from Satisfied Customers Across Uttarakhand",
  },
  categories: [{ name: "All" }],
  testimonials: [
    {
      id: 1,
      author: "Rajesh & Priya Sharma",
      role: "Homeowners, Dehradun",
      quote:
        "Riddhi Interiors transformed our 3BHK apartment into a dream home. Their attention to detail and creative space utilization was exceptional. The team was professional and delivered on time.",
      rating: 5,
      category: "Residential",
      imageUrl: "/Riddhi Interior Design/Testimonials/residential-1.jpg",
    },
    {
      id: 2,
      author: "Vikram Singh",
      role: "Restaurant Owner, Haridwar",
      quote:
        "Our restaurant's ambiance has been completely transformed. The design not only looks beautiful but has significantly improved customer flow and experience. Highly recommended for commercial projects!",
      rating: 5,
      category: "Commercial",
      imageUrl: "/Riddhi Interior Design/Testimonials/commercial-1.jpg",
    },
    {
      id: 3,
      author: "Anita Desai",
      role: "Villa Owner, Mussoorie",
      quote:
        "Working with Riddhi Interiors was a pleasure from start to finish. They understood our vision for a modern yet cozy mountain home and executed it perfectly. The quality of materials and workmanship is outstanding.",
      rating: 5,
      category: "Residential",
      imageUrl: "/Riddhi Interior Design/Testimonials/residential-2.jpg",
    },
    {
      id: 4,
      author: "Dr. Sameer Gupta",
      role: "Clinic Owner, Rishikesh",
      quote:
        "The clinic interior design has created a calming and professional atmosphere that our patients love. The team managed the project efficiently while we continued our practice.",
      rating: 5,
      category: "Commercial",
      imageUrl: "/Riddhi Interior Design/Testimonials/commercial-2.jpg",
    },
    {
      id: 5,
      author: "The Kapoor Family",
      role: "Family Home, Dehradun",
      quote:
        "They transformed our outdated house into a modern, functional home that meets all our family's needs. The children love their new rooms, and we enjoy the open living space.",
      rating: 5,
      category: "Residential",
      imageUrl: "/Riddhi Interior Design/Testimonials/residential-3.jpg",
    },
    {
      id: 6,
      author: "Neha Rawat",
      role: "Boutique Owner, Roorkee",
      quote:
        "The store design has doubled our footfall! The lighting, layout, and color scheme perfectly showcase our products. It's exactly what we envisioned for our brand.",
      rating: 5,
      category: "Commercial",
      imageUrl: "/Riddhi Interior Design/Testimonials/commercial-3.jpg",
    },
  ],
  stats: [
    { value: "98%", label: "Client Satisfaction Rate" },
    { value: "250+", label: "Projects Completed" },
    { value: "50+", label: "5-Star Reviews" },
    { value: "15+", label: "Cities Served" },
  ],
  cta: {
    title: "Ready to Share Your Success Story?",
    description:
      "Join our growing family of satisfied clients. Let us transform your space and create an experience you'll love to share.",
  },
};

const Testimonials = () => {
  const { testimonials: reduxContent } = usePublicContent();
  const [activeFilter, setActiveFilter] = useState("All");

  // Merge Redux data with defaults
  const content = {
    hero: reduxContent?.hero || defaultContent.hero,
    categories: reduxContent?.categories || defaultContent.categories,
    testimonials: reduxContent?.testimonials || defaultContent.testimonials,
    stats: reduxContent?.stats || defaultContent.stats,
    cta: reduxContent?.cta || defaultContent.cta,
  };

  console.log("content", content);


  // Get categories for filtering
  const projectTypes = [
    ...new Set(content.categories.map((t) => t.name)),
  ];

  const filteredTestimonials =
    activeFilter === "All"
      ? content.testimonials
      : content.testimonials.filter((t) => t.category === activeFilter);

  return (
    <div className="min-h-screen bg-linear-to-b from-lime-50 to-gray-50">
      {/* Hero Section */}
      <div className="relative w-full h-125 flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Parallax background */}
        <div className="absolute inset-0 z-0">
          <Image
            src={content.hero.backgroundImageUrl}
            alt="Testimonials background"
            fill
            className="object-cover brightness-90"
          />
          <div className="absolute inset-0 bg-linear-to-t from-lime-900/50 to-transparent" />
        </div>

        {/* Content */}
        <motion.div
          className="relative z-10 px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.span
            className="text-xs md:text-sm tracking-widest font-bold text-lime-200 mb-5 block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {content.hero.preTitle}
          </motion.span>

          <motion.h1
            className="text-4xl md:text-6xl font-serif font-bold text-white tracking-wide mb-5"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {content.hero.title}
          </motion.h1>

          <motion.p
            className="font-bold text-xl md:text-2xl text-lime-100 tracking-wide font-serif max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            {content.hero.subtitle}
          </motion.p>
        </motion.div>
      </div>

      {/* Testimonials Section */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex justify-center items-center mb-8">
            <div className="h-px bg-lime-300 w-16 hidden md:block" />
            <motion.div
              className="mx-4"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Image
                src="/Riddhi Interior Design/Logo.png"
                alt="Riddhi Interiors"
                width={120}
                height={120}
                className="mx-auto"
              />
            </motion.div>
            <div className="h-px bg-lime-300 w-16 hidden md:block" />
          </div>

          <motion.h2
            className="text-3xl md:text-4xl font-serif font-bold text-lime-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            What Our Clients Say
          </motion.h2>

          <motion.p
            className="text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Hear from homeowners and businesses who have transformed their
            spaces with our design expertise.
          </motion.p>
        </div>

        {/* Project Type Filter */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {projectTypes.map((type) => (
            <motion.button
              key={type}
              className={`px-4 py-2 rounded-full text-sm md:text-base font-medium transition-colors duration-300 ${activeFilter === type
                ? "bg-lime-600 text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-lime-100"
                }`}
              onClick={() => setActiveFilter(type)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {type}
            </motion.button>
          ))}
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTestimonials.map((client, idx) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 + 0.2, duration: 0.5 }}
              className="h-full"
            >
              <Card className="h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-lime-100 group">
                <div className="relative h-60 overflow-hidden">
                  <Image
                    src={client.imageUrl}
                    alt={client.category}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-lime-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {client.category}
                    </span>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(client.rating)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 text-lime-500 fill-current"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>

                  <QuoteIcon className="text-lime-400 w-8 h-8 mb-4" />

                  <p className="text-gray-700 italic mb-6">
                    &quot;{client.quote}&quot;
                  </p>

                  <div className="flex items-center pt-4 border-t border-lime-100">
                    <div className="w-16 h-16 rounded-full bg-lime-200 flex items-center justify-center border-2 border-lime-500">
                      <span className="text-lime-700 font-bold text-2xl">
                        {client.author.charAt(0)}
                      </span>
                    </div>
                    <div className="ml-4">
                      <h4 className="font-bold text-gray-800">
                        {client.author}
                      </h4>
                      <p className="text-sm text-gray-600">{client.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-linear-to-r from-lime-700 to-lime-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2
              className="text-3xl md:text-4xl font-serif font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Our Impact in Numbers
            </motion.h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {content.stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="text-4xl md:text-5xl font-bold text-lime-300 mb-2">
                  {stat.value}
                </div>
                <div className="text-lime-100">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-linear-to-b from-white to-lime-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-lime-200"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl md:text-3xl font-serif font-bold text-lime-900 mb-4">
              {content.cta.title}
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              {content.cta.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact-us">
                <button className="bg-lime-600 hover:bg-lime-700 text-white font-bold py-3 px-8 rounded-full transition-colors shadow-lg text-lg">
                  Book a Consultation
                </button>
              </Link>
              <Link href="/our-projects">
                <button className="bg-white border-2 border-lime-600 text-lime-700 hover:bg-lime-50 font-bold py-3 px-8 rounded-full transition-colors text-lg">
                  View Our Portfolio
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Testimonials;
