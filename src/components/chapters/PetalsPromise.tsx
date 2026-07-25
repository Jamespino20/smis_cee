"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

const COLORS = {
  dustyPink: "#d4a0b9",
  cream: "#f5f0e8",
  mauve: "#9b7a9b",
  rose: "#c97a8a",
};

interface Petal {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotSpeed: number;
  opacity: number;
  wobble: number;
  wobbleSpeed: number;
  hue: number;
}

interface WordParticle {
  targetX: number;
  targetY: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
}

const WORDS = ["YOU", "ARE", "LOVED"];

function getTextPositions(
  text: string,
  centerX: number,
  centerY: number,
  fontSize: number
): { x: number; y: number }[] {
  const chars = text.split("");
  const charWidth = fontSize * 0.65;
  const totalWidth = chars.length * charWidth;
  const startX = centerX - totalWidth / 2;

  return chars.map((_, i) => ({
    x: startX + i * charWidth + charWidth / 2,
    y: centerY,
  }));
}

export default function PetalsPromise({
  isActive,
  onComplete,
}: {
  isActive: boolean;
  onComplete: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [phase, setPhase] = useState<"drifting" | "gathering" | "word" | "dispersing" | "message" | "done">("drifting");
  const [wordIndex, setWordIndex] = useState(0);
  const petalsRef = useRef<Petal[]>([]);
  const wordParticlesRef = useRef<WordParticle[]>([]);
  const frameRef = useRef<number>(0);
  const prevTimeRef = useRef<number>(0);

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

  // Phase progression
  useEffect(() => {
    if (!isActive || phase !== "drifting") return;
    const t1 = setTimeout(() => setPhase("gathering"), 3000);
    const t2 = setTimeout(() => setPhase("word"), 5000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [isActive, phase]);

  useEffect(() => {
    if (!isActive || phase !== "word") return;

    let current = 0;
    const showWord = () => {
      if (current >= WORDS.length) {
        setPhase("dispersing");
        setTimeout(() => setPhase("message"), 1500);
        setTimeout(() => {
          setPhase("done");
          onComplete();
        }, 4000);
        return;
      }
      setWordIndex(current);
      current++;
      setTimeout(showWord, 1500);
    };
    showWord();
  }, [isActive, phase, onComplete]);

  // Create word particles when entering word phase
  useEffect(() => {
    if (phase !== "word") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    const fontSize = Math.min(w * 0.12, 80);
    const positions = getTextPositions(WORDS[wordIndex], w / 2, h / 2, fontSize);

    // Convert existing petals into word-targeting particles
    const newParticles: WordParticle[] = positions.map((pos, i) => ({
      targetX: pos.x,
      targetY: pos.y,
      x: petalsRef.current[i % petalsRef.current.length]?.x ?? random(0, w),
      y: petalsRef.current[i % petalsRef.current.length]?.y ?? random(0, h),
      size: random(3, 6),
      opacity: 1,
    }));

    wordParticlesRef.current = newParticles;
  }, [phase, wordIndex]);

  function random(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  // Canvas render loop
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

    const draw = (timestamp: number) => {
      const dt = prevTimeRef.current ? (timestamp - prevTimeRef.current) / 1000 : 0.016;
      prevTimeRef.current = timestamp;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      // Spawn petals
      if (phase === "drifting" || phase === "gathering") {
        if (Math.random() < 0.4) {
          const windX = (mousePos.x - 0.5) * 4;
          petalsRef.current.push({
            x: random(0, w),
            y: random(-20, -5),
            vx: windX + random(-0.5, 0.5),
            vy: random(0.5, 2),
            size: random(4, 10),
            rotation: random(0, 360),
            rotSpeed: random(-2, 2),
            opacity: random(0.4, 0.8),
            wobble: random(0, Math.PI * 2),
            wobbleSpeed: random(1, 3),
            hue: random(320, 350),
          });
        }
      }

      // Update petals
      petalsRef.current = petalsRef.current.filter((p) => {
        if (phase === "gathering") {
          // Drift toward center
          const cx = w / 2;
          const cy = h / 2;
          p.vx += (cx - p.x) * 0.001;
          p.vy += (cy - p.y) * 0.001;
          p.vx *= 0.99;
          p.vy *= 0.99;
        } else if (phase === "dispersing") {
          // Fly outward
          const dx = p.x - w / 2;
          const dy = p.y - h / 2;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          p.vx += (dx / dist) * 0.5;
          p.vy += (dy / dist) * 0.5;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.wobble += p.wobbleSpeed * dt;
        p.x += Math.sin(p.wobble) * 0.5;
        p.rotation += p.rotSpeed;

        if (phase === "dispersing") {
          p.opacity -= 0.005;
        }

        if (p.y > h + 20 || p.opacity <= 0) return false;

        // Draw petal
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;

        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
        grad.addColorStop(0, `hsla(${p.hue}, 50%, 80%, 1)`);
        grad.addColorStop(1, `hsla(${p.hue}, 40%, 70%, 0.5)`);
        ctx.fillStyle = grad;

        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        return true;
      });

      // Draw word particles
      if (phase === "word") {
        wordParticlesRef.current.forEach((p) => {
          // Lerp toward target
          p.x += (p.targetX - p.x) * 0.05;
          p.y += (p.targetY - p.y) * 0.05;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          const alpha = Math.min(1, Math.abs(p.targetX - p.x) < 5 ? 1 : 0.6);
          ctx.fillStyle = `rgba(212, 160, 185, ${alpha})`;
          ctx.fill();
        });
      }

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [isActive, mousePos, phase, wordIndex]);

  if (!isActive) return null;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a1218] via-[#1f1520] to-[#15101a]" />

      {/* Canvas for petals */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Title */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute top-[8%] left-0 right-0 text-center z-20"
      >
        <p className="font-display text-sm md:text-base tracking-[0.3em] uppercase text-[#d4a0b9]">
          Chapter IV
        </p>
      </motion.div>

      {/* Word display */}
      <AnimatePresence mode="wait">
        {phase === "word" && (
          <motion.div
            key={wordIndex}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.5 }}
            className="absolute z-20 pointer-events-none"
          >
            <p
              className="font-display text-5xl md:text-7xl lg:text-8xl tracking-widest"
              style={{
                color: COLORS.dustyPink,
                textShadow: `0 0 40px rgba(212, 160, 185, 0.5)`,
              }}
            >
              {WORDS[wordIndex]}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Final message */}
      <AnimatePresence>
        {phase === "message" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="absolute z-20 text-center px-6"
          >
            <p className="font-display text-xl md:text-2xl lg:text-3xl text-[#f5f0e8] tracking-wide leading-relaxed">
              Each petal carries a whisper:
              <br />
              <span className="text-[#d4a0b9]">you are loved, you are celebrated, you are home.</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint */}
      {phase === "drifting" && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-12 z-30 text-[#d4a0b9] text-sm tracking-widest font-serif"
        >
          MOVE YOUR CURSOR TO GUIDE THE WIND
        </motion.p>
      )}
    </div>
  );
}
