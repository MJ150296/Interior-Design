"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@/components/ui/button";
import { blogs } from "@/app/data/blogs";

const BlogCarousel: React.FC = () => {
  const plugin = React.useRef(
    Autoplay({ delay: 6000, stopOnInteraction: false })
  );

  return (
    <section className="py-16 px-4 w-full max-w-7xl mx-auto">
      <div className="text-center mb-16 flex flex-col items-center">
        <motion.h2
          className="text-3xl md:text-4xl font-serif font-bold text-amber-900 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center items-center gap-x-2 md:gap-x-10 mb-5">
            <Image
              src="/Riddhi Interior Design/About/hang-lamp.png"
              alt="hanging lamp"
              width={50}
              height={50}
              className="mx-auto"
            />
            <h2 className="text-2xl md:text-4xl mb-1 font-bold italic text-orange-900 font-serif">
              Design Insights & Inspiration
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
          className="text-gray-600 max-w-2xl mx-auto italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Explore our latest articles on interior design trends and tips
        </motion.p>
      </div>

      <Carousel
        plugins={[plugin.current]}
        opts={{ align: "start", loop: true }}
        className="w-full"
        onMouseEnter={() => plugin.current.stop()}
        onMouseLeave={() => plugin.current.play()}
      >
        <CarouselContent>
          {blogs.map((blog, index) => (
            <CarouselItem
              key={blog.id}
              className="basis-full md:basis-1/2 lg:basis-1/3 mb-4"
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
              >
                <Link href={`/blogs/${blog.id}`} className="block">
                  <Card className="h-[530px] rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-amber-100 overflow-hidden">
                    <div className="relative h-60">
                      <Image
                        src={blog.image}
                        alt={blog.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-amber-900 mb-4">
                        {blog.title}
                      </h3>
                      <p className="text-gray-600 mb-6">{blog.excerpt}</p>
                      <Button
                        variant="outline"
                        className="w-full border-amber-600 text-amber-700 hover:bg-amber-50"
                      >
                        Read Article
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
};

export default BlogCarousel;
