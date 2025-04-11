"use client";

import React from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { blogs } from "@/app/data/blogs";

const BlogDetail: React.FC = () => {
  const params = useParams();
  const slug = params.slug as string; // ensure it's treated as a string

  // Find the blog by slug (ID)
  const blog = blogs.find((b) => b.id === slug);
  if (!blog) return <p className="text-center p-10">Blog not found.</p>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <Link
        href="/blogs"
        className="text-blue-600 hover:underline mb-4 inline-block"
      >
        ← Back to Blogs
      </Link>
      <Card className="shadow-lg">
        <div className="relative w-full h-80">
          <Image
            src={blog.image}
            alt={blog.title}
            layout="fill"
            objectFit="cover"
            className="rounded-t-lg"
          />
        </div>
        <CardHeader className="px-4 pt-4">
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white">
            {blog.title}
          </CardTitle>
          {blog.subheading && (
            <h3 className="text-xl text-gray-500 dark:text-gray-400 mt-2">
              {blog.subheading}
            </h3>
          )}
        </CardHeader>
        <CardContent className="px-4 pb-6">
          <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            {blog.content}
          </p>
          {/* Optional additional images */}
          {blog.additionalImages &&
            blog.additionalImages.map((src, index) => (
              <div key={index} className="my-4 relative h-64">
                <Image
                  src={src}
                  alt={`${blog.title} image ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogDetail;
