"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "./ThemeProvider";
import SectionNavigator from "./SectionNavigator";

const NAV_LINKS = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#medium-blogs", label: "Blogs" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  // Update active link on hash change
  useEffect(() => {
    const setActiveFromHash = () => {
      setActive(window.location.hash || "#home");
    };
    setActiveFromHash();
    window.addEventListener("hashchange", setActiveFromHash);
    return () => window.removeEventListener("hashchange", setActiveFromHash);
  }, []);

  const { theme } = useTheme();
  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 border-b-2 border-solid border-[#e5e7eb] shadow-sm transition-colors ${
        theme === "dark" ? "bg-black text-white" : "bg-white text-black"
      } backdrop-blur`}
    >
      <div className="max-w-4xl mx-auto flex items-center px-6 py-5 relative">
        {/* Hamburger for mobile */}
        <button
          className="md:hidden flex items-center justify-center w-10 h-10 text-white focus:outline-none"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((open) => !open)}
        >
          <span className="sr-only">{mobileOpen ? "Close menu" : "Open menu"}</span>
          <svg
            className={`w-7 h-7 transition-transform duration-200 ${mobileOpen ? "rotate-90" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
            )}
          </svg>
        </button>

        {/* Desktop nav links, right-aligned */}
        <div className="hidden md:flex flex-1 justify-end pr-8">
          <ul className="flex space-x-2 text-base font-medium">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`nav-cool-link font-bold px-3 py-1 rounded-lg transition-all duration-200
                    ${active === link.href ? "nav-cool-link-active" : ""}
                  `}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile: SectionNavigator only, in navbar (not duplicated) */}
        <div className="flex md:hidden flex-1 justify-end items-center">
          <SectionNavigator navbarMode />
        </div>

        {/* Mobile nav dropdown (for nav links) */}
        {mobileOpen && (
          <ul
            className={`absolute top-full left-0 w-full border-b border-[#e5e7eb] flex flex-col items-start py-2 px-6 md:hidden animate-fade-in-down shadow-lg ${
              theme === "dark" ? "bg-[#23272f]" : "bg-white"
            }`}
          >
            {NAV_LINKS.map((link) => (
              <li key={link.href} className="w-full">
                <a
                  href={link.href}
                  className={`block w-full py-2 font-bold ${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </nav>
  );
}
