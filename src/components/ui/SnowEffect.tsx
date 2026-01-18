"use client";
import React, { useRef, useEffect } from "react";

/**
 * Animated snow/particle effect for background.
 */
const SnowEffect: React.FC<{ color?: string }> = ({ color = "#ea86a4" }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    let snowflakes: { x: number; y: number; r: number; d: number }[] = [];
    const snowCount = Math.floor(width / 8);

    for (let i = 0; i < snowCount; i++) {
      snowflakes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2 + 1,
        d: Math.random() * 1 + 0.5,
      });
    }

    function draw() {
      ctx!.clearRect(0, 0, width, height);
      ctx!.save();
      ctx!.globalAlpha = 0.7;
      for (let i = 0; i < snowCount; i++) {
        const f = snowflakes[i];
        ctx!.beginPath();
        ctx!.arc(f.x, f.y, f.r, 0, Math.PI * 2, false);
        ctx!.fillStyle = color;
        ctx!.shadowColor = color;
        ctx!.shadowBlur = 8;
        ctx!.fill();
      }
      ctx!.restore();
      update();
    }

    function update() {
      for (let i = 0; i < snowCount; i++) {
        const f = snowflakes[i];
        f.y += f.d;
        if (f.y > height) {
          f.y = 0;
          f.x = Math.random() * width;
        }
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

export default SnowEffect;

