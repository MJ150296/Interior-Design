"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { usePublicContent } from "../PublicContentProvider";

// Simplified interface for public blog display
interface BlogArticle {
  id: string;
  imageUrl: string;
  category: string;
  title: string;
  description: string;
  author: string;
  authorBio?: string;
  date: string;
}

interface BlogHero {
  backgroundImageUrl: string;
  preTitle: string;
  title: string;
  subtitle: string;
  searchPlaceholder: string;
}

interface BlogFeatured {
  title: string;
  postIds: string[];
}

interface BlogNewsletter {
  title: string;
  description: string;
  placeholder: string;
  buttonText: string;
  privacyText: string;
}

interface BlogContentType {
  hero: BlogHero;
  featured: BlogFeatured;
  categories: string[];
  articles: BlogArticle[];
  newsletter: BlogNewsletter;
}

// Default content for when no data is available
const defaultContent: BlogContentType = {
  hero: {
    backgroundImageUrl: "/Riddhi Interior Design/Projects/cover.jpg",
    preTitle: "INSIGHTS & INSPIRATION",
    title: "Design Journal",
    subtitle: "Explore Ideas, Trends, and Expert Advice on Beautiful Living Spaces.",
    searchPlaceholder: "Search blog posts...",
  },
  featured: {
    title: "Featured Inspiration",
    postIds: ["1"],
  },
  categories: ["All", "Trends", "Space Planning", "Residential", "Color Theory", "Budget Design"],
  articles: [
    {
      id: "1",
      imageUrl: "/Riddhi Interior Design/Blogs/top_interior_design_trends_for_the_year.jpeg",
      category: "Trends",
      title: "Top Interior Design Trends for 2025",
      description: "Discover the biggest interior design trends for 2025—from natural textures and bold color accents to smart homes and sustainable materials.",
      author: "Riddhi Sharma",
      authorBio: "Interior Design Expert",
      date: "May 15, 2025",
    },
  ],
  newsletter: {
    title: "Design Inspiration Delivered",
    description: "Join our newsletter and receive exclusive design tips, trend reports, and special offers.",
    placeholder: "Your email address",
    buttonText: "Subscribe",
    privacyText: "We respect your privacy. Unsubscribe at any time.",
  },
};

