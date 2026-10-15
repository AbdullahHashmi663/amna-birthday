"use client";

import { useState } from "react";
import { playPrayerBell } from "../utils/sound";

interface PrayerCardProps {
  icon: string;
  title: string;
  copy: string;
  index: number;
}

interface FloatingHeart {
  id: number;
  char: string;
  left: number;
}

const FLOAT_CHARS = ["🤍", "🤲", "✨", "🌸", "⭐"];

export default function PrayerCard({ icon, title, copy, index }: PrayerCardProps) {
  const [ameenCount, setAmeenCount] = useState(0);
  const [floatingParticles, setFloatingParticles] = useState<FloatingHeart[]>([]);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleSayAmeen = () => {
    playPrayerBell();
    setAmeenCount((prev) => prev + 1);

    const newParticle: FloatingHeart = {
      id: Date.now() + Math.random(),
      char: FLOAT_CHARS[Math.floor(Math.random() * FLOAT_CHARS.length)],
      left: Math.random() * 60 + 20, // percentage within card
    };

    setFloatingParticles((prev) => [...prev, newParticle]);

    setTimeout(() => {
      setFloatingParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
    }, 1800);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 10, y: -y * 10 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <article
      className="prayer prayerEnhanced"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(800px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
        animationDelay: `${index * 0.12}s`,
      }}
    >
      <div className="cardGlowAura" />
      <span className="icon bounceOnHover">{icon}</span>
      <h3>{title}</h3>
      <p>{copy}</p>

      <div className="prayerActionRow">
        <button
          className="ameenBtn"
          onClick={handleSayAmeen}
          aria-label={`Say Ameen for ${title}`}
        >
          <span className="ameenHands">🤲</span>
          <span>Ameen</span>
          {ameenCount > 0 && <span className="ameenCounterBadge">+{ameenCount}</span>}
        </button>

        {floatingParticles.map((p) => (
          <span
            key={p.id}
            className="floatingParticle"
            style={{ left: `${p.left}%` }}
          >
            {p.char}
          </span>
        ))}
      </div>
    </article>
  );
}
