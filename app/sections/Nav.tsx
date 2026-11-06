"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const MENU = [
  { href: "/", label: "Home" },
  { href: "/components", label: "Components" },
  { href: "/contact", label: "Contact" },
];

const SOCIAL = [
  { href: "https://x.com/hatemrihan", label: "𝕏", name: "X (Twitter)" },
  { href: "https://www.instagram.com/hatemrihann", label: "IG", name: "Instagram" },
  { href: "https://www.linkedin.com/in/hatem-rihan-298753309", label: "in", name: "LinkedIn" },
];

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Lock page scroll and allow Escape to close while the menu is open.
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  return (
    <>
      <nav className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between bg-[#f2f2f2] px-6 py-6 md:px-12 md:py-8">
        <Link href="/" className="text-xl font-medium tracking-tight text-black md:text-2xl">
          TOM
        </Link>
        <div className="flex items-center gap-6 text-sm uppercase tracking-wide">
          <Link href="/components" className="hidden items-center gap-1 transition-colors hover:text-gray-600 sm:flex">
            Components <span aria-hidden>↗</span>
          </Link>
          <Link href="/contact" className="flex items-center gap-1 transition-colors hover:text-gray-600">
            Contact <span aria-hidden>→</span>
          </Link>
        </div>
      </nav>

      {/* Menu toggle — bottom right */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        aria-controls="site-menu"
        className="group fixed bottom-8 right-8 z-50 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-black/40 md:bottom-12 md:right-12 md:h-16 md:w-16"
      >
        <span
          className={`absolute h-0.5 w-7 bg-black transition-all duration-300 ease-in-out ${isOpen ? "translate-y-0 rotate-45" : "-translate-y-2"}`}
        />
        <span
          className={`absolute h-0.5 w-7 bg-black transition-all duration-300 ease-in-out ${isOpen ? "translate-y-0 -rotate-45" : "translate-y-2"}`}
        />
      </button>

      {/* Full-screen menu */}
      <div
        id="site-menu"
        aria-hidden={!isOpen}
        className={`fixed inset-0 z-40 bg-[#f2f2f2] transition-all duration-700 ease-in-out ${isOpen ? "visible opacity-100" : "invisible opacity-0"}`}
      >
        <div className="flex h-full flex-col justify-between py-24 pr-12 md:pr-24 lg:pr-32">
          <ul className="space-y-3 text-right md:space-y-4">
            {MENU.map((item, i) => (
              <li
                key={item.href}
                className={`transition-all duration-700 ease-out ${isOpen ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"}`}
                style={{ transitionDelay: `${100 + i * 100}ms` }}
              >
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  tabIndex={isOpen ? 0 : -1}
                  className="inline-flex items-center gap-4 text-xl font-normal uppercase tracking-tight transition-colors duration-300 hover:text-gray-600 md:text-2xl lg:text-3xl"
                >
                  {item.label}
                  <span className="text-lg" aria-hidden>
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex justify-end gap-4 text-2xl">
            {SOCIAL.map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.name}
                tabIndex={isOpen ? 0 : -1}
                className="transition-colors hover:text-gray-600"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Nav;
