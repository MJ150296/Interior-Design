// Example using pages directory: pages/blog/index.tsx
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { blogs } from "../data/blogs";

const BlogList: React.FC = () => {
  return (
    <section className="py-10 px-4 md:px-8 lg:px-12">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
        Our Blog
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <Link key={blog.id} href={`/blogs/${blog.id}`}>
            <Card className="h-full shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="relative w-full h-48">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg"
                />
              </div>
              <CardHeader className="px-4 pt-4">
                <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white">
                  {blog.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-6">
                <p className="text-gray-600 dark:text-gray-300">
                  {blog.excerpt}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default BlogList;
