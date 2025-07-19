"use client";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";

const teamMembers = [
  {
    name: "Riddhi Sharma",
    title: "Founder & Principal Designer",
    imageUrl: "/Riddhi Interior Design/owner.jpg",
    bio: "With over 15 years of experience in interior design, Riddhi brings a unique blend of creativity and technical expertise to every project.",
    specialties: ["Residential Design", "Space Planning", "Color Theory"],
  },
  {
    name: "Aarav Mehta",
    title: "Interior Architect",
    imageUrl: "/Riddhi Interior Design/owner.jpg",
    bio: "Aarav combines structural knowledge with aesthetic sensibility to create spaces that are both beautiful and functional.",
    specialties: ["Architectural Design", "3D Modeling", "Project Management"],
  },
  {
    name: "Simran Kaur",
    title: "3D Visualizer & Designer",
    imageUrl: "/Riddhi Interior Design/owner.jpg",
    bio: "Simran transforms concepts into photorealistic visualizations that help clients envision their future spaces.",
    specialties: ["3D Rendering", "Material Selection", "Lighting Design"],
  },
];

const socialMedia = [
  {
    name: "Instagram",
    icon: "/Riddhi Interior Design/icons/Instagram.png",
    url: "https://instagram.com",
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
  },
  {
    name: "Facebook",
    icon: "/Riddhi Interior Design/icons/Facebook.png",
    url: "https://facebook.com",
    color: "bg-gradient-to-r from-blue-600 to-blue-400",
  },
  {
    name: "Twitter",
    icon: "/Riddhi Interior Design/icons/Gmail.png",
    url: "https://twitter.com",
    color: "bg-gradient-to-r from-blue-400 to-cyan-400",
  },
  {
    name: "LinkedIn",
    icon: "/Riddhi Interior Design/icons/WhatsApp.png",
    url: "https://linkedin.com",
    color: "bg-gradient-to-r from-teal-500 to-teal-300",
  },
];

const stats = [
  { value: "12+", label: "Years Experience" },
  { value: "250+", label: "Projects Completed" },
  { value: "98%", label: "Client Satisfaction" },
  { value: "25+", label: "Awards Received" },
];

const coreValues = [
  {
    title: "Innovation",
    description:
      "We embrace new ideas and technologies to create unique spaces",
    icon: "💡",
  },
  {
    title: "Excellence",
    description: "We pursue perfection in every detail of our work",
    icon: "⭐",
  },
  {
    title: "Integrity",
    description: "We build relationships based on trust and transparency",
    icon: "🤝",
  },
  {
    title: "Sustainability",
    description: "We prioritize eco-friendly materials and practices",
    icon: "🌿",
  },
];

