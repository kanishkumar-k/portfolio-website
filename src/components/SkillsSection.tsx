"use client";

import React, { useEffect, useMemo, useState } from "react";
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

import { useTheme } from "./ui/ThemeProvider";

/**
 * Skills section with glassy, dark, blurred style and white text.
 */
type SkillType = {
  name: string;
  icon: string;
};

type CertType = {
  name: string;
  description?: string;
  image?: string;
  achieved_month?: string;
  achieved_year?: string | number;
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

const SkillsSection: React.FC = () => {
  const [skills, setSkills] = useState<SkillType[]>([]);
  const [showCerts, setShowCerts] = useState(false);
  const [certs, setCerts] = useState<CertType[]>([]);
  const [selectedCertIdx, setSelectedCertIdx] = useState(0);
  const [loadingCerts, setLoadingCerts] = useState(false);
  const [openCertImage, setOpenCertImage] = useState<string | null>(null);

  const { theme } = useTheme();
  const isDark = theme === "dark";

  const selectedCert = useMemo(
    () => (certs.length > 0 ? certs[Math.min(selectedCertIdx, certs.length - 1)] : null),
    [certs, selectedCertIdx]
  );

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
          if (Array.isArray(data)) {
            setCerts(data);
            setSelectedCertIdx(0);
          }
          setLoadingCerts(false);
        })
        .catch(() => setLoadingCerts(false));
    }
  }, [showCerts, certs.length, loadingCerts]);

  // Modal close handler (esc key)
  useEffect(() => {
    if (!showCerts && !openCertImage) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (openCertImage) setOpenCertImage(null);
        else setShowCerts(false);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [showCerts, openCertImage]);

  return (
    <section
      id="skills"
      className="w-full py-24 px-4 flex justify-center items-center relative bg-[var(--background)]"
    >
      {/* Certifications Modal (sideways/landscape, centered) */}
      {showCerts && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
          onClick={() => setShowCerts(false)}
          aria-modal="true"
          role="dialog"
        >
          <div
            className={`relative w-[95vw] max-w-5xl rounded-lg shadow-lg p-6 ${
              isDark ? "bg-[#181c23] text-white" : "bg-white text-gray-900"
            }`}
            onClick={(e) => e.stopPropagation()}
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
              type="button"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 6l12 12M6 18L18 6"
                  stroke={isDark ? "#fff" : "#222"}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <h3 className="text-xl font-bold mb-4 text-center">Certifications</h3>

            {loadingCerts ? (
              <div className="text-center text-gray-400">Loading...</div>
            ) : certs.length === 0 ? (
              <div className="text-center text-gray-400">No certifications available.</div>
            ) : (
              <div className="flex flex-col md:flex-row gap-6">
                {/* Left: list */}
                <div
                  className="md:w-1/2 lg:w-2/5 overflow-y-auto pr-1"
                  style={{ maxHeight: "70vh" }}
                  aria-label="Certification list"
                >
                  <ul className="flex flex-col gap-3">
                    {certs.map((cert, idx) => {
                      const isSelected = idx === selectedCertIdx;
                      return (
                        <li
                          key={`${cert?.name ?? "cert"}-${idx}`}
                          className={`flex gap-4 items-center border rounded-lg p-3 cursor-pointer transition-colors ${
                            isDark
                              ? `border-gray-700 ${isSelected ? "bg-[#2a303a]" : "bg-[#23272f] hover:bg-[#2a303a]"}`
                              : `border-gray-200 ${isSelected ? "bg-gray-100" : "bg-white hover:bg-gray-50"}`
                          }`}
                          onClick={() => setSelectedCertIdx(idx)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") setSelectedCertIdx(idx);
                          }}
                          tabIndex={0}
                          role="button"
                          aria-pressed={isSelected}
                        >
                          <div className="flex-shrink-0">
                            {cert.image ? (
                              <img
                                src={cert.image}
                                alt={cert.name}
                                className="w-24 h-16 object-cover rounded shadow"
                              />
                            ) : (
                              <div
                                className={`w-24 h-16 rounded grid place-items-center ${
                                  isDark ? "bg-black/20" : "bg-gray-200"
                                }`}
                              >
                                <FaCode size={22} color={isDark ? "#fff" : "#222"} />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold truncate">{cert.name}</div>
                            <div className="text-xs opacity-80 truncate">
                              {cert.achieved_month || cert.achieved_year
                                ? `Achieved: ${cert.achieved_month ?? ""} ${cert.achieved_year ?? ""}`.trim()
                                : " "}
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Right: preview (centered, sideways modal layout) */}
                <div
                  className="md:w-1/2 lg:w-3/5 flex flex-col items-center justify-center"
                  style={{ minHeight: "40vh" }}
                  aria-label="Certification preview"
                >
                  {selectedCert ? (
                    <>
                      {selectedCert.image ? (
                        <img
                          src={selectedCert.image}
                          alt={selectedCert.name}
                          className="rounded-lg shadow-lg max-h-[42vh] w-full object-contain cursor-pointer"
                          style={{ background: isDark ? "#111" : "#f3f4f6" }}
                          onClick={() => setOpenCertImage(selectedCert.image!)}
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") setOpenCertImage(selectedCert.image!);
                          }}
                        />
                      ) : (
                        <div
                          className={`rounded-lg shadow-inner w-full grid place-items-center ${
                            isDark ? "bg-black/20" : "bg-gray-100"
                          }`}
                          style={{ height: "42vh" }}
                        >
                          <div className="text-sm opacity-80">No image available</div>
                        </div>
                      )}

                      <div className="w-full mt-4">
                        <div className="text-lg font-bold text-center">{selectedCert.name}</div>
                        {(selectedCert.achieved_month || selectedCert.achieved_year) && (
                          <div className="text-sm opacity-80 text-center mt-1">
                            Achieved: {selectedCert.achieved_month} {selectedCert.achieved_year}
                          </div>
                        )}
                        {selectedCert.description && (
                          <div className="text-sm opacity-90 mt-3 text-center">{selectedCert.description}</div>
                        )}
                        <div className="text-xs opacity-70 mt-3 text-center">
                          Tip: Click the preview to open full image.
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center opacity-80">Select a certification to preview.</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Certification Image Lightbox */}
      {openCertImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
          onClick={() => setOpenCertImage(null)}
          aria-modal="true"
          role="dialog"
        >
          <div
            className="relative max-w-5xl w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 bg-white/80 rounded-full p-2 shadow hover:bg-white"
              onClick={() => setOpenCertImage(null)}
              aria-label="Close image"
              tabIndex={0}
              type="button"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 6l12 12M6 18L18 6"
                  stroke="#222"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <img
              src={openCertImage}
              alt="Certification"
              className="rounded-lg shadow-lg max-h-[85vh] w-full object-contain"
              style={{ background: "#111" }}
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

        <ul
          className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-lg"
          style={{ color: "var(--foreground)", opacity: 0.9 }}
        >
          {skills.length === 0 ? (
            <li className="col-span-full text-center text-white/70">No skills data available.</li>
          ) : (
            skills.map((skill, idx) => {
              let name = "";
              let icon = "FaCode";

              if (typeof skill === "object" && skill !== null && "name" in skill && "icon" in skill) {
                name = (skill as SkillType).name;
                icon = (skill as SkillType).icon;
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
