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
        <h2
          className={`text-3xl font-bold mb-4 text-center font-['JetBrains_Mono',monospace] underline underline-offset-8 section-title-variant${active ? " section-title-active" : ""}`}
          style={{ color: theme === "light" ? "#111" : "var(--foreground)" }}
        >
          Experience
        </h2>
        {experiences.length === 0 ? (
          <div
            className="text-center"
            style={{ color: theme === "light" ? "#111" : "var(--foreground)", opacity: 0.7 }}
          >
            No experience data available.
          </div>
        ) : (
          <ul className="space-y-8">
            {experiences.map((exp, idx) => (
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
