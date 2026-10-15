"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { musicBox } from "../utils/sound";

interface FloatingDockProps {
  onOpenLetter: () => void;
  onOpenGift: () => void;
}

export default function FloatingDock({ onOpenLetter, onOpenGift }: FloatingDockProps) {
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMusic = () => {
    const active = musicBox.toggle();
    setIsPlayingMusic(active);
  };

  const triggerConfettiBlast = () => {
    const colors = ["#ff7b9c", "#ffd166", "#b892ff", "#ff819e", "#ffffff", "#48dbfb"];
    confetti({
      particleCount: 80,
      spread: 100,
      origin: { y: 0.8 },
      colors: colors,
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="floatingDock" role="toolbar" aria-label="Celebration controls">
      {/* Music Toggle */}
      <button
        className={`dockBtn ${isPlayingMusic ? "dockBtnActive" : ""}`}
        onClick={toggleMusic}
        title={isPlayingMusic ? "Pause Birthday Tune" : "Play Birthday Tune (Music Box)"}
        aria-label="Toggle Birthday Music"
      >
        <span className="dockIcon">🎵</span>
        <span className="dockText">{isPlayingMusic ? "Tune On" : "Play Tune"}</span>
        {isPlayingMusic && (
          <span className="soundBars">
            <i />
            <i />
            <i />
          </span>
        )}
      </button>

      {/* Confetti Blast */}
      <button
        className="dockBtn"
        onClick={triggerConfettiBlast}
        title="Shoot Confetti!"
        aria-label="Launch Confetti Blast"
      >
        <span className="dockIcon">🎉</span>
        <span className="dockText">Confetti</span>
      </button>

      {/* Open Letter */}
      <button
        className="dockBtn"
        onClick={onOpenLetter}
        title="Open Heartfelt Birthday Letter"
        aria-label="Open Birthday Letter"
      >
        <span className="dockIcon">💌</span>
        <span className="dockText">Letter</span>
      </button>

      {/* Surprise Gift */}
      <button
        className="dockBtn"
        onClick={onOpenGift}
        title="Unwrap Birthday Gift"
        aria-label="Open Birthday Gift"
      >
        <span className="dockIcon">🎁</span>
        <span className="dockText">Gift</span>
      </button>

      {/* Back to top */}
      {showBackToTop && (
        <button
          className="dockBtn dockBtnTop"
          onClick={scrollToTop}
          title="Scroll to Top"
          aria-label="Scroll to top"
        >
          <span className="dockIcon">↑</span>
        </button>
      )}
    </div>
  );
}
