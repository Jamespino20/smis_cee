"use client";

import { motion } from "motion/react";
import { useState } from "react";

interface HiddenStarProps {
  id: string;
  onFound: (id: string) => void;
  className?: string;
}

export default function HiddenStar({ id, onFound, className = "" }: HiddenStarProps) {
  const [found, setFound] = useState(false);

  const handleClick = () => {
    if (found) return;
    setFound(true);
    onFound(id);
  };

  return (
    <motion.button
      onClick={handleClick}
      initial={{ opacity: 0 }}
      animate={{
        opacity: found ? 1 : [0.08, 0.15, 0.08],
      }}
      transition={
        found
          ? { duration: 0.3 }
          : { duration: 4, repeat: Infinity, ease: "easeInOut" }
      }
      whileHover={
        found
          ? {}
          : {
              opacity: 0.8,
              scale: 1.4,
              filter: "drop-shadow(0 0 12px rgba(212,165,116,0.8))",
            }
      }
      className={`absolute pointer-events-auto cursor-default ${className}`}
      aria-label="Hidden star"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        className="transition-all duration-500"
      >
        <path
          d="M12 2L14.5 9L22 9.5L16.5 14L18 21.5L12 17.5L6 21.5L7.5 14L2 9.5L9.5 9L12 2Z"
          fill={found ? "#d4a574" : "#f5f0e8"}
          stroke={found ? "#d4a574" : "#f5f0e8"}
          strokeWidth="0.5"
        />
      </svg>
      {found && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.8, 0], opacity: [1, 0.6, 0] }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(212,165,116,0.4) 0%, transparent 70%)",
          }}
        />
      )}
    </motion.button>
  );
}
