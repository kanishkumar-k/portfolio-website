"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "./ui/ThemeProvider";

interface Experience {
  role: string;
  company: string;
  period: string;
  description: string;
}

const ExperienceSection: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const { theme } = useTheme();
  const [active, setActive] = useState(false);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [sortType, setSortType] = useState<"year-desc" | "year-asc" | "company-asc" | "company-desc">("year-desc");

  useEffect(() => {
    fetch("/api/experience")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // Map admin/API keys to UI keys if needed
          const mapped = data.map((exp: any) => ({
            role: exp.role ?? exp.title ?? "",
            company: exp.company ?? "",
            period: exp.period ?? exp.duration ?? "",
            description: exp.description ?? "",
          }));
          setExperiences(mapped);
        }
      });
  }, []);

  // Helper to parse start year for sorting
  const getStartYear = (exp: Experience) => {
    if (!exp.period) return 0;
    const match = exp.period.match(/(\d{4})/);
    return match ? parseInt(match[1], 10) : 0;
  };

  // Sorting logic
  const sortedExperiences = [...experiences].sort((a, b) => {
    if (sortType === "year-desc") {
      return getStartYear(b) - getStartYear(a);
    }
    if (sortType === "year-asc") {
      return getStartYear(a) - getStartYear(b);
    }
    if (sortType === "company-asc") {
      return a.company.localeCompare(b.company);
    }
    if (sortType === "company-desc") {
      return b.company.localeCompare(a.company);
    }
    return 0;
  });

  const handleSort = (type: "year-desc" | "year-asc" | "company-asc" | "company-desc") => {
    setSortType(type);
    setSortMenuOpen(false);
  };

  return (
    <section
      id="experience"
      className="w-full py-24 px-4 flex justify-center items-center relative bg-[var(--background)]"
    >
      <motion.div
        className={`section-card w-full max-w-3xl mx-auto backdrop-blur-lg bg-white/10 rounded-2xl shadow-2xl p-10 border border-white/20${active ? " section-card-active" : ""}`}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        tabIndex={0}
        onClick={() => setActive(true)}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
      >
        <div className="flex items-center justify-between mb-4">
          <h2
            className={`text-3xl font-bold text-center font-['JetBrains_Mono',monospace] underline underline-offset-8 section-title-variant${active ? " section-title-active" : ""}`}
            style={{ color: theme === "light" ? "#111" : "var(--foreground)" }}
          >
            Experience
          </h2>
          {/* Sort Icon and Dropdown */}
          <div className="relative ml-4">
            <button
              className="flex items-center px-2 py-1 rounded hover:bg-white/20 transition"
              onClick={() => setSortMenuOpen((open) => !open)}
              aria-label="Sort experience"
              type="button"
            >
              {/* Simple sort icon SVG */}
              <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                <path d="M6 8h8M8 12h4M10 16h0M4 4h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span className="ml-1 text-xs font-mono">Sort</span>
            </button>
            {sortMenuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white/90 text-black rounded shadow z-20">
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-200 text-sm"
                  onClick={() => handleSort("year-desc")}
                >
                  Year: Newest First
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-200 text-sm"
                  onClick={() => handleSort("year-asc")}
                >
                  Year: Oldest First
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-200 text-sm"
                  onClick={() => handleSort("company-asc")}
                >
                  Company: A-Z
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-200 text-sm"
                  onClick={() => handleSort("company-desc")}
                >
                  Company: Z-A
                </button>
              </div>
            )}
          </div>
        </div>
        {experiences.length === 0 ? (
          <div
            className="text-center"
            style={{ color: theme === "light" ? "#111" : "var(--foreground)", opacity: 0.7 }}
          >
            No experience data available.
          </div>
        ) : (
          <ul className="space-y-8">
            {sortedExperiences.map((exp, idx) => (
              <motion.li
                key={exp.role + exp.company}
                className="bg-white/10 rounded-lg shadow p-6 border border-white/10"
                initial={{ opacity: 0, x: idx % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
              >
                <h3
                  className="text-xl font-semibold mb-1"
                  style={{ color: theme === "light" ? "#111" : "#fff" }}
                >
                  {exp.role}
                </h3>
                <p
                  className="text-md"
                  style={{ color: theme === "light" ? "#222" : "rgba(255,255,255,0.8)" }}
                >
                  {exp.company} &mdash; <span className="italic">{exp.period}</span>
                </p>
                <p
                  className="mt-2"
                  style={{ color: theme === "light" ? "#333" : "rgba(255,255,255,0.7)" }}
                >
                  {exp.description}
                </p>
              </motion.li>
            ))}
          </ul>
        )}
      </motion.div>
    </section>
  );
};

export default ExperienceSection;
