"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { animate, random } from "animejs";

const COLORS = {
  oldGold: "#c9a96e",
  cream: "#f5f0e8",
  terracotta: "#c67a4b",
  woodBrown: "#5c3d2e",
};

interface WindParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
}

export default function ArchersAim({
  isActive,
  onComplete,
}: {
  isActive: boolean;
  onComplete: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [phase, setPhase] = useState<"aiming" | "drawing" | "fired" | "impact" | "done">("aiming");
  const [pullX, setPullX] = useState(60);
  const [isDragging, setIsDragging] = useState(false);
  const [bowGlow, setBowGlow] = useState(false);
  const particlesRef = useRef<WindParticle[]>([]);
  const frameRef = useRef<number>(0);
  const arrowRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    setMousePos({
      x: (clientX - rect.left) / rect.width,
      y: (clientY - rect.top) / rect.height,
    });
  }, []);

  const handleBowDown = useCallback((clientX: number) => {
    if (phase !== "aiming" || !isActive) return;
    setIsDragging(true);
    setPhase("drawing");
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const bowCenterX = rect.left + rect.width * 0.75;
    const diff = clientX - bowCenterX;
    const clamped = Math.max(60, Math.min(80, 60 + diff / 3));
    setPullX(clamped);
  }, [phase, isActive]);

  const handleBowMove = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const bowCenterX = rect.left + rect.width * 0.75;
    const diff = clientX - bowCenterX;
    const clamped = Math.max(60, Math.min(80, 60 + diff / 3));
    setPullX(clamped);
  }, []);

  const handleBowUp = useCallback(() => {
    setIsDragging(false);
    setPullX(60);
    setPhase("fired");
    setTimeout(() => setPhase("impact"), 1000);
    setTimeout(() => {
      setPhase("done");
      onComplete();
    }, 3000);
  }, [onComplete]);

  // Document-level drag listeners
  useEffect(() => {
    if (!isDragging) return;
    const handleMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      handleBowMove(clientX);
    };
    const handleUp = () => {
      handleBowUp();
    };
    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleUp);
    document.addEventListener("touchmove", handleMove, { passive: false });
    document.addEventListener("touchend", handleUp);
    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleUp);
      document.removeEventListener("touchmove", handleMove);
      document.removeEventListener("touchend", handleUp);
    };
  }, [isDragging, handleBowMove, handleBowUp]);

  // Rose petal explosion on impact
  useEffect(() => {
    if (phase !== "impact" || !containerRef.current) return;
    const container = containerRef.current;
    const particles: HTMLDivElement[] = [];
    for (let i = 0; i < 30; i++) {
      const el = document.createElement("div");
      const hue = 330 + Math.random() * 30;
      el.className = "absolute w-2 h-2 rounded-full pointer-events-none";
      el.style.cssText = `
        background: hsl(${hue}, 70%, 70%);
        box-shadow: 0 0 6px hsla(${hue}, 70%, 60%, 0.8);
        left: 10%; top: 35%;
      `;
      container.appendChild(el);
      particles.push(el);
      const angle = Math.random() * Math.PI * 2;
      const dist = 50 + Math.random() * 150;
      animate(el, {
        translateX: Math.cos(angle) * dist,
        translateY: Math.sin(angle) * dist,
        opacity: [1, 0],
        scale: [1, 0.3],
        duration: 800 + Math.random() * 600,
        ease: "outExpo",
      });
      setTimeout(() => el.remove(), 1500);
    }
  }, [phase]);

  // Canvas wind particles
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

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      // Spawn wind particles
      if (Math.random() < 0.3) {
        const windX = (mousePos.x - 0.5) * 3;
        particlesRef.current.push({
          x: random(0, w),
          y: random(0, h),
          vx: windX + random(-0.3, 0.3),
          vy: random(-0.5, 0.5),
          size: random(1, 3),
          opacity: random(0.1, 0.3),
          life: random(1, 3),
        });
      }

      // Update + draw particles
      particlesRef.current = particlesRef.current.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.016;
        p.opacity = Math.max(0, p.life / 3) * 0.3;
        if (p.life <= 0 || p.x < -10 || p.x > w + 10) return false;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 169, 110, ${p.opacity})`;
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
  }, [isActive, mousePos]);

  if (!isActive) return null;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
    >
      {/* Warm gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#2a1f15] via-[#1f1710] to-[#15100a]" />

      {/* Canvas for wind particles */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Chapter title */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="absolute top-[8%] left-0 right-0 text-center z-20"
      >
        <p className="font-display text-sm md:text-base tracking-[0.3em] uppercase text-[#c9a96e]">
          III — The Archer&apos;s Aim
        </p>
      </motion.div>

      {/* Aiming reticle */}
      <motion.div
        animate={{
          x: (mousePos.x - 0.5) * -20,
          y: (mousePos.y - 0.5) * -15,
        }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
        className="absolute z-10 pointer-events-none"
        style={{ left: "15%", top: "10%" }}
      >
        <svg width="100" height="100" viewBox="0 0 100 100" className="opacity-50">
          <circle cx="50" cy="50" r="42" fill="none" stroke={COLORS.oldGold} strokeWidth="0.8" opacity="0.4" />
          <circle cx="50" cy="50" r="25" fill="none" stroke={COLORS.oldGold} strokeWidth="0.5" opacity="0.25" />
          <line x1="50" y1="4" x2="50" y2="20" stroke={COLORS.oldGold} strokeWidth="0.8" opacity="0.4" />
          <line x1="50" y1="80" x2="50" y2="96" stroke={COLORS.oldGold} strokeWidth="0.8" opacity="0.4" />
          <line x1="4" y1="50" x2="20" y2="50" stroke={COLORS.oldGold} strokeWidth="0.8" opacity="0.4" />
          <line x1="80" y1="50" x2="96" y2="50" stroke={COLORS.oldGold} strokeWidth="0.8" opacity="0.4" />
          <circle cx="50" cy="50" r="3" fill={COLORS.oldGold} opacity="0.6" />
          <text x="50" y="6" textAnchor="middle" fill={COLORS.oldGold} fontSize="7" opacity="0.35" fontFamily="serif">N</text>
          <text x="50" y="98" textAnchor="middle" fill={COLORS.oldGold} fontSize="7" opacity="0.35" fontFamily="serif">S</text>
          <text x="6" y="54" textAnchor="middle" fill={COLORS.oldGold} fontSize="7" opacity="0.35" fontFamily="serif">W</text>
          <text x="94" y="54" textAnchor="middle" fill={COLORS.oldGold} fontSize="7" opacity="0.35" fontFamily="serif">E</text>
        </svg>
      </motion.div>

      {/* Bow (interactive zone) */}
      <div
        className="absolute z-20 cursor-grab active:cursor-grabbing"
        style={{ right: "20%", top: "30%" }}
        onMouseEnter={() => setBowGlow(true)}
        onMouseLeave={() => { setBowGlow(false); if (!isDragging) handleBowUp(); }}
        onMouseDown={(e) => handleBowDown(e.clientX)}
        onTouchStart={(e) => { e.preventDefault(); handleBowDown(e.touches[0].clientX); }}
      >
        {/* Bow shape */}
        <motion.div
          animate={{
            scaleX: phase === "drawing" ? 1.05 : 1,
            x: phase === "drawing" ? 5 : 0,
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative"
        >
          <svg width="120" height="200" viewBox="0 0 120 200" className="overflow-visible">
            {/* Bow arc */}
            <motion.path
              d="M 60 10 C 10 60 10 140 60 190"
              stroke={bowGlow ? COLORS.oldGold : COLORS.woodBrown}
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              animate={{
                filter: bowGlow
                  ? [
                      "drop-shadow(0 0 5px rgba(201,169,110,0.3))",
                      "drop-shadow(0 0 15px rgba(201,169,110,0.6))",
                      "drop-shadow(0 0 5px rgba(201,169,110,0.3))",
                    ]
                  : "drop-shadow(0 0 0 rgba(201,169,110,0))",
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            {/* Bowstring - V shape outward when pulled */}
            <motion.line
              x1="60" y1="10"
              x2={phase === "drawing" ? pullX : 60}
              y2="100"
              stroke={COLORS.cream} strokeWidth="1.5"
              animate={{
                x2: phase === "drawing" ? pullX : 60,
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
            <motion.line
              x1={phase === "drawing" ? pullX : 60}
              y1="100"
              x2="60" y2="190"
              stroke={COLORS.cream} strokeWidth="1.5"
              animate={{
                x1: phase === "drawing" ? pullX : 60,
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
            {/* Arrow (visible when drawing) */}
            <AnimatePresence>
              {phase === "drawing" && (
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, x: -200 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Arrow shaft: from nock at string to tip pointing left */}
                  <motion.line
                    x1={pullX} y1="100"
                    x2={pullX - 30} y2="100"
                    stroke={COLORS.woodBrown}
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  {/* Arrowhead (pointing left) */}
                  <motion.polygon
                    points={`${pullX - 25},95 ${pullX - 30},100 ${pullX - 25},105`}
                    fill={COLORS.oldGold}
                  />
                  {/* Fletching */}
                  <motion.polygon
                    points={`${pullX - 3},96 ${pullX},100 ${pullX - 3},104`}
                    fill={COLORS.terracotta}
                    opacity={0.6}
                  />
                </motion.g>
              )}
            </AnimatePresence>
          </svg>
        </motion.div>
      </div>

      {/* Target on left side */}
      <div
        className="absolute z-10 pointer-events-none"
        style={{ left: "10%", top: "35%" }}
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="80" height="80" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="38" fill="none" stroke={COLORS.oldGold} strokeWidth="1" opacity="0.3" />
            <circle cx="40" cy="40" r="28" fill="none" stroke={COLORS.oldGold} strokeWidth="1.5" opacity="0.4" />
            <circle cx="40" cy="40" r="18" fill="none" stroke={COLORS.terracotta} strokeWidth="2" opacity="0.5" />
            <circle cx="40" cy="40" r="8" fill={COLORS.terracotta} opacity="0.4" />
            <circle cx="40" cy="40" r="3" fill={COLORS.oldGold} opacity="0.6" />
          </svg>
        </motion.div>
      </div>

      {/* Fired arrow streak */}
      <AnimatePresence>
        {phase === "fired" && (
          <motion.div
            ref={arrowRef}
            initial={{ right: "22%", top: "38%", opacity: 1 }}
            animate={{ right: "120%", opacity: [1, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeIn" }}
            className="absolute z-30 pointer-events-none"
          >
            <div
              className="w-32 h-1 rounded-full"
              style={{
                background: `linear-gradient(to right, transparent, ${COLORS.oldGold}, ${COLORS.cream})`,
                boxShadow: `0 0 20px ${COLORS.oldGold}`,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Impact flash */}
      <AnimatePresence>
        {phase === "impact" && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 0.6, 0], scale: [0, 2, 3] }}
            transition={{ duration: 1 }}
            className="absolute left-[10%] top-[35%] z-30 pointer-events-none"
          >
            <div
              className="w-20 h-20 rounded-full"
              style={{
                background: `radial-gradient(circle, ${COLORS.oldGold}, transparent)`,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message */}
      <AnimatePresence>
        {(phase === "impact" || phase === "done") && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="absolute bottom-[12%] left-0 right-0 text-center px-6 z-30"
          >
            <p className="font-display text-xl md:text-2xl lg:text-3xl text-[#f5f0e8] tracking-wide">
              The aim of a true heart never misses.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bow hint */}
      {phase === "aiming" && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-12 z-30 text-[#c9a96e] text-sm tracking-widest font-serif"
        >
          TAP THE BOW
        </motion.p>
      )}
    </div>
  );
}
