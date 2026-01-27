"use client";

import React from "react";
import { useTheme } from "./ThemeProvider";

/**
 * MobileThemeSwitch renders a two-ended toggle button for theme switching.
 * Left: sun (light), Right: moon (dark). Shows current theme with highlight.
 */
const MobileThemeSwitch: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center">
      <button
        aria-label="Switch to light mode"
        className={`flex items-center justify-center w-9 h-9 rounded-l-full border border-gray-300 dark:border-gray-700
          ${theme === "light"
            ? "bg-yellow-400 text-black border-yellow-400 shadow-[0_0_0_2px_#fbbf24,0_0_8px_2px_#fbbf24]"
            : "bg-white dark:bg-[#23272f] text-yellow-500"}
          transition-colors duration-200`}
        onClick={() => theme !== "light" && toggleTheme()}
        type="button"
      >
        {/* Sun icon */}
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="5" fill="currentColor" />
          <g stroke="currentColor" strokeLinecap="round">
            <line x1="12" y1="2" x2="12" y2="4" />
            <line x1="12" y1="20" x2="12" y2="22" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="2" y1="12" x2="4" y2="12" />
            <line x1="20" y1="12" x2="22" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </g>
        </svg>
      </button>
      <button
        aria-label="Switch to dark mode"
        className={`flex items-center justify-center w-9 h-9 rounded-r-full border-t border-b border-r border-gray-300 dark:border-gray-700
          ${theme === "dark"
            ? "bg-black text-white border-pink-500 shadow-[0_0_0_2px_#ec4899,0_0_8px_2px_#ec4899]"
            : "bg-white dark:bg-[#23272f] text-gray-500"}
          transition-colors duration-200`}
        onClick={() => theme !== "dark" && toggleTheme()}
        type="button"
      >
        {/* Moon icon */}
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path
            d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"
            fill="currentColor"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};

export default MobileThemeSwitch;
