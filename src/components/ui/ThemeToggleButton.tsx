"use client";
import React from "react";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className="fixed bottom-4 left-4 z-50 bg-[#23272f]/80 rounded-full shadow-lg p-3 flex items-center justify-center transition-all border border-[#b3c0f7] hover:bg-[#b3c0f7]/20 focus:outline-none focus:ring-2 focus:ring-white"
      onClick={toggleTheme}
      tabIndex={0}
      style={{ width: 56, height: 56, cursor: "pointer" }}
    >
      {theme === "light" ? (
        // Owl SVG (light mode)
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{ opacity: 0.7 }}>
          <ellipse cx="16" cy="20" rx="10" ry="8" fill="#23272f" stroke="#b3c0f7" strokeWidth="2"/>
          <ellipse cx="12" cy="19" rx="2.5" ry="3" fill="#fff"/>
          <ellipse cx="20" cy="19" rx="2.5" ry="3" fill="#fff"/>
          <ellipse cx="12" cy="19" rx="1" ry="1.2" fill="#23272f"/>
          <ellipse cx="20" cy="19" rx="1" ry="1.2" fill="#23272f"/>
          <ellipse cx="16" cy="23" rx="1.2" ry="0.7" fill="#fbbf24"/>
          <path d="M16 21.5 Q15.5 22.5 16 23 Q16.5 22.5 16 21.5Z" fill="#fbbf24"/>
          <path d="M8 14 Q10 10 16 10 Q22 10 24 14" stroke="#b3c0f7" strokeWidth="2" fill="none"/>
          <ellipse cx="8" cy="14" rx="1.2" ry="0.7" fill="#b3c0f7"/>
          <ellipse cx="24" cy="14" rx="1.2" ry="0.7" fill="#b3c0f7"/>
        </svg>
      ) : (
        // Sun SVG (dark mode) with splash effect
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="8" fill="#fbbf24" stroke="#f59e42" strokeWidth="2"/>
          <g>
            <rect x="15" y="2" width="2" height="6" rx="1" fill="#fbbf24">
              <animate attributeName="y" values="2;0;2" dur="0.7s" repeatCount="indefinite"/>
            </rect>
            <rect x="15" y="24" width="2" height="6" rx="1" fill="#fbbf24">
              <animate attributeName="y" values="24;26;24" dur="0.7s" repeatCount="indefinite"/>
            </rect>
            <rect x="2" y="15" width="6" height="2" rx="1" fill="#fbbf24">
              <animate attributeName="x" values="2;0;2" dur="0.7s" repeatCount="indefinite"/>
            </rect>
            <rect x="24" y="15" width="6" height="2" rx="1" fill="#fbbf24">
              <animate attributeName="x" values="24;26;24" dur="0.7s" repeatCount="indefinite"/>
            </rect>
            <rect x="6" y="6" width="2" height="6" rx="1" fill="#fbbf24" transform="rotate(-45 7 9)">
              <animate attributeName="x" values="6;4;6" dur="0.7s" repeatCount="indefinite"/>
            </rect>
            <rect x="24" y="6" width="2" height="6" rx="1" fill="#fbbf24" transform="rotate(45 25 9)">
              <animate attributeName="x" values="24;26;24" dur="0.7s" repeatCount="indefinite"/>
            </rect>
          </g>
          {/* Splash effect */}
          <ellipse cx="16" cy="28" rx="7" ry="2.5" fill="#fbbf24" opacity="0.3">
            <animate attributeName="rx" values="7;12;7" dur="1.2s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.3;0.7;0.3" dur="1.2s" repeatCount="indefinite"/>
          </ellipse>
        </svg>
      )}
    </button>
  );
}
