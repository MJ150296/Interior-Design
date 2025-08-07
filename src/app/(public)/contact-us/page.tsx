"use client";

import React, { useState, useEffect } from "react";
import "animate.css";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  HomeIcon,
  AwardIcon,
  PaletteIcon,
  PhoneIcon,
  MapPinIcon,
} from "lucide-react";
import BookAppointmentForm from "../../components/HomePage/ads/BookAppointmentForm";

const AppointmentPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("consultation");
  const [currentHighlight, setCurrentHighlight] = useState(0);

  const highlights = [
    {
      title: "Expert Design Consultation",
      description:
        "Our experienced designers will work with you to create spaces that reflect your personality and lifestyle.",
      icon: <PaletteIcon className="w-8 h-8 text-lime-600" />,
    },
    {
      title: "Premium Quality Materials",
      description:
        "We source only the finest materials to ensure your interiors are both beautiful and durable.",
      icon: <AwardIcon className="w-8 h-8 text-lime-600" />,
    },
    {
      title: "End-to-End Project Management",
      description:
        "From concept to completion, we handle every detail so you can relax and enjoy the transformation.",
      icon: <HomeIcon className="w-8 h-8 text-lime-600" />,
    },
    {
      title: "Personalized Solutions",
      description:
        "Every space is unique - we create custom solutions tailored to your specific needs and preferences.",
      icon: <CalendarIcon className="w-8 h-8 text-lime-600" />,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHighlight((prev) => (prev + 1) % highlights.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen pt-24 bg-gradient-to-br from-gray-50 to-lime-50">
      {/* Hero Section */}
      <motion.header
        className="relative bg-gradient-to-r from-lime-900 via-lime-700 to-lime-600 text-white p-8 md:p-16 text-center shadow-xl overflow-hidden"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        {/* <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-repeat opacity-10"></div> */}
        <div className="relative z-10">
          <motion.h1
            className="text-4xl md:text-5xl font-extrabold tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Design Your Dream Space
          </motion.h1>
          <motion.p
            className="mt-4 text-lg font-medium max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Schedule a consultation with our expert interior designers to
            transform your home or office
          </motion.p>
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Button
              size="lg"
              className="bg-lime-500 hover:bg-lime-400 text-lime-900 font-bold text-lg px-8 py-6 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300"
              onClick={() =>
                document
                  .getElementById("appointment-form")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Book Free Consultation
            </Button>
          </motion.div>
        </div>
      </motion.header>

      {/* Highlights Section */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-lime-900">
            Why Choose Riddhi Interiors?
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            We combine creativity, expertise, and attention to detail to deliver
            exceptional interior solutions
          </p>
        </motion.div>

        {/* Interactive Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="max-w-4xl mx-auto mb-12"
        >
          <TabsList className="grid grid-cols-2 md:grid-cols-4 bg-transparent p-2 rounded-xl">
            <TabsTrigger value="consultation" className="rounded-lg">
              Consultation
            </TabsTrigger>
            <TabsTrigger value="design" className="rounded-lg">
              Design Process
            </TabsTrigger>
            <TabsTrigger value="materials" className="rounded-lg">
              Materials
            </TabsTrigger>
            <TabsTrigger value="execution" className="rounded-lg">
              Execution
            </TabsTrigger>
          </TabsList>

          <TabsContent value="consultation">
            <Card className="border-lime-500 border-2">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center">
                    <PhoneIcon className="text-lime-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-lime-900">
                      Personalized Consultation
                    </h3>
                    <p className="mt-2 text-gray-600">
                      Our process begins with understanding your vision,
                      preferences, and requirements through an in-depth
                      consultation.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="design">
            <Card className="border-lime-500 border-2">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center">
                    <PaletteIcon className="text-lime-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-lime-900">
                      Creative Design Process
                    </h3>
                    <p className="mt-2 text-gray-600">
                      Our designers create mood boards, 3D renderings, and
                      detailed plans to bring your vision to life.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="materials">
            <Card className="border-lime-500 border-2">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center">
                    <AwardIcon className="text-lime-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-lime-900">
                      Quality Materials
                    </h3>
                    <p className="mt-2 text-gray-600">
                      We source premium, sustainable materials from trusted
                      suppliers to ensure longevity and aesthetic appeal.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="execution">
            <Card className="border-lime-500 border-2">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center">
                    <HomeIcon className="text-lime-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-lime-900">
                      Precision Execution
                    </h3>
                    <p className="mt-2 text-gray-600">
                      Our skilled craftsmen execute the design with meticulous
                      attention to detail and quality workmanship.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Auto-rotating highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {highlights.map((highlight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: index === currentHighlight ? 1 : 0.7,
                y: 0,
                scale: index === currentHighlight ? 1.05 : 1,
              }}
              transition={{ duration: 0.5 }}
              className={`bg-gradient-to-br from-white to-lime-50 p-6 rounded-xl shadow-lg border ${
                index === currentHighlight
                  ? "border-lime-500 border-2 shadow-lime-100"
                  : "border-gray-200"
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 p-3 bg-lime-100 rounded-full">
                  {highlight.icon}
                </div>
                <h3 className="text-xl font-bold text-lime-900">
                  {highlight.title}
                </h3>
                <p className="mt-2 text-gray-600">{highlight.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Portfolio Preview */}
      <section className="py-16 bg-gradient-to-b from-lime-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-lime-900">
              Our Signature Designs
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Explore some of our recent projects that showcase our design
              philosophy
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: item * 0.1 }}
                className="group"
              >
                <Card className="overflow-hidden border-0 shadow-lg h-full">
                  <div className="relative h-64 bg-gradient-to-r from-lime-200 to-lime-300 rounded-t-xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-lime-900/40 to-transparent"></div>
                    <div className="absolute bottom-4 left-4">
                      <h3 className="text-white font-bold text-xl">
                        Project {item}
                      </h3>
                      <p className="text-lime-100">Residential Design</p>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <p className="text-gray-600">
                      Modern living room design with custom furniture and warm
                      lighting solutions.
                    </p>
                    <Button variant="link" className="text-lime-600 p-0 mt-4">
                      View Project Details →
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Appointment Form Section */}
      <section
        id="appointment-form"
        className="relative py-16 bg-gradient-to-b from-gray-50 to-lime-50"
      >
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-lime-900">
              Schedule Your Design Consultation
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Fill out the form below and our design team will contact you to
              discuss your project
            </p>
          </motion.div>

          <motion.div
            className="bg-white flex justify-center rounded-2xl shadow-xl p-6 md:p-8 border border-lime-200 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <BookAppointmentForm
              onClose={() => {
                return;
              }}
            />
          </motion.div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-12 bg-gradient-to-br from-lime-600 to-lime-800 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="bg-lime-500/20 p-4 rounded-full mb-4">
                <PhoneIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold">Call Us</h3>
              <p className="mt-2 text-lime-100">+91 78959 27366</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="bg-lime-500/20 p-4 rounded-full mb-4">
                <MapPinIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold">Visit Us</h3>
              <p className="mt-2 text-lime-100">Tilak Road, Dehradun</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="bg-lime-500/20 p-4 rounded-full mb-4">
                <CalendarIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold">Working Hours</h3>
              <p className="mt-2 text-lime-100">Mon-Sat: 10AM - 7PM</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AppointmentPage;