const BlogList: React.FC = () => {
  const { blog: reduxContent } = usePublicContent();
  const [activeCategory, setActiveCategory] = useState("all");
  const [hoveredBlog, setHoveredBlog] = useState<string | null>(null);
  const [featuredBlog, setFeaturedBlog] = useState<BlogArticle | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ARTICLES_PER_PAGE = 6;

  console.log("BlogList content:", reduxContent); // Debug log for content

  // Merge Redux data with defaults
  const content: BlogContentType = {
    hero: reduxContent?.hero || defaultContent.hero,
    featured: reduxContent?.featured || defaultContent.featured,
    categories: reduxContent?.categories || defaultContent.categories,
    articles: reduxContent?.articles || defaultContent.articles,
    newsletter: reduxContent?.newsletter || defaultContent.newsletter,
  };

  // Sort articles by date (latest first)
  const sortedArticles = useMemo(() => {
    return [...(content.articles || [])].sort((a, b) => {
      const dateA = new Date(a.date || "Jan 1, 2024");
      const dateB = new Date(b.date || "Jan 1, 2024");
      return dateB.getTime() - dateA.getTime();
    });
  }, [content.articles]);

  // Get featured articles from postIds - wrapped in useMemo to fix exhaustive-deps warning
  const featuredArticles = useMemo(() => {
    return content.articles?.filter((article: BlogArticle) => 
      content.featured?.postIds?.includes(article.id || "")
    ) || [];
  }, [content.articles, content.featured?.postIds]);

  // Set initial featured blog from postIds
  useEffect(() => {
    if (featuredArticles.length > 0 && !featuredBlog) {
      setFeaturedBlog(featuredArticles[0]);
    }
  }, [featuredArticles, featuredBlog]);

  // Fallback featured blog if null
  const displayFeaturedBlog = featuredBlog || featuredArticles[0] || content.articles?.[0] || {
    id: "1",
    imageUrl: "/Riddhi%20Interior%20Design/Blogs/top_interior_design_trends_for_the_year.jpeg",
    category: "Trends",
    title: "Top Interior Design Trends for 2025",
    description: "Discover the biggest interior design trends for 2025",
    author: "Riddhi Sharma",
    date: "May 15, 2025"
  } as BlogArticle;

  // Filter blogs based on category and search using sorted articles
  const filteredBlogs = sortedArticles.filter((blog: BlogArticle) => {
    const matchesCategory =
      activeCategory === "all" || blog.category === activeCategory;
    const matchesSearch =
      (blog.title?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (blog.description?.toLowerCase() || "").includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredBlogs.length / ARTICLES_PER_PAGE);
  const indexOfLastArticle = currentPage * ARTICLES_PER_PAGE;
  const indexOfFirstArticle = indexOfLastArticle - ARTICLES_PER_PAGE;
  const currentArticles = filteredBlogs.slice(indexOfFirstArticle, indexOfLastArticle);

  // Reset to page 1 when category or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery]);

  // Update featured blog every 8 seconds - only cycle through featured articles
  useEffect(() => {
    const interval = setInterval(() => {
      if (featuredArticles.length > 0) {
        setFeaturedBlog((prev: BlogArticle | null) => {
          const currentIndex = featuredArticles.findIndex((b: BlogArticle) => b.id === prev?.id);
          const nextIndex = (currentIndex + 1) % featuredArticles.length;
          return featuredArticles[nextIndex];
        });
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [featuredArticles]);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Unique categories from content
  const categories = content.categories || ["all"];

  return (
    <div className="min-h-screen bg-linear-to-b from-lime-50 to-white">
      {/* Hero Section */}
      <div className="relative w-full h-132 shadow-xl flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Parallax background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('/Riddhi%20Interior%20Design/Projects/cover.jpg')] bg-cover bg-center bg-no-repeat" />
          <div className="absolute inset-0 bg-linear-to-t from-lime-900/50 to-transparent" />
        </div>

        {/* Content */}
        <motion.div
          className="relative z-10 flex flex-col items-center justify-center px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.span
            className="text-xs md:text-sm tracking-widest font-bold text-lime-200 mb-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            {content.hero.preTitle}
          </motion.span>

          <motion.h1
            className="text-4xl md:text-7xl text-white font-bold tracking-wide mb-5 font-serif"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {content.hero.title}
          </motion.h1>

          <motion.p
            className="font-bold text-xl md:text-2xl text-lime-100 tracking-wide font-serif max-w-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            {content.hero.subtitle}
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
                placeholder={content.hero.searchPlaceholder || "Search blog posts..."}
                className="w-full bg-transparent border-none focus:outline-none text-gray-700 placeholder-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Featured Blog Carousel */}
      <section className="py-12 bg-linear-to-r from-lime-50 to-lime-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center gap-4 mb-12">
            <div className="h-px bg-lime-300 grow max-w-20 md:max-w-40" />
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-lime-900 text-center">
              Featured Inspiration
            </h2>
            <div className="h-px bg-lime-300 grow max-w-20 md:max-w-40" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={displayFeaturedBlog?.id || "featured"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="relative overflow-hidden rounded-2xl shadow-xl"
            >
              <div className="relative h-96">
                <Image
                  src={displayFeaturedBlog?.imageUrl || "/Riddhi%20Interior%20Design/Blogs/top_interior_design_trends_for_the_year.jpeg"}
                  alt={displayFeaturedBlog?.title || "Blog"}
                  fill
                  className="brightness-90 object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-lime-900/80 to-transparent" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <span className="bg-lime-600 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3 inline-block">
                  {displayFeaturedBlog?.category || "Blog"}
                </span>
                <Link href={`/blogs/${displayFeaturedBlog?.id || "1"}`}>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 hover:text-lime-200 transition-colors">
                    {displayFeaturedBlog?.title || "Blog Post"}
                  </h3>
                </Link>
                <p className="text-lime-100 mb-4 max-w-2xl">
                  {displayFeaturedBlog?.description || ""}
                </p>
                <div className="flex items-center">
                  <div className="w-16 h-16 rounded-full bg-lime-200 flex items-center justify-center border-2 border-lime-500">
                    <span className="text-lime-700 font-bold text-2xl">
                      {displayFeaturedBlog?.author?.charAt(0)}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-lime-200 font-medium">
                      {displayFeaturedBlog?.author || "Author"}
                    </p>
                    <p className="text-lime-300 text-sm">
                      {displayFeaturedBlog?.date || ""}
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
        className={`sticky top-0 z-10 py-4 bg-white shadow-md transition-all duration-300 ${isScrolled ? "py-3" : "py-4"
          }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            {categories.map((category) => (
              <motion.button
                key={category}
                className={`px-4 py-2 rounded-full text-sm md:text-base font-medium transition-colors duration-300 ${activeCategory === category
                  ? "bg-lime-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-lime-100"
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
            <div className="h-px bg-lime-300 grow max-w-20 md:max-w-40" />
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-lime-900 text-center">
              Latest Articles
            </h2>
            <div className="h-px bg-lime-300 grow max-w-20 md:max-w-40" />
          </div>

          {filteredBlogs.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-bold text-lime-800 mb-4">
                No articles found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search or filter
              </p>
              <button
                className="bg-lime-600 hover:bg-lime-700 text-white font-medium py-2 px-6 rounded-full transition-colors"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentArticles.map((blog) => (
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
                      <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-lime-100">
                        <div className="relative h-56 overflow-hidden">
                          <Image
                            src={blog.imageUrl}
                            alt={blog.title}
                            fill
                            className={`object-cover transition-transform duration-500 ${hoveredBlog === blog.id ? "scale-110" : "scale-100"
                              }`}
                          />
                          <div className="absolute top-4 right-4">
                            <span className="bg-lime-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
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
                          <p className="text-gray-600 mb-4">{blog.description}</p>

                          <div className="flex items-center justify-between border-t border-lime-100 pt-4">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full bg-lime-200 flex items-center justify-center border-2 border-lime-500">
                                <span className="text-lime-700 font-bold text-lg">
                                  {blog.author?.charAt(0)}
                                </span>
                              </div>
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
                            className="absolute inset-0 bg-lime-700/90 flex items-center justify-center rounded-lg"
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-lime-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-full font-medium transition-colors ${
                        currentPage === page
                          ? "bg-lime-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-lime-100"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-lime-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}

        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-linear-to-r from-lime-900 to-lime-700 text-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              {content.newsletter.title}
            </h2>
            <p className="text-lime-100 max-w-2xl mx-auto">
              {content.newsletter.description}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 shadow-lg">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="email"
                placeholder={content.newsletter.placeholder}
                className="grow px-5 py-3 rounded-full bg-white/20 text-white placeholder-lime-200 focus:outline-none focus:ring-2 focus:ring-lime-400"
              />
              <button className="bg-lime-500 hover:bg-lime-400 text-lime-900 font-bold py-3 px-6 rounded-full transition-colors shadow-lg">
                {content.newsletter.buttonText}
              </button>
            </div>
            <p className="text-lime-200 text-sm text-center mt-4">
              {content.newsletter.privacyText}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogList;
