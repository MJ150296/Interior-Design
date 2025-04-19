"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon, Phone, Mail } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";

const Header: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Apply theme on load
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const isDark = savedTheme ? savedTheme === "dark" : prefersDark;

    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleDarkMode = () => {
    const newTheme = darkMode ? "light" : "dark";
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark", !darkMode);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex justify-between items-center p-3 bg-black">
        <div className="flex gap-x-5">
          {/* Contact Section */}
          <a href="tel:+919711569405" className="block">
            <div className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200">
              <Phone className="w-5 h-5 text-blue-500 dark:text-blue-400" />
              <span className="text-sm text-white font-semibold">
                +91-97115 69405
              </span>
            </div>
          </a>

          {/* Email */}
          <a
            href="mailto:singlaromart@gmail.in?subject=Service%20Enquiry&body=Hello,%0D%0A%0D%0AThanks%20%26%20Regards"
            className="hidden md:block"
          >
            <div className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200">
              <Mail className="w-5 h-5 text-green-400 dark:text-green-300" />
              <span className="text-sm text-white font-semibold">
                singlaromart@gmail.in
              </span>
            </div>
          </a>
        </div>

        <div className="flex items-center space-x-8">
          {/* Social Icons */}
          <div className="hidden h-full md:flex items-center space-x-4 text-gray-400">
            <a
              href="https://www.facebook.com/profile.php?id=61570484670946"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://x.com/singlaromart"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              <FaTwitter />
            </a>
            <a
              href="https://www.instagram.com/romartgaurcity/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              <FaInstagram />
            </a>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="flex items-center px-3 py-2 bg-white dark:bg-background rounded-md hover:bg-background text-foreground transition"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-gray-500" />
            )}
            <span className="hidden md:block ml-2 text-sm">
              {darkMode ? "Light Mode" : "Dark Mode"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
