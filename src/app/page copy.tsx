"use client";
import React, { useEffect } from "react";
import OurStory from "./components/HomePage/OurStory";
import About from "./components/HomePage/About";
import MasonryGallery from "./components/HomePage/Masonry";
import Owner from "./components/HomePage/Owner";
import QuoteSection from "./components/HomePage/QuoteSection";
import BlogCarousel from "./components/HomePage/MyBlogs";
import CallToAction from "./components/HomePage/CTA";
import HomePageCarousel from "./components/HomePage/HomePageCarousel";
import WhyChooseUs from "./components/HomePage/WhyChooseUs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Home = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect once session is loaded and user is logged in
  useEffect(() => {
    if (status === "authenticated" && session?.user?.role) {
      router.replace(`/dashboard/pages/${session.user.role}`);
    }
  }, [status, session, router]);

  return (
    <div className="w-full flex flex-col items-center relative bg-gradient-to-b from-amber-50 to-white">
      <HomePageCarousel />

      <OurStory />

      <About />

      <MasonryGallery />

      <Owner />

      <WhyChooseUs />

      <QuoteSection />

      <BlogCarousel />

      <CallToAction />
    </div>
  );
};

export default Home;
