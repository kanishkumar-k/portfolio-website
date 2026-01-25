"use client";
import React, { useEffect, useState } from "react";
import { FaChevronUp, FaChevronDown, FaChevronRight, FaCompass, FaRegDotCircle } from "react-icons/fa";
import { useTheme } from "./ThemeProvider";
import { useUiPanel } from "./UiPanelContext";
import ThemeToggleButton from "./ThemeToggleButton";
import AiButton from "./AiButton";

const SECTIONS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "github-showcase", label: "GitHub" },
  { id: "medium-blogs", label: "Blogs" },
  { id: "contact", label: "Contact" },
];

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) {
    const yOffset = -80; // Adjust for fixed navbar height
    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
    el.focus?.();
  }
}

interface SectionNavigatorProps {
  navbarMode?: boolean;
}

const SectionNavigator: React.FC<SectionNavigatorProps> = ({ navbarMode = false }) => {
  const [active, setActive] = useState("home");
  const { theme } = useTheme();
  const { openPanel, setOpenPanel } = useUiPanel();
  const open = openPanel === "navigator";

  useEffect(() => {
    if (!open && !navbarMode) return;
    const handleScroll = () => {
      let found = "home";
      for (const section of SECTIONS) {
        const el = document.getElementById(section.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) {
            found = section.id;
          }
        }
      }
      setActive(found);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [open, navbarMode]);

  if (navbarMode) {
    // Render horizontal nav for navbar
    return (
      <nav
        aria-label="Section navigation"
        className="flex flex-row items-center gap-1 md:gap-2"
        style={{ marginLeft: 8 }}
      >
        <ul className="flex flex-row gap-1 md:gap-2">
          {SECTIONS.map((section) => (
            <li key={section.id}>
              <button
                aria-label={`Go to ${section.label} section`}
                className={`px-2 py-1 md:px-3 md:py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-all
                  ${active === section.id
                    ? "bg-[#ec4899] text-white shadow"
                    : theme === "dark"
                      ? "bg-transparent text-white/80 hover:bg-[#ec4899]/30 hover:text-white"
                      : "bg-transparent text-black/80 hover:bg-[#ec4899]/30 hover:text-black"
                  }
                  focus:outline-none focus:ring-2 focus:ring-white
                `}
                onClick={() => scrollToSection(section.id)}
                tabIndex={0}
              >
                {section.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  // Floating/fixed vertical nav for desktop only
  return (
    <>
      {/* Desktop floating panel */}
      <div className="hidden md:block">
        {/* Toggle group: open/close button (always), theme toggle (only when open) */}
        <div
          className="flex fixed right-6 bottom-6 z-50 flex-col md:flex-row items-center gap-2"
          style={{
            borderRadius: "2rem",
            background: "rgba(16,19,26,0.92)",
            boxShadow: "0 2px 16px 0 rgba(0,0,0,0.18)",
            padding: "0.25rem 0.5rem",
            transition: "background 0.2s, box-shadow 0.2s"
          }}
        >
          {/* Desktop only: Theme Toggle, AI, Open/Close */}
          <div className="flex flex-row items-center gap-2">
            {/* Theme Toggle Button with Tooltip */}
            <div className="relative group">
              <ThemeToggleButton inline />
              {!open && (
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded bg-black text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                  Toggle theme
                </span>
              )}
            </div>
            {/* AI Button with Tooltip */}
            <div className="relative group">
              <AiButton />
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded bg-black text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                Get in touch
              </span>
            </div>
            {/* Open/Close Button with Tooltip */}
            <div className="relative group">
              <button
                aria-label={open ? "Close Navigation" : "Open Navigation"}
                onClick={() => setOpenPanel(open ? "none" : "navigator")}
                className={`
                  w-10 h-10 p-2 flex items-center justify-center
                  rounded-full shadow-lg transition-all duration-300 hover:scale-105 active:scale-95
                  ${open
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-gradient-to-br from-[#ec4899] to-[#f472b6] text-white"}
                `}
                style={{ minWidth: 40, minHeight: 40 }}
              >
                {open ? <FaRegDotCircle size={20} /> : <FaCompass size={20} />}
              </button>
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded bg-black text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                {open ? "" : "Navigation"}
              </span>
            </div>
          </div>
        </div>
        {/* Menu Container: show when open */}
        {open && (
          <nav
            aria-label="Section navigation"
            className={`
              fixed right-6 bottom-20 z-50
              flex flex-col items-center gap-2
              rounded-xl shadow-lg px-3 py-4
              backdrop-blur border border-[#b3c0f7]
              transition-all duration-300 ease-out
            `}
            style={{
              background: theme === "dark" ? "#10131a" : "#fff"
            }}
          >
            {/* Scroll to top */}
            <button
              aria-label="Scroll to top"
              className="p-2 rounded-full bg-[#b3c0f7] text-[#23272f] hover:bg-[#ec4899] focus:ring-2 focus:ring-white"
              onClick={() => scrollToSection("home")}
            >
              <FaChevronUp />
            </button>

            {/* Section buttons */}
            <ul className="flex flex-col gap-2 min-w-[90px]">
              {SECTIONS.map((section) => (
                <li key={section.id}>
                  <button
                    className={`w-full px-3 py-1 rounded-lg text-sm font-semibold transition-all
                      ${
                        active === section.id
                          ? (theme === "dark"
                              ? "bg-[#ec4899] text-white shadow"
                              : "bg-[#fbbf24] text-black shadow")
                          : theme === "dark"
                          ? "text-white/80 hover:bg-black"
                          : "text-black/80 hover:bg-[#fbbf24]/30"
                      }
                    `}
                    onClick={() => scrollToSection(section.id)}
                  >
                    {section.label}
                  </button>
                </li>
              ))}
            </ul>

            {/* Scroll to bottom */}
            <button
              aria-label="Scroll to bottom"
              className="p-2 rounded-full bg-[#b3c0f7] text-[#23272f] hover:bg-[#ec4899] focus:ring-2 focus:ring-white"
              onClick={() =>
                window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })
              }
            >
              <FaChevronDown />
            </button>
          </nav>
        )}
      </div>
      {/* Mobile floating panel: only email button */} 
      <div className="fixed bottom-6 right-6 z-50 flex gap-2 md:hidden">
        <div className="relative group">
          <AiButton />
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded bg-black text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
            Send email
          </span>
        </div>
      </div>
    </>
  );
}

export default SectionNavigator;
