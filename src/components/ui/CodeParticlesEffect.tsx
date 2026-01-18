"use client";
import React, { useRef, useEffect } from "react";

/**
 * Animated code keywords/particles effect for background.
 * - Flows horizontally like snow.
 * - No extreme rotation.
 * - More transparent.
 * - Fills the top and entire screen.
 */
const KEYWORDS = [
  "def", "class", "import", "lambda", "async", "await", "print", "return", "if", "else", "elif", "for", "while", "try", "except", "with", "as", "from", "pass", "raise", "yield"
];

const COLORS = [
  "#e5e7eb", "#b3c0f7", "#facc15", "#38bdf8", "#a5b4fc", "#f472b6"
];

const FONT_SIZES = [18, 22, 26, 30];

const CodeParticlesEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<any[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Generate particles, evenly distributed vertically
    const particles = Array.from({ length: 22 }).map((_, i) => ({
      x: Math.random() * width,
      y: (i / 22) * height + Math.random() * (height / 22),
      dx: (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 0.4 + 0.2),
      keyword: KEYWORDS[Math.floor(Math.random() * KEYWORDS.length)],
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      fontSize: FONT_SIZES[Math.floor(Math.random() * FONT_SIZES.length)],
      opacity: Math.random() * 0.25 + 0.18,
      angle: (Math.random() - 0.5) * 10, // Only slight angle
    }));
    particlesRef.current = particles;

    function draw() {
      ctx!.clearRect(0, 0, width, height);
      for (const p of particlesRef.current) {
        ctx!.save();
        ctx!.globalAlpha = p.opacity;
        ctx!.font = `bold ${p.fontSize}px 'JetBrains Mono', 'Fira Code', monospace`;
        ctx!.fillStyle = p.color;
        ctx!.translate(p.x, p.y);
        ctx!.rotate((p.angle * Math.PI) / 180);
        ctx!.shadowColor = p.color;
        ctx!.shadowBlur = 8;
        ctx!.fillText(p.keyword, 0, 0);
        ctx!.restore();
      }
      update();
    }

    function update() {
      for (const p of particlesRef.current) {
        p.x += p.dx;
        if (p.dx > 0 && p.x > width + 100) p.x = -50;
        if (p.dx < 0 && p.x < -100) p.x = width + 50;
      }
    }

    let animationId: number;
    function animate() {
      draw();
      animationId = requestAnimationFrame(animate);
    }

    animate();

    function handleResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = width;
      canvas!.height = height;
    }
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-0 pointer-events-none"
      style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh" }}
    />
  );
};

export default CodeParticlesEffect;
