"use client";

import React from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { blogs } from "@/app/data/blogs";
import { motion } from "framer-motion";
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  LayoutGridIcon,
} from "lucide-react";

const BlogDetail: React.FC = () => {
  const params = useParams();
  const slug = params.slug as string;

  const blog = blogs.find((b) => b.id === slug);
  if (!blog) return <p className="text-center p-10">Blog not found.</p>;

  return (
    <div className="relative max-w-7xl mx-auto py-2 px-4">
      <div className="absolute top-7 left-10 z-20">
        <Link
          href="/blogs"
          className="text-lime-700 hover:text-lime-900 font-medium flex items-center group"
        >
          <svg
            className="w-8 h-8 bg-lime-50 p-2 rounded-full mr-2 group-hover:-translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </Link>
      </div>

      {/* Featured Image with Overlay */}
      <div className="relative w-full h-[500px] rounded-xl overflow-hidden shadow-xl mb-12">
        <Image
          src={blog.image}
          alt={blog.title}
          layout="fill"
          objectFit="cover"
          className="brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-lime-900/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <motion.h1
            className="text-3xl md:text-5xl font-serif font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {blog.title}
          </motion.h1>
          {blog.subheading && (
            <motion.p
              className="text-xl text-lime-100 max-w-3xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {blog.subheading}
            </motion.p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card className="shadow-lg rounded-xl overflow-hidden border border-lime-100">
            <CardContent className="p-6 md:p-8">
              {/* Meta Information */}
              <div className="flex flex-wrap gap-4 mb-8 pb-4 border-b border-lime-100">
                <div className="flex items-center text-lime-700">
                  <UserIcon className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">{blog.author}</span>
                </div>
                <div className="flex items-center text-lime-700">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">{blog.date}</span>
                </div>
                <div className="flex items-center text-lime-700">
                  <ClockIcon className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">{blog.readTime}</span>
                </div>
                <div className="flex items-center text-lime-700">
                  <LayoutGridIcon className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">{blog.category}</span>
                </div>
              </div>

              {/* Blog Content */}
              <motion.div
                className="prose prose-lg max-w-none text-gray-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.7 }}
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />

              {/* Key Features */}
              {blog.keyFeatures && blog.keyFeatures.length > 0 && (
                <motion.div
                  className="mt-12 bg-lime-50 rounded-xl p-6 border border-lime-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <h3 className="text-xl font-bold text-lime-900 mb-4">
                    Key Features
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {blog.keyFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg
                          className="w-5 h-5 text-lime-600 mt-0.5 mr-2 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Design Tips */}
              {blog.designTips && blog.designTips.length > 0 && (
                <motion.div
                  className="mt-8 bg-gradient-to-r from-lime-50 to-lime-100 rounded-xl p-6 border border-lime-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <h3 className="text-xl font-bold text-lime-900 mb-4">
                    Design Tips from Our Experts
                  </h3>
                  <ul className="space-y-3">
                    {blog.designTips.map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <div className="bg-lime-500 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">
                          <span className="text-white text-sm font-bold">
                            {index + 1}
                          </span>
                        </div>
                        <span className="text-gray-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Additional Images Gallery */}
              {blog.additionalImages && blog.additionalImages.length > 0 && (
                <motion.div
                  className="mt-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <h3 className="text-xl font-bold text-lime-900 mb-6">
                    Project Gallery
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {blog.additionalImages.map((img, index) => (
                      <div
                        key={index}
                        className="relative h-72 rounded-xl overflow-hidden shadow-md"
                      >
                        <Image
                          src={img}
                          alt={`${blog.title} gallery image ${index + 1}`}
                          layout="fill"
                          objectFit="cover"
                          className="transition-transform duration-500 hover:scale-105"
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div>
          {/* Author Info */}
          <Card className="shadow-lg rounded-xl overflow-hidden border border-lime-100 mb-8">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-lime-900 mb-4">
                About the Author
              </h3>
              <div className="flex items-start">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                <div className="ml-4">
                  <h4 className="font-bold text-gray-800">{blog.author}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Interior Design Specialist at Riddhi Interiors with over 10
                    years of experience creating beautiful living spaces.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Categories */}
          <Card className="shadow-lg rounded-xl overflow-hidden border border-lime-100 mb-8">
            <CardHeader className="bg-lime-50 p-4">
              <CardTitle className="text-lg font-bold text-lime-900">
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <ul className="space-y-2">
                {Array.from(new Set(blogs.map((b) => b.category))).map(
                  (category, index) => (
                    <li key={index}>
                      <Link
                        href="#"
                        className="flex items-center justify-between py-2 text-gray-700 hover:text-lime-700 transition-colors"
                      >
                        <span>{category}</span>
                        <span className="bg-lime-100 text-lime-800 text-xs font-medium px-2 py-1 rounded-full">
                          {blogs.filter((b) => b.category === category).length}
                        </span>
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </CardContent>
          </Card>

          {/* Related Blogs */}
          <Card className="shadow-lg rounded-xl overflow-hidden border border-lime-100">
            <CardHeader className="bg-lime-50 p-4">
              <CardTitle className="text-lg font-bold text-lime-900">
                You May Also Like
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                {blogs
                  .filter((b) => b.id !== blog.id)
                  .slice(0, 3)
                  .map((relatedBlog) => (
                    <Link
                      key={relatedBlog.id}
                      href={`/blogs/${relatedBlog.id}`}
                      className="group block"
                    >
                      <div className="flex items-start">
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={relatedBlog.image}
                            alt={relatedBlog.title}
                            layout="fill"
                            objectFit="cover"
                            className="transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                        <div className="ml-4">
                          <h4 className="font-bold text-gray-800 group-hover:text-lime-700 transition-colors">
                            {relatedBlog.title}
                          </h4>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <CalendarIcon className="w-3 h-3 mr-1" />
                            <span>{relatedBlog.date}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Newsletter CTA */}
      <motion.div
        className="mt-16 bg-gradient-to-r from-lime-700 to-lime-900 rounded-2xl p-8 text-white text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <h3 className="text-2xl font-serif font-bold mb-4">
          Stay Inspired with Our Design Journal
        </h3>
        <p className="text-lime-100 max-w-2xl mx-auto mb-6">
          Subscribe to our newsletter for exclusive design tips, trend reports,
          and special offers delivered to your inbox.
        </p>
        <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="Your email address"
            className="flex-grow px-5 py-3 rounded-full bg-white/20 text-white placeholder-lime-200 focus:outline-none focus:ring-2 focus:ring-lime-400"
          />
          <button className="bg-lime-500 hover:bg-lime-400 text-lime-900 font-bold py-3 px-6 rounded-full transition-colors shadow-lg">
            Subscribe
          </button>
        </div>
        <p className="text-lime-200 text-sm mt-4">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </motion.div>
    </div>
  );
};

export default BlogDetail;
