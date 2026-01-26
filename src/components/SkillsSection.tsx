"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  SiPython,
  SiJavascript,
  SiFastapi,
  SiDjango,
  SiStreamlit,
  SiNodedotjs,
  SiReact,
  SiGraphql,
  SiGithub,
  SiPostgresql,
  SiMongodb,
  SiMysql,
  SiGit,
} from "react-icons/si";
import { FaCode } from "react-icons/fa";

/**
 * Skills section with glassy, dark, blurred style and white text.
 */
type SkillType = {
  name: string;
  icon: string;
};

const ICON_MAP: { [key: string]: React.ReactNode } = {
  SiPython: <SiPython size={32} color="#3776AB" title="Python" />,
  SiJavascript: <SiJavascript size={32} color="#F7DF1E" title="JavaScript" />,
  SiFastapi: <SiFastapi size={32} color="#009688" title="FastAPI" />,
  SiDjango: <SiDjango size={32} color="#092E20" title="Django" />,
  SiStreamlit: <SiStreamlit size={32} color="#FF4B4B" title="Streamlit" />,
  SiNodedotjs: <SiNodedotjs size={32} color="#339933" title="Node.js" />,
  SiReact: <SiReact size={32} color="#61DAFB" title="React.js" />,
  SiGraphql: <SiGraphql size={32} color="#E10098" title="GraphQL" />,
  SiGithub: <SiGithub size={32} color="#181717" title="GitHub" />,
  SiPostgresql: <SiPostgresql size={32} color="#336791" title="PostgreSQL" />,
  SiMongodb: <SiMongodb size={32} color="#47A248" title="MongoDB" />,
  SiMysql: <SiMysql size={32} color="#4479A1" title="MySQL" />,
  SiGit: <SiGit size={32} color="#F05032" title="Git" />,
  FaCode: <FaCode size={32} color="#4A90E2" title="Other" />,
};

import { useTheme } from "./ui/ThemeProvider";
import { useUiPanel } from "./ui/UiPanelContext";

