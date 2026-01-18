"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

/**
 * About section with glassy, dark, blurred style and white text.
 */
const defaultAbout = {
  description: "Write about yourself here.",
};

const AboutSection: React.FC = () => {
  const [about, setAbout] = useState(defaultAbout);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("portfolioData");
      if (stored) {
        const data = JSON.parse(stored);
        if (data.about) setAbout(data.about);
      }
    }
  }, []);

  return (
    <section
      id="about"
      className="w-full py-24 px-4 flex justify-center items-center relative bg-[var(--background)]"
    >
      <motion.div
        className="section-card w-full max-w-3xl mx-auto backdrop-blur-lg bg-white/10 rounded-2xl shadow-2xl p-10 border border-white/20"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold mb-4 text-center font-['JetBrains_Mono',monospace] text-[var(--foreground)]">
          About
        </h2>
        <p className="text-lg text-center" style={{ color: "var(--foreground)", opacity: 0.9 }}>{about.description}</p>
      </motion.div>
    </section>
  );
};

export default AboutSection;
