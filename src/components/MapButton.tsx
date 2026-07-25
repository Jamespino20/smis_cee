"use client";

import { motion } from "motion/react";
import { useState } from "react";
import WorldMap from "./WorldMap";

export default function MapButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full border border-sunset-gold/40 bg-twilight/80 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-twilight-deep/50 hover:border-sunset-gold/70 transition-colors group"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, duration: 0.5, type: "spring" }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open world map"
      >
        {/* Compass icon */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          className="text-sunset-gold group-hover:text-sunset-gold-light transition-colors"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="2" fill="currentColor" />
          <path
            d="M12 4L13.5 9.5L12 8L10.5 9.5L12 4Z"
            fill="#E8A0BF"
          />
          <path
            d="M12 20L10.5 14.5L12 16L13.5 14.5L12 20Z"
            fill="currentColor"
          />
          <path
            d="M4 12L9.5 10.5L8 12L9.5 13.5L4 12Z"
            fill="currentColor"
          />
          <path
            d="M20 12L14.5 13.5L16 12L14.5 10.5L20 12Z"
            fill="currentColor"
          />
        </svg>
      </motion.button>

      <WorldMap isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
