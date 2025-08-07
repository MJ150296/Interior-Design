"use client";
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/app/redux/store/hooks";
import {
  fetchPortfolioContent,
  selectPortfolioContent,
  selectPortfolioLoading,
} from "@/app/redux/slices/portfolioPageSlice";

interface Project {
  src: string;
  alt: string;
  title: string;
  description: string;
  category: string;
  location: string;
}

const residentialImages = [
  {
    src: "/Riddhi Interior Design/masonry-1.jpg",
    alt: "Residential 1",
    title: "Elegant Living",
    description: "Cozy and refined home interiors.",
    category: "Living Room",
    location: "Dehradun",
  },
  {
    src: "/Riddhi Interior Design/masonry-2.jpg",
    alt: "Residential 2",
    title: "Serene Spaces",
    description: "Comfort meets creativity.",
    category: "Bedroom",
    location: "Mussoorie",
  },
  {
    src: "/Riddhi Interior Design/masonry-3.jpg",
    alt: "Residential 3",
    title: "Modern Vibes",
    description: "Designed to enhance everyday life.",
    category: "Kitchen",
    location: "Rishikesh",
  },
  {
    src: "/Riddhi Interior Design/masonry-4.jpg",
    alt: "Commercial 1",
    title: "Corporate Class",
    description: "Workspaces that inspire productivity.",
    category: "Office",
    location: "Haridwar",
  },
  {
    src: "/Riddhi Interior Design/masonry-5.jpg",
    alt: "Commercial 2",
    title: "Retail Radiance",
    description: "Showrooms that attract attention.",
    category: "Retail",
    location: "Noida",
  },
  {
    src: "/Riddhi Interior Design/masonry-6.jpg",
    alt: "Commercial 3",
    title: "Hospitality Harmony",
    description: "Where business meets comfort.",
    category: "Restaurant",
    location: "Delhi",
  },
  {
    src: "/Riddhi Interior Design/luxury.jpg",
    alt: "Luxury Residence",
    title: "Opulent Retreat",
    description: "Premium finishes for discerning clients.",
    category: "Penthouse",
    location: "Dehradun",
  },
  {
    src: "/Riddhi Interior Design/modular-interior.jpg",
    alt: "Modular Kitchen",
    title: "Culinary Excellence",
    description: "Smart storage solutions for modern homes.",
    category: "Kitchen",
    location: "Rishikesh",
  },
  {
    src: "/Riddhi Interior Design/modular-interior.jpg",
    alt: "Master Bedroom",
    title: "Tranquil Sanctuary",
    description: "Restful spaces designed for relaxation.",
    category: "Bedroom",
    location: "Mussoorie",
  },
];

const commercialImages = [
  {
    src: "/Riddhi Interior Design/luxury.jpg",
    alt: "Commercial Office",
    title: "Corporate Class",
    description: "Workspaces that inspire productivity.",
    category: "Office",
    location: "Dehradun",
  },
  {
    src: "/Riddhi Interior Design/masonry1.jpg",
    alt: "Retail Space",
    title: "Retail Radiance",
    description: "Showrooms that attract attention.",
    category: "Retail",
    location: "Delhi",
  },
  {
    src: "/Riddhi Interior Design/luxury.jpg",
    alt: "Hotel Lobby",
    title: "Hospitality Harmony",
    description: "Where business meets comfort.",
    category: "Hotel",
    location: "Rishikesh",
  },
  {
    src: "/Riddhi Interior Design/luxury.jpg",
    alt: "Fine Dining",
    title: "Culinary Experience",
    description: "Atmosphere that complements cuisine.",
    category: "Restaurant",
    location: "Mussoorie",
  },
  {
    src: "/Riddhi Interior Design/masonry3.jpg",
    alt: "Coffee Shop",
    title: "Urban Oasis",
    description: "Spaces that encourage conversation.",
    category: "Cafe",
    location: "Haridwar",
  },
  {
    src: "/Riddhi Interior Design/modular-interior.jpg",
    alt: "Wellness Center",
    title: "Holistic Design",
    description: "Spaces that promote wellbeing.",
    category: "Spa",
    location: "Dehradun",
  },
];

const quotes = [
  {
    text: "The best rooms have something to say about the people who live in them.",
    author: "M.J",
  },
  {
    text: "Design is not just what it looks like and feels like. Design is how it works.",
    author: "Steve Jobs",
  },
  {
    text: "The details are not the details. They make the design.",
    author: "Charles Eames",
  },
  {
    text: "A room should feel collected, not decorated.",
    author: "Benjamin Noriega-Ortiz",
  },
];

