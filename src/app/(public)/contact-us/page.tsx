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
  ClockIcon,
} from "lucide-react";
import BookAppointmentForm from "../../components/HomePage/ads/BookAppointmentForm";
import { getStaticIcon } from "@/app/utils/staticIcons";
import {
  fetchAppointmentForm,
  selectAppointmentForm,
  selectAppointmentFormError,
  selectAppointmentFormLoading,
} from "@/app/redux/slices/appointmentFormSlice";
import {
  fetchContactContent,
  selectContactContent,
  selectContactError,
  selectContactLoading,
} from "@/app/redux/slices/contactPageSlice";
import { useAppDispatch, useAppSelector } from "@/app/redux/store/hooks";
import Image from "next/image";

// Define types for our dynamic content
interface ContactContent {
  hero: {
    title: string;
    subtitle: string;
    buttonText: string;
  };
  whyChooseUs: {
    title: string;
    description: string;
    tabs: Array<{
      title: string;
      icon: string;
      contentTitle: string;
      description: string;
    }>;
    features: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  };
  contactInfo: {
    items: Array<{
      icon: string;
      title: string;
      details: string;
    }>;
  };
}

// Default values as fallback
const defaultContactContent: ContactContent = {
  hero: {
    title: "Design Your Dream Space",
    subtitle:
      "Schedule a consultation with our expert interior designers to transform your home or office",
    buttonText: "Book Free Consultation",
  },
  whyChooseUs: {
    title: "Why Choose Riddhi Interiors?",
    description:
      "We combine creativity, expertise, and attention to detail to deliver exceptional interior solutions",
    tabs: [
      {
        title: "Consultation",
        icon: "phone",
        contentTitle: "Personalized Consultation",
        description:
          "Our process begins with understanding your vision, preferences, and requirements through an in-depth consultation.",
      },
      {
        title: "Design Process",
        icon: "palette",
        contentTitle: "Creative Design Process",
        description:
          "We create detailed design concepts and 3D visualizations to bring your vision to life before implementation.",
      },
      {
        title: "Materials",
        icon: "award",
        contentTitle: "Quality Materials",
        description:
          "We source premium, sustainable materials from trusted suppliers to ensure longevity and aesthetic appeal.",
      },
      {
        title: "Execution",
        icon: "home",
        contentTitle: "Precision Execution",
        description:
          "Our skilled craftsmen execute the design with meticulous attention to detail and quality workmanship.",
      },
    ],
    features: [
      {
        icon: "palette",
        title: "Expert Design Consultation",
        description:
          "Our experienced designers will work with you to create spaces that reflect your personality and lifestyle.",
      },
      {
        icon: "award",
        title: "Premium Quality Materials",
        description:
          "We source only the finest materials to ensure your interiors are both beautiful and durable.",
      },
      {
        icon: "home",
        title: "End-to-End Project Management",
        description:
          "From concept to completion, we handle every detail so you can relax and enjoy the transformation.",
      },
      {
        icon: "calendar",
        title: "Personalized Solutions",
        description:
          "Every space is unique - we create custom solutions tailored to your specific needs and preferences.",
      },
    ],
  },
  contactInfo: {
    items: [
      {
        icon: "phone",
        title: "Call Us",
        details: "+91 78959 27366",
      },
      {
        icon: "map-pin",
        title: "Visit Us",
        details: "Tilak Road, Dehradun",
      },
      {
        icon: "clock",
        title: "Working Hours",
        details: "Mon-Sat: 10AM - 7PM",
      },
    ],
  },
};

const AppointmentPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("consultation");
  const [currentHighlight, setCurrentHighlight] = useState(0);
  // Redux state management
  const dispatch = useAppDispatch();
  const contactData = useAppSelector(selectContactContent);
  const contactLoading = useAppSelector(selectContactLoading);
  const contactError = useAppSelector(selectContactError);
  const appointmentData = useAppSelector(selectAppointmentForm);
  const appointmentLoading = useAppSelector(selectAppointmentFormLoading);
  const appointmentError = useAppSelector(selectAppointmentFormError);

  // Use fetched data or fallback to default
  const contactContent = contactData || defaultContactContent;

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchContactContent());
    dispatch(fetchAppointmentForm());
  }, [dispatch]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHighlight(
        (prev) => (prev + 1) % (contactContent.whyChooseUs.features.length || 4)
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [contactContent.whyChooseUs.features.length]);

  if (contactLoading || appointmentLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Image
          src="/Riddhi Interior Design/Logo.png"
          alt="Riddhi Interior Logo"
          width={128}
          height={128}
          className="animate-pulse"
          priority
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-gradient-to-br from-gray-50 to-lime-50">
      {/* Hero Section */}
      <motion.header
        className="relative bg-gradient-to-r from-lime-900 via-lime-700 to-lime-600 text-white p-8 md:p-16 text-center shadow-xl overflow-hidden"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="relative z-10">
          <motion.h1
            className="text-4xl md:text-5xl font-extrabold tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            {contactContent.hero.title}
          </motion.h1>
          <motion.p
            className="mt-4 text-lg font-medium max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {contactContent.hero.subtitle}
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
              {contactContent.hero.buttonText}
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
            {contactContent.whyChooseUs.title}
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            {contactContent.whyChooseUs.description}
          </p>
        </motion.div>

        {/* Interactive Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="max-w-4xl mx-auto mb-12"
        >
          <TabsList className="grid grid-cols-2 md:grid-cols-4 bg-transparent p-2 rounded-xl">
            {contactContent.whyChooseUs.tabs.map((tab, index) => (
              <TabsTrigger
                key={index}
                value={tab.title.toLowerCase().replace(/\s+/g, "-")}
                className="rounded-lg"
              >
                {tab.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {contactContent.whyChooseUs.tabs.map((tab, index) => (
            <TabsContent
              key={index}
              value={tab.title.toLowerCase().replace(/\s+/g, "-")}
            >
              <Card className="border-lime-500 border-2">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center">
                      {getStaticIcon(tab.icon)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-lime-900">
                        {tab.contentTitle}
                      </h3>
                      <p className="mt-2 text-gray-600">{tab.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Auto-rotating highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {contactContent.whyChooseUs.features.map((feature, index) => (
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
                  {getStaticIcon(feature.icon)}
                </div>
                <h3 className="text-xl font-bold text-lime-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-gray-600">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Appointment Form Section */}
      <section
        id="appointment-form"
        className="relative py-16 bg-gradient-to-b from-gray-50 to-lime-50"
      >
        <div className="max-w-6xl mx-auto px-4">
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
            {contactContent.contactInfo.items.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center"
              >
                <div className="bg-lime-500/20 p-4 rounded-full mb-4">
                  {getStaticIcon(item.icon)}
                </div>
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="mt-2 text-lime-100">{item.details}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AppointmentPage;
