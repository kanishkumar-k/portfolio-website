"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaLinkedin, FaGithub, FaMedium } from "react-icons/fa";

type ContactInfo = {
  linkedin?: string;
  github?: string;
  medium?: string;
  name?: string;
  textColor?: string;
};

const ContactSection: React.FC = () => {
  const [contact, setContact] = useState<ContactInfo>({});
  useEffect(() => {
    fetch("/api/contact")
      .then((r) => r.json())
      .then((data) => setContact(data))
      .catch(() => setContact({}));
  }, []);

  return (
    <section
      id="contact"
      className="w-full py-24 px-4 flex justify-center items-center relative bg-[var(--background)]"
    >
      <motion.div
        className="section-card w-full max-w-3xl mx-auto backdrop-blur-lg bg-white/10 rounded-2xl shadow-2xl p-10 border border-white/20"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold mb-4 text-center font-['JetBrains_Mono',monospace] text-[var(--foreground)] underline underline-offset-8 section-title-variant">
          Contact
        </h2>
        <div className="flex flex-col items-center justify-center gap-4">
          {contact.name && (
            <div className="text-xl text-white font-semibold mb-2">{contact.name}</div>
          )}
          <div className="text-lg mb-4" style={{ color: "var(--foreground)" }}>
            Connect with me on:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-lg">
            {contact.linkedin && (
              <a
                href={contact.linkedin}
                className="flex flex-col items-center bg-gradient-to-br from-[#94d6f9]/80 to-[#94d6f9]/40 rounded-xl p-5 shadow group hover:scale-105 transition-all"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="mb-2 text-3xl text-[#0a66c2]">
                  <FaLinkedin />
                </div>
                <span className="break-all font-semibold text-[#0a66c2] group-hover:underline">
                  LinkedIn
                </span>
                <span className="mt-1 text-xs text-[#0a66c2] opacity-80">/in/kanishkumar-k</span>
              </a>
            )}
            {contact.github && (
              <a
                href={contact.github}
                className="flex flex-col items-center bg-gradient-to-br from-[#181717]/80 to-[#181717]/40 rounded-xl p-5 shadow group hover:scale-105 transition-all text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="mb-2 text-3xl text-white transition-colors">
                  <FaGithub />
                </div>
                <span className="break-all font-semibold text-white group-hover:underline transition-colors">
                  GitHub
                </span>
                <span className="mt-1 text-xs text-white opacity-80 transition-colors">/kanishkumar-k</span>
              </a>
            )}
            {contact.medium && (
              <a
                href={contact.medium}
                className="flex flex-col items-center bg-gradient-to-br from-[#02b875]/80 to-[#02b875]/40 rounded-xl p-5 shadow group hover:scale-105 transition-all text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="mb-2 text-3xl text-white transition-colors">
                  <FaMedium />
                </div>
                <span className="break-all font-semibold text-white group-hover:underline transition-colors">
                  Medium
                </span>
                <span className="mt-1 text-xs text-white opacity-80 transition-colors">/kanishkumar0409</span>
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default ContactSection;
