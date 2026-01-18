"use client";
import React, { useEffect, useState } from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

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
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    el.focus?.();
  }
}

import { useTheme } from "./ThemeProvider";

export default function SectionNavigator() {
  const [active, setActive] = useState("home");
  const { theme } = useTheme();

  useEffect(() => {
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
  }, []);

  return (
    <nav
      aria-label="Section navigation"
      className={`fixed right-4 bottom-4 z-50 flex flex-col items-center gap-2 rounded-xl shadow-lg px-2 py-3 backdrop-blur border border-[#b3c0f7] transition-all ${
        theme === "dark" ? "bg-[#23272f]/80 text-white" : "bg-white/40 text-black"
      }`}
      style={{}}
    >
      <button
        aria-label="Scroll to top"
        className="p-2 rounded-full bg-[#b3c0f7] text-[#23272f] hover:bg-[#6ee7b7] focus:outline-none focus:ring-2 focus:ring-white"
        onClick={() => scrollToSection("home")}
        tabIndex={0}
      >
        <FaChevronUp />
      </button>
      <ul className="flex flex-col gap-1" style={{ minWidth: 80 }}>
        {SECTIONS.map((section) => (
          <li key={section.id}>
            <button
              aria-label={`Go to ${section.label} section`}
              className={`w-full px-3 py-1 rounded-lg text-sm font-semibold transition-all
                ${active === section.id
                  ? "bg-[#b3c0f7] text-[#23272f] shadow"
                  : theme === "dark"
                    ? "bg-transparent text-white/80 hover:bg-[#b3c0f7]/30 hover:text-white"
                    : "bg-transparent text-black/80 hover:bg-[#b3c0f7]/30 hover:text-black"
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
      <button
        aria-label="Scroll to end"
        className="p-2 rounded-full bg-[#b3c0f7] text-[#23272f] hover:bg-[#6ee7b7] focus:outline-none focus:ring-2 focus:ring-white"
        onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}
        tabIndex={0}
      >
        <FaChevronDown />
      </button>
    </nav>
  );
}
