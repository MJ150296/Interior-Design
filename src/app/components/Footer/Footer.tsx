"use client";

import React from "react";
import Link from "next/link";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer: React.FC = () => {
  return (
    <footer className="bg-lime-950 text-white pt-10 pb-6 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* About Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-lime-500">
            Riddhi Interiors, Tilak Road, Dehradun
          </h3>
          <p className="text-sm text-gray-400">
            Elevating living spaces with bespoke interior design and modular
            solutions. Proudly serving Tilak Road, Dehradun with timeless
            craftsmanship and refined aesthetics.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            {[
              "Home",
              "About Us",
              "Our Projects",
              "Testimonials",
              "Blogs",
              "Contact Us",
            ].map((item) => (
              <li key={item}>
                <Link
                  href={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                  className="hover:text-white"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Our Services */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Our Services</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            {[
              "Full Home Interiors",
              "Modular Interiors",
              "Luxury Interiors",
              "Renovations",
            ].map((service) => (
              <li key={service}>
                <Link
                  href={`/services/${service
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  className="hover:text-white"
                >
                  {service}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Contact Us</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>
              <a href="tel:+917895927366" className="hover:text-white">
                +91-78959 27366
              </a>
            </li>
            <li>
              <a
                href="mailto:riddhiinteriors@gmail.com"
                className="hover:text-white"
              >
                riddhiinteriors@gmail.com
              </a>
            </li>
            <li>
              Riddhi Interiors
              <br />
              Tilak Road, Dehradun
              <br />
              Uttarakhand - 248001
            </li>
          </ul>

          {/* Social Icons */}
          <div className="flex space-x-4 mt-4 text-gray-400">
            <a
              href="https://www.facebook.com/profile.php?id=61581159277317"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://x.com/riddhiinterior"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              <FaXTwitter />
            </a>
            <a
              href="https://www.instagram.com/riddhiinterior1/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              <FaInstagram />
            </a>
          </div>

          {/* Image Credits  */}
          {/* <div className="mt-2">
            <Link
              href="/credits"
              className="text-sm text-gray-400 hover:underline"
            >
              Image Credits
            </Link>
          </div> */}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 mt-10 pt-6 text-sm text-center">
        <p>© 2025 Riddhi Interiors. All rights reserved.</p>
        <div className="text-gray-400">
          <strong className="mt-2">Designed & Developed by: Mayank Joshi</strong>
          <p>Website | Mobile Apps | WebApps</p>
          <a href="tel:+917895927366" className="hover:text-white">
            +91-78959 27366
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
