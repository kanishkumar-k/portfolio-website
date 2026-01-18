"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Blog {
  title: string;
  url: string;
  date?: string;
  summary?: string;
  image?: string;
}

const MediumBlogsSection: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    fetch("/api/blogs")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setBlogs(data);
      });
  }, []);

  return (
    <section
      id="medium-blogs"
      className="w-full py-24 px-4 flex justify-center items-center relative bg-[var(--background)]"
    >
      <motion.div
        className="section-card w-full max-w-3xl mx-auto backdrop-blur-lg bg-white/10 rounded-2xl shadow-2xl p-10 border border-white/20"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold mb-4 text-center font-['JetBrains_Mono',monospace] text-[var(--foreground)]">Medium Blogs</h2>
        <div className="space-y-8">
          {blogs.length === 0 ? (
            <div className="text-center" style={{ color: "var(--foreground)", opacity: 0.7 }}>No blogs data available.</div>
          ) : (
            blogs.map((blog, idx) => (
              <motion.div
                key={blog.title}
                className="bg-white/10 rounded-lg shadow p-6 border border-white/10"
                initial={{ opacity: 0, x: idx % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                style={{ color: "var(--foreground)" }}
              >
                {blog.image && blog.image.startsWith("/images/") ? (
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-40 object-cover rounded-lg mb-3 border border-white/20 blog-image"
                    style={{ background: "#222", objectFit: "cover" }}
                  />
                ) : null}
                <a href={blog.url} target="_blank" rel="noopener noreferrer" className="text-xl font-semibold hover:underline" style={{ color: "var(--foreground)" }}>
                  {blog.title}
                </a>
                {blog.date && <p className="text-sm" style={{ color: "var(--foreground)", opacity: 0.7 }}>{blog.date}</p>}
                {blog.summary && <p className="mt-2" style={{ color: "var(--foreground)", opacity: 0.9 }}>{blog.summary}</p>}
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </section>
  );
};

export default MediumBlogsSection;