const Projects = () => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [activeTab, setActiveTab] = useState("residential");
  const [loading, setLoading] = useState(true);

  const dispatch = useAppDispatch();
  const reduxContent = useAppSelector(selectPortfolioContent);
  const reduxLoading = useAppSelector(selectPortfolioLoading);
  // const reduxError = useAppSelector(selectPortfolioError);

  useEffect(() => {
    // Check if Redux data is available
    if (reduxContent) {
      setLoading(false);
      console.log("Redux content loaded:", reduxContent);
    } else {
      // If not, fetch data from the server
      dispatch(fetchPortfolioContent()).then(() => setLoading(false));
    }
  }, [dispatch, reduxContent]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
        setFade(true);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const ProjectCard = ({ project }: { project: Project }) => (
    <motion.div
      className="relative group overflow-hidden rounded-xl shadow-lg"
      whileHover={{ y: -10 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative h-80">
        <Image
          src={project.src}
          alt={project.alt}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-lime-900/50 to-transparent" />
        <div className="absolute top-4 right-4">
          <span className="bg-lime-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
            {project.category}
          </span>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
        <h3 className="text-xl font-bold">{project.title}</h3>
        <div className="flex justify-between items-center mt-2">
          <p className="text-lime-300 text-sm">{project.location}</p>
          <span className="text-xs bg-lime-500 px-2 py-1 rounded-full">
            View Project
          </span>
        </div>
      </div>

      <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-center p-4 text-white">
        <h3 className="text-xl font-bold">{project.title}</h3>
        <p className="text-sm mt-2 mb-4">{project.description}</p>
        <div className="bg-lime-600 text-white text-sm px-4 py-2 rounded-full mt-4">
          Explore Project
        </div>
      </div>
    </motion.div>
  );

    if (loading || reduxLoading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <Image
            src="/Riddhi Interior Design/Logo.png" // Place your logo in the public directory
            alt="Riddhi Interior Logo"
            width={128} // equivalent to w-32
            height={128} // equivalent to h-32
            className="animate-pulse"
            priority
          />
        </div>
      );
    }

  return (
    <div className="min-h-screen bg-gradient-to-b from-lime-50 to-white">
      {/* Hero Section */}
      <div className="relative w-full h-[500px] flex flex-col items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/Riddhi Interior Design/Projects/cover.jpg"
            alt="Projects background"
            layout="fill"
            objectFit="cover"
            className="brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-lime-900/50 to-transparent" />
          {/* <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-repeat opacity-10" /> */}
        </div>

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
            OUR EXCLUSIVE CLIENT
          </motion.span>

          <motion.h1
            className="text-4xl md:text-6xl font-serif font-bold text-white tracking-wide mb-5"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Project Portfolio
          </motion.h1>

          <motion.p
            className="font-bold text-xl md:text-2xl text-lime-100 tracking-wide font-serif max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            We Have Solutions for All Your Space Related Issues!
          </motion.p>
        </motion.div>
      </div>

      {/* Quote Section */}
      <div className="w-full text-center pt-16 px-4 md:px-0">
        <motion.div
          className="flex justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex justify-center items-center gap-x-10">
            <Image
              src="/Riddhi Interior Design/About/hang-lamp.png"
              alt="hanging lamp"
              width={50}
              height={50}
              className="mx-auto"
            />
            <h2 className="text-3xl md:text-4xl mb-1 font-bold italic text-lime-900 font-serif">
              Explore Our Signature Projects
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
        <div className="min-h-[100px] flex items-center justify-center">
          <div
            className={`transition-all duration-500 ease-in-out ${
              fade ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <p className="text-lg text-gray-700 max-w-3xl mx-auto font-light italic">
              “{quotes[currentQuoteIndex].text}”
            </p>
            <p className="text-sm text-gray-500 mt-2">
              - {quotes[currentQuoteIndex].author}
            </p>
          </div>
        </div>
      </div>

      {/* Project Tabs */}
      <div className="py-16 px-4 max-w-7xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Tabs List */}
          <div className="flex flex-col items-center mb-12">
            <TabsList className="bg-transparent gap-x-14 w-full flex justify-center">
              <TabsTrigger
                value="residential"
                className="relative font-serif text-2xl md:text-3xl text-lime-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none
            after:content-[''] after:absolute after:-bottom-3 after:left-0 after:w-full after:h-1 after:bg-lime-500 after:scale-x-0 after:origin-right after:transition-transform after:duration-300
            data-[state=active]:after:scale-x-100"
              >
                Residential
              </TabsTrigger>

              <div className="h-10 border border-l-2 border-lime-500 hidden md:block"></div>

              <TabsTrigger
                value="commercial"
                className="relative font-serif text-2xl md:text-3xl text-lime-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none
            after:content-[''] after:absolute after:-bottom-3 after:left-0 after:w-full after:h-1 after:bg-lime-500 after:scale-x-0 after:origin-left after:transition-transform after:duration-300
            data-[state=active]:after:scale-x-100"
              >
                Commercial
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tabs Content - Now properly inside Tabs */}
          <TabsContent value="residential">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {residentialImages.map((project, index) => (
                <ProjectCard key={index} project={project} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="commercial">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {commercialImages.map((project, index) => (
                <ProjectCard key={index} project={project} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-lime-700 to-lime-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2
              className="text-3xl md:text-4xl font-serif font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Our Design Journey
            </motion.h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "250+", label: "Projects Completed" },
              { value: "98%", label: "Client Satisfaction" },
              { value: "15+", label: "Years Experience" },
              { value: "50+", label: "Awards Received" },
            ].map((stat, index) => (
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
      <section className="py-16 bg-gradient-to-b from-white to-lime-50">
        <div className="max-w-4xl mx-auto text-center px-4">
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-lime-200"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl md:text-3xl font-serif font-bold text-lime-900 mb-4">
              Ready to Start Your Project?
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Schedule a free consultation with our design experts to discuss
              your vision
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-lime-600 hover:bg-lime-700 text-white font-bold py-3 px-8 rounded-full transition-colors shadow-lg text-lg">
                Book a Consultation
              </button>
              <button className="bg-white border-2 border-lime-600 text-lime-700 hover:bg-lime-50 font-bold py-3 px-8 rounded-full transition-colors text-lg">
                View Pricing
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Projects;
