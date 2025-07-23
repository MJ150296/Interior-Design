"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const pathname = usePathname();

  // Check local storage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md w-full z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="w-full flex justify-between h-24 items-center">
          {/* Brand Logo */}
          <div className="flex items-center gap-x-10">
            <Link
              href="/"
              className="text-xl font-bold text-gray-900 dark:text-white"
            >
              <Image
                src="/Riddhi Interior Design/Logo.png"
                alt="Riddhi Interiors Logo"
                width={150}
                height={60}
                className="h-20 w-auto"
              />
            </Link>
            <div className="md:flex items-center space-x-8 hidden">
              {/* Social Icons */}
              <div className="hidden h-full md:flex items-center space-x-4 text-gray-400">
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600"
                >
                  <FaFacebookF />
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400"
                >
                  <FaTwitter />
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-pink-500"
                >
                  <FaInstagram />
                </a>
              </div>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="font-sans hidden md:flex justify-end space-x-8 items-center font-medium text-base tracking-wide">
            <Link
              href="/"
              className={`nav-link ${
                pathname === "/"
                  ? "text-amber-500"
                  : "text-amber-900 dark:text-white"
              }`}
            >
              Home
            </Link>
            <Link
              href="/about-us"
              className={`nav-link ${
                pathname === "/about-us"
                  ? "text-amber-500"
                  : "text-amber-900 dark:text-white"
              }`}
            >
              About Us
            </Link>

            <Link
              href="/our-projects"
              className={`nav-link ${
                pathname === "/our-projects"
                  ? "text-amber-500"
                  : "text-amber-900 dark:text-white"
              }`}
            >
              Portfolio
            </Link>

            {/* Services Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                className={`nav-link flex items-center gap-1 ${
                  pathname.startsWith("/services")
                    ? "text-amber-500"
                    : "text-amber-900 dark:text-white"
                }`}
                onClick={() => setIsDropdownOpen((prev) => !prev)}
              >
                Services <ChevronDown size={16} />
              </button>
              {isDropdownOpen && (
                <div className="absolute left-0 z-20 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                  <Link
                    href="/services/full-home-interiors"
                    className="dropdown-link"
                  >
                    Full Home Interiors
                  </Link>
                  <Link
                    href="/services/luxury-interiors"
                    className="dropdown-link"
                  >
                    Luxury Interiors
                  </Link>
                  <Link
                    href="/services/modular-interiors"
                    className="dropdown-link"
                  >
                    Modular Interiors
                  </Link>
                  <Link href="/services/renovations" className="dropdown-link">
                    Renovations
                  </Link>
                </div>
              )}
            </div>
            <Link
              href="/testimonials"
              className={`nav-link ${
                pathname === "/testimonials"
                  ? "text-amber-500"
                  : "text-amber-900 dark:text-white"
              }`}
            >
              Testimonials
            </Link>
            <Link
              href="/iamadmin"
              className={`nav-link ${
                pathname === "/iamadmin"
                  ? "text-amber-500"
                  : "text-amber-900 dark:text-white"
              }`}
            >
              Admin
            </Link>
            <Link
              href="/blogs"
              className={`nav-link ${
                pathname === "/blogs"
                  ? "text-amber-500"
                  : "text-amber-900 dark:text-white"
              }`}
            >
              Blogs
            </Link>
            <Link
              href="/contact-us"
              className={`nav-link ${
                pathname === "/"
                  ? "text-amber-500"
                  : "text-amber-900 dark:text-white"
              }`}
            >
              Contact Us
            </Link>
          </div>

          {/* Mobile Menu */}
          <div className="flex items-center space-x-4 md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu size={24} />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-white dark:bg-gray-900">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>Riddhi Interiors</SheetDescription>
                </SheetHeader>

                <div className="flex flex-col space-y-4 mt-5 ml-4">
                  <Link href="/" className="mobile-link">
                    Home
                  </Link>
                  <Link href="/about-us" className="mobile-link">
                    About Us
                  </Link>
                  <Link href="/our-projects" className="mobile-link">
                    Portfolio
                  </Link>

                  <details className="group">
                    <summary className="flex items-center justify-between mobile-link cursor-pointer">
                      Services
                      <ChevronDown
                        size={16}
                        className="group-open:rotate-180 transition-transform"
                      />
                    </summary>
                    <div className="ml-4 flex flex-col space-y-2 mt-2">
                      <Link
                        href="/services/full-home-interiors"
                        className="mobile-dropdown-link"
                      >
                        Full Home Interiors
                      </Link>
                      <Link
                        href="/services/luxury-interiors"
                        className="mobile-dropdown-link"
                      >
                        Luxury Interiors
                      </Link>
                      <Link
                        href="/services/modular-interiors"
                        className="mobile-dropdown-link"
                      >
                        Modular Interiors
                      </Link>
                      <Link
                        href="/services/renovations"
                        className="mobile-dropdown-link"
                      >
                        Renovations
                      </Link>
                    </div>
                  </details>

                  <Link href="/testimonials" className="mobile-link">
                    Testimonials
                  </Link>
                  <Link href="/blogs" className="mobile-link">
                    Blogs
                  </Link>
                  <Link href="/contact-us" className="mobile-link">
                    Contact Us
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
