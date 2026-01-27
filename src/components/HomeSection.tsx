"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CodeParticlesEffect from "./ui/CodeParticlesEffect";
import SnowEffect from "./ui/SnowEffect";
import { useTheme } from "./ui/ThemeProvider";
import { FaTimes } from "react-icons/fa";

type HomeData = {
  greeting?: string;
  name?: string;
  intro?: string;
};

const HomeSection: React.FC = () => {
  const { theme } = useTheme();

  const [home, setHome] = useState<HomeData>({});
  const [mounted, setMounted] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch home data
  useEffect(() => {
    const fetchHome = async () => {
      try {
        const res = await fetch("/api/home");
        if (res.ok) {
          setHome(await res.json());
        }
      } catch {}
    };
    fetchHome();
  }, []);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleResumeDownload = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/kanishkumar-resume.pdf");
      if (!res.ok) throw new Error("Failed to fetch resume");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "kanishkumar-resume.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden"
      style={{ background: "var(--background)" }}
    >
      {/* 🔽 VISUAL EFFECTS (NON-INTERACTIVE) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <CodeParticlesEffect />
        {mounted && (
          <SnowEffect color={theme === "dark" ? "#ec4899" : "#fbbf24"} />
        )}
      </div>

      {/* Radial glow */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 blur-[40px] rounded-full"
          style={{
            width: 600,
            height: 400,
            background:
              "radial-gradient(circle, rgba(255,255,255,0.18) 0%, rgba(80,120,200,0.08) 60%, rgba(16,22,36,0.01) 100%)",
          }}
        />
      </div>

      {/* 🔼 MAIN CONTENT */}
      <motion.div
        className="relative z-10 flex flex-col items-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.h1
          className="text-2xl xs:text-3xl sm:text-4xl mb-4 text-center tracking-widest font-extralight drop-shadow-md px-2"
          style={{
            color: "var(--foreground)",
            fontFamily: "'JetBrains Mono', 'Inter', monospace",
            textShadow: "0 2px 8px rgba(0,0,0,0.10)"
          }}
        >
          {home.greeting}
          <br />
          <span className="text-3xl xs:text-4xl sm:text-5xl font-semibold drop-shadow-md">
            {home.name}
          </span>
        </motion.h1>

        <motion.p
          className="text-base xs:text-lg sm:text-xl mb-8 text-center sm:text-justify max-w-full sm:max-w-xl px-2 drop-shadow"
          style={{
            color: "var(--foreground)",
            fontFamily: "'Inter', 'JetBrains Mono', monospace",
            textShadow: "0 2px 8px rgba(0,0,0,0.10)"
          }}
        >
          {home.intro}
        </motion.p>

        {/* Download Resume Button */}
        <motion.button
          onClick={handleResumeDownload}
          disabled={loading}
          className={`
            cursor-pointer
            px-8 py-3 rounded-full shadow-xl font-semibold
            transition-all duration-300
            ${loading ? "cursor-wait bg-gray-400" : "bg-white"}
            ${theme === "dark" ? "text-black border-2 border-pink-500" : "text-[#101624] border-2 border-yellow-400"}
            relative flex items-center justify-center w-[260px] min-w-[200px]
          `}
          style={{
            fontFamily: "'Inter', 'JetBrains Mono', monospace",
            letterSpacing: "0.05em",
          }}
        >
          <span
            className="absolute left-6 flex items-center justify-center"
            style={{ minWidth: 24, minHeight: 20, display: "inline-flex" }}
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin" />
            ) : (
              <span style={{ width: 20, height: 20, display: "inline-block" }} />
            )}
          </span>
          <span className="w-full text-center block">VIEW MY RESUME</span>
        </motion.button>
      </motion.div>

      {/* ✅ Success Snackbar */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            role="alert"
            aria-live="polite"
            className="
              fixed bottom-6 left-1/2 -translate-x-1/2 z-50
              bg-green-600 text-white px-4 py-3 rounded-lg shadow-xl
              font-medium flex items-center gap-4
            "
          >
            <span>Resume downloaded successfully!</span>
            <button
              aria-label="Dismiss notification"
              onClick={() => setShowSuccess(false)}
              className="cursor-pointer ml-auto p-1 rounded hover:bg-white/20 transition focus:outline-none focus:ring-2 focus:ring-white"
            >
              <FaTimes size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ❌ Error Snackbar */}
      <AnimatePresence>
        {showError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            role="alert"
            aria-live="assertive"
            className="
              fixed bottom-6 left-1/2 -translate-x-1/2 z-50
              bg-red-600 text-white px-4 py-3 rounded-lg shadow-xl
              font-medium flex items-center gap-4
            "
          >
            <span>Resume unavailable</span>
            <button
              aria-label="Dismiss notification"
              onClick={() => setShowError(false)}
              className="cursor-pointer ml-auto p-1 rounded hover:bg-white/20 transition focus:outline-none focus:ring-2 focus:ring-white"
            >
              <FaTimes size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default HomeSection;
