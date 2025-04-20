// layout.tsx
"use client";

import { useEffect, useState } from "react";
import { metadata } from "@/lib/metadata"; // Import metadata from the separate file
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header/Header";
import Navbar from "./components/Header/Navbar";
import Footer from "./components/Footer/Footer";

// Timed Components (now in the layout)
import BookAppointmentForm from "./components/HomePage/ads/BookAppointmentForm";
import SinglaROMartAd from "./components/HomePage/ads/SinglaROMartAd";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [adIndex, setAdIndex] = useState(0);
  const [showAd, setShowAd] = useState(false);

  const ads = [
    {
      image: "/Ads/Ad9.png",
      description:
        "Get your RO serviced by experts! Book now and avail exclusive discounts on repairs and AMC plans.",
    },
    {
      image: "/Ads/Ad1.png",
      description:
        "Upgrade your RO system with our latest models! Enjoy a cleaner and safer water experience.",
    },
    {
      image: "/Ads/Ad4.png",
      description:
        "Need an AMC plan? Get reliable service for your RO with our yearly AMC subscription.",
    },
  ];

  useEffect(() => {
    // Show appointment form after 3 seconds
    const formTimer = setTimeout(() => setShowAppointmentForm(true), 3000);

    // Show ad after 10 seconds
    const adTimer = setTimeout(() => setShowAd(true), 10000);

    const adCycleTimer = setInterval(() => {
      setAdIndex((prevIndex) => (prevIndex + 1) % ads.length); // Cycle through ads every 30 seconds
    }, 30000);

    return () => {
      clearTimeout(formTimer);
      clearTimeout(adTimer);
      clearInterval(adCycleTimer);
    };
  }, []);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground dark:bg-black dark:text-white transition-colors`}
      >
        <header className="w-full flex flex-col fixed z-30">
          <Header />
          <div className="">
            <Navbar />
          </div>
        </header>
        <main className="pt-32">{children}</main>
        <footer>
          <Footer />
        </footer>

        {/* Timed Components - These will be available globally */}
        {showAppointmentForm && (
          <div className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center">
            <BookAppointmentForm
              onClose={() => setShowAppointmentForm(false)}
            />
          </div>
        )}

        {/* Single Ad Slot */}
        {showAd && (
          <div className="fixed bottom-5 left-5 z-40">
            <SinglaROMartAd
              adImage={ads[adIndex].image} // Pass current ad image based on the index
              description={ads[adIndex].description} // Pass current ad description
              onClose={() => setShowAd(false)} // Close the ad
            />
          </div>
        )}
      </body>
    </html>
  );
}
