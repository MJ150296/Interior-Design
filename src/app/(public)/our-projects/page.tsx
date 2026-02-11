"use client";
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { motion } from "framer-motion";
import { usePublicContent } from "../PublicContentProvider";

interface RawProject {
  imageUrl: string;
  title: string;
  hoverTitle?: string;
  hoverDescription?: string;
  category: string;
  location: string;
  exploreLink?: string;
}

interface Project {
  src: string;
  alt: string;
  title: string;
  description: string;
  category: string;
  location: string;
  exploreLink?: string;
}

// Create a consolidated default content object
const defaultContent = {
  hero: {
    backgroundImageUrl: "/Riddhi Interior Design/Portfolio/cover.jpg",
    title: "Our Portfolio",
    subtitle: "Showcasing Excellence in Interior Design Across Uttarakhand",
    preTitle: "EXPLORE OUR WORK",
  },
  quotes: [
    {
      text: "Riddhi Interiors transformed our home into a masterpiece. Their attention to detail and creative solutions exceeded our expectations.",
      author: "Rajesh & Priya Sharma, Dehradun",
    },
    {
      text: "The commercial space design perfectly captured our brand identity while maximizing functionality. A truly professional team!",
      author: "Vikram Singh, Business Owner, Haridwar",
    },
  ],
  residentialProjects: [
    {
      id: 1,
      title: "Modern Hillside Villa",
      location: "Mussoorie",
      category: "Residential",
      imageUrl:
        "/Riddhi Interior Design/Portfolio/Residential/modern-hillside-villa/cover.jpg",
      hoverTitle: "Contemporary Luxury",
      hoverDescription:
        "A 5,000 sq.ft villa with panoramic mountain views featuring open-plan living spaces and premium finishes",
      exploreLink: "",
    },
    {
      id: 2,
      title: "Heritage Bungalow Restoration",
      location: "Dehradun",
      category: "Residential",
      imageUrl:
        "/Riddhi Interior Design/Portfolio/Residential/heritage-bungalow-restoration/cover.jpg",
      hoverTitle: "Classic Elegance",
      hoverDescription:
        "Restoration of a colonial-era bungalow preserving original architectural elements while adding modern comforts",
      exploreLink: "",
    },
  ],
  commercialProjects: [
    {
      id: 1,
      title: "Premium Restaurant Design",
      location: "Rishikesh",
      category: "Commercial",
      imageUrl:
        "/Riddhi Interior Design/Portfolio/Commercial/premium-restaurant-design/cover.jpg",
      hoverTitle: "Ambiance Creation",
      hoverDescription:
        "A 120-seat fine dining establishment with custom lighting and bespoke furniture",
      exploreLink: "",
    },
    {
      id: 2,
      title: "Corporate Office Space",
      location: "Dehradun",
      category: "Commercial",
      imageUrl:
        "/Riddhi Interior Design/Portfolio/Commercial/corporate-office-space/cover.jpg",
      hoverTitle: "Productive Environment",
      hoverDescription:
        "A 10,000 sq.ft office designed for productivity with ergonomic furniture and collaborative spaces",
      exploreLink: "",
    },
  ],
  stats: [
    { value: "250+", label: "Projects Completed" },
    { value: "98%", label: "Client Satisfaction" },
    { value: "15+", label: "Cities Served" },
    { value: "12+", label: "Years Experience" },
  ],
  cta: {
    title: "Ready to Start Your Project?",
    description:
      "Let's discuss how we can transform your space into something extraordinary. Our team is ready to bring your vision to life with our expert design services.",
  },
};

const Projects = () => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [activeTab, setActiveTab] = useState("residential");
  const { portfolio: reduxContent } = usePublicContent();

  // Merge Redux data with defaults
  const heroData = reduxContent?.hero || defaultContent.hero;
  const quotesData = reduxContent?.quotes || defaultContent.quotes;
  const residentialData =
    reduxContent?.residentialProjects || defaultContent.residentialProjects;
  const commercialData =
    reduxContent?.commercialProjects || defaultContent.commercialProjects;
  const statsData = reduxContent?.stats || defaultContent.stats;
  const ctaData = reduxContent?.cta || defaultContent.cta;

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentQuoteIndex((prev) => (prev + 1) % quotesData.length);
        setFade(true);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, [quotesData.length]);

  // Convert project data to the format expected by the ProjectCard component
  const formatProjectData = (projects: RawProject[]): Project[] => {
    return projects.map((project) => ({
      src: project.imageUrl,
      alt: project.title,
      title: project.hoverTitle || project.title,
      description: project.hoverDescription || "",
      category: project.category,
      location: project.location,
      exploreLink: project.exploreLink || "",
    }));
  };

  const residentialImages = formatProjectData(residentialData);
  const commercialImages = formatProjectData(commercialData);

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
        {project.exploreLink ? (
          <a
            href={project.exploreLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-lime-600 text-white text-sm px-4 py-2 rounded-full mt-4 hover:bg-lime-700 transition-colors"
          >
            Explore Project
          </a>
        ) : (
          <div className="bg-lime-600 text-white text-sm px-4 py-2 rounded-full mt-4">
            Explore Project
          </div>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-lime-50 to-white">
      {/* Hero Section */}
      <div className="relative w-full h-[500px] flex flex-col items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={heroData.backgroundImageUrl}
            alt="Projects background"
            layout="fill"
            objectFit="cover"
            className="brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-lime-900/50 to-transparent" />
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
            {heroData.preTitle}
          </motion.span>

          <motion.h1
            className="text-4xl md:text-6xl font-serif font-bold text-white tracking-wide mb-5"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {heroData.title}
          </motion.h1>

          <motion.p
            className="font-bold text-xl md:text-2xl text-lime-100 tracking-wide font-serif max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            {heroData.subtitle}
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
            className={`transition-all duration-500 ease-in-out ${fade ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
          >
            <p className="text-lg text-gray-700 max-w-3xl mx-auto font-light italic">
              &quot;{quotesData[currentQuoteIndex]?.text}&quot;
            </p>
            <p className="text-sm text-gray-500 mt-2">
              - {quotesData[currentQuoteIndex]?.author}
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

          {/* Tabs Content */}
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
            {statsData.map((stat, index) => (
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
              {ctaData.title}
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              {ctaData.description}
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
    </div>
  );
};

export default Projects;
