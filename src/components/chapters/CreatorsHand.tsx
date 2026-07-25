"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const COLORS = {
  amber: "#d4a574",
  parchment: "#f5f0e8",
  ivory: "#faf8f0",
  inkBrown: "#3d2b1f",
};

const SVG_PATHS = {
  // A flowing line
  line1: "M 100 400 C 200 350 300 450 400 380 C 500 310 600 420 700 370",
  // Line becomes a curve/sketch
  line2: "M 100 400 C 200 350 300 450 400 380 C 500 310 600 420 700 370 C 750 350 780 300 760 250",
  // Character silhouette 1 (standing figure)
  char1: "M 380 380 L 375 340 C 370 320 360 300 370 280 C 380 260 390 260 400 280 C 410 300 400 320 395 340 L 390 380 M 375 340 L 355 360 M 395 340 L 415 360 M 380 380 L 375 410 M 390 380 L 395 410",
  // Character silhouette 2 (with raised arm)
  char2: "M 520 370 L 515 330 C 510 310 500 290 510 270 C 520 250 530 250 540 270 C 550 290 540 310 535 330 L 530 370 M 515 330 L 495 310 M 535 330 L 560 290 M 520 370 L 515 400 M 530 370 L 535 400",
  // Stars / sparkles
  star1: "M 200 200 L 205 185 L 210 200 L 225 195 L 210 205 L 205 220 L 200 205 L 185 210 L 195 200 L 180 195 Z",
  star2: "M 650 180 L 653 170 L 656 180 L 666 177 L 656 183 L 653 193 L 650 183 L 640 186 L 647 180 L 637 177 Z",
  star3: "M 450 150 L 452 142 L 454 150 L 462 148 L 454 152 L 452 160 L 450 152 L 442 154 L 448 150 L 440 148 Z",
  // Small worlds / circles
  world1: "M 150 250 A 20 20 0 1 1 150 250.01 M 135 250 A 35 12 0 0 1 165 250",
  world2: "M 700 230 A 15 15 0 1 1 700 230.01 M 688 230 A 27 9 0 0 1 712 230",
};

const PHASES = [
  { paths: ["line1"], message: null, duration: 2000 },
  { paths: ["line1", "line2"], message: null, duration: 1500 },
  { paths: ["line1", "line2", "char1", "char2"], message: null, duration: 2000 },
  { paths: ["line1", "line2", "char1", "char2", "star1", "star2", "star3", "world1", "world2"], message: "You gave them worlds.", duration: 2500 },
  { paths: ["line1", "line2", "char1", "char2", "star1", "star2", "star3", "world1", "world2"], message: "Today, one was made for you.", duration: 2000 },
];

function AnimatedPath({
  d,
  delay,
  stroke,
}: {
  d: string;
  delay: number;
  stroke: string;
}) {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const el = pathRef.current;
    if (!el) return;
    const length = el.getTotalLength();
    el.style.strokeDasharray = `${length}`;
    el.style.strokeDashoffset = `${length}`;

    const timeout = setTimeout(() => {
      el.style.transition = "stroke-dashoffset 1.5s ease-out";
      el.style.strokeDashoffset = "0";
    }, delay);

    return () => clearTimeout(timeout);
  }, [delay]);

  return (
    <path
      ref={pathRef}
      d={d}
      stroke={stroke}
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

export default function CreatorsHand({
  isActive,
  onComplete,
}: {
  isActive: boolean;
  onComplete: () => void;
}) {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  useEffect(() => {
    if (!isActive || isAnimating) return;

    setIsAnimating(true);
    let currentPhase = 0;

    const advancePhase = () => {
      if (currentPhase >= PHASES.length) {
        setIsAnimating(false);
        onComplete();
        return;
      }
      setPhaseIndex(currentPhase);
      const phase = PHASES[currentPhase];
      const t = setTimeout(() => {
        currentPhase++;
        advancePhase();
      }, phase.duration);
      timeoutsRef.current.push(t);
    };

    advancePhase();

    return () => clearTimeouts();
  }, [isActive, onComplete, isAnimating]);

  if (!isActive) return null;

  const currentPhase = PHASES[phaseIndex];
  const activePaths = new Set(currentPhase.paths);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Parchment background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#faf8f0] via-[#f5f0e8] to-[#ede4d4]" />

      {/* Subtle texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233d2b1f' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* SVG canvas */}
      <svg
        viewBox="0 0 800 500"
        className="relative z-10 w-full max-w-4xl h-auto px-4"
        style={{ maxHeight: "70vh" }}
      >
        {/* Reveal active paths */}
        {Object.entries(SVG_PATHS).map(([key, d]) => {
          if (!activePaths.has(key)) return null;
          const isStar = key.startsWith("star");
          const isWorld = key.startsWith("world");
          const isChar = key.startsWith("char");
          const strokeColor = isStar
            ? COLORS.amber
            : isWorld
              ? COLORS.inkBrown
              : isChar
                ? COLORS.inkBrown
                : COLORS.inkBrown;
          const delay = isStar || isWorld ? 200 : 0;
          return (
            <AnimatedPath key={key} d={d} delay={delay} stroke={strokeColor} />
          );
        })}
      </svg>

      {/* Messages */}
      <AnimatePresence mode="wait">
        {currentPhase.message && (
          <motion.div
            key={currentPhase.message}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
            className="absolute bottom-[12%] left-0 right-0 text-center px-6 z-20"
          >
            <p
              className="font-display text-xl md:text-2xl lg:text-3xl tracking-wide"
              style={{
                color: COLORS.inkBrown,
                textShadow: `0 1px 2px rgba(61, 43, 31, 0.1)`,
              }}
            >
              {currentPhase.message}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="absolute top-[8%] left-0 right-0 text-center z-20"
      >
        <p
          className="font-display text-sm md:text-base tracking-[0.3em] uppercase"
          style={{ color: COLORS.amber }}
        >
          II — The Creator&apos;s Hand
        </p>
      </motion.div>
    </div>
  );
}
