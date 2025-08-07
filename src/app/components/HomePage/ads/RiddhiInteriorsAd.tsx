"use client";

import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import Image from "next/image";

interface RiddhiInteriorsAdProps {
  adImage: string;
  description: string;
  onClose: () => void;
}

const RiddhiInteriorsAd: React.FC<RiddhiInteriorsAdProps> = ({
  adImage,
  description,
  onClose,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    containerRef.current?.animate(
      [
        { transform: "scale(0.5)", opacity: 0 },
        { transform: "scale(1.05)", opacity: 1 },
        { transform: "scale(1)", opacity: 1 },
      ],
      {
        duration: 600,
        easing: "ease-out",
        fill: "forwards",
      }
    );
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-[300px] md:w-[500px] bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-4 flex flex-col items-center text-center space-y-4"
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-lime-950 dark:text-gray-300 hover:text-red-500 transition"
        aria-label="Close"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Image */}
      <Image
        src={adImage}
        alt="Riddhi Interiors"
        width={300}
        height={150}
        className="rounded-xl object-cover w-full h-60 p-2"
      />

      {/* Heading */}
      <h2 className="text-xl font-bold text-lime-800 dark:text-blue-400">
        Riddhi Interiors - Tilak Road, Dehradun
      </h2>

      {/* Description */}
      <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>

      {/* CTA Button */}
      <a
        href="https://wa.me/917895927366?text=Hi%20Riddhi%20Interiors%2C%20I%27m%20interested%20in%20interior%20design%20services.%20Please%20guide%20me."
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow transition"
      >
        Chat on WhatsApp
      </a>
    </div>
  );
};

export default RiddhiInteriorsAd;
