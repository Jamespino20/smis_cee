"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface TypewriterProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function Typewriter({
  text,
  speed = 40,
  delay = 0,
  className = "",
  style,
}: TypewriterProps) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [started, setStarted] = useState(delay === 0);

  useEffect(() => {
    if (delay > 0) {
      const t = setTimeout(() => setStarted(true), delay);
      return () => clearTimeout(t);
    }
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    const interval = setInterval(() => {
      setVisibleCount((prev) => {
        if (prev >= text.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed, started]);

  if (!started) {
    return <span className={className} style={style}>{text}</span>;
  }

  const chars = text.split("");

  return (
    <span className={className} style={style}>
      <AnimatePresence mode="popLayout">
        {chars.map((char, i) => {
          if (i >= visibleCount) return null;
          return (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              className="inline-block"
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          );
        })}
      </AnimatePresence>
    </span>
  );
}