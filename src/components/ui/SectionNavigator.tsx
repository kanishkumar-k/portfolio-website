"use client";
import React, { useEffect, useState } from "react";
import { FaChevronUp, FaChevronDown, FaTimes, FaBars } from "react-icons/fa";
import { useTheme } from "./ThemeProvider";

const SECTIONS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "github-showcase", label: "Github" },
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

export default function SectionNavigator() {
  const [active, setActive] = useState("home");
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const { theme } = useTheme();

  // Scroll spy
  useEffect(() => {
    if (!open) return;

    const handleScroll = () => {
      let found = "home";
      for (const section of SECTIONS) {
        const el = document.getElementById(section.id);
        if (el && el.getBoundingClientRect().top <= 120) found = section.id;
      }
      setActive(found);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [open]);

  const toggleMenu = () => {
    if (open) {
      setVisible(false);
      setTimeout(() => setOpen(false), 200);
    } else {
      setOpen(true);
      requestAnimationFrame(() => setVisible(true));
    }
  };

  return (
    <>
      {/* ---------------- Menu Container ---------------- */}
      {open && (
        <nav
          aria-label="Section navigation"
          className={`
            fixed right-6 bottom-20 z-50
            flex flex-col items-center gap-2
            rounded-xl shadow-lg px-3 py-4
            backdrop-blur border border-[#b3c0f7]
            transition-all duration-300 ease-out
            ${visible
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-4 scale-95 pointer-events-none"}
            ${theme === "dark"
              ? "bg-[#23272f]/90 text-white"
              : "bg-white/80 text-black"}
          `}
        >
          {/* Scroll to top */}
          <button
            aria-label="Scroll to top"
            className="p-2 rounded-full bg-[#b3c0f7] text-[#23272f] hover:bg-[#6ee7b7] focus:ring-2 focus:ring-white"
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
                        ? "bg-[#b3c0f7] text-[#23272f] shadow"
                        : theme === "dark"
                        ? "text-white/80 hover:bg-[#b3c0f7]/30"
                        : "text-black/80 hover:bg-[#b3c0f7]/30"
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
            className="p-2 rounded-full bg-[#b3c0f7] text-[#23272f] hover:bg-[#6ee7b7] focus:ring-2 focus:ring-white"
            onClick={() =>
              window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })
            }
          >
            <FaChevronDown />
          </button>
        </nav>
      )}

      {/* ---------------- Toggle button (open/close) ---------------- */}
      <button
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={toggleMenu}
        className={`
          fixed right-6 bottom-6 z-50
          w-12 h-12 flex items-center justify-center
          rounded-full shadow-lg transition-all duration-300 hover:scale-105 active:scale-95
          ${open
            ? "bg-red-500 text-white hover:bg-red-600"
            : "bg-gradient-to-br from-[#6ee7b7] to-[#3b82f6] text-white"}
        `}
      >
        {open ? <FaTimes size={22} /> : <FaBars size={22} />}
      </button>
    </>
  );
}
