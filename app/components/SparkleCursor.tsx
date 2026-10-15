"use client";

import { useEffect, useRef } from "react";

interface Sparkle {
  x: number;
  y: number;
  size: number;
  color: string;
  vx: number;
  vy: number;
  alpha: number;
  decay: number;
  char: string;
}

const CHARS = ["✦", "✧", "⋆", "🌸", "✨", "🤍"];
const COLORS = ["#ffadc6", "#ffd88b", "#c5a8fa", "#ffffff", "#ff819e"];

export default function SparkleCursor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let sparkles: Sparkle[] = [];
    let mouse = { x: -100, y: -100 };
    let lastSpawn = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      let clientX = -100;
      let clientY = -100;
      if ("touches" in e) {
        if (!e.touches || e.touches.length === 0) return;
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      mouse = { x: clientX, y: clientY };

      const now = performance.now();
      if (now - lastSpawn > 35) {
        lastSpawn = now;
        for (let i = 0; i < 2; i++) {
          sparkles.push({
            x: mouse.x + (Math.random() * 16 - 8),
            y: mouse.y + (Math.random() * 16 - 8),
            size: Math.random() * 10 + 10,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            vx: (Math.random() - 0.5) * 1.5,
            vy: Math.random() * 1.5 + 0.5,
            alpha: 1,
            decay: Math.random() * 0.02 + 0.015,
            char: CHARS[Math.floor(Math.random() * CHARS.length)],
          });
        }
      }
    };

    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("touchmove", onPointerMove, { passive: true });

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = sparkles.length - 1; i >= 0; i--) {
        const s = sparkles[i];
        s.x += s.vx;
        s.y += s.vy;
        s.alpha -= s.decay;

        if (s.alpha <= 0) {
          sparkles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, s.alpha);
        ctx.fillStyle = s.color;
        ctx.font = `${s.size}px "DM Sans", serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 8;
        ctx.fillText(s.char, s.x, s.y);
        ctx.restore();
      }

      if (sparkles.length > 80) {
        sparkles.splice(0, sparkles.length - 80);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("touchmove", onPointerMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  );
}
