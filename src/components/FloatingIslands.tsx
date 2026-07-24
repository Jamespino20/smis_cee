"use client";

import { motion, useScroll, useTransform } from "motion/react";

export default function FloatingIslands() {
  const { scrollYProgress } = useScroll();

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -350]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.6, 1, 1, 0.3]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Distant mountain silhouettes */}
      <motion.div
        style={{ y: y3, opacity }}
        className="absolute bottom-0 left-0 w-full h-[40vh]"
      >
        <svg viewBox="0 0 1440 400" className="w-full h-full" preserveAspectRatio="none">
          <path
            d="M0,400 L0,280 Q120,180 240,250 Q360,100 480,200 Q600,50 720,180 Q840,80 960,220 Q1080,120 1200,200 Q1320,150 1440,260 L1440,400 Z"
            fill="rgba(45,27,61,0.4)"
          />
        </svg>
      </motion.div>

      {/* Mid-ground hills */}
      <motion.div
        style={{ y: y2, opacity }}
        className="absolute bottom-0 left-0 w-full h-[35vh]"
      >
        <svg viewBox="0 0 1440 350" className="w-full h-full" preserveAspectRatio="none">
          <path
            d="M0,350 L0,250 Q180,180 360,230 Q540,120 720,200 Q900,100 1080,180 Q1260,140 1440,220 L1440,350 Z"
            fill="rgba(26,26,46,0.6)"
          />
        </svg>
      </motion.div>

      {/* Floating island silhouettes */}
      <motion.div style={{ y: y1, opacity }} className="absolute top-[15%] right-[10%] hidden sm:block">
        <svg width="120" height="80" viewBox="0 0 120 80" className="opacity-40">
          <ellipse cx="60" cy="50" rx="55" ry="25" fill="rgba(45,27,61,0.5)" />
          <path d="M25,50 Q40,10 60,15 Q80,10 95,50" fill="rgba(45,27,61,0.5)" />
          <circle cx="60" cy="12" r="8" fill="rgba(126,206,126,0.15)" />
        </svg>
      </motion.div>

      <motion.div style={{ y: y2, opacity }} className="absolute top-[25%] left-[5%] hidden sm:block">
        <svg width="90" height="60" viewBox="0 0 90 60" className="opacity-30">
          <ellipse cx="45" cy="40" rx="40" ry="18" fill="rgba(45,27,61,0.4)" />
          <path d="M15,40 Q30,8 45,12 Q60,8 75,40" fill="rgba(45,27,61,0.4)" />
          <circle cx="45" cy="10" r="6" fill="rgba(126,206,126,0.12)" />
        </svg>
      </motion.div>

      <motion.div style={{ y: y3, opacity }} className="absolute top-[40%] right-[25%] hidden md:block">
        <svg width="70" height="50" viewBox="0 0 70 50" className="opacity-25">
          <ellipse cx="35" cy="35" rx="30" ry="14" fill="rgba(45,27,61,0.35)" />
          <path d="M10,35 Q22,5 35,8 Q48,5 60,35" fill="rgba(45,27,61,0.35)" />
        </svg>
      </motion.div>

      {/* Birds */}
      <motion.div
        style={{ y: y1 }}
        className="absolute top-[20%] left-[30%] opacity-20 hidden sm:block"
      >
        <svg width="40" height="20" viewBox="0 0 40 20">
          <path d="M0,10 Q10,0 20,10 Q30,0 40,10" fill="none" stroke="rgba(212,165,116,0.5)" strokeWidth="1.5" />
        </svg>
      </motion.div>

      <motion.div
        style={{ y: y2 }}
        className="absolute top-[30%] right-[40%] opacity-15 hidden md:block"
      >
        <svg width="30" height="15" viewBox="0 0 30 15">
          <path d="M0,7 Q7,0 15,7 Q23,0 30,7" fill="none" stroke="rgba(212,165,116,0.4)" strokeWidth="1" />
        </svg>
      </motion.div>
    </div>
  );
}
