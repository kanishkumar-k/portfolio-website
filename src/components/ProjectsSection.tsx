"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Project {
  title: string;
  description: string;
  link: string;
  image?: string;
}

const ProjectsSection: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [active, setActive] = useState(false);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setProjects(data);
      });
  }, []);

  return (
    <section
      id="projects"
      className="w-full pt-24 pb-8 px-4 flex justify-center items-center relative bg-[var(--background)]"
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
        <h2 className={`text-3xl font-bold mb-4 text-center font-['JetBrains_Mono',monospace] text-[var(--foreground)] underline underline-offset-8 section-title-variant${active ? " section-title-active" : ""}`}>Projects</h2>
        <div className="grid gap-8 sm:grid-cols-2">
          {projects.length === 0 ? (
            <div className="col-span-full text-center" style={{ color: "var(--foreground)", opacity: 0.7 }}>No projects data available.</div>
          ) : (
            projects.map((project, idx) => (
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
                    className="w-full h-40 object-cover rounded-lg mb-3 border border-white/20 project-image"
                    style={{ background: "#222", objectFit: "cover" }}
                  />
                )}
<h3 className="text-xl font-semibold mb-2" style={{ color: "var(--foreground)" }}>{project.title}</h3>
                <p className="flex-1" style={{ color: "var(--foreground)", opacity: 0.9 }}>{project.description}</p>
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
