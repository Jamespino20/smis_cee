"use client";

import { motion, AnimatePresence } from "motion/react";
import { useProgress, LOCATIONS, type LocationId } from "@/lib/progressContext";
import MapNode from "./MapNode";

interface WorldMapProps {
  isOpen: boolean;
  onClose: () => void;
}

const EDGES: { from: LocationId; to: LocationId; fromX: number; fromY: number; toX: number; toY: number }[] = [];

for (let i = 0; i < LOCATIONS.length; i++) {
  const from = LOCATIONS[i];
  const to = LOCATIONS[(i + 1) % LOCATIONS.length];
  EDGES.push({ from: from.id, to: to.id, fromX: from.x, fromY: from.y, toX: to.x, toY: to.y });
}

function MapPath({
  fromX,
  fromY,
  toX,
  toY,
  unlocked,
  delay,
}: {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  unlocked: boolean;
  delay: number;
}) {
  const midX = (fromX + toX) / 2;
  const midY = (fromY + toY) / 2 - 20;

  return (
    <g>
      {/* Background path (always visible, dim) */}
      <path
        d={`M${fromX},${fromY} Q${midX},${midY} ${toX},${toY}`}
        fill="none"
        stroke="rgba(74,58,92,0.3)"
        strokeWidth={1.5}
        strokeDasharray="6 4"
      />
      {/* Animated path (visible when unlocked) */}
      {unlocked && (
        <motion.path
          d={`M${fromX},${fromY} Q${midX},${midY} ${toX},${toY}`}
          fill="none"
          stroke="url(#pathGradient)"
          strokeWidth={2}
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay, ease: "easeInOut" }}
        />
      )}
    </g>
  );
}

export default function WorldMap({ isOpen, onClose }: WorldMapProps) {
  const { unlockedLocations, currentLocation, completeLocation, isPathUnlocked } = useProgress();

  const handleNodeClick = (id: LocationId) => {
    completeLocation(id);
    const loc = LOCATIONS.find((l) => l.id === id);
    if (loc) {
      const el = document.getElementById(loc.sectionId);
      if (el) {
        onClose();
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 300);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="map-backdrop"
            className="fixed inset-0 z-50 bg-lake-deep/90 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* Map panel */}
          <motion.div
            key="map-panel"
            className="fixed inset-4 sm:inset-8 md:inset-12 z-50 flex flex-col items-center justify-center rounded-2xl border border-sunset-gold/20 overflow-hidden"
            style={{ background: "linear-gradient(135deg, #0F0F1A 0%, #1A0F26 50%, #2D1B3D 100%)" }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* Title bar */}
            <div className="w-full flex items-center justify-between px-6 py-4 border-b border-sunset-gold/10">
              <div>
                <p className="font-serif text-sakura-pink text-xs tracking-[0.4em] uppercase">
                  World of Vestia
                </p>
                <h2 className="font-display text-2xl md:text-3xl text-cream tracking-wide">
                  The Map
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full border border-sunset-gold/30 flex items-center justify-center text-sunset-gold/60 hover:text-sunset-gold hover:border-sunset-gold/60 transition-colors"
                aria-label="Close map"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Desktop SVG map */}
            <div className="hidden md:flex flex-1 w-full items-center justify-center p-6">
              <svg
                viewBox="0 0 800 500"
                className="w-full h-full max-w-4xl"
                style={{ maxHeight: "calc(100vh - 200px)" }}
              >
                <defs>
                  <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#E8A0BF" />
                    <stop offset="100%" stopColor="#c9a96e" />
                  </linearGradient>
                  <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#E8A0BF" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#c9a96e" stopOpacity="0" />
                  </radialGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Background stars (deterministic positions) */}
                {Array.from({ length: 40 }).map((_, i) => {
                  const px = ((i * 137 + 42) % 800);
                  const py = ((i * 97 + 13) % 500);
                  const pr = 0.3 + ((i * 31) % 15) / 10;
                  const dur = 2 + ((i * 23) % 30) / 10;
                  const del = ((i * 17) % 20) / 10;
                  return (
                    <motion.circle
                      key={`star-${i}`}
                      cx={px}
                      cy={py}
                      r={pr}
                      fill="rgba(232,192,160,0.15)"
                      animate={{ opacity: [0.1, 0.4, 0.1] }}
                      transition={{
                        duration: dur,
                        repeat: Infinity,
                        delay: del,
                      }}
                    />
                  );
                })}

                {/* Paths between nodes */}
                {EDGES.map((edge, i) => (
                  <MapPath
                    key={`${edge.from}-${edge.to}`}
                    fromX={edge.fromX}
                    fromY={edge.fromY}
                    toX={edge.toX}
                    toY={edge.toY}
                    unlocked={isPathUnlocked(edge.from, edge.to)}
                    delay={0.1 * i}
                  />
                ))}

                {/* Location nodes */}
                {LOCATIONS.map((loc, i) => (
                  <MapNode
                    key={loc.id}
                    id={loc.id}
                    label={loc.label}
                    x={loc.x}
                    y={loc.y}
                    unlocked={unlockedLocations.has(loc.id)}
                    isCurrent={currentLocation === loc.id}
                    onClick={() => handleNodeClick(loc.id)}
                    delay={0.05 * i}
                  />
                ))}
              </svg>
            </div>

            {/* Mobile vertical list */}
            <div className="md:hidden flex-1 w-full overflow-y-auto p-4 space-y-3">
              <p className="text-center font-serif text-cream/40 text-xs tracking-widest uppercase mb-4">
                Tap a location to explore
              </p>
              {LOCATIONS.map((loc, i) => {
                const unlocked = unlockedLocations.has(loc.id);
                const isCurrent = currentLocation === loc.id;
                return (
                  <motion.button
                    key={loc.id}
                    disabled={!unlocked}
                    onClick={() => handleNodeClick(loc.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl border transition-colors ${
                      unlocked
                        ? "border-sunset-gold/30 bg-twilight/60 hover:bg-twilight"
                        : "border-lake-shadow/40 bg-lake-deep/40 opacity-40 cursor-not-allowed"
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: unlocked ? 1 : 0.4, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.05 * i }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full flex-shrink-0 ${
                          isCurrent ? "bg-sakura-pink" : unlocked ? "bg-sunset-gold" : "bg-lake-shadow"
                        }`}
                      />
                      <div>
                        <p
                          className={`font-display text-sm tracking-wide ${
                            unlocked ? "text-cream" : "text-cream/30"
                          }`}
                        >
                          {loc.label}
                        </p>
                        {!unlocked && (
                          <p className="text-[10px] text-cream/20 font-serif">Locked</p>
                        )}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Footer hint */}
            <div className="w-full px-6 py-3 border-t border-sunset-gold/10 text-center">
              <p className="font-serif text-cream/30 text-xs">
                {unlockedLocations.size} of {LOCATIONS.length} locations discovered
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
