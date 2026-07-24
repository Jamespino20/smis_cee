"use client";

import { motion } from "motion/react";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-twilight-deep via-twilight to-lake-shadow" />

      {/* Character art background */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Image
          src="/noot.png"
          alt="Character art"
          fill
          className="object-contain opacity-30 scale-110"
          priority
        />
      </div>

      {/* Radial glow overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,165,116,0.1)_0%,transparent_70%)]" />

      {/* Content */}
      <div className="relative z-10 text-center px-5 sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <p className="font-serif text-sunset-gold-light text-sm sm:text-base md:text-lg tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-3 sm:mb-4">
            A message from the realm of
          </p>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
          className="font-display text-5xl sm:text-6xl md:text-8xl lg:text-9xl text-sunset-gold mb-4 sm:mb-6 drop-shadow-[0_0_40px_rgba(212,165,116,0.3)]"
        >
          Vestia
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="w-24 sm:w-32 h-px bg-gradient-to-r from-transparent via-sakura-pink to-transparent mx-auto mb-4 sm:mb-6"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="font-serif text-cream-warm text-lg sm:text-xl md:text-2xl italic max-w-lg mx-auto px-2"
        >
          For Smiscee, on the day the stars aligned
        </motion.p>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="font-serif text-sunset-gold-light text-sm tracking-widest uppercase">
            Scroll
          </span>
          <svg width="20" height="30" viewBox="0 0 20 30" className="text-sunset-gold-light">
            <rect x="1" y="1" width="18" height="28" rx="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <motion.circle
              cx="10"
              cy="10"
              r="3"
              fill="currentColor"
              animate={{ cy: [10, 18, 10] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
