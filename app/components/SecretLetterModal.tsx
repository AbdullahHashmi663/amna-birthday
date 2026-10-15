"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import { playChime } from "../utils/sound";

interface SecretLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SecretLetterModal({ isOpen, onClose }: SecretLetterModalProps) {
  const [opened, setOpened] = useState(false);

  if (!isOpen) return null;

  const handleOpenEnvelope = () => {
    if (opened) return;
    playChime();
    setOpened(true);

    confetti({
      particleCount: 35,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#ffd18a", "#ff9ebb", "#fff", "#c5a8fa"],
    });
  };

  return (
    <div className="modalBackdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="letterModalBox" onClick={(e) => e.stopPropagation()}>
        <button className="modalCloseBtn" onClick={onClose} aria-label="Close letter">
          ✕
        </button>

        {!opened ? (
          <div className="envelopeContainer" onClick={handleOpenEnvelope}>
            <div className="envelope">
              <div className="envelopeFlap" />
              <div className="envelopePocket" />
              <div className="waxSeal" title="Click to break seal & open!">
                <div className="waxInner">
                  <span>A</span>
                </div>
              </div>
              <div className="envelopeNotice">
                <span className="pulseText">✦ Tap the wax seal to open ✦</span>
              </div>
            </div>
            <p className="envelopeTo">Strictly for Amna’s eyes only 💌</p>
          </div>
        ) : (
          <div className="openedLetter animateLetterPaper">
            <div className="parchmentHeader">
              <span className="vintageStamp">19 · NOV · 2005</span>
              <span className="letterRose">🌹</span>
            </div>

            <h3 className="letterSalutation">Dearest Amna,</h3>

            <div className="letterBody">
              <p>
                Happy Birthday to someone who naturally makes the world around her feel
                gentler, brighter, and kinder just by being in it.
              </p>
              <p>
                You are the kind of person whose presence is a quiet comfort, whose
                smile lights up rooms, and whose sincere heart deserves nothing less
                than the absolute purest happiness life can offer.
              </p>
              <p>
                May this year reward every ounce of patience you have shown, answer
                the prayers you only utter in your heart, and bring people and
                experiences that celebrate you for the rare gem you are.
              </p>
              <p>
                Keep shining, keep being yourself, and never forget how deeply
                treasured and valued you are.
              </p>
            </div>

            <div className="letterFooter">
              <span className="handwritingSign">Always wishing you the best,</span>
              <span className="signStar">✦ With endless prayers & warmth ✦</span>
            </div>

            <button className="closeLetterBtn" onClick={onClose}>
              Fold & Keep in Heart 🤍
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
