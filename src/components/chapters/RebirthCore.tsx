"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
  hue: number;
}

const COLORS = {
  indigo: "#1a1a3e",
  violet: "#6b4c9a",
  gold: "#c9a96e",
  white: "#f5f0e8",
};

export default function RebirthCore({
  isActive,
  onComplete,
}: {
  isActive: boolean;
  onComplete: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"idle" | "flashing" | "cracked" | "message" | "done">("idle");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const frameRef = useRef<number>(0);
  const burstParticlesRef = useRef<Particle[]>([]);

  const handleMouseMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    setMousePos({ x: clientX - rect.left, y: clientY - rect.top });
  }, []);

  const handleClick = useCallback(() => {
    if (phase !== "idle" || !isActive) return;

    setPhase("flashing");
    setPhase("cracked");

    setTimeout(() => setPhase("message"), 1200);
    setTimeout(() => {
      setPhase("done");
      onComplete();
    }, 4000);
  }, [phase, isActive, onComplete]);

  // Canvas animation loop
  useEffect(() => {
    if (!isActive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    let time = 0;
    const draw = () => {
      time += 0.016;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      // Draw core
      const cx = w / 2;
      const cy = h / 2;

      // Proximity effect
      const dx = mousePos.x - cx;
      const dy = mousePos.y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const proximity = Math.max(0, 1 - dist / 300);

      // Pulsing core
      const pulse = Math.sin(time * 2) * 0.15 + 0.85;
      const coreRadius = 60 * pulse + proximity * 15;

      // Outer glow
      const glowSize = coreRadius * 2.5 + proximity * 40;
      const gradient = ctx.createRadialGradient(cx, cy, coreRadius * 0.3, cx, cy, glowSize);
      gradient.addColorStop(0, `rgba(107, 76, 154, ${0.6 + proximity * 0.3})`);
      gradient.addColorStop(0.4, `rgba(26, 26, 62, ${0.4 + proximity * 0.2})`);
      gradient.addColorStop(1, "rgba(26, 26, 62, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      // Core body
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreRadius);
      coreGrad.addColorStop(0, `rgba(201, 169, 110, ${0.9 + proximity * 0.1})`);
      coreGrad.addColorStop(0.5, `rgba(107, 76, 154, ${0.7 + proximity * 0.2})`);
      coreGrad.addColorStop(1, "rgba(26, 26, 62, 0.8)");
      ctx.beginPath();
      ctx.arc(cx, cy, coreRadius, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.fill();

      // Inner particles (fragments of light inside core)
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2 + time * 0.5;
        const r = coreRadius * 0.4 * (0.5 + Math.sin(time * 3 + i) * 0.3);
        const px = cx + Math.cos(angle) * r;
        const py = cy + Math.sin(angle) * r;
        const pSize = 1.5 + Math.sin(time * 2 + i * 0.5) * 0.8;
        const pAlpha = 0.5 + Math.sin(time * 3 + i) * 0.3;

        ctx.beginPath();
        ctx.arc(px, py, pSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 240, 232, ${pAlpha})`;
        ctx.fill();
      }

      // Burst particles
      burstParticlesRef.current = burstParticlesRef.current.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.016;
        p.opacity = Math.max(0, p.life / p.maxLife);
        p.vy += 0.02;

        if (p.life <= 0) return false;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.opacity, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 70%, 75%, ${p.opacity})`;
        ctx.fill();
        return true;
      });

      frameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [isActive, mousePos, phase]);

  function random(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  // Burst particles on click
  useEffect(() => {
    if (phase !== "cracked") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cx = canvas.offsetWidth / 2;
    const cy = canvas.offsetHeight / 2;

    for (let i = 0; i < 60; i++) {
      const angle = (i / 60) * Math.PI * 2 + random(-0.1, 0.1);
      const speed = random(2, 8);
      burstParticlesRef.current.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: random(2, 5),
        opacity: 1,
        life: random(1, 2.5),
        maxLife: 2.5,
        hue: random(260, 45),
      });
    }
  }, [phase]);

  if (!isActive) return null;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center overflow-hidden cursor-pointer"
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
      onClick={handleClick}
      onTouchEnd={handleClick}
    >
      {/* Dark background */}
      <div className="absolute inset-0 bg-[#0a0a1a]" />

      {/* Canvas for core + particles */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* White flash overlay */}
      <AnimatePresence>
        {phase === "flashing" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.8, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, times: [0, 0.1, 0.3, 1] }}
            className="absolute inset-0 bg-white z-20 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Crack lines */}
      {phase === "cracked" && (
        <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const len = 120 + i * 15;
            return (
              <motion.line
                key={angle}
                x1="50%"
                y1="50%"
                x2={`${50 + (Math.cos(rad) * len) / 4}%`}
                y2={`${50 + (Math.sin(rad) * len) / 4}%`}
                stroke={COLORS.gold}
                strokeWidth="1.5"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: [0, 0.8, 0.3] }}
                transition={{ duration: 0.8, delay: i * 0.05 }}
              />
            );
          })}
        </svg>
      )}

      {/* Message */}
      <AnimatePresence>
        {(phase === "message" || phase === "done") && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute z-30 text-center px-6"
          >
            <p className="font-display text-2xl md:text-3xl lg:text-4xl text-[#f5f0e8] tracking-wide leading-relaxed">
              Every world begins with a first breath.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tap hint */}
      {phase === "idle" && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-12 z-30 text-[#c9a96e] text-sm tracking-widest font-serif"
        >
          TAP TO IGNITE
        </motion.p>
      )}
    </div>
  );
}
