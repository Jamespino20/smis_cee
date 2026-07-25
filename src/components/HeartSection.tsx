"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import MagicCore from "./MagicCore";
import Typewriter from "@/lib/typewriter";

export default function HeartSection() {
  const [revealed, setRevealed] = useState(false);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center py-20 sm:py-32 px-5 sm:px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-lake-deep via-twilight-deep to-lake-deep" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(126,206,126,0.05)_0%,transparent_60%)]" />

      <div className="relative z-10 text-center">
        {/* Chapter label */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-serif text-sakura-pink text-sm tracking-[0.4em] uppercase mb-4"
        >
          Chapter II
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-display text-3xl sm:text-4xl md:text-5xl text-cream mb-8 sm:mb-12"
        >
          The Heart of Vestia
        </motion.h2>

        {/* Heart of Vestia symbol */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative mb-10 sm:mb-16"
        >
          <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 mx-auto flex items-center justify-center">
            {/* Glow aura */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(126,206,126,0.3) 0%, rgba(201,169,110,0.15) 50%, transparent 70%)",
              }}
              animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Outward pulse rings */}
            <motion.div
              className="absolute inset-4 rounded-full border border-vine-green/20"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute inset-8 rounded-full border border-old-gold/15"
              animate={{ scale: [1, 1.25, 1], opacity: [0.2, 0, 0.2] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />
            {/* Heart SVG */}
            <motion.div
              className="relative z-10"
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg width="120" height="120" viewBox="0 0 100 100">
                <defs>
                  <radialGradient id="heartGlow">
                    <stop offset="0%" stopColor="#7ece7e" stopOpacity="1" />
                    <stop offset="50%" stopColor="#c9a96e" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#1a1a3e" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <motion.path
                  d="M 50 15 C 10 -20 -20 40 50 85 C 120 40 90 -20 50 15 Z"
                  fill="url(#heartGlow)"
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  style={{ transformOrigin: "50% 50%" }}
                />
                <motion.path
                  d="M 50 20 C 18 -10 -10 38 50 78 C 110 38 82 -10 50 20 Z"
                  fill="none"
                  stroke="#c9a96e"
                  strokeWidth="0.5"
                  animate={{ opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  style={{ transformOrigin: "50% 50%" }}
                />
              </svg>
            </motion.div>
          </div>
        </motion.div>

        {/* Magic core interaction */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mb-10 sm:mb-16"
        >
          <p className="font-serif text-cream/60 text-xs sm:text-sm mb-6 sm:mb-8 italic">
            {revealed ? "The core remembers you." : "Touch the core to unlock the message."}
          </p>
          <MagicCore onReveal={() => setRevealed(true)} revealed={revealed} />
        </motion.div>

        {/* Birthday message */}
        <AnimatePresence>
          {revealed && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="max-w-2xl mx-auto"
            >
              <div className="w-20 h-px bg-gradient-to-r from-transparent via-vine-green to-transparent mx-auto mb-8" />

              <p className="font-serif text-lg sm:text-xl md:text-2xl text-cream leading-relaxed mb-6 sm:mb-8">
                <Typewriter text="Happy Birthday, Smiscee." speed={50} />
              </p>

              <p className="font-serif text-base sm:text-lg text-cream/80 leading-relaxed mb-4 sm:mb-6">
                Today, the world of Vestia celebrates not just the turning of a year,
                but the existence of the one who gave it life. You who drew the first
                line, who named the first star, who breathed magic into ink and paper.
              </p>

              <p className="font-serif text-base sm:text-lg text-cream/80 leading-relaxed mb-4 sm:mb-6">
                In every story you tell, in every character you create, there is a piece
                of your soul — brilliant, defiant, and endlessly generous. The Rosen
                family walks because you walk. The Corruptus trembles because you dare
                to imagine courage.
              </p>

              <p className="font-serif text-base sm:text-lg text-cream/80 leading-relaxed mb-6 sm:mb-8">
                May this year bring you as much wonder as you have given to every
                world you have ever touched. May the cherry blossoms always find you.
                May your bow never falter.
              </p>

              <div className="w-16 h-px bg-gradient-to-r from-transparent via-sakura-pink to-transparent mx-auto mb-6" />

              <p className="font-serif text-sakura-pink text-xl italic">
                With all my love, always.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
