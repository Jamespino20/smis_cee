"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import RebirthCore from "./chapters/RebirthCore";
import CreatorsHand from "./chapters/CreatorsHand";
import ArchersAim from "./chapters/ArchersAim";
import PetalsPromise from "./chapters/PetalsPromise";

const CHAPTERS = [
  { id: "rebirth", label: "The Rebirth Core", Component: RebirthCore },
  { id: "creator", label: "The Creator's Hand", Component: CreatorsHand },
  { id: "archer", label: "The Archer's Aim", Component: ArchersAim },
  { id: "petals", label: "The Petal's Promise", Component: PetalsPromise },
];

export default function JourneyChapters() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  const handleComplete = useCallback(() => {
    setCompleted((prev) => {
      const next = new Set(prev);
      next.add(currentIndex);
      return next;
    });
  }, [currentIndex]);

  const goTo = (index: number) => {
    if (index >= 0 && index < CHAPTERS.length) {
      setCurrentIndex(index);
    }
  };

  const goNext = () => {
    if (currentIndex < CHAPTERS.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  };

  const { Component } = CHAPTERS[currentIndex];

  return (
    <section className="relative w-full">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="text-center py-8 sm:py-12"
      >
        <p className="font-serif text-sm tracking-[0.4em] uppercase text-[#d4a574] mb-3">
          The Journey
        </p>
        <div className="w-20 h-px bg-gradient-to-r from-transparent via-[#d4a574] to-transparent mx-auto" />
      </motion.div>

      {/* Chapter viewport */}
      <div className="relative w-full" style={{ height: "80vh", minHeight: "500px" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Component isActive={true} onComplete={handleComplete} />
          </motion.div>
        </AnimatePresence>

        {/* Left arrow */}
        {currentIndex > 0 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            whileHover={{ opacity: 1, scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={goPrev}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-black/30 backdrop-blur-sm border border-white/10 text-[#f5f0e8] cursor-pointer transition-colors hover:bg-black/50"
            aria-label="Previous chapter"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </motion.button>
        )}

        {/* Right arrow */}
        {currentIndex < CHAPTERS.length - 1 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            whileHover={{ opacity: 1, scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={goNext}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-black/30 backdrop-blur-sm border border-white/10 text-[#f5f0e8] cursor-pointer transition-colors hover:bg-black/50"
            aria-label="Next chapter"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M8 4L14 10L8 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </motion.button>
        )}
      </div>

      {/* Navigation dots */}
      <div className="flex items-center justify-center gap-3 py-6 sm:py-8">
        {CHAPTERS.map((chapter, i) => (
          <button
            key={chapter.id}
            onClick={() => goTo(i)}
            className={`relative w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
              i === currentIndex
                ? "bg-[#d4a574] scale-125"
                : completed.has(i)
                  ? "bg-[#d4a574]/50 hover:bg-[#d4a574]/70"
                  : "bg-white/20 hover:bg-white/40"
            }`}
            aria-label={chapter.label}
          >
            {i === currentIndex && (
              <motion.div
                layoutId="activeDot"
                className="absolute inset-[-4px] rounded-full border border-[#d4a574]/50"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Chapter label */}
      <motion.div
        key={`label-${currentIndex}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center pb-8 sm:pb-12"
      >
        <p className="font-display text-xs sm:text-sm tracking-[0.3em] uppercase text-[#d4a574]/60">
          {CHAPTERS[currentIndex].label}
        </p>
      </motion.div>
    </section>
  );
}
