"use client";
import React, { useEffect, useState } from "react";

/**
 * Animated SVG wave separator for sections.
 * Props:
 *   color: string (hex or rgba)
 *   flip?: boolean (if true, flips the wave vertically)
 *   className?: string
 */
const SectionSeparator: React.FC<{ color?: string; flip?: boolean; className?: string }> = ({
  color = "#353942",
  flip = false,
  className = "",
}) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDark = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    checkDark();
    window.addEventListener("storage", checkDark);
    return () => window.removeEventListener("storage", checkDark);
  }, []);

  return (
    <div className={className} style={{ lineHeight: 0 }}>
      <svg
        width="100%"
        height="60"
        viewBox="0 0 1440 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          transform: flip ? "rotate(180deg)" : undefined,
          display: "block",
        }}
        preserveAspectRatio="none"
      >
        <path
          d="M0,30 Q360,60 720,30 T1440,30 V60 H0 Z"
          fill={isDark ? color : "#fff"}
          opacity="0.7"
        >
          <animate
            attributeName="d"
            dur="6s"
            repeatCount="indefinite"
            values="
            M0,30 Q360,60 720,30 T1440,30 V60 H0 Z;
            M0,30 Q360,0 720,30 T1440,30 V60 H0 Z;
            M0,30 Q360,60 720,30 T1440,30 V60 H0 Z
          "
          />
        </path>
      </svg>
    </div>
  );
};

export default SectionSeparator;
