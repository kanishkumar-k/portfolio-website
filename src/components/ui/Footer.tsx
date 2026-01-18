"use client";
import React from "react";
import { useTheme } from "./ThemeProvider";

const currentYear = new Date().getFullYear();

export default function Footer() {
  const { theme } = useTheme();
  return (
    <footer
      className={`w-full py-6 mt-8 flex flex-col items-center border-t border-[#e5e7eb] transition-colors ${
        theme === "dark" ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <div className="text-sm text-center" style={{ color: "var(--foreground)" }}>
        &copy; {currentYear} Kanishkumar. All rights reserved.
      </div>
    </footer>
  );
}
