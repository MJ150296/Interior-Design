// src/app/components/GlobalOverlay.tsx
"use client";

import { useEffect, useState } from "react";
import BookAppointmentForm from "./HomePage/ads/BookAppointmentForm";
import RiddhiInteriorsAd from "./HomePage/ads/RiddhiInteriorsAd";
import Image from "next/image";

const ads = [
  {
    image:
      "/Riddhi Interior Design/Blogs/top_interior_design_trends_for_the_year (2).jpeg",
    description:
      "Transform your home with expert interior design! Book a free consultation today.",
  },
  {
    image: "/Riddhi Interior Design/Blogs/modern_living_room_design_tips.jpeg",
    description:
      "Upgrade to modern living with our stylish modular kitchens and wardrobes. Crafted for your lifestyle.",
  },
  {
    image:
      "/Riddhi Interior Design/Blogs/top_interior_design_trends_for_the_year.jpeg",
    description:
      "Looking for custom interiors? Get end-to-end solutions from planning to execution with Riddhi Interiors.",
  },
];

export default function GlobalOverlay() {
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [adIndex, setAdIndex] = useState(0);
  const [showAd, setShowAd] = useState(false);

  useEffect(() => {
    const formTimer = setTimeout(() => setShowAppointmentForm(true), 5000);
    const adTimer = setTimeout(() => setShowAd(true), 20000);
    const adCycleTimer = setInterval(() => {
      setAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
    }, 30000);

    return () => {
      clearTimeout(formTimer);
      clearTimeout(adTimer);
      clearInterval(adCycleTimer);
    };
  }, []);

  return (
    <>
      {showAppointmentForm && (
        <div className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center">
          <BookAppointmentForm onClose={() => setShowAppointmentForm(false)} />
        </div>
      )}

      {showAd && (
        <div className="fixed bottom-12 right-1/2 translate-x-1/2 z-50 p-2 md:p-0">
          <RiddhiInteriorsAd
            adImage={ads[adIndex].image}
            description={ads[adIndex].description}
            onClose={() => setShowAd(false)}
          />
        </div>
      )}

      <div className="fixed bottom-5 right-5 z-40">
        <Image
          src="/Riddhi Interior Design/Logo.png"
          alt="Riddhi Interiors Logo"
          width={150}
          height={60}
          className="h-20 w-auto mb-4 rounded-lg shadow-lg"
        />
      </div>
      <div className="fixed bottom-1/2 right-0 z-40">
        <a
          href="https://wa.me/917895927366?text=Hi%20Riddhi%20Interiors%2C%20I%27m%20interested%20in%20interior%20design%20services.%20Please%20guide%20me."
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/icons/WhatsApp.png"
            alt="Whatsapp Logo"
            width={100}
            height={100}
            className="h-12 w-auto mb-4 shadow-lg bg-amber-50 px-2 py-1 rounded-tl-lg rounded-bl-lg hover:scale-110 transition-transform duration-300 ease-in-out"
          />
        </a>
      </div>
      <div className="fixed bottom-14 left-0 z-40">
        <a
          href="tel:+917895927366"
        >
          <Image
            src="/icons/phoneB.png"
            alt="Phone Logo"
            width={100}
            height={100}
            className="h-12 w-auto mb-4 shadow-lg bg-amber-50 p-2 rounded-tr-lg rounded-br-lg hover:scale-110 transition-transform duration-300 ease-in-out"
          />
        </a>
      </div>
    </>
  );
}
