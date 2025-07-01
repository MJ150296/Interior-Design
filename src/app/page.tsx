"use client";
import About from "./components/HomePage/About";
import CustomerSupport from "./components/HomePage/CustomerSupport";
import HomePageCarousel from "./components/HomePage/HomePageCarousel";
import Masonry from "./components/HomePage/Masonry";
import BlogCarousel from "./components/HomePage/MyBlogs";
import OurStory from "./components/HomePage/OurStory";
import Owner from "./components/HomePage/Owner";
import QuoteSection from "./components/HomePage/QuoteSection";

export default function Home() {
  return (
    <div className="p-4 space-y-5 w-full flex flex-col justify-center items-center relative">
      <HomePageCarousel />
      <OurStory />
      <About />
      <Masonry />
      <Owner />
      <CustomerSupport />
      <QuoteSection />
      <BlogCarousel />
    </div>
  );
}
