"use client";

import { motion, useInView } from "motion/react";
import { useRef, useEffect, useState, useCallback } from "react";
import Typewriter from "@/lib/typewriter";

interface EndingSequenceProps {
  onReturnToMap: () => void;
}

export default function EndingSequence({ onReturnToMap }: EndingSequenceProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isInView = useInView(sectionRef, { margin: "-200px" });
  const [phase, setPhase] = useState<"stars" | "gather" | "candle" | "message" | "done">("stars");
  const [flash, setFlash] = useState(false);
  const animationRef = useRef<number>(0);

  const runStarGathering = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    interface Star {
      x: number;
      y: number;
      size: number;
      color: string;
      speed: number;
      angle: number;
      opacity: number;
    }

    const colors = ["#d4a574", "#e8a0bf", "#7ece7e", "#6b4c9a", "#c9a96e", "#f5d0e3"];
    const stars: Star[] = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: Math.random() * 0.02 + 0.005,
      angle: Math.random() * Math.PI * 2,
      opacity: Math.random() * 0.6 + 0.4,
    }));

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    let progress = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      progress += 0.003;

      let allClose = true;
      stars.forEach((star) => {
        const dx = centerX - star.x;
        const dy = centerY - star.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 5) {
          allClose = false;
          star.x += dx * star.speed;
          star.y += dy * star.speed;
          star.angle += 0.02;
        }

        const wobble = Math.sin(star.angle) * 2;
        ctx.beginPath();
        ctx.arc(star.x + wobble, star.y + wobble, star.size, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.opacity * Math.min(1, progress * 3);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      if (allClose || progress > 1) {
        setFlash(true);
        setTimeout(() => setFlash(false), 1500);
        setPhase("candle");
        return;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
  }, []);

  useEffect(() => {
    if (isInView && phase === "stars") {
      setPhase("gather");
    }
  }, [isInView, phase]);

  useEffect(() => {
    if (phase === "gather") {
      runStarGathering();
    }
    return () => cancelAnimationFrame(animationRef.current);
  }, [phase, runStarGathering]);

  useEffect(() => {
    if (phase === "candle") {
      const t = setTimeout(() => setPhase("message"), 2500);
      return () => clearTimeout(t);
    }
    if (phase === "message") {
      const t = setTimeout(() => setPhase("done"), 3000);
      return () => clearTimeout(t);
    }
  }, [phase]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[#050510]" />

      {/* Star gathering canvas */}
      {(phase === "gather" || phase === "stars") && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-10"
          style={{ pointerEvents: "none" }}
        />
      )}

      {/* White flash when particles converge */}
      {flash && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.6, 0] }}
          transition={{ duration: 1.5, times: [0, 0.15, 1] }}
          className="absolute inset-0 z-20 bg-white pointer-events-none"
        />
      )}

      {/* Candle flame */}
      {(phase === "candle" || phase === "message" || phase === "done") && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="relative z-20"
        >
          <svg width="60" height="100" viewBox="0 0 60 100" className="mb-8">
            {/* Candle body */}
            <rect x="22" y="55" width="16" height="40" rx="3" fill="#f5f0e8" opacity="0.8" />
            {/* Wick */}
            <line x1="30" y1="55" x2="30" y2="45" stroke="#888" strokeWidth="1" />
            {/* Flame outer */}
            <motion.ellipse
              cx="30"
              cy="38"
              rx="10"
              ry="18"
              fill="#d4a574"
              animate={{ ry: [18, 20, 17, 19, 18], rx: [10, 9, 11, 10, 10] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Flame inner */}
            <motion.ellipse
              cx="30"
              cy="40"
              rx="5"
              ry="10"
              fill="#f5f0e8"
              animate={{ ry: [10, 12, 9, 11, 10] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            />
            {/* Glow */}
            <circle cx="30" cy="38" r="30" fill="url(#candleGlow)" />
            <defs>
              <radialGradient id="candleGlow">
                <stop offset="0%" stopColor="#d4a574" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#d4a574" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
        </motion.div>
      )}

      {/* Messages */}
      {phase === "message" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="relative z-20 text-center px-6"
        >
          <p className="font-display text-3xl sm:text-4xl md:text-5xl text-cream mb-6" style={{ color: "#f5f0e8" }}>
            <Typewriter text="Happy Birthday, Smiscee." speed={40} />
          </p>
        </motion.div>
      )}

      {phase === "done" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-20 text-center px-6"
        >
          <p className="font-serif text-xl sm:text-2xl text-cream/80 italic mb-10" style={{ color: "rgba(245,240,232,0.8)" }}>
            <Typewriter text="Vestia will be here whenever you return." speed={30} delay={500} />
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReturnToMap}
            className="font-serif text-sm tracking-[0.2em] uppercase px-8 py-3 rounded-full border transition-colors duration-300"
            style={{
              color: "#d4a574",
              borderColor: "rgba(212,165,116,0.4)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#d4a574";
              e.currentTarget.style.background = "rgba(212,165,116,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(212,165,116,0.4)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            Return to Map
          </motion.button>
        </motion.div>
      )}
    </section>
  );
}
