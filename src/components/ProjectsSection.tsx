"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

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
  { label: "Others", value: "others" }
];

const ProjectsSection: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [active, setActive] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [openImage, setOpenImage] = useState<string | null>(null);

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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
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
            filteredProjects.map((project, idx) => (
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
      </motion.div>
    </section>
  );
};

export default ProjectsSection;
