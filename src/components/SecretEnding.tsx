"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";

interface SecretEndingProps {
  active: boolean;
  onComplete: () => void;
}

const lines = [
  "There is one final thing the worlds wanted to say.",
  "You gave us names.",
  "You gave us homes.",
  "You gave us stories.",
  "Today, we celebrate the person who gave us all of them.",
];

const silhouettes = [
  "M20,50 Q25,20 30,50 Q35,20 40,50",
  "M60,50 Q65,25 70,50 Q75,25 80,50",
  "M100,50 Q105,30 110,50 Q115,30 120,50",
];

export default function SecretEnding({ active, onComplete }: SecretEndingProps) {
  const [phase, setPhase] = useState<"idle" | "dark" | "lines" | "silhouettes" | "fade">("idle");

  useEffect(() => {
    if (!active) {
      setPhase("idle");
      return;
    }

    setPhase("dark");
    const t1 = setTimeout(() => setPhase("lines"), 1500);
    const t2 = setTimeout(() => setPhase("silhouettes"), 5500);
    const t3 = setTimeout(() => setPhase("fade"), 8500);
    const t4 = setTimeout(() => onComplete(), 10500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [active, onComplete]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: "#050510" }}
        >
          {/* Lines */}
          <AnimatePresence>
            {phase === "lines" && (
              <div className="flex flex-col items-center gap-6 px-6 text-center">
                {lines.map((line, i) => (
                  <motion.p
                    key={line}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, delay: i * 0.7 }}
                    className="font-serif text-cream text-lg sm:text-xl md:text-2xl italic max-w-xl"
                    style={{ color: "#f5f0e8" }}
                  >
                    {line}
                  </motion.p>
                ))}
              </div>
            )}
          </AnimatePresence>

          {/* Silhouettes */}
          <AnimatePresence>
            {phase === "silhouettes" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <svg viewBox="0 0 140 70" className="w-64 h-32 sm:w-80 sm:h-40">
                  {silhouettes.map((d, i) => (
                    <motion.path
                      key={i}
                      d={d}
                      fill="none"
                      stroke={["#6b4c9a", "#d4a574", "#d4a0b9"][i]}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.7 }}
                      transition={{ duration: 1.5, delay: i * 0.3 }}
                    />
                  ))}
                  {/* Shared star above */}
                  <motion.circle
                    cx="70"
                    cy="10"
                    r="3"
                    fill="#d4a574"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 0.8, scale: 1 }}
                    transition={{ duration: 0.8, delay: 1.2 }}
                  />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Fade out */}
          {phase === "fade" && (
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0"
              style={{ background: "#050510" }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
