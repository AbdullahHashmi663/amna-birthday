"use client";

import Image from "next/image";
import { FormEvent, useState, useRef } from "react";
import confetti from "canvas-confetti";
import SparkleCursor from "./components/SparkleCursor";
import PetalCanvas from "./components/PetalCanvas";
import FloatingBalloons from "./components/FloatingBalloons";
import BirthdayCake from "./components/BirthdayCake";
import SecretLetterModal from "./components/SecretLetterModal";
import SurpriseGiftModal from "./components/SurpriseGiftModal";
import PrayerCard from "./components/PrayerCard";
import FloatingDock from "./components/FloatingDock";
import { playChime, musicBox } from "./utils/sound";

const prayers = [
  ["☀️", "For your happiness", "May Allah fill your heart with the kind of joy that stays, shines, and makes ordinary days feel beautiful."],
  ["🌷", "For your dreams", "May every sincere dream find its way to you at the right time, in the most beautiful form."],
  ["🕊️", "For your peace", "May your mind be calm, your heart be light, and your path be protected from every worry."],
  ["✨", "For your future", "May your coming years be brighter than you imagine, full of good people, gentle moments, and barakah."],
  ["🌙", "For every dua", "May the duas you whisper when no one is listening be answered with kindness beyond your expectations."],
  ["🤍", "For you, always", "May you remain cherished, safe, confident, and surrounded by love that feels honest and peaceful."],
];

