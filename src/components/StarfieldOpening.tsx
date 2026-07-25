"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Star {
  x: number;
  y: number;
  radius: number;
  baseRadius: number;
  opacity: number;
  targetOpacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  isConstellation: boolean;
  constellationIndex: number;
  expandedX: number;
  expandedY: number;
}

interface StarfieldOpeningProps {
  onEnter?: () => void;
}

const STAR_COLOR = "#f5f0e8";
const CONSTELLATION_COLOR = "#c9a96e";
const LINE_ALPHA = 0.4;
const BG_COLOR = "#0a0a1a";

// Vestia constellation: a triangle with radiating lines (vertex indices)
// Triangle vertices: 0 (top), 1 (bottom-left), 2 (bottom-right)
// Radiating points: 3 (top-left), 4 (top-right), 5 (bottom)
const CONSTELLATION_EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 0], // triangle
  [0, 3],
  [0, 4],
  [1, 5],
  [2, 5], // radiating lines
];

function getConstellationPoints(w: number, h: number) {
  const cx = w / 2;
  const cy = h / 2;
  const scale = Math.min(w, h) * 0.28;
  return [
    { x: cx, y: cy - scale }, // top
    { x: cx - scale * 0.866, y: cy + scale * 0.5 }, // bottom-left
    { x: cx + scale * 0.866, y: cy + scale * 0.5 }, // bottom-right
    { x: cx - scale * 1.3, y: cy - scale * 0.6 }, // top-left ray
    { x: cx + scale * 1.3, y: cy - scale * 0.6 }, // top-right ray
    { x: cx, y: cy + scale * 1.4 }, // bottom ray
  ];
}

