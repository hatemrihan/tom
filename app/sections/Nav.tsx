'use client';

import Link from 'next/link';
// This imports React hooks to manage state
import { useState } from 'react';

// Navigation component with smooth menu overlay
const Nav = () => {
  // This tracks if the menu is open or closed
  const [isOpen, setIsOpen] = useState(false);

  // This function toggles the menu open/closed
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Fixed navigation bar at top - Logo and top links ONLY */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 md:px-12 md:py-8 flex items-center justify-between bg-[#f2f2f2]">
        {/* Logo on the left */}
        <Link href='/'>
        <div className="text-xl md:text-2xl font-medium tracking-tight text-black ">
          TOM
        </div>
        </Link>

        {/* Top navigation links - CONTACT on mobile, all links on desktop */}
        <div className="flex items-center gap-6 text-sm uppercase tracking-wide ">
          <a href="#manifesto" className="hidden md:flex hover:text-gray-600 transition-colors items-center gap-1">
            MANIFESTO <span className="text-xs">↗</span>
          </a>
          <a href="#webflow" className="hidden md:flex hover:text-gray-600 transition-colors items-center gap-1">
            WEBFLOW  <span className="text-xs">↗</span>
          </a>
          <a href="/contact" className="hover:text-gray-600 transition-colors flex items-center gap-1">
            CONTACT <span>→</span>
          </a>
        </div>
      </nav>

      {/* Hamburger menu button - FIXED AT BOTTOM RIGHT */}
      <button
        onClick={toggleMenu}
        className="fixed bottom-8 right-8 md:bottom-12 md:right-12 z-50 w-14 h-14 md:w-16 md:h-16 flex items-center justify-center focus:outline-none   hover:border-black transition-colors duration-300 group"
        aria-label="Toggle menu"
      >
        {/* Top line of hamburger */}
        <span
          className={`absolute w-7 h-0.5 bg-black group-hover:bg-black transition-all duration-300 ease-in-out ${
            isOpen ? 'rotate-45 translate-y-0' : '-translate-y-2'
          }`}
        />
        {/* Bottom line of hamburger */}
        <span
          className={`absolute w-7 h-0.5 bg-black group-hover:bg-black transition-all duration-300 ease-in-out cursor-pointer ${
            isOpen ? '-rotate-45 translate-y-0' : 'translate-y-2'
          }`}
        />
      </button>

      {/* Full-screen menu overlay */}
      <div
        className={`fixed inset-0 bg-[#f2f2f2] z-40 transition-all duration-700 ease-in-out ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        {/* Menu content container - RIGHT side aligned */}
        <div className="flex flex-col justify-between h-full py-24 pr-12 md:pr-24 lg:pr-32">
          {/* Main menu items - Right aligned */}
          <ul className="space-y-3 md:space-y-4 text-right">
            {/* HOME */}
            <li
              className={`transition-all duration-700 ease-out ${
                isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
              }`}
              style={{ transitionDelay: '100ms' }}
            >
              <a
                href="/"
                className="text-xl md:text-2xl lg:text-3xl font-normal uppercase tracking-tight hover:text-gray-600 transition-colors duration-300 inline-flex items-center gap-4"
                onClick={toggleMenu}
              >
                HOME
                <span className="text-lg">→</span>
              </a>
            </li>

            {/* ABOUT US */}
            <li
              className={`transition-all duration-700 ease-out ${
                isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
              }`}
              style={{ transitionDelay: '150ms' }}
            >
              <a
                href="/about"
                className="text-xl md:text-2xl lg:text-3xl font-normal uppercase tracking-tight hover:text-gray-600 transition-colors duration-300 inline-flex items-center gap-4"
                onClick={toggleMenu}
              >
                ABOUT US
                <span className="text-lg">→</span>
              </a>
            </li>

            {/* WORK */}
            <li
              className={`transition-all duration-700 ease-out ${
                isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
              }`}
              style={{ transitionDelay: '200ms' }}
            >
              <a
                href="#work"
                className="text-xl md:text-2xl lg:text-3xl font-normal uppercase tracking-tight hover:text-gray-600 transition-colors duration-300 inline-flex items-center gap-4"
                onClick={toggleMenu}
              >
                WORK
                <span className="text-lg">→</span>
              </a>
            </li>

            {/* SERVICES */}
           

            {/* CONTACT */}
            <li
              className={`transition-all duration-700 ease-out ${
                isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
              }`}
              style={{ transitionDelay: '300ms' }}
            >
              <a
                href="/contact"
                className="text-xl md:text-2xl lg:text-3xl font-normal uppercase tracking-tight hover:text-gray-600 transition-colors duration-300 inline-flex items-center gap-4"
                onClick={toggleMenu}
              >
                CONTACT
                <span className="text-lg">→</span>
              </a>
            </li>

            {/* W. ENTERPRISE */}
            <li
              className={`transition-all duration-700 ease-out ${
                isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
              }`}
              style={{ transitionDelay: '350ms' }}
            >
              <a
                href="#enterprise"
                className="text-xl md:text-2xl lg:text-3xl font-normal uppercase tracking-tight hover:text-gray-600 transition-colors duration-300 inline-flex items-center gap-4"
                onClick={toggleMenu}
              >
                W. ENTERPRISE
                <span className="text-lg">↗</span>
              </a>
            </li>

            {/* MANIFESTO */}
            <li
              className={`transition-all duration-700 ease-out ${
                isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
              }`}
              style={{ transitionDelay: '400ms' }}
            >
              <a
                href="#manifesto"
                className="text-xl md:text-2xl lg:text-3xl font-normal uppercase tracking-tight hover:text-gray-600 transition-colors duration-300 inline-flex items-center gap-4"
                onClick={toggleMenu}
              >
                MANIFESTO
                <span className="text-lg">↗</span>
              </a>
            </li>
          </ul>

          {/* Footer section - Bottom right */}
          <div className="text-right space-y-4">
            {/* Footer links */}
            <div className="flex justify-end gap-6 text-sm uppercase tracking-wide">
              <a href="/privacy" className="hover:text-gray-600 transition-colors">
                PRIVACY →
              </a>
              <a href="#careers" className="hover:text-gray-600 transition-colors">
                CAREERS →
              </a>
            </div>

            {/* Social media icons */}
            <div className="flex justify-end gap-4 text-2xl">
              <a href="https://x.com/hatemrihan?s=21" className="hover:text-gray-600 transition-colors">
                𝕏
              </a>
              <a href="#webflow" className="hover:text-gray-600 transition-colors">
                W.
              </a>
              <a href="https://www.instagram.com/hatemrihan" className="hover:text-gray-600 transition-colors">
                IG
              </a>
              <a href="https://www.linkedin.com/in/hatem-rihan-298753309?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" className="hover:text-gray-600 transition-colors">
                in
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Nav;