export default function Home() {
  const [passkey, setPasskey] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState("");
  const [isShaking, setIsShaking] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [photoHearts, setPhotoHearts] = useState<{ id: number; left: number }[]>([]);
  const [photoTilt, setPhotoTilt] = useState({ x: 0, y: 0 });

  // Modals
  const [letterOpen, setLetterOpen] = useState(false);
  const [giftOpen, setGiftOpen] = useState(false);

  const heroPortraitRef = useRef<HTMLDivElement | null>(null);

  const unlock = (event: FormEvent) => {
    event.preventDefault();
    const cleanKey = passkey.replace(/[^0-9]/g, "").trim();

    if (cleanKey === "19112005") {
      playChime();
      setUnlocked(true);
      setError("");

      // Start music box gently
      musicBox.play();

      // Massive unlock celebration
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.5 },
        colors: ["#ffd166", "#ff7b9c", "#b892ff", "#ffffff", "#ff819e"],
      });
    } else {
      setError("That is not the secret date — try again ✦");
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600);
    }
  };

  // Interactive hearts on portrait click
  const handlePortraitClick = () => {
    const newHeart = { id: Date.now() + Math.random(), left: Math.random() * 60 + 20 };
    setPhotoHearts((prev) => [...prev, newHeart]);
    setTimeout(() => {
      setPhotoHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 1600);
  };

  // 3D tilt on portrait
  const handlePortraitMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setPhotoTilt({ x: x * 15, y: -y * 15 });
  };

  const handlePortraitMouseLeave = () => {
    setPhotoTilt({ x: 0, y: 0 });
  };

  return (
    <main className="mainWrapper">
      {/* Sparkle cursor follower */}
      <SparkleCursor />

      {/* Floating flower petals */}
      {unlocked && <PetalCanvas />}

      {/* Floating balloons */}
      {unlocked && <FloatingBalloons />}

      {/* Floating dock controls */}
      {unlocked && (
        <FloatingDock
          onOpenLetter={() => setLetterOpen(true)}
          onOpenGift={() => setGiftOpen(true)}
        />
      )}

      {/* Secret Letter Modal */}
      <SecretLetterModal isOpen={letterOpen} onClose={() => setLetterOpen(false)} />

      {/* Surprise Gift Modal */}
      <SurpriseGiftModal isOpen={giftOpen} onClose={() => setGiftOpen(false)} />

      {/* Passkey Gate Screen */}
      {!unlocked && (
        <section className="gate" aria-label="Birthday passkey">
          {/* Shooting stars & starry sky */}
          <div className="starfield">
            {Array.from({ length: 48 }, (_, i) => (
              <i
                key={i}
                style={{
                  left: `${(i * 37) % 100}%`,
                  top: `${(i * 71) % 100}%`,
                  animationDelay: `${(i % 8) / -2}s`,
                  opacity: (i % 3 === 0 ? 0.9 : 0.4),
                }}
              />
            ))}
            <span className="shootingStar shoot1" />
            <span className="shootingStar shoot2" />
            <span className="shootingStar shoot3" />
          </div>

          <form
            className={`lockbox ${isShaking ? "shake" : ""}`}
            onSubmit={unlock}
          >
            <div className="lockIconPulse">
              <span>✦</span>
            </div>
            <span className="tiny">A little birthday universe</span>
            <h1>For Amna</h1>
            <p>
              There is something lovely waiting on the other side. Enter the
              secret date to open it.
            </p>

            <div className="passRow">
              <input
                aria-label="Passkey"
                autoFocus
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                type="password"
                inputMode="numeric"
                maxLength={10}
                placeholder="DDMMYYYY"
              />
              <button type="submit" aria-label="Unlock">
                ✦
              </button>
            </div>

            <span className="error" aria-live="polite">
              {error}
            </span>

            <div className="hintArea">
              {!showHint ? (
                <button
                  type="button"
                  className="hintToggle"
                  onClick={() => setShowHint(true)}
                >
                  Need a hint? 💡
                </button>
              ) : (
                <span className="hintText animateFadeIn">
                  Hint: Abdullah’s birth date in DDMMYYYY format ✨
                </span>
              )}
            </div>
          </form>
        </section>
      )}

      {/* Hero Section */}
      <section className="hero">
        <div className="orb one" />
        <div className="orb two" />
        <div className="orb three" />
        <span className="spark s1">✦</span>
        <span className="spark s2">✧</span>
        <span className="spark s3">✦</span>

        <div className="heroContent">
          <div className="heroTextContent">
            <span className="eyebrow floatingBadge">
              <span className="badgeIcon">✨</span> A small celebration, made with warmth
            </span>

            <h2 className="mainHeroHeading">
              Happy Birthday,
              <br />
              <em className="nameShimmer">Amna.</em>
            </h2>

            <p className="intro">
              May this new year of your life arrive softly — carrying happiness,
              beautiful surprises, and every good thing your heart has been
              quietly hoping for.
            </p>

            <div className="heroButtons">
              <a href="#cake" className="primaryHeroBtn">
                🎂 Blow Candles
              </a>
              <button
                className="secondaryHeroBtn"
                onClick={() => setLetterOpen(true)}
              >
                💌 Open Letter
              </button>
              <a href="#prayers" className="linkHeroBtn">
                Open Prayers ↓
              </a>
            </div>
          </div>

          <div
            className="portraitWrap"
            ref={heroPortraitRef}
            onMouseMove={handlePortraitMouseMove}
            onMouseLeave={handlePortraitMouseLeave}
            onClick={handlePortraitClick}
            style={{
              transform: `perspective(900px) rotateX(${photoTilt.y}deg) rotateY(${photoTilt.x}deg)`,
            }}
            title="Click to send love!"
          >
            <div className="portraitBackGlow" />
            <Image
              src="/amna-portrait.png"
              alt="Amna's portrait illustration"
              fill
              priority
              sizes="(max-width: 760px) 330px, 370px"
              className="portrait"
            />
            <span className="tag">
              <span className="tagFlower">🌸</span> a gentle soul, a bright year ✿
            </span>
            <span className="clickPrompt">Tap photo for love 💖</span>

            {/* Clicked floating hearts */}
            {photoHearts.map((h) => (
              <span
                key={h.id}
                className="portraitFloatingHeart"
                style={{ left: `${h.left}%` }}
              >
                💖
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Birthday Cake & Candles */}
      <BirthdayCake />

      {/* Prayers Section */}
      <section className="prayerSection" id="prayers">
        <div className="container">
          <div className="prayerHeader">
            <span className="eyebrow">Made as a prayer</span>
            <h2 className="sectionTitle">
              May your days be
              <br />
              full of <em>khair.</em>
            </h2>
            <p className="prayerSubtitle">
              Tap &quot;Say Ameen&quot; on any dua to send a prayer straight to the heavens.
            </p>
          </div>

          <div className="prayerGrid">
            {prayers.map(([icon, title, copy], idx) => (
              <PrayerCard
                key={title}
                icon={icon}
                title={title}
                copy={copy}
                index={idx}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Moment Section */}
      <section className="moment">
        <div className="container momentGrid">
          <div className="flowerFrame">
            <Image
              src="/amna-flowers.png"
              alt="A flower-filled moment"
              fill
              sizes="300px"
            />
            <div className="frameGlow" />
          </div>

          <div>
            <span className="eyebrow pink">A birthday wish</span>
            <h2>
              May life bring you
              <br />
              reasons to <em>smile wider,</em>
              <br />
              every single day.
            </h2>
            <p>
              May this year open doors you did not even know were meant for you.
              May it hold quiet comfort, proud moments, sweet surprises, and a
              heart that knows how deeply it is valued.
            </p>

            <div
              className="gift giftInteractive"
              onClick={() => setGiftOpen(true)}
              role="button"
              tabIndex={0}
              title="Click to unwrap surprise!"
            >
              <span className="giftBox">
                <i />
                <b />
              </span>
              <span>
                <strong>A little surprise gift</strong> — tap to unwrap! 🎁
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="footerContent">
          <p className="footerQuote">
            “May you be blessed with a year as lovely as your heart.”
          </p>
          <div className="footerSparks">
            <span>✦</span>
            <span className="footerHeart">🤍</span>
            <span>✦</span>
          </div>
          <span className="footerSub">Crafted with endless love & warm duas</span>
        </div>
      </footer>
    </main>
  );
}
