"use client";
import React from "react";
import { motion } from "framer-motion";

/**
 * Publications section with glassy, dark, blurred style and white text.
 */
const publications = [
  {
    title: "Understanding Async in JavaScript",
    venue: "Dev Journal",
    date: "Nov 2025",
    summary: "An article exploring asynchronous programming patterns in JavaScript, with practical examples.",
    url: "#",
  },
  {
    title: "A Guide to Modern CSS",
    venue: "Web Dev Magazine",
    date: "Sep 2025",
    summary: "A comprehensive guide to new CSS features and how to use them in real-world projects.",
    url: "#",
  },
];

const PublicationsSection: React.FC = () => (
  <section
    id="publications"
    className="w-full py-24 px-4 flex justify-center items-center relative bg-[var(--background)]"
  >
      <motion.div
        className="section-card w-full max-w-3xl mx-auto backdrop-blur-lg bg-white/10 rounded-2xl shadow-2xl p-10 border border-white/20"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
      <h2 className="text-3xl font-bold mb-4 text-center font-['JetBrains_Mono',monospace] text-[var(--foreground)]">Publications</h2>
      <div className="space-y-8">
        {publications.map((pub, idx) => (
          <motion.div
            key={pub.title}
            className="bg-white/10 rounded-lg shadow p-6 border border-white/10"
            initial={{ opacity: 0, x: idx % 2 === 0 ? -40 : 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.2 }}
          >
            <a href={pub.url} target="_blank" rel="noopener noreferrer" className="text-xl font-semibold text-cyan-200 hover:underline">
              {pub.title}
            </a>
            <p className="text-sm text-white/70">{pub.venue} &mdash; {pub.date}</p>
            <p className="mt-2 text-white/80">{pub.summary}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  </section>
);

export default PublicationsSection;
