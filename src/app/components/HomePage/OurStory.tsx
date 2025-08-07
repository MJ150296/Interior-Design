import useInView from "@/app/hooks/useInView";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import React from "react";

const services = [
  {
    name: "Modular Interiors",
    description:
      "Elevate your space with our custom modular interiors, designed to maximize functionality and style.",
    image: "/Riddhi Interior Design/modular-interior.jpg",
  },
  {
    name: "Full Home Interiors",
    description:
      "From living rooms to bedrooms, we create cohesive designs that reflect your style.",
    image: "/Riddhi Interior Design/full-home.jpg",
  },
  {
    name: "Luxury Interiors",
    description:
      "Experience the epitome of luxury with our bespoke interior solutions, designed to elevate your living spaces.",
    image: "/Riddhi Interior Design/luxury.jpg",
  },
  {
    name: "Renovations",
    description:
      "Transform your space with our expert renovation services, blending modern aesthetics with functionality.",
    image: "/Riddhi Interior Design/renovations.jpg",
  },
];

const OurStory: React.FC = () => {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false })
  );
  const { ref, isVisible } = useInView();
  return (
    <div
      ref={ref}
      className={`w-full flex flex-col items-center justify-center px-12 py-16 mt-5 transition-all duration-700 ease-in-out transform ${
        isVisible ? "translate-y-0" : "translate-y-20"
      }`}
    >
      {/* Text Section */}
      <div className="w-full flex flex-col items-center text-center mb-6 md:mb-0">
        <div className="flex justify-center items-center gap-x-2 md:gap-x-10 mb-5">
          <Image
            src="/Riddhi Interior Design/About/hang-lamp.png"
            alt="hanging lamp"
            width={50}
            height={50}
            className="mx-auto"
          />
          <h2 className="text-2xl md:text-4xl mb-1 font-bold italic text-lime-900 font-serif">
            One-stop shop for all interiors
          </h2>
          <Image
            src="/Riddhi Interior Design/About/hang-lamp.png"
            alt="hanging lamp"
            width={50}
            height={50}
            className="mx-auto"
          />
        </div>

        <p className="w-full md:w-3/4 italic text-base text-gray-800 dark:text-gray-200 leading-5">
          From end-to-end interior design and renovation to smart modular
          solutions, we provide everything you need to transform your home or
          office.
        </p>
      </div>

      {/* Image Section */}
      <div className="flex justify-center items-center mt-10">
        <Carousel
          plugins={[plugin.current]}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-11/12 md:w-full"
          onMouseEnter={() => plugin.current.stop()}
          onMouseLeave={() => plugin.current.play()}
        >
          <CarouselContent>
            {services.map((service, index) => (
              <CarouselItem
                key={index}
                className="basis-full md:basis-1/2 lg:basis-1/3"
              >
                <Card className="h-full shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between">
                  <CardHeader className="flex flex-col items-center">
                    <Image
                      src={service.image}
                      alt={service.name}
                      width={500}
                      height={500}
                      className="w-full h-60 rounded-t-xl object-cover"
                    />
                    <CardTitle className="text-center text-lg sm:text-lg font-semibold text-lime-900 dark:text-white">
                      {service.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow p-2">
                    <p className="italic text-base sm:text-base text-center text-muted-foreground leading-relaxed">
                      &quot;{service.description}&quot;
                    </p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};

export default OurStory;
