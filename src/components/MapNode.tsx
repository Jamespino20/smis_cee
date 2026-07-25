"use client";

import { motion } from "motion/react";
import { useState } from "react";

interface MapNodeProps {
  id: string;
  label: string;
  x: number;
  y: number;
  unlocked: boolean;
  isCurrent: boolean;
  onClick: () => void;
  delay?: number;
}

export default function MapNode({
  label,
  x,
  y,
  unlocked,
  isCurrent,
  onClick,
  delay = 0,
}: MapNodeProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <g
      style={{ cursor: unlocked ? "pointer" : "default" }}
      onClick={unlocked ? onClick : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Glow ring (unlocked + current) */}
      {unlocked && isCurrent && (
        <motion.circle
          cx={x}
          cy={y}
          r={38}
          fill="none"
          stroke="url(#glowGradient)"
          strokeWidth={2}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: [0.4, 0.8, 0.4],
            scale: [0.95, 1.05, 0.95],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: `${x}px ${y}px` }}
        />
      )}

      {/* Hover ring */}
      {unlocked && hovered && (
        <motion.circle
          cx={x}
          cy={y}
          r={34}
          fill="none"
          stroke="rgba(201,169,110,0.3)"
          strokeWidth={1.5}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}

      {/* Island body */}
      <motion.ellipse
        cx={x}
        cy={y + 6}
        rx={30}
        ry={16}
        fill={unlocked ? "#2d1b4e" : "#1a0f26"}
        stroke={unlocked ? "#c9a96e" : "#4a3a5c"}
        strokeWidth={unlocked ? 2 : 1}
        opacity={unlocked ? 1 : 0.4}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: unlocked ? 1 : 0.4 }}
        transition={{ duration: 0.5, delay, type: "spring", stiffness: 200 }}
        style={{ transformOrigin: `${x}px ${y}px` }}
      />

      {/* Island top dome */}
      <motion.path
        d={`M${x - 24},${y + 2} Q${x - 10},${y - 18} ${x},${y - 20} Q${x + 10},${y - 18} ${x + 24},${y + 2}`}
        fill={unlocked ? "#3d2660" : "#1a0f26"}
        stroke="none"
        opacity={unlocked ? 0.8 : 0.3}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: unlocked ? 0.8 : 0.3 }}
        transition={{ duration: 0.5, delay: delay + 0.1, type: "spring", stiffness: 200 }}
        style={{ transformOrigin: `${x}px ${y}px` }}
      />

      {/* Crystal / landmark on top */}
      {unlocked && (
        <motion.polygon
          points={`${x},${y - 24} ${x - 5},${y - 14} ${x + 5},${y - 14}`}
          fill={isCurrent ? "#E8A0BF" : "#c9a96e"}
          opacity={0.9}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4, delay: delay + 0.2, type: "spring" }}
          style={{ transformOrigin: `${x}px ${y - 14}px` }}
        />
      )}

      {/* Lock icon for locked nodes */}
      {!unlocked && (
        <motion.text
          x={x}
          y={y + 4}
          textAnchor="middle"
          fill="#6b5b7b"
          fontSize={14}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: delay + 0.3 }}
        >
          &#128274;
        </motion.text>
      )}

      {/* Label */}
      <motion.text
        x={x}
        y={y + 36}
        textAnchor="middle"
        fill={unlocked ? "#c9a96e" : "#4a3a5c"}
        fontSize={unlocked ? 11 : 10}
        fontFamily="Cormorant Garamond, Georgia, serif"
        fontWeight={isCurrent ? 600 : 400}
        initial={{ opacity: 0, y: y + 46 }}
        animate={{ opacity: unlocked ? 1 : 0.4, y: y + 36 }}
        transition={{ duration: 0.4, delay: delay + 0.15 }}
      >
        {label}
      </motion.text>
    </g>
  );
}
