"use client";
import React, { useEffect, useState } from "react";

interface EducationEntry {
  type: string;
  name: string;
  degree: string;
  year: string;
  cgpa?: string;
  grade?: string;
  percentage?: string;
}

const EducationSection: React.FC = () => {
  const [education, setEducation] = useState<EducationEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [sortType, setSortType] = useState<"year-desc" | "year-asc" | "name-asc" | "name-desc">("year-desc");

  useEffect(() => {
    fetch("/api/education")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setEducation(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Helper to parse start year for sorting
  const getStartYear = (entry: EducationEntry) => {
    if (!entry.year) return 0;
    const match = entry.year.match(/(\d{4})/);
    return match ? parseInt(match[1], 10) : 0;
  };

  // Sorting logic
  const sortedEducation = [...education].sort((a, b) => {
    if (sortType === "year-desc") {
      return getStartYear(b) - getStartYear(a);
    }
    if (sortType === "year-asc") {
      return getStartYear(a) - getStartYear(b);
    }
    if (sortType === "name-asc") {
      return a.name.localeCompare(b.name);
    }
    if (sortType === "name-desc") {
      return b.name.localeCompare(a.name);
    }
    return 0;
  });

  const handleSort = (type: "year-desc" | "year-asc" | "name-asc" | "name-desc") => {
    setSortType(type);
    setSortMenuOpen(false);
  };

  return (
    <section
      id="education"
      className="w-full pt-16 pb-8 px-4 flex justify-center items-center relative bg-[var(--background)]"
    >
      <div className="section-card w-full max-w-2xl mx-auto backdrop-blur-lg bg-white/10 rounded-2xl shadow-2xl p-8 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-center font-['JetBrains_Mono',monospace] text-[var(--foreground)] underline underline-offset-8">
            Academic Background
          </h2>
          {/* Sort Icon and Dropdown */}
          <div className="relative ml-4">
            <button
              className="flex items-center px-2 py-1 rounded hover:bg-white/20 transition"
              onClick={() => setSortMenuOpen((open) => !open)}
              aria-label="Sort education"
              type="button"
            >
              {/* Simple sort icon SVG */}
              <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                <path d="M6 8h8M8 12h4M10 16h0M4 4h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span className="ml-1 text-xs font-mono">Sort</span>
            </button>
            {sortMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white/90 text-black rounded shadow z-20">
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
                  onClick={() => handleSort("name-asc")}
                >
                  Name: A-Z
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-200 text-sm"
                  onClick={() => handleSort("name-desc")}
                >
                  Name: Z-A
                </button>
              </div>
            )}
          </div>
        </div>
        {loading ? (
          <div className="text-center" style={{ color: "var(--foreground)", opacity: 0.7 }}>
            Loading...
          </div>
        ) : education.length === 0 ? (
          <div className="text-center" style={{ color: "var(--foreground)", opacity: 0.7 }}>
            No education data available.
          </div>
        ) : (
          <div className="w-full flex flex-col gap-6">
            {sortedEducation.map((entry, idx) => {
              // Parse start and end year from entry.year (e.g., "2020 -2024")
              let startYear = "";
              let endYear = "";
              if (entry.year) {
                const match = entry.year.match(/(\d{4})\s*-\s*(\d{4})/);
                if (match) {
                  startYear = match[1];
                  endYear = match[2];
                } else {
                  startYear = entry.year;
                }
              }
              return (
                <div
                  key={idx}
                  className="flex items-center bg-white/10 rounded-lg shadow p-4 border border-white/10"
                  style={{ color: "var(--foreground)" }}
                >
                  {/* Years column */}
                  <div className="flex flex-col items-center justify-center min-w-[80px] mr-6">
                    <span className="text-lg font-bold font-mono bg-[var(--foreground)] text-[var(--background)] px-3 py-1 rounded">
                      {startYear}
                    </span>
                    <span className="text-xs font-mono opacity-70 mt-1">to</span>
                    <span className="text-lg font-bold font-mono bg-[var(--foreground)] text-[var(--background)] px-3 py-1 rounded mt-1">
                      {endYear}
                    </span>
                  </div>
                  {/* Details column */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-semibold text-lg">{entry.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-[var(--foreground)] text-[var(--background)]">
                        {entry.type}
                      </span>
                    </div>
                    <div className="text-sm font-medium mb-1">{entry.degree}</div>
                    {(entry.cgpa || entry.grade || entry.percentage) && (
                      <div className="text-sm font-mono opacity-80 flex flex-wrap gap-2">
                        {entry.cgpa && <span>CGPA: {entry.cgpa}</span>}
                        {entry.grade && <span>Grade: {entry.grade}</span>}
                        {entry.percentage && <span>Percentage: {entry.percentage}</span>}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default EducationSection;