const SkillsSection: React.FC = () => {
  const [skills, setSkills] = useState<SkillType[]>([]);
  const [showCerts, setShowCerts] = useState(false);
  const [certs, setCerts] = useState<any[]>([]);
  const [loadingCerts, setLoadingCerts] = useState(false);
  const [openCertImage, setOpenCertImage] = useState<string | null>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { openPanel } = useUiPanel();

  useEffect(() => {
    fetch("/api/skills")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setSkills(data);
      });
  }, []);

  // Fetch certifications when modal opens
  useEffect(() => {
    if (showCerts && certs.length === 0 && !loadingCerts) {
      setLoadingCerts(true);
      fetch("/api/certifications")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setCerts(data);
          setLoadingCerts(false);
        })
        .catch(() => setLoadingCerts(false));
    }
  }, [showCerts, certs.length, loadingCerts]);

  // Modal close handler (esc key)
  useEffect(() => {
    if (!openCertImage) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenCertImage(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [openCertImage]);

  return (
    <section
      id="skills"
      className="w-full py-24 px-4 flex justify-center items-center relative bg-[var(--background)]"
    >
      {/* Certifications Modal */}
      {showCerts && (
        <div
          className={`fixed top-0 left-0 h-full z-50 flex flex-col items-center justify-start transition-all duration-300
            ${openPanel === "email" ? "w-[340px] md:w-[340px] translate-x-[-30px]" : "w-[380px] md:w-[380px]"}
            bg-black/70 md:bg-transparent`}
          style={{ boxShadow: "2px 0 16px 0 rgba(0,0,0,0.12)" }}
          onClick={() => setShowCerts(false)}
          aria-modal="true"
          role="dialog"
        >
          <div
            className={`relative w-full h-full max-w-[380px] md:max-w-[380px] rounded-lg shadow-lg p-6 flex flex-col
              ${isDark ? "bg-[#181c23] text-white" : "bg-white text-gray-900"}
              mt-8 md:mt-16
            `}
            onClick={e => e.stopPropagation()}
            style={{ minHeight: "80vh", maxHeight: "90vh", overflowY: "auto" }}
          >
            <button
              className={`absolute top-2 right-2 rounded-full p-2 shadow ${
                isDark
                  ? "bg-gray-800 text-white hover:bg-gray-700"
                  : "bg-gray-200 text-gray-900 hover:bg-gray-300"
              }`}
              onClick={() => setShowCerts(false)}
              aria-label="Close certifications"
              tabIndex={0}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M6 18L18 6" stroke={isDark ? "#fff" : "#222"} strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <h3 className="text-xl font-bold mb-4 text-center">Certifications</h3>
            {loadingCerts ? (
              <div className="text-center text-gray-400">Loading...</div>
            ) : certs.length === 0 ? (
              <div className="text-center text-gray-400">No certifications available.</div>
            ) : (
              <ul
                className="flex flex-col gap-4 overflow-y-auto"
                style={{ maxHeight: "60vh", minWidth: "280px" }}
              >
                {certs.map((cert, idx) => (
                  <li
                    key={idx}
                    className={`flex flex-col sm:flex-row gap-4 items-center border rounded-lg p-4 ${
                      isDark
                        ? "border-gray-700 bg-[#23272f]"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {cert.image && (
                        <img
                          src={cert.image}
                          alt={cert.name}
                          className="w-28 h-20 object-cover rounded shadow cursor-pointer"
                          onClick={() => setOpenCertImage(cert.image)}
                          tabIndex={0}
                          onKeyDown={e => {
                            if (e.key === "Enter" || e.key === " ") setOpenCertImage(cert.image);
                          }}
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-lg">{cert.name}</div>
                      <div className="text-sm opacity-80 mb-1">
                        Achieved: {cert.achieved_month} {cert.achieved_year}
                      </div>
                      <div className="text-sm opacity-90">{cert.description}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
      {/* Certification Image Lightbox */}
      {openCertImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={() => setOpenCertImage(null)}
          aria-modal="true"
          role="dialog"
        >
          <div
            className="relative max-w-2xl w-full flex flex-col items-center"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 bg-white/80 rounded-full p-2 shadow hover:bg-white"
              onClick={() => setOpenCertImage(null)}
              aria-label="Close image"
              tabIndex={0}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M6 18L18 6" stroke="#222" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <img
              src={openCertImage}
              alt="Certification"
              className="rounded-lg shadow-lg max-h-[80vh] object-contain"
              style={{ background: "#222" }}
            />
          </div>
        </div>
      )}
      <motion.div
        className="section-card w-full max-w-3xl mx-auto backdrop-blur-lg bg-white/10 rounded-2xl shadow-2xl p-10 border border-white/20"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="mb-4">
          <h2 className="text-3xl font-bold text-center font-['JetBrains_Mono',monospace] text-[var(--foreground)] underline underline-offset-8 section-title-variant">
            Skills
          </h2>
          <div className="flex justify-center mt-4">
            <button
              className="px-5 py-2 rounded-full border border-blue-600 text-blue-700 bg-white/80 font-medium hover:bg-blue-600 hover:text-white transition-colors shadow-sm"
              onClick={() => setShowCerts(true)}
              type="button"
            >
              View Certifications
            </button>
          </div>
        </div>
        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-lg" style={{ color: "var(--foreground)", opacity: 0.9 }}>
          {skills.length === 0 ? (
            <li className="col-span-full text-center text-white/70">No skills data available.</li>
          ) : (
            skills.map((skill, idx) => {
              let name = "";
              let icon = "FaCode";
              if (typeof skill === "object" && skill !== null && "name" in skill && "icon" in skill) {
                name = skill.name;
                icon = skill.icon;
              } else if (typeof skill === "string") {
                name = skill;
                icon = "FaCode";
              }
              return (
                <motion.li
                  key={name + idx}
                  className="bg-white/10 rounded-lg shadow p-3 text-center border border-white/10 flex flex-col items-center justify-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="mb-2 text-2xl">
                    {ICON_MAP[icon] || <FaCode size={32} color="#4A90E2" />}
                  </span>
                  <span>{name}</span>
                </motion.li>
              );
            })
          )}
        </ul>
      </motion.div>
    </section>
  );
};

export default SkillsSection;

