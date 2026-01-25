"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";

const WelcomeModal: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setVisible(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (!mounted || !visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center ${isDark ? "bg-black/80" : "bg-white/80"}`}
      style={{ backdropFilter: "blur(4px)" }}
    >
      <div
        className={`relative w-full max-w-lg mx-auto px-6 py-10 rounded-2xl border-4 border-pink-400 shadow-2xl flex flex-col items-center ${
          isDark ? "bg-black/70" : "bg-white"
        }`}
        style={{
          boxShadow: "0 0 0 4px #fff, 0 0 32px 8px #ec4899",
          borderImage: "linear-gradient(90deg, #ec4899, #fbbf24, #ec4899) 1",
        }}
      >
        {/* Animated Welcome Text */}
        <h1 className={`text-3xl sm:text-5xl font-bold animate-pulse mb-4 ${isDark ? "text-white" : "text-black"}`}>
          Hello there !
        </h1>
        <p className={`text-xl sm:text-3xl animate-fade-in-up mb-4 ${isDark ? "text-pink-300" : "text-blue-700"}`}>
          Welcome to my portfolio
        </p>
        {/* Loader (animated dots) */}
        <div className="mb-4 flex justify-center">
          <span className="loader-dots">
            <span className={`dot ${isDark ? "" : "dot-light"}`}></span>
            <span className={`dot ${isDark ? "" : "dot-light"}`}></span>
            <span className={`dot ${isDark ? "" : "dot-light"}`}></span>
          </span>
        </div>
        {/* Loader and animation styles */}
        <style>
          {`
            .loader-dots {
              display: flex;
              align-items: center;
              gap: 0.5rem;
              height: 24px;
            }
            .loader-dots .dot {
              width: 12px;
              height: 12px;
              border-radius: 50%;
              background: linear-gradient(135deg, #fbbf24 40%, #ec4899 100%);
              opacity: 0.7;
              animation: dot-bounce 1.2s infinite both;
            }
            .loader-dots .dot-light {
              background: linear-gradient(135deg, #38bdf8 40%, #fbbf24 100%);
              opacity: 0.8;
            }
            .loader-dots .dot:nth-child(2) {
              animation-delay: 0.2s;
            }
            .loader-dots .dot:nth-child(3) {
              animation-delay: 0.4s;
            }
            @keyframes dot-bounce {
              0%, 80%, 100% { transform: translateY(0);}
              40% { transform: translateY(-16px);}
            }
            @keyframes fade-in-up {
              0% { opacity: 0; transform: translateY(40px);}
              100% { opacity: 1; transform: translateY(0);}
            }
            .animate-fade-in-up {
              animation: fade-in-up 1s cubic-bezier(0.4,0,0.2,1) both;
            }
            @keyframes fade-in-up-quote {
              0% { opacity: 0; transform: translateY(40px);}
              100% { opacity: 1; transform: translateY(0);}
            }
            .animate-fade-in-up-quote {
              animation: fade-in-up-quote 1.5s 0.5s cubic-bezier(0.4,0,0.2,1) both;
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default WelcomeModal;
