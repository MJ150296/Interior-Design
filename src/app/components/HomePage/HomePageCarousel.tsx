"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Wrench, Cog } from "lucide-react"; // Lucide Icons
import { Button } from "@/components/ui/button";

export default function HomePageCarousel() {
  const autoplay = React.useRef(Autoplay({ delay: 6000 }));

  const carouselItems = [
    {
      id: 1,
      imgURL: "/carousel2.jpg",
      title: "Transform Your Living Space",
      message:
        "Your living environment profoundly impacts your well-being, and a thoughtfully designed space can significantly enhance your quality of life. From the colors you choose to the furniture layout, every detail contributes to your mood.",

      description1: "Our Recent Projects",
      description2:
        "Explore our projects to see how we can transform your space and boost your well-being.",
      buttonText: "Our Projects",
    },
  ];

  return (
    <div className="relative w-full">
      <Carousel
        // plugins={[autoplay.current]}
        className="w-full"
        // onMouseEnter={() => autoplay.current.stop()} // Pause on hover
        // onMouseLeave={() => autoplay.current.play()} // Resume autoplay properly
        // opts={{ loop: true }} // ✅ Enables looping
      >
        <CarouselContent>
          {carouselItems.map((item) => (
            <CarouselItem key={item.id}>
              <div className="">
                <Card>
                  <div
                    style={{ backgroundImage: `url(${item.imgURL})` }}
                    className="relative bg-cover bg-center h-[500px] rounded-lg"
                  >
                    <CardContent className="h-full flex items-start justify-center bg-black/30 rounded-lg z-20">
                      <div className="hidden md:flex md:flex-col w-3/4 py-14 h-full justify-between items-start">
                        <p className="text-base text-white w-1/2 font-serif">
                          {item.message}
                        </p>
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
                          <Button className="mt-5">{item.buttonText}</Button>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Next and Prev buttons are now children of <Carousel /> */}
        {/* <CarouselPrevious className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full shadow p-2 hover:bg-gray-100" /> */}
        {/* <CarouselNext className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full shadow p-2 hover:bg-gray-100" /> */}
      </Carousel>
    </div>
  );
}
