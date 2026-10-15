"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import { playBlowSound, playChime } from "../utils/sound";

export default function BirthdayCake() {
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [wishRevealed, setWishRevealed] = useState(false);

  const handleBlow = () => {
    if (candlesBlown) return;
    playBlowSound();
    setCandlesBlown(true);

    setTimeout(() => {
      playChime();
      setWishRevealed(true);

      // Grand celebration confetti
      const end = Date.now() + 2.5 * 1000;
      const colors = ["#ff7b9c", "#ffd166", "#b892ff", "#ffcad4", "#ffffff"];

      (function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0.2, y: 0.65 },
          colors: colors,
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 0.8, y: 0.65 },
          colors: colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    }, 400);
  };

  const handleRelight = () => {
    setCandlesBlown(false);
    setWishRevealed(false);
  };

  return (
    <section className="cakeSection" id="cake">
      <div className="container cakeContainer">
        <span className="eyebrow" style={{ color: "#ffd583" }}>
          ✦ An Interactive Moment
        </span>
        <h2 className="cakeTitle">Make a Wish & Blow the Candles</h2>
        <p className="cakeSubtitle">
          Close your eyes, think of the most heartfelt wish for your coming year,
          and blow out the candles.
        </p>

        <div className="cakeStage">
          {/* Cake Illustration */}
          <div className="cakeWrapper" onClick={handleBlow} title={candlesBlown ? "Candles blown!" : "Click to blow candles!"}>
            {/* Candles */}
            <div className="candlesRow">
              {[0, 1, 2].map((i) => (
                <div key={i} className={`candle candle-${i}`}>
                  {!candlesBlown && (
                    <div className="flameWrapper">
                      <div className="flameGlow" />
                      <div className="flame" />
                    </div>
                  )}
                  {candlesBlown && <div className="candleSmoke" />}
                  <div className="wick" />
                  <div className="candleStick" />
                </div>
              ))}
            </div>

            {/* Cake Tiers */}
            <div className="cakeTier topTier">
              <div className="frostingDrip" />
              <div className="cakeSprinkles">
                <span className="sprinkle s-1" />
                <span className="sprinkle s-2" />
                <span className="sprinkle s-3" />
                <span className="sprinkle s-4" />
              </div>
            </div>

            <div className="cakeTier midTier">
              <div className="frostingDrip" />
              <div className="cakeSprinkles">
                <span className="sprinkle s-5" />
                <span className="sprinkle s-6" />
                <span className="sprinkle s-7" />
              </div>
            </div>

            <div className="cakeTier bottomTier">
              <div className="frostingDrip" />
              <div className="cakeSprinkles">
                <span className="sprinkle s-1" />
                <span className="sprinkle s-3" />
                <span className="sprinkle s-6" />
                <span className="sprinkle s-8" />
              </div>
            </div>

            {/* Plate */}
            <div className="cakePlate" />
          </div>

          {/* Action Button */}
          <div className="cakeActions">
            {!candlesBlown ? (
              <button className="blowBtn" onClick={handleBlow}>
                <span className="btnSparkle">✨</span>
                Blow Out the Candles
                <span className="btnSparkle">🎂</span>
              </button>
            ) : (
              <button className="relightBtn" onClick={handleRelight}>
                🕯️ Relight the Candles
              </button>
            )}
          </div>

          {/* Revealed Wish */}
          {wishRevealed && (
            <div className="wishCard animateFadeUp">
              <span className="wishBadge">🤲 May Allah Accept Your Wish ✦</span>
              <h3>May every heartfelt dream come true, Amna!</h3>
              <p>
                “May Allah bless you with a year of unshakeable peace, doors opening
                naturally, hearts that appreciate your kindness, and answers to
                prayers you thought were forgotten.”
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
