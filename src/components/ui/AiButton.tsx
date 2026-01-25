import React from "react";

const AiButton: React.FC = () => {
  return (
    <button
      className="w-10 h-10 p-2 flex items-center justify-center rounded-full shadow-lg bg-gradient-to-br from-[#fbbf24] to-[#f472b6] text-white transition-all duration-300 hover:scale-105 active:scale-95"
      style={{ minWidth: 40, minHeight: 40 }}
      aria-label="AI Integration (coming soon)"
      disabled
    >
      {/* Placeholder for future AI icon or content */}
    </button>
  );
};

export default AiButton;
