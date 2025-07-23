"use client";
import React from "react";
import HomePageCarousel from "../components/HomePage/HomePageCarousel";
import OurStory from "../components/HomePage/OurStory";
import About from "../components/HomePage/About";
import MasonryGallery from "../components/HomePage/Masonry";
import Owner from "../components/HomePage/Owner";
import WhyChooseUs from "../components/HomePage/WhyChooseUs";
import QuoteSection from "../components/HomePage/QuoteSection";
import BlogCarousel from "../components/HomePage/MyBlogs";
import CallToAction from "../components/HomePage/CTA";

const Home = () => {

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
