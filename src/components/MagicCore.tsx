"use client";

import { motion, useAnimation } from "motion/react";
import { useState, useCallback } from "react";
import { animate, random } from "animejs";

export default function MagicCore({
  onReveal,
  revealed,
}: {
  onReveal: () => void;
  revealed: boolean;
}) {
  const controls = useAnimation();
  const [particles, setParticles] = useState<number[]>([]);

  const handleClick = useCallback(() => {
    if (revealed) return;

    // Burst particles
    const newParticles = Array.from({ length: 20 }, (_, i) => i);
    setParticles(newParticles);

    // Animate core
    controls.start({
      scale: [1, 1.5, 1],
      opacity: [1, 0.8, 1],
      transition: { duration: 0.6 },
    });

    // Animate particles outward
    setTimeout(() => {
      const coreEl = document.querySelector("[data-magic-core]");
      if (!coreEl) return;

      const els = document.querySelectorAll("[data-particle]");
      els.forEach((el, i) => {
        const angle = (i / els.length) * Math.PI * 2;
        const dist = random(80, 200);
        animate(el, {
          translateX: Math.cos(angle) * dist,
          translateY: Math.sin(angle) * dist,
          opacity: [1, 0],
          scale: [1, 0.3],
          ease: "outExpo",
          duration: random(600, 1200),
        });
      });

      setTimeout(() => {
        setParticles([]);
        onReveal();
      }, 800);
    }, 200);
  }, [controls, onReveal, revealed]);

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer glow ring */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-40 h-40 rounded-full border border-vine-green/30"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute w-52 h-52 rounded-full border border-sakura-pink/20"
      />

      {/* Core button */}
      <motion.button
        data-magic-core
        animate={controls}
        whileHover={!revealed ? { scale: 1.05 } : {}}
        whileTap={!revealed ? { scale: 0.95 } : {}}
        onClick={handleClick}
        className={`relative z-10 w-28 h-28 rounded-full flex items-center justify-center cursor-pointer transition-all duration-500 ${
          revealed
            ? "bg-vine-green/20 shadow-[0_0_60px_rgba(126,206,126,0.4)]"
            : "bg-gradient-to-br from-vine-green/30 to-sakura-pink/30 shadow-[0_0_40px_rgba(126,206,126,0.2)] hover:shadow-[0_0_60px_rgba(126,206,126,0.4)]"
        }`}
        disabled={revealed}
      >
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-vine-green/60 to-sakura-pink/40 flex items-center justify-center">
          {revealed ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-cream">
              <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z" fill="currentColor" />
            </svg>
          ) : (
            <span className="font-display text-cream text-xs tracking-widest uppercase">
              Tap
            </span>
          )}
        </div>
      </motion.button>

      {/* Burst particles */}
      {particles.map((i) => (
        <div
          key={i}
          data-particle
          className="absolute w-2 h-2 rounded-full bg-vine-green shadow-[0_0_8px_rgba(126,206,126,0.6)]"
          style={{
            opacity: 0,
          }}
        />
      ))}
    </div>
  );
}
