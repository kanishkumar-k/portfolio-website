"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";
import AbstractModalBg from "./AbstractModalBg";

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
      className={`fixed inset-0 z-[9999] flex items-center justify-center ${isDark ? "bg-black" : "bg-white"}`}
    >
      <div
        className={`relative max-w-xs w-[90vw] min-h-[60vh] rounded-2xl shadow-2xl px-4 py-8 flex flex-col items-center text-center sm:max-w-lg sm:mx-auto sm:px-6 sm:py-10 sm:min-h-[40vh] sm:rounded-2xl ${
          isDark ? "bg-black" : "bg-white"
        }`}
        style={{
          boxShadow: "0 2px 32px 8px rgba(0,0,0,0.10)"
        }}
      >
        {/* Abstract animated SVG background (replace with three.js if desired) */}
        {/** @ts-ignore */}
        <AbstractModalBg dark={isDark} />
        {/* Filler animation top */}
        <div className="w-full flex-1 flex items-end justify-center">
          <div
            className="w-2/3 h-8 animate-gradient-x rounded-full blur-lg opacity-60"
            style={{
              background: isDark
                ? "linear-gradient(90deg, #ec4899, #fbbf24, #38bdf8, #ec4899)"
                : "linear-gradient(90deg, #fbbf24, #fbbf24, #38bdf8, #fbbf24)",
              backgroundSize: "200% 100%",
              animation: "gradient-x 2s linear infinite",
            }}
          />
        </div>
        {/* Animated Welcome Text */}
        <div className="flex-1 flex flex-col justify-center">
          <p className={`text-xl sm:text-3xl animate-fade-in-up mb-4 ${isDark ? "text-pink-300" : "text-blue-700"}`}>
            Welcome to my portfolio
          </p>
          {/* 3D Spinning Cube Loader */}
          <div className="flex justify-center items-center my-4">
            <div className="cube-loader">
              <div className="cube-face cube-face-front"></div>
              <div className="cube-face cube-face-back"></div>
              <div className="cube-face cube-face-right"></div>
              <div className="cube-face cube-face-left"></div>
              <div className="cube-face cube-face-top"></div>
              <div className="cube-face cube-face-bottom"></div>
            </div>
          </div>
        </div>
        {/* Filler animation bottom */}
        <div className="w-full flex-1 flex items-start justify-center">
          <div
            className="w-2/3 h-8 animate-gradient-x rounded-full blur-lg opacity-60"
            style={{
              background: isDark
                ? "linear-gradient(90deg, #ec4899, #fbbf24, #38bdf8, #ec4899)"
                : "linear-gradient(90deg, #fbbf24, #fbbf24, #38bdf8, #fbbf24)",
              backgroundSize: "200% 100%",
              animation: "gradient-x 2s linear infinite",
            }}
          />
        </div>
        {/* Loader and animation styles */}
        <style>
          {`
            @keyframes gradient-x {
              0% { background-position: 0% 50%; }
              100% { background-position: 100% 50%; }
            }
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
              background: linear-gradient(135deg, #fbbf24 40%, #fbbf24 100%);
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
            .cube-loader {
              width: 32px;
              height: 32px;
              position: relative;
              transform-style: preserve-3d;
              animation: cube-spin 1.2s infinite linear;
              margin: 0 auto;
            }
            .cube-face {
              position: absolute;
              width: 32px;
              height: 32px;
              background: ${isDark ? "#ec4899" : "#fbbf24"};
              opacity: 0.95;
              border-radius: 6px;
              box-shadow: 0 2px 8px 0 rgba(0,0,0,0.10);
            }
            .cube-face-front  { transform: rotateY(0deg) translateZ(16px);}
            .cube-face-back   { transform: rotateY(180deg) translateZ(16px);}
            .cube-face-right  { transform: rotateY(90deg) translateZ(16px);}
            .cube-face-left   { transform: rotateY(-90deg) translateZ(16px);}
            .cube-face-top    { transform: rotateX(90deg) translateZ(16px);}
            .cube-face-bottom { transform: rotateX(-90deg) translateZ(16px);}
            @keyframes cube-spin {
              0% { transform: rotateX(0deg) rotateY(0deg);}
              100% { transform: rotateX(360deg) rotateY(360deg);}
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default WelcomeModal;
