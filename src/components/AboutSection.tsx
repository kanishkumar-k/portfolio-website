"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const AboutSection: React.FC = () => {
  const [about, setAbout] = useState<{ description?: string }>({});

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await fetch("/api/about");
        if (res.ok) {
          const data = await res.json();
          setAbout(data);
        }
      } catch (error) {
      }
    };
    fetchAbout();
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
        <p className="text-lg text-center" style={{ color: "var(--foreground)", opacity: 0.9 }}>
          {about?.description || ""}
        </p>
      </motion.div>
    </section>
  );
};

export default AboutSection;
