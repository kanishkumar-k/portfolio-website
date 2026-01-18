"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CodeParticlesEffect from "./ui/CodeParticlesEffect";
import SnowEffect from "./ui/SnowEffect";
import { useTheme } from "./ui/ThemeProvider";

/**
 * Home section with blurred glassy background, radial glow, and glowing text.
 */
const HomeSection: React.FC = () => {
  const [home, setHome] = useState<{ greeting?: string; name?: string; intro?: string }>({});

  useEffect(() => {
    const fetchHome = async () => {
      try {
        const res = await fetch("/api/home");
        if (res.ok) {
          const data = await res.json();
          setHome(data);
        }
      } catch (error) {
        // Optionally handle error, e.g., log or set error state
      }
    };
    fetchHome();
  }, []);

  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <section
      id="home"
      className="relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden"
      style={{
        background: "var(--background)",
        transition: "background 0.3s"
      }}
    >
      {/* Effects always visible, colors adapt to theme */}
      <CodeParticlesEffect />
      {mounted && <SnowEffect color={theme === "light" ? "#ec4899" : "#fff"} />}
      {/* Radial Glow Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "40%",
            transform: "translate(-50%, -50%)",
            width: "600px",
            height: "400px",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.18) 0%, rgba(80,120,200,0.08) 60%, rgba(16,22,36,0.01) 100%)",
            filter: "blur(40px)",
            borderRadius: "50%",
          }}
        />
      </div>
      <motion.div
        className="relative z-10 flex flex-col items-center w-full"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="w-full max-w-2xl mx-auto px-4 flex flex-col items-center">
          <motion.h1
            className="text-1xl sm:text-4xl font-extrabold mb-4 text-center tracking-widest"
            style={{
              color: "var(--foreground)",
              letterSpacing: "0.05em",
              fontWeight: 200,
              fontFamily: "'JetBrains Mono', 'Inter', monospace",
              opacity: 0.95,
            }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <br />
            <br />
            {home?.greeting || ""}
            <br />
            <span className="text-1xl sm:text-5xl" style={{ color: "var(--foreground)" }}>{home?.name || ""}</span>
            <br />
          </motion.h1>
          <motion.p
            className="text-lg sm:text-xl mb-8 text-center max-w-xl"
            style={{
              color: "var(--foreground)",
              fontWeight: 400,
              fontFamily: "'Inter', 'JetBrains Mono', monospace",
              opacity: 0.9,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            {home?.intro || ""}
          </motion.p>
          <motion.a
            href="/kanishkumar-resume.pdf"
            target="_blank"
            className={`px-8 py-3 bg-white/90 text-[#101624] font-bold rounded-full shadow-xl hover:bg-white transition-colors duration-300 ${
              theme === "light" ? "border-2 border-pink-400" : ""
            }`}
            style={{
              fontWeight: 600,
              fontFamily: "'Inter', 'JetBrains Mono', monospace",
              fontSize: "1.1rem",
              letterSpacing: "0.05em",
              boxShadow: "0 4px 32px 0 rgba(255,255,255,0.12)",
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            VIEW MY RESUME
          </motion.a>
        </div>
      </motion.div>
    </section>
  );
};

export default HomeSection;
