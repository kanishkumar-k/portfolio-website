"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useUiPanel } from "./ui/UiPanelContext";

interface Project {
  title: string;
  description: string;
  link: string;
  image?: string;
  type?: string;
}

const PROJECT_TYPES = [
  { label: "All", value: "all" },
  { label: "Backend", value: "backend" },
  { label: "UI", value: "ui" },
  { label: "Full Stack", value: "full stack" },
  { label: "AI/ML", value: "ai/ml" },
  { label: "Freelance", value: "freelance" },
  { label: "Open Source", value: "others" }
];

const PROJECTS_PER_PAGE = 4;

const ProjectsSection: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [active, setActive] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [openImage, setOpenImage] = useState<string | null>(null);
  const { openPanel } = useUiPanel();
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setProjects(data);
      });
  }, []);

  const filteredProjects =
    selectedType === "all"
      ? projects
      : projects.filter(
          (project) =>
            project.type &&
            project.type.toLowerCase() === selectedType.toLowerCase()
        );

  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedType]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * PROJECTS_PER_PAGE,
    currentPage * PROJECTS_PER_PAGE
  );

  // Modal close handler (esc key)
  useEffect(() => {
    if (!openImage) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenImage(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [openImage]);

  return (
    <section
      id="projects"
      className="w-full pt-24 pb-8 px-4 flex justify-center items-center relative bg-[var(--background)]"
    >
      {/* Image Modal */}
      {openImage && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/70 transition-all duration-300 ease-out ${
            openPanel === "email" ? "md:mr-[380px]" : ""
          }`}
          onClick={() => setOpenImage(null)}
          aria-modal="true"
          role="dialog"
        >
          <div
            className="relative max-w-2xl w-full flex flex-col items-center"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 bg-white/80 rounded-full p-2 shadow hover:bg-white"
              onClick={() => setOpenImage(null)}
              aria-label="Close image"
              tabIndex={0}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M6 18L18 6" stroke="#222" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <img
              src={openImage}
              alt="Project"
              className="rounded-lg shadow-lg max-h-[80vh] object-contain"
              style={{ background: "#222" }}
            />
          </div>
        </div>
      )}
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

        <h2 className={`text-3xl font-bold mb-4 text-center font-['JetBrains_Mono',monospace] text-[var(--foreground)] underline underline-offset-8 section-title-variant${active ? " section-title-active" : ""}`}>Projects</h2>
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {PROJECT_TYPES.map((type) => (
            <button
              key={type.value}
              className={`px-4 py-1 rounded-full border text-sm font-medium transition-colors ${
                selectedType === type.value
                  ? "bg-[var(--foreground)] text-[var(--background)] border-[var(--foreground)]"
                  : "bg-transparent text-[var(--foreground)] border-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)]"
              }`}
              onClick={() => setSelectedType(type.value)}
              type="button"
            >
              {type.label}
            </button>
          ))}
        </div>
        <div className="grid gap-8 sm:grid-cols-2">
          {filteredProjects.length === 0 ? (
            <div className="col-span-full text-center" style={{ color: "var(--foreground)", opacity: 0.7 }}>
              No projects data available.
            </div>
          ) : (
            paginatedProjects.map((project, idx) => (
              <motion.div
                key={project.title || idx}
                className="bg-white/10 rounded-lg shadow-xl p-6 flex flex-col hover:scale-105 transition-transform duration-300 border border-white/10"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                style={{ color: "var(--foreground)" }}
              >
                {project.image && (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-40 object-cover rounded-lg mb-3 border border-white/20 project-image cursor-pointer transition-transform hover:scale-105"
                    style={{ background: "#222", objectFit: "cover" }}
                    onClick={() => setOpenImage(project.image!)}
                    tabIndex={0}
                    onKeyDown={e => {
                      if (e.key === "Enter" || e.key === " ") setOpenImage(project.image!);
                    }}
                  />
                )}
                <h3 className="text-xl font-semibold mb-2" style={{ color: "var(--foreground)" }}>
                  {project.title}
                </h3>
                <p className="flex-1" style={{ color: "var(--foreground)", opacity: 0.9 }}>
                  {project.description}
                </p>
                {/* Architecture/Algorithm button(s) from project fields */}
                {(() => {
                  // @ts-ignore: allow future fields
                  const archImg = project.architecture;
                  // @ts-ignore: allow future fields
                  const algoImg = project.algorithm;
                  const buttons = [];
                  if (archImg) {
                    buttons.push({
                      label: "architecture",
                      img: archImg,
                    });
                  }
                  if (algoImg) {
                    buttons.push({
                      label: "algorithm",
                      img: algoImg,
                    });
                  }
                  if (buttons.length === 0) return null;
                  return (
                    <div className="flex flex-wrap gap-2 mt-3 mb-2">
                      {buttons.map((btn) => (
                        <button
                          key={btn.label}
                          className="px-4 py-1 rounded-full border text-sm font-medium transition-colors bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                          type="button"
                          onClick={() => setOpenImage(btn.img)}
                          tabIndex={0}
                          aria-label={`Show ${btn.label} image`}
                        >
                          {btn.label}
                        </button>
                      ))}
                    </div>
                  );
                })()}
                {project.type && (
                  <span className="mt-2 text-xs font-semibold px-2 py-1 rounded bg-[var(--foreground)] text-[var(--background)] w-fit">
                    {project.type.toUpperCase()}
                  </span>
                )}
                {project.link && (
                  <a
                    href={project.link}
                    className="mt-4 inline-block hover:underline"
                    style={{ color: "var(--foreground)", fontWeight: 500 }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Project
                  </a>
                )}
              </motion.div>
            ))
          )}
        </div>
        {/* Pagination Controls */}
        {filteredProjects.length > PROJECTS_PER_PAGE && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              className="px-3 py-1 rounded border text-sm font-medium bg-transparent text-[var(--foreground)] border-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              type="button"
              aria-label="Previous page"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`px-3 py-1 rounded border text-sm font-medium ${
                  currentPage === i + 1
                    ? "bg-[var(--foreground)] text-[var(--background)] border-[var(--foreground)]"
                    : "bg-transparent text-[var(--foreground)] border-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)]"
                }`}
                onClick={() => setCurrentPage(i + 1)}
                type="button"
                aria-label={`Go to page ${i + 1}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="px-3 py-1 rounded border text-sm font-medium bg-transparent text-[var(--foreground)] border-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              type="button"
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default ProjectsSection;
