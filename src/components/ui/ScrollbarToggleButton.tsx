"use client";
import React, { useState, useEffect } from "react";


const ScrollbarToggleButton: React.FC = () => {
  const [scrollbarVisible, setScrollbarVisible] = useState(true);

  useEffect(() => {
    document.body.style.overflow = scrollbarVisible ? "auto" : "hidden";
    document.documentElement.style.overflow = scrollbarVisible ? "auto" : "hidden";
    return () => {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
    };
  }, [scrollbarVisible]);

  return ( null

  );
};

export default ScrollbarToggleButton;
