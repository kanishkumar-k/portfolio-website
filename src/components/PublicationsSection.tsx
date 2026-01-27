"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "./ui/ThemeProvider";
import publications from "../../data/publications.json";

type Publication = {
  title: string;
  venue: string;
  date: string;
  summary: string;
  url: string;
  image?: string;
};

const PublicationsSection: React.FC = () => {
  const [active, setActive] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [zoomedImg, setZoomedImg] = useState<string | null>(null);
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  // For demonstration, add image to the first publication if not present
  const pubsWithImages = publications.map((pub: Publication, idx: number) =>
    idx === 0 && !pub.image
      ? { ...pub, image: "/images/architecture.png" }
      : pub
  );

  return (
    <section
      id="publications"
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
          className={`text-3xl font-bold mb-4 text-center font-['JetBrains_Mono',monospace] underline underline-offset-8 section-title-variant${active ? " section-title-active" : ""} ${
            isDark ? "text-white" : "text-black"
          }`}
        >
          Publications
        </h2>
        <div className="space-y-4">
          {pubsWithImages.length === 0 && (
            <div className="text-center text-gray-400">No publications found.</div>
          )}
          {pubsWithImages.map((pub: Publication, idx: number) => {
            const isOpen = openIdx === idx;
            return (
              <motion.div
                key={pub.title}
                className={`bg-white/10 rounded-lg shadow p-4 border border-white/10 ${
                  isDark ? "text-white" : "text-black"
                }`}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
              >
                <button
                  className="flex items-center w-full text-left focus:outline-none"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  aria-controls={`pub-details-${idx}`}
                  style={{ gap: 8 }}
                >
                  <span
                    className={`text-xl font-semibold flex-1 ${
                      isDark ? "text-cyan-200" : "text-blue-700"
                    }`}
                  >
                    {pub.title}
                  </span>
                  <span className="ml-2">
                    {isOpen ? (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                        <path d="M6 15l6-6 6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </span>
                </button>
                {isOpen && (
                  <div id={`pub-details-${idx}`} className="mt-3">
                    {pub.image && (
                      <img
                        src={pub.image}
                        alt={pub.title}
                        className="w-full max-w-xs mx-auto my-4 rounded-lg shadow cursor-zoom-in"
                        style={{ objectFit: "cover", maxHeight: 180 }}
                        onClick={() => setZoomedImg(pub.image!)}
                      />
                    )}
                    <p className={`text-sm ${isDark ? "text-white/70" : "text-gray-700"}`}>
                      {pub.venue} &mdash; {pub.date}
                    </p>
                    <p className={`mt-2 ${isDark ? "text-white/80" : "text-gray-800"}`}>{pub.summary}</p>
                    <a
                      href={pub.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`block mt-2 underline ${isDark ? "text-cyan-200" : "text-blue-700"}`}
                    >
                      View Publication
                    </a>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
      {/* Zoomed image modal */}
      {zoomedImg && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80"
          onClick={() => setZoomedImg(null)}
        >
          <div
            className="relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={zoomedImg}
              alt="Zoomed publication"
              className="max-w-[90vw] max-h-[80vh] rounded-lg shadow-2xl border-4 border-white"
              style={{ objectFit: "contain" }}
            />
            <button
              className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 shadow-lg hover:bg-red-700 transition-all"
              onClick={() => setZoomedImg(null)}
              aria-label="Close"
              type="button"
            >
              <svg width="24" height="24" viewBox="0 0 24 24">
                <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2"/>
                <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default PublicationsSection;
