// Example using pages directory: pages/blog/index.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { blogs } from "../../data/blogs";
import { motion, AnimatePresence } from "framer-motion";

const BlogList: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [hoveredBlog, setHoveredBlog] = useState<string | null>(null);
  const [featuredBlog, setFeaturedBlog] = useState(blogs[0]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter blogs based on category and search
  const filteredBlogs = blogs.filter((blog) => {
    const matchesCategory =
      activeCategory === "all" || blog.category === activeCategory;
    const matchesSearch =
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Update featured blog every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setFeaturedBlog((prev) => {
        const currentIndex = blogs.findIndex((b) => b.id === prev.id);
        const nextIndex = (currentIndex + 1) % blogs.length;
        return blogs[nextIndex];
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Unique categories
  const categories = [
    "all",
    ...Array.from(new Set(blogs.map((blog) => blog.category))),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Hero Section */}
      <div className="relative w-full h-[530px] shadow-xl flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Parallax background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('/Riddhi%20Interior%20Design/Projects/cover.jpg')] bg-cover bg-center bg-no-repeat" />
          <div className="absolute inset-0 bg-gradient-to-t from-amber-900/80 to-amber-700/30" />
          {/* <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-repeat opacity-10" /> */}
        </div>

        {/* Content */}
        <motion.div
          className="relative z-10 flex flex-col items-center justify-center px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.span
            className="text-xs md:text-sm tracking-widest font-bold text-amber-200 mb-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            INSIGHTS & INSPIRATION
          </motion.span>

          <motion.h1
            className="text-4xl md:text-7xl text-white font-bold tracking-wide mb-5 font-serif"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Design Journal
          </motion.h1>

          <motion.p
            className="font-bold text-xl md:text-2xl text-amber-100 tracking-wide font-serif max-w-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            Explore Ideas, Trends, and Expert Advice on Beautiful Living Spaces.
          </motion.p>

          {/* Search bar */}
          <motion.div
            className="mt-8 w-full max-w-md bg-white/90 backdrop-blur-sm rounded-full overflow-hidden shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <div className="flex items-center px-4 py-3">
              <svg
                className="w-5 h-5 text-gray-400 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search blog posts..."
                className="w-full bg-transparent border-none focus:outline-none text-gray-700 placeholder-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Featured Blog Carousel */}
      <section className="py-12 bg-gradient-to-r from-amber-50 to-amber-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center gap-4 mb-12">
            <div className="h-px bg-amber-300 flex-grow max-w-20 md:max-w-40" />
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-amber-900 text-center">
              Featured Inspiration
            </h2>
            <div className="h-px bg-amber-300 flex-grow max-w-20 md:max-w-40" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={featuredBlog.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="relative overflow-hidden rounded-2xl shadow-xl"
            >
              <div className="relative h-96">
                <Image
                  src={featuredBlog.image}
                  alt={featuredBlog.title}
                  layout="fill"
                  objectFit="cover"
                  className="brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-amber-900/80 to-transparent" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <span className="bg-amber-600 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3 inline-block">
                  {featuredBlog.category}
                </span>
                <Link href={`/blogs/${featuredBlog.id}`}>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 hover:text-amber-200 transition-colors">
                    {featuredBlog.title}
                  </h3>
                </Link>
                <p className="text-amber-100 mb-4 max-w-2xl">
                  {featuredBlog.excerpt}
                </p>
                <div className="flex items-center">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                  <div className="ml-3">
                    <p className="text-amber-200 font-medium">
                      {featuredBlog.author}
                    </p>
                    <p className="text-amber-300 text-sm">
                      {featuredBlog.date}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Sticky category filter */}
      <div
        className={`sticky top-0 z-10 py-4 bg-white shadow-md transition-all duration-300 ${
          isScrolled ? "py-3" : "py-4"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            {categories.map((category) => (
              <motion.button
                key={category}
                className={`px-4 py-2 rounded-full text-sm md:text-base font-medium transition-colors duration-300 ${
                  activeCategory === category
                    ? "bg-amber-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-amber-100"
                }`}
                onClick={() => setActiveCategory(category)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Blog Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center gap-4 mb-12">
            <div className="h-px bg-amber-300 flex-grow max-w-20 md:max-w-40" />
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-amber-900 text-center">
              Latest Articles
            </h2>
            <div className="h-px bg-amber-300 flex-grow max-w-20 md:max-w-40" />
          </div>

          {filteredBlogs.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-bold text-amber-800 mb-4">
                No articles found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search or filter
              </p>
              <button
                className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-6 rounded-full transition-colors"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map((blog) => (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  whileHover={{ y: -10 }}
                  onHoverStart={() => setHoveredBlog(blog.id)}
                  onHoverEnd={() => setHoveredBlog(null)}
                  className="relative"
                >
                  <Link href={`/blogs/${blog.id}`}>
                    <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-amber-100">
                      <div className="relative h-56 overflow-hidden">
                        <Image
                          src={blog.image}
                          alt={blog.title}
                          layout="fill"
                          objectFit="cover"
                          className={`transition-transform duration-500 ${
                            hoveredBlog === blog.id ? "scale-110" : "scale-100"
                          }`}
                        />
                        <div className="absolute top-4 right-4">
                          <span className="bg-amber-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                            {blog.category}
                          </span>
                        </div>
                      </div>

                      <CardHeader className="px-6 pt-6">
                        <CardTitle className="text-xl font-bold text-gray-800">
                          {blog.title}
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="px-6 pb-6">
                        <p className="text-gray-600 mb-4">{blog.excerpt}</p>

                        <div className="flex items-center justify-between border-t border-amber-100 pt-4">
                          <div className="flex items-center">
                            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8" />
                            <span className="ml-2 text-sm text-gray-500">
                              {blog.author}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {blog.date}
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Hover effect overlay */}
                    <AnimatePresence>
                      {hoveredBlog === blog.id && (
                        <motion.div
                          className="absolute inset-0 bg-amber-600/90 flex items-center justify-center rounded-lg"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <motion.span
                            className="text-white font-bold text-lg"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                          >
                            Read Article →
                          </motion.span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-amber-900 to-amber-700 text-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Design Inspiration Delivered
            </h2>
            <p className="text-amber-100 max-w-2xl mx-auto">
              Join our newsletter and receive exclusive design tips, trend
              reports, and special offers.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 shadow-lg">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-5 py-3 rounded-full bg-white/20 text-white placeholder-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <button className="bg-amber-500 hover:bg-amber-400 text-amber-900 font-bold py-3 px-6 rounded-full transition-colors shadow-lg">
                Subscribe
              </button>
            </div>
            <p className="text-amber-200 text-sm text-center mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogList;
