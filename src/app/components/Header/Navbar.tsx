"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
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

export default function Navbar() {
  // const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Check local storage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Close dropdown on outside click
  // useEffect(() => {
  //   function handleClickOutside(event: MouseEvent) {
  //     if (
  //       dropdownRef.current &&
  //       !dropdownRef.current.contains(event.target as Node)
  //     ) {
  //       setIsDropdownOpen(false);
  //     }
  //   }

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, []);

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md w-full z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="w-full flex justify-between h-24 items-center">
          {/* Brand Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-bold text-gray-900 dark:text-white"
            >
              <Image
                src="/Riddhi Interior Design/Logo.png"
                alt="Singla RO Mart"
                width={150}
                height={60}
                className="h-20 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex justify-end space-x-8 items-center font-medium text-base tracking-wide font-serif">
            <Link href="/" className="nav-link">
              Home
            </Link>
            <Link href="/" className="nav-link">
              About Us
            </Link>

            {/* Services Dropdown */}
            {/* <div className="relative" ref={dropdownRef}>
              <button
                className="nav-link flex items-center gap-1"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
              >
                Our Services <ChevronDown size={16} />
              </button>
              {isDropdownOpen && (
                <div className="absolute left-0 z-20 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                  <Link href="/services/ro-services" className="dropdown-link">
                    RO Services
                  </Link>
                  <Link href="/services/ro-repair" className="dropdown-link">
                    RO Repair
                  </Link>
                  <Link href="/services/amc-plans" className="dropdown-link">
                    AMC Plans
                  </Link>
                  <Link
                    href="/services/livpure-service"
                    className="dropdown-link"
                  >
                    Livpure Service
                  </Link>
                </div>
              )}
            </div> */}

            <Link href="/" className="nav-link">
              Our Projects
            </Link>
            <Link href="/" className="nav-link">
              Services
            </Link>
            <Link href="/" className="nav-link">
              Blogs
            </Link>
          </div>

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
                  <Link href="/" className="mobile-link">
                    About Us
                  </Link>

                  {/* <details className="group">
                    <summary className="flex items-center justify-between mobile-link cursor-pointer">
                      Our Services
                      <ChevronDown
                        size={16}
                        className="group-open:rotate-180 transition-transform"
                      />
                    </summary>
                    <div className="ml-4 flex flex-col space-y-2 mt-2">
                      <Link
                        href="/services/ro-services"
                        className="mobile-dropdown-link"
                      >
                        RO Services
                      </Link>
                      <Link
                        href="/services/ro-repair"
                        className="mobile-dropdown-link"
                      >
                        RO Repair
                      </Link>
                      <Link
                        href="/services/amc-plans"
                        className="mobile-dropdown-link"
                      >
                        AMC Plans
                      </Link>
                      <Link
                        href="/services/livpure-service"
                        className="mobile-dropdown-link"
                      >
                        Livpure Service
                      </Link>
                    </div>
                  </details> */}

                  <Link href="/" className="mobile-link">
                    Gallery
                  </Link>
                  {/* <Link href="/location" className="mobile-link">
                    Location
                  </Link> */}
                  <Link href="/" className="mobile-link">
                    Blogs
                  </Link>
                  <Link href="/" className="mobile-link">
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