const AboutUs: React.FC = () => {
  return (
    <div className="w-full relative bg-gradient-to-b from-amber-50 to-white">
      {/* Hero Section */}
      <div className="relative w-full h-[500px] flex flex-col items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/Riddhi Interior Design/About/cover.jpg"
            alt="About background"
            layout="fill"
            objectFit="cover"
            className="brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-amber-900/60 to-amber-700/30" />
          {/* <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-repeat opacity-10" /> */}
        </div>

        <motion.div
          className="relative z-10 px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.span
            className="text-xs md:text-sm tracking-widest font-bold text-amber-200 mb-5 block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            A FEW WORDS ABOUT
          </motion.span>

          <motion.h1
            className="text-4xl md:text-6xl font-serif font-bold text-white tracking-wide mb-5"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Our Firm
          </motion.h1>

          <motion.p
            className="font-bold text-xl md:text-2xl text-amber-100 tracking-wide font-serif max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            Award Winning Interior Design Firm in UTTARAKHAND
          </motion.p>
        </motion.div>
      </div>

      {/* Stats Section */}
      <div className="py-12 bg-gradient-to-r from-amber-700 to-amber-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center py-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
              >
                <div className="text-4xl md:text-5xl font-bold text-amber-300 mb-2">
                  {stat.value}
                </div>
                <div className="text-amber-100">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="px-4 md:px-12 py-16 flex flex-col md:flex-row w-full max-w-7xl mx-auto">
        <div className="w-full md:w-1/2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-amber-900 mb-6">
              <span className="block">Our Story</span>
              <span className="text-amber-600 italic text-3xl">
                Transforming Spaces with Elegance & Style
              </span>
            </h2>

            <p className="mb-6 text-lg text-gray-700 leading-relaxed">
              At <strong className="text-amber-700">Riddhi Interiors</strong>,
              we believe every space tells a story — and we're here to help you
              tell yours. From timeless elegance to contemporary flair, our
              designs breathe life into your interiors with a touch of
              sophistication and functionality.
            </p>

            <p className="mb-6 text-lg text-gray-700 leading-relaxed">
              With a strong presence in{" "}
              <strong className="text-amber-700">Dehradun</strong>, our passion
              for crafting beautiful and practical interiors extends across
              nearby cities including
              <strong className="text-amber-700"> Mussoorie</strong>,{" "}
              <strong className="text-amber-700">Haridwar</strong>,
              <strong className="text-amber-700"> Rishikesh</strong>, and{" "}
              <strong className="text-amber-700">Roorkee</strong>. Whether it's
              a cozy residence in the hills or a stylish commercial outlet in
              the plains, we bring innovation and expertise to every project.
            </p>

            <div className="my-8 p-6 bg-amber-50 rounded-xl border border-amber-200">
              <p className="text-lg text-gray-700 italic border-l-4 border-amber-600 pl-4">
                “Your trusted interior design partner in Dehradun, dedicated to
                creating beautiful, functional spaces that inspire and impress.”
              </p>
            </div>

            <div className="flex flex-wrap gap-4 mt-8">
              <motion.a
                href="/contact-us"
                className="px-8 py-4 bg-amber-600 text-white font-bold rounded-xl shadow-lg hover:bg-amber-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Design Experts
              </motion.a>
              <motion.a
                href="/gallery"
                className="px-8 py-4 bg-white border-2 border-amber-600 text-amber-700 font-bold rounded-xl shadow-lg hover:bg-amber-50 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore Our Work
              </motion.a>
            </div>
          </motion.div>
        </div>

        <div className="w-full md:w-1/2 flex justify-center items-center mt-12 md:mt-0">
          <motion.div
            className="relative w-full max-w-lg h-[500px] rounded-3xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <Image
              src="/Riddhi Interior Design/About/story.jpg"
              alt="Riddhi Interiors Project"
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-500 hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </motion.div>
        </div>
      </div>

      {/* Core Values Section */}
      <section className="py-16 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2
              className="flex justify-center items-center gap-x-10 "
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex justify-center items-center gap-x-10 mb-5">
                <Image
                  src="/Riddhi Interior Design/About/hang-lamp.png"
                  alt="hanging lamp"
                  width={50}
                  height={50}
                  className="mx-auto"
                />
                <h2 className="text-3xl md:text-4xl mb-1 font-bold italic text-orange-900 font-serif">
                  Our Core Values
                </h2>
                <Image
                  src="/Riddhi Interior Design/About/hang-lamp.png"
                  alt="hanging lamp"
                  width={50}
                  height={50}
                  className="mx-auto"
                />
              </div>
            </motion.h2>
            <motion.p
              className="text-gray-600 italic max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              The principles that guide our work and relationships
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 border border-amber-100 hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-amber-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="w-full py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              className="flex justify-center items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="flex justify-center items-center gap-x-10 mb-5">
                <Image
                  src="/Riddhi Interior Design/About/hang-lamp.png"
                  alt="hanging lamp"
                  width={50}
                  height={50}
                  className="mx-auto"
                />
                <h2 className="text-3xl md:text-4xl mb-1 font-bold italic text-orange-900 font-serif">
                  Meet Our Creative Team
                </h2>
                <Image
                  src="/Riddhi Interior Design/About/hang-lamp.png"
                  alt="hanging lamp"
                  width={50}
                  height={50}
                  className="mx-auto"
                />
              </div>
            </motion.div>
            <motion.p
              className="italic text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              "Interior design is making the best possible use of the available
              space."
            </motion.p>
          </div>

          {/* Team Members Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                className="overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.4, duration: 0.5 }}
                whileHover={{ y: -10 }}
              >
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full">
                  <div className="relative w-full h-80">
                    <Image
                      src={member.imageUrl}
                      alt={member.name}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-amber-900">
                      {member.name}
                    </h3>
                    <p className="text-amber-600 font-medium mb-3">
                      {member.title}
                    </p>
                    <p className="text-gray-600 mb-4">{member.bio}</p>
                    <div className="flex flex-wrap gap-2">
                      {member.specialties.map((specialty, idx) => (
                        <span
                          key={idx}
                          className="bg-amber-100 text-amber-800 text-xs px-3 py-1 rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Connect Section */}
      <section className="py-16 bg-gradient-to-r from-amber-700 to-amber-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-serif font-bold mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Connect With Us
          </motion.h2>

          <div className="flex flex-wrap justify-center gap-8 mb-12">
            {socialMedia.map((social, index) => (
              <motion.a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${social.color} w-24 h-24 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Image
                  src={social.icon}
                  alt={social.name}
                  width={40}
                  height={40}
                  className="filter brightness-0 invert"
                />
              </motion.a>
            ))}
          </div>

          <motion.div
            className="bg-white/10 backdrop-blur-sm rounded-xl p-8 shadow-lg max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <h3 className="text-xl font-bold mb-4">Visit Our Studio</h3>
            <p className="mb-4">Tilak Road, Dehradun, Uttarakhand 248001</p>
            <p className="mb-6">Open Monday-Saturday: 9AM - 7PM</p>
            <a
              href="tel:+917895927366"
              className="text-amber-300 font-bold text-lg hover:text-amber-200 transition-colors"
            >
              +91 78959 27366
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
