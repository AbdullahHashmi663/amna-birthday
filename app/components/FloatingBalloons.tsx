"use client";

import { useEffect, useState, useCallback } from "react";
import confetti from "canvas-confetti";
import { playPop } from "../utils/sound";

interface BalloonItem {
  id: number;
  left: number; // 0 to 95 %
  color1: string;
  color2: string;
  size: number;
  speed: number;
  swayDuration: number;
  delay: number;
}

const BALLOON_PALETTES = [
  ["#ff7b9c", "#ff4b72"], // vibrant pink
  ["#ffd166", "#f4a261"], // warm golden peach
  ["#b892ff", "#8e5af7"], // lavender purple
  ["#ff9ebb", "#ff6b93"], // rose
  ["#a0e7e5", "#5cd0cc"], // soft aqua
  ["#ffd8a8", "#f783ac"], // sunset coral
];

export default function FloatingBalloons() {
  const [balloons, setBalloons] = useState<BalloonItem[]>([]);

  const spawnBalloon = useCallback((id: number, customDelay = 0): BalloonItem => {
    const palette = BALLOON_PALETTES[Math.floor(Math.random() * BALLOON_PALETTES.length)];
    return {
      id,
      left: Math.random() * 88 + 5,
      color1: palette[0],
      color2: palette[1],
      size: Math.random() * 20 + 55, // 55px to 75px
      speed: Math.random() * 8 + 14, // 14s to 22s float time
      swayDuration: Math.random() * 2 + 3, // 3s to 5s sway
      delay: customDelay,
    };
  }, []);

  useEffect(() => {
    // Initial batch of balloons
    const initialList: BalloonItem[] = [];
    for (let i = 0; i < 7; i++) {
      initialList.push(spawnBalloon(Date.now() + i, i * 2.2));
    }
    setBalloons(initialList);

    // Periodically release fresh balloons
    const interval = setInterval(() => {
      setBalloons((prev) => {
        if (prev.length < 9) {
          return [...prev, spawnBalloon(Date.now(), 0)];
        }
        return prev;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [spawnBalloon]);

  const handlePop = (id: number, e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    playPop();

    // Trigger localized confetti burst
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 28,
      spread: 60,
      startVelocity: 25,
      origin: { x, y },
      colors: ["#ff7b9c", "#ffd166", "#b892ff", "#ffffff", "#ff819e"],
    });

    // Remove balloon and respawn one after a short delay
    setBalloons((prev) => prev.filter((b) => b.id !== id));
    setTimeout(() => {
      setBalloons((prev) => [...prev, spawnBalloon(Date.now(), 0)]);
    }, 1200);
  };

  return (
    <div className="balloonContainer" aria-hidden="true">
      {balloons.map((b) => (
        <div
          key={b.id}
          className="balloonWrapper"
          style={{
            left: `${b.left}%`,
            animationDuration: `${b.speed}s`,
            animationDelay: `${b.delay}s`,
          }}
          onClick={(e) => handlePop(b.id, e)}
          title="Click to pop!"
        >
          <div
            className="balloonBody"
            style={{
              width: `${b.size}px`,
              height: `${b.size * 1.25}px`,
              background: `radial-gradient(circle at 35% 28%, ${b.color1} 0%, ${b.color2} 85%)`,
              animationDuration: `${b.swayDuration}s`,
            }}
          >
            <div className="balloonShine" />
            <div className="balloonKnot" style={{ background: b.color2 }} />
            <div className="balloonString" />
          </div>
        </div>
      ))}
    </div>
  );
}
