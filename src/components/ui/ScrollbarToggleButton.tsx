import React, { useState, useEffect } from "react";

/**
 * A floating button to toggle the visibility of the main scrollbar.
 * When closed, sets body overflow to hidden. When open, sets overflow to auto.
 */
const ScrollbarToggleButton: React.FC = () => {
  const [scrollbarVisible, setScrollbarVisible] = useState(true);

  useEffect(() => {
    document.body.style.overflow = scrollbarVisible ? "auto" : "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [scrollbarVisible]);

  return (
    <button
      onClick={() => setScrollbarVisible((v) => !v)}
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 1000,
        padding: "0.75em 1.5em",
        borderRadius: "999px",
        background: "#fff",
        color: "#222",
        border: "2px solid #b3c0f7",
        boxShadow: "0 2px 12px 0 rgba(0,0,0,0.10)",
        fontWeight: 600,
        cursor: "pointer",
        opacity: 0.85,
        transition: "background 0.2s, color 0.2s"
      }}
      aria-label={scrollbarVisible ? "Hide scrollbar" : "Show scrollbar"}
    >
      {scrollbarVisible ? "Hide Scrollbar" : "Show Scrollbar"}
    </button>
  );
};

export default ScrollbarToggleButton;
