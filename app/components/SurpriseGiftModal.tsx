"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import { playChime, playPop } from "../utils/sound";

interface SurpriseGiftModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SurpriseGiftModal({ isOpen, onClose }: SurpriseGiftModalProps) {
  const [unwrapped, setUnwrapped] = useState(false);

  if (!isOpen) return null;

  const handleUnwrap = () => {
    if (unwrapped) return;
    playPop();
    setUnwrapped(true);

    setTimeout(() => {
      playChime();
      confetti({
        particleCount: 70,
        spread: 90,
        origin: { y: 0.5 },
        colors: ["#ffd700", "#ff69b4", "#ffb6c1", "#9370db", "#ffffff"],
      });
    }, 300);
  };

  return (
    <div className="modalBackdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="giftModalBox" onClick={(e) => e.stopPropagation()}>
        <button className="modalCloseBtn" onClick={onClose} aria-label="Close modal">
          ✕
        </button>

        {!unwrapped ? (
          <div className="giftBoxStage" onClick={handleUnwrap}>
            <div className="interactiveGift3D">
              <div className="giftBoxLid">
                <div className="giftBow">
                  <span className="bowLeft" />
                  <span className="bowRight" />
                </div>
              </div>
              <div className="giftBoxBase">
                <div className="ribbonVertical" />
                <div className="ribbonHorizontal" />
              </div>
            </div>
            <p className="unwrapPrompt">
              <span className="pulseSparkle">🎁</span> Tap the box to unwrap your surprise! <span className="pulseSparkle">✨</span>
            </p>
          </div>
        ) : (
          <div className="giftRewardCard animatePopIn">
            <div className="certificateHeader">
              <span className="crownIcon">👑</span>
              <span className="certificateTag">HONORARY BIRTHDAY CITATION</span>
            </div>

            <h3 className="certificateTitle">The Golden Soul Award</h3>

            <div className="awardeeWrap">
              <span className="awardeeLabel">Proudly presented to</span>
              <h2 className="awardeeName">Amna</h2>
            </div>

            <div className="citationBody">
              <p>
                In recognition of your exceptional warmth, your gentle strength,
                and your rare ability to bring peace and sunshine to everyone around you.
              </p>
              <div className="traitsList">
                <span className="traitPill">🌷 Pure Kindness</span>
                <span className="traitPill">✨ Infinite Grace</span>
                <span className="traitPill">🤍 Deep Empathy</span>
                <span className="traitPill">🌟 Priceless Smile</span>
              </div>
            </div>

            <div className="certificateFooter">
              <div className="goldStamp">
                <div className="stampText">CERTIFIED · 100% · PRECIOUS</div>
              </div>
              <p className="blessingNote">“May your year ahead be as golden as your spirit.”</p>
            </div>

            <button className="claimGiftBtn" onClick={onClose}>
              Claim & Cherish Forever 💖
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
