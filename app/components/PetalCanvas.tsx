"use client";

import { useEffect, useRef } from "react";

interface Petal {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  angle: number;
  angleSpeed: number;
  color: string;
  opacity: number;
  flip: number;
  flipSpeed: number;
}

const PETAL_COLORS = [
  "rgba(255, 182, 193, 0.75)",
  "rgba(255, 192, 203, 0.7)",
  "rgba(255, 218, 224, 0.8)",
  "rgba(255, 240, 245, 0.65)",
  "rgba(244, 185, 200, 0.75)",
];

export default function PetalCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let petals: Petal[] = [];
    const count = 35;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < count; i++) {
      petals.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 8 + 6,
        vx: Math.random() * 1 - 0.5,
        vy: Math.random() * 1.2 + 0.8,
        angle: Math.random() * Math.PI * 2,
        angleSpeed: (Math.random() - 0.5) * 0.02,
        color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
        opacity: Math.random() * 0.5 + 0.4,
        flip: Math.random() * Math.PI,
        flipSpeed: Math.random() * 0.03 + 0.01,
      });
    }

    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.scale(Math.cos(p.flip), 1);
      ctx.fillStyle = p.color;

      ctx.beginPath();
      // Draw petal leaf shape
      ctx.moveTo(0, -p.r);
      ctx.bezierCurveTo(p.r * 0.8, -p.r * 0.5, p.r * 0.8, p.r * 0.5, 0, p.r);
      ctx.bezierCurveTo(-p.r * 0.8, p.r * 0.5, -p.r * 0.8, -p.r * 0.5, 0, -p.r);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];
        p.x += p.vx + Math.sin(p.angle) * 0.5;
        p.y += p.vy;
        p.angle += p.angleSpeed;
        p.flip += p.flipSpeed;

        if (p.y > canvas.height + 20) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }
        if (p.x > canvas.width + 20) p.x = -20;
        if (p.x < -20) p.x = canvas.width + 20;

        drawPetal(p);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
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
        zIndex: 5,
        opacity: 0.85,
      }}
    />
  );
}
