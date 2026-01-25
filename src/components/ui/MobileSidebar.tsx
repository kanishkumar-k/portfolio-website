"use client";

import React, { useState } from "react";
import { useTheme } from "./ThemeProvider";
import MobileThemeSwitch from "./MobileThemeSwitch";

const NAV_LINKS = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#medium-blogs", label: "Blogs" },
  { href: "#contact", label: "Contact" },
];

/**
 * MobileSidebar renders a hamburger button and a sliding sidebar menu for mobile navigation.
 */
const MobileSidebar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { theme } = useTheme();
  const [active, setActive] = useState<string>("");

  // Set sidebar bg/text based on theme
  const sidebarBg = theme === "dark" ? "bg-[#23272f] text-white" : "bg-white text-black";
  const linkHover =
    theme === "dark"
      ? "hover:bg-pink-500 hover:text-white"
      : "hover:bg-yellow-400 hover:text-white";

  // Track active section by hash
  React.useEffect(() => {
    const setActiveFromHash = () => {
      setActive(window.location.hash || "#home");
    };
    setActiveFromHash();
    window.addEventListener("hashchange", setActiveFromHash);
    return () => window.removeEventListener("hashchange", setActiveFromHash);
  }, []);

  return (
    <>
      {/* Top bar: hamburger left, theme toggle right (mobile only) */}
      <div
        className={`fixed top-0 left-0 w-full flex items-center px-4 z-[100] md:hidden pointer-events-none
          ${theme === "dark" ? "bg-[#23272f] shadow-lg" : "bg-white shadow-lg"}`}
        style={{ minHeight: 56, boxShadow: "0 2px 16px 0 rgba(0,0,0,0.10)" }}
      >
        <button
          className={`flex items-center justify-center w-10 h-10 rounded-full shadow-lg focus:outline-none pointer-events-auto transition-colors duration-200
            ${theme === "dark" ? "bg-pink-500 text-white" : "bg-yellow-400 text-black"}`}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((prev) => !prev)}
          style={{ transition: "background 0.2s" }}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <svg
            className={`w-7 h-7 transition-transform duration-200 ${open ? "rotate-90" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeOpacity={1} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeOpacity={1} d="M4 8h16M4 16h16" />
            )}
          </svg>
        </button>
        <div className="ml-auto pointer-events-auto">
          <MobileThemeSwitch />
        </div>
      </div>

      {/* Sidebar drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-64 ${sidebarBg} shadow-lg z-40 transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 md:hidden`}
        style={{ willChange: "transform" }}
      >
        <div className="flex flex-col h-full">
          
          <nav className="flex-1 px-6 py-4 pt-24">
            <ul className="flex flex-col space-y-4">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={`block py-2 px-3 rounded-lg font-medium transition-colors ${
                      active === link.href
                        ? (theme === "dark" ? "bg-pink-500 text-white" : "bg-yellow-400 text-black")
                        : linkHover
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={() => setOpen(false)}
          aria-label="Close menu overlay"
        />
      )}
    </>
  );
};

export default MobileSidebar;