export default function StarfieldOpening({ onEnter }: StarfieldOpeningProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animFrameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const [phase, setPhase] = useState<"stars" | "constellation" | "text" | "exiting">("stars");
  const [entered, setEntered] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);

  const initStars = useCallback((w: number, h: number) => {
    const isMobile = w < 768;
    const starCount = isMobile ? 80 : 200;
    const constellationPts = getConstellationPoints(w, h);

    const stars: Star[] = [];

    // Constellation stars (fixed positions)
    constellationPts.forEach((pt, i) => {
      stars.push({
        x: pt.x,
        y: pt.y,
        radius: isMobile ? 2.5 : 3.5,
        baseRadius: isMobile ? 2.5 : 3.5,
        opacity: 0,
        targetOpacity: 1,
        twinkleSpeed: 0.3 + Math.random() * 0.4,
        twinkleOffset: Math.random() * Math.PI * 2,
        isConstellation: true,
        constellationIndex: i,
        expandedX: pt.x + (Math.random() - 0.5) * w * 2,
        expandedY: pt.y + (Math.random() - 0.5) * h * 2,
      });
    });

    // Background stars
    for (let i = 0; i < starCount; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const r = 0.5 + Math.random() * 1.5;
      stars.push({
        x,
        y,
        radius: r,
        baseRadius: r,
        opacity: 0,
        targetOpacity: 0.3 + Math.random() * 0.7,
        twinkleSpeed: 0.2 + Math.random() * 0.8,
        twinkleOffset: Math.random() * Math.PI * 2,
        isConstellation: false,
        constellationIndex: -1,
        expandedX: x + (Math.random() - 0.5) * w * 2,
        expandedY: y + (Math.random() - 0.5) * h * 2,
      });
    }

    starsRef.current = stars;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
      initStars(window.innerWidth, window.innerHeight);
    };

    resize();
    setCanvasReady(true);
    startTimeRef.current = performance.now();

    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [initStars]);

  // Phase transitions
  useEffect(() => {
    if (!canvasReady) return;
    const t1 = setTimeout(() => setPhase("constellation"), 1500);
    const t2 = setTimeout(() => setPhase("text"), 3500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [canvasReady]);

  // Main animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = (time: number) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const elapsed = (time - startTimeRef.current) / 1000;

      ctx.clearRect(0, 0, w, h);

      // Background
      const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.7);
      grad.addColorStop(0, "#12122a");
      grad.addColorStop(1, BG_COLOR);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      const stars = starsRef.current;
      const showLines = phase === "constellation" || phase === "text" || phase === "exiting";

      for (const star of stars) {
        // Fade in based on time and phase
        const fadeDelay = star.isConstellation
          ? 0.3 + star.constellationIndex * 0.15
          : 0.1 + Math.random() * 0.5;
        const fadeProgress = Math.max(0, Math.min(1, (elapsed - fadeDelay) / 1.2));
        star.opacity += (star.targetOpacity * fadeProgress - star.opacity) * 0.05;

        // Twinkle
        const twinkle = 0.6 + 0.4 * Math.sin(elapsed * star.twinkleSpeed + star.twinkleOffset);

        // Expansion on enter
        let drawX = star.x;
        let drawY = star.y;
        let drawRadius = star.radius;
        let drawOpacity = star.opacity * twinkle;

        if (entered) {
          const expandProgress = Math.min(1, (elapsed - 0) / 1.5);
          const ease = expandProgress * expandProgress;
          drawX += (star.expandedX - star.x) * ease;
          drawY += (star.expandedY - star.y) * ease;
          drawRadius = star.radius * (1 + ease * 3);
          drawOpacity = star.opacity * twinkle * (1 - ease);
        }

        // Draw star
        ctx.beginPath();
        ctx.arc(drawX, drawY, Math.max(0.1, drawRadius), 0, Math.PI * 2);
        const color = star.isConstellation ? CONSTELLATION_COLOR : STAR_COLOR;
        ctx.fillStyle = color;
        ctx.globalAlpha = Math.max(0, drawOpacity);
        ctx.fill();

        // Glow for constellation stars
        if (star.isConstellation && drawOpacity > 0.1) {
          ctx.beginPath();
          ctx.arc(drawX, drawY, drawRadius * 3, 0, Math.PI * 2);
          const glow = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, drawRadius * 3);
          glow.addColorStop(0, `rgba(201,169,110,${0.3 * drawOpacity})`);
          glow.addColorStop(1, "rgba(201,169,110,0)");
          ctx.fillStyle = glow;
          ctx.globalAlpha = 1;
          ctx.fill();
        }
      }

      // Draw constellation lines
      if (showLines) {
        const lineAlpha = Math.min(1, elapsed - 1.5) * LINE_ALPHA;
        if (lineAlpha > 0) {
          const constellationStars = stars.filter((s) => s.isConstellation);
          ctx.globalAlpha = lineAlpha;
          ctx.strokeStyle = CONSTELLATION_COLOR;
          ctx.lineWidth = 1;

          for (const [a, b] of CONSTELLATION_EDGES) {
            const sa = constellationStars[a];
            const sb = constellationStars[b];
            if (!sa || !sb) continue;

            let ax = sa.x, ay = sa.y;
            let bx = sb.x, by = sb.y;

            if (entered) {
              const expandProgress = Math.min(1, (elapsed - 0) / 1.5);
              const ease = expandProgress * expandProgress;
              ax += (sa.expandedX - sa.x) * ease;
              ay += (sa.expandedY - sa.y) * ease;
              bx += (sb.expandedX - sb.x) * ease;
              by += (sb.expandedY - sb.y) * ease;
            }

            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.lineTo(bx, by);
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
      animFrameRef.current = requestAnimationFrame(draw);
    };

    animFrameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [phase, entered, canvasReady]);

  const handleEnter = useCallback(() => {
    setEntered(true);
    setPhase("exiting");
    setTimeout(() => {
      onEnter?.();
    }, 1200);
  }, [onEnter]);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: BG_COLOR }}
      />

      {/* Text overlay */}
      <div className="relative z-10 text-center px-5 sm:px-6 pointer-events-none">
        <AnimatePresence>
          {(phase === "text" || phase === "exiting") && !entered && (
            <>
              <motion.p
                key="subtitle-pre"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 1 }}
                className="font-serif text-sm sm:text-base md:text-lg tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-3 sm:mb-4"
                style={{ color: "#c9a96e" }}
              >
                A world made for its creator
              </motion.p>

              <motion.h1
                key="title"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                className="font-display text-5xl sm:text-6xl md:text-8xl lg:text-9xl mb-6 sm:mb-8"
                style={{
                  color: "#c9a96e",
                  textShadow: "0 0 60px rgba(201,169,110,0.3)",
                }}
              >
                Welcome to Vestia.
              </motion.h1>

              <motion.div
                key="line"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="w-24 sm:w-32 h-px mx-auto mb-8 sm:mb-10"
                style={{
                  background: "linear-gradient(to right, transparent, #c9a96e, transparent)",
                }}
              />

              <motion.button
                key="enter-btn"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                onClick={handleEnter}
                className="pointer-events-auto relative px-10 sm:px-14 py-3 sm:py-4 font-serif text-sm sm:text-base tracking-[0.25em] uppercase cursor-pointer transition-all duration-300 hover:scale-105"
                style={{
                  color: "#c9a96e",
                  border: "1px solid rgba(201,169,110,0.5)",
                  background: "rgba(10,10,26,0.6)",
                  boxShadow:
                    "0 0 20px rgba(201,169,110,0.15), inset 0 0 20px rgba(201,169,110,0.05)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 0 40px rgba(201,169,110,0.35), inset 0 0 30px rgba(201,169,110,0.1)";
                  e.currentTarget.style.borderColor = "rgba(201,169,110,0.8)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 0 20px rgba(201,169,110,0.15), inset 0 0 20px rgba(201,169,110,0.05)";
                  e.currentTarget.style.borderColor = "rgba(201,169,110,0.5)";
                }}
              >
                Enter Vestia
              </motion.button>
            </>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
