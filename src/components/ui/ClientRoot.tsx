"use client";
import React from "react";
import Navbar from "./Navbar";
import { useUiPanel } from "./UiPanelContext";

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  const { openPanel } = useUiPanel();
  // Only shift on desktop and when email panel is open
  return (
    <>
      <Navbar />
      {/* Background/effects (if any) should be rendered here, outside the margin wrapper */}
      {/* Only shift the main content */}
      <div style={{ position: "relative" }}>
        <div
          className={
            openPanel === "email"
              ? "transition-all duration-300 ease-out md:mr-[380px]"
              : "transition-all duration-300 ease-out"
          }
        >
          {children}
        </div>
      </div>
    </>
  );
}
