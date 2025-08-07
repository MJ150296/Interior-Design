import React from "react";
import AnimatedService from "./AnimatedService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const services = [
  {
    title: "Full Home Interiors",
    imageURL: "/Riddhi Interior Design/interior.png",
    description:
      "Get end-to-end design solutions tailored to your entire home layout.",
  },
  {
    title: "Modular Kitchen",
    imageURL: "/Riddhi Interior Design/kitchen.png",
    description:
      "Design a smart, functional and aesthetic kitchen setup within your budget.",
  },
  {
    title: "Wardrobe Solutions",
    imageURL: "/Riddhi Interior Design/wardrobe.png",
    description: "Maximize space and style with personalized wardrobe designs.",
  },
];

const QuoteSection: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center mt-10 px-4 py-16">
      <AnimatedService />
      <p className="text-xl font-medium text-center mb-8">
        Calculate the approximate cost of doing up your home interiors
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {services.map((service, index) => (
          <Card
            key={index}
            className="rounded-2xl shadow-md hover:shadow-lg transition duration-300 py-3"
          >
            <CardHeader>
              <div className="flex justify-between p-2 mb-6">
                <Image
                  src={service.imageURL}
                  alt={service.title}
                  width={100}
                  height={100}
                  className="w-16 h-16 object-cover"
                />
                <Image
                  src="/Riddhi Interior Design/calculator.png"
                  alt="Quote Icon"
                  width={50}
                  height={50}
                  className="w-12 h-12 object-cover"
                />
              </div>
            </CardHeader>
            <CardTitle className="pl-6 text-lime-900 text-xl">
              {service.title}
            </CardTitle>

            <CardContent>
              <p className="mb-4 text-gray-600">{service.description}</p>
              <Button
                variant="default"
                className="w-full bg-lime-600 hover:bg-lime-700 cursor-pointer"
              >
                Get Estimate
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default QuoteSection;
