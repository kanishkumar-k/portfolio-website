"use client";

import React from "react";

/**
 * AbstractModalBg renders an animated SVG blob background for use in modals.
 * Replace this with a three.js canvas for richer effects if desired.
 */
const AbstractModalBg: React.FC<{ dark?: boolean }> = ({ dark }) => (
  <div className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      style={{ position: "absolute", top: 0, left: 0 }}
    >
      <defs>
        <radialGradient id="modal-bg-grad" cx="50%" cy="50%" r="80%">
          <stop offset="0%" stopColor={dark ? "#ec4899" : "#fbbf24"} stopOpacity="0.25" />
          <stop offset="100%" stopColor={dark ? "#23272f" : "#fffde4"} stopOpacity="0.9" />
        </radialGradient>
        <filter id="blur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="30" />
        </filter>
      </defs>
      <g filter="url(#blur)">
        <ellipse
          cx="200"
          cy="200"
          rx="160"
          ry="120"
          fill="url(#modal-bg-grad)"
        >
          <animate
            attributeName="rx"
            values="160;180;160"
            dur="4s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="ry"
            values="120;140;120"
            dur="4s"
            repeatCount="indefinite"
          />
        </ellipse>
        <ellipse
          cx="120"
          cy="300"
          rx="60"
          ry="40"
          fill={dark ? "#ec4899" : "#fbbf24"}
          opacity="0.18"
        >
          <animate
            attributeName="cx"
            values="120;180;120"
            dur="6s"
            repeatCount="indefinite"
          />
        </ellipse>
        <ellipse
          cx="320"
          cy="100"
          rx="50"
          ry="30"
          fill={dark ? "#fbbf24" : "#ec4899"}
          opacity="0.13"
        >
          <animate
            attributeName="cy"
            values="100;160;100"
            dur="5s"
            repeatCount="indefinite"
          />
        </ellipse>
      </g>
    </svg>
  </div>
);

export default AbstractModalBg;
