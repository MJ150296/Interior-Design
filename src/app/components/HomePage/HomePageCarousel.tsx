"use client";

import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function HomePageCarousel() {
  const carouselItems = [
    {
      id: 1,
      imgURL: "/Riddhi Interior Design/Home/carousel_video.jpeg",
      videoURL: "/Riddhi Interior Design/videos/video1.mp4",
      title: "Transform Your Living Space",
      description1: "Our Recent Projects",
      description2:
        "Explore our projects to see how we can transform your space and boost your well-being.",
      buttonText: "Our Projects",
    },
  ];

  return (
    <div className="relative w-full">
      <Carousel className="w-full">
        <CarouselContent>
          {carouselItems.map((item) => (
            <CarouselItem key={item.id}>
              <div className="relative">
                <Card className="overflow-hidden rounded-none border-none">
                  {/* Background video or image */}
                  <div className="relative h-screen w-full">
                    {item.videoURL ? (
                      <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="auto"
                        poster={item.imgURL}
                        className="absolute inset-0 w-full h-full object-cover z-0"
                      >
                        <source src={item.videoURL} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <div
                        style={{
                          backgroundImage: `url(${item.imgURL})`,
                        }}
                        className="absolute inset-0 bg-cover bg-center z-0"
                      />
                    )}

                    {/* Overlay Content */}
                    <CardContent className="relative z-10 h-full flex items-start justify-center">
                      <div className="hidden md:flex md:flex-col w-3/4 pt-14 pb-32 pl-10 h-full justify-center items-start">
                        <h1 className="text-7xl font-serif font-semibold text-white w-2/3">
                          {item.title}
                        </h1>
                      </div>

                      <div className="flex items-center gap-2 w-full md:w-1/4 text-white mt-40 md:mt-10">
                        <div
                          style={{ background: "rgba(0, 0, 0, 0.4)" }}
                          className="p-4 mt-20 rounded-lg"
                        >
                          <p className="text-base font-serif">
                            {item.description1}
                          </p>
                          <hr className="w-full h-4 my-3" />
                          <p className="text-base font-serif mt-2">
                            {item.description2}
                          </p>
                          <Button variant="default" className="mt-5">{item.buttonText}</Button>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
