"use client";

import { motion, useInView, AnimatePresence } from "motion/react";
import { useRef, useState, useEffect, useCallback } from "react";

interface StarEntry {
  id: string;
  name: string;
  message: string;
  color: string;
  createdAt: string;
  x: number;
  y: number;
  radius: number;
  twinkleDelay: number;
}

const COLOR_MAP: Record<string, string> = {
  hope: "#4a9eff",
  celebration: "#c9a96e",
  affection: "#d4a0b9",
  growth: "#7cb97c",
  dreams: "#9b7a9b",
};

const COLOR_LABELS: Record<string, string> = {
  hope: "Hope",
  celebration: "Celebration",
  affection: "Affection",
  growth: "Growth",
  dreams: "Dreams",
};

const fallbackEntries: StarEntry[] = [
  {
    id: "1",
    name: "The Rosen Family",
    message: "Thank you for giving us life. Vestia is forever because of you.",
    color: "celebration",
    createdAt: "The First Dawn",
    x: 0, y: 0, radius: 0, twinkleDelay: 0,
  },
  {
    id: "2",
    name: "Oswen",
    message: "Happy Birthday, Creator. You made us more than characters — you made us family.",
    color: "affection",
    createdAt: "The Golden Hour",
    x: 0, y: 0, radius: 0, twinkleDelay: 0,
  },
  {
    id: "3",
    name: "A Friend from Earth",
    message: "Your worlds are magic, but you are the real magic. Happy Birthday!",
    color: "hope",
    createdAt: "Starfall Night",
    x: 0, y: 0, radius: 0, twinkleDelay: 0,
  },
];

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function positionStars(
  entries: StarEntry[],
  width: number,
  height: number
): StarEntry[] {
  const rand = seededRandom(42);
  const placed: { x: number; y: number; r: number }[] = [];
  const margin = 60;
  const minR = 4;
  const maxR = 9;

  return entries.map((entry) => {
    let attempts = 0;
    let x = 0;
    let y = 0;
    const r = minR + rand() * (maxR - minR);

    while (attempts < 200) {
      x = margin + rand() * (width - margin * 2);
      y = margin + rand() * (height - margin * 2);
      const overlaps = placed.some(
        (p) => Math.hypot(p.x - x, p.y - y) < p.r + r + 12
      );
      if (!overlaps) break;
      attempts++;
    }

    placed.push({ x, y, r });

    return {
      ...entry,
      x,
      y,
      radius: r,
      twinkleDelay: rand() * 4,
    };
  });
}

export default function ConstellationGallery() {
  const sectionRef = useRef(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const [stars, setStars] = useState<StarEntry[]>([]);
  const [selectedStar, setSelectedStar] = useState<StarEntry | null>(null);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("celebration");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ w: 800, h: 500 });
  const [mobileStarIndex, setMobileStarIndex] = useState<number | null>(null);
  const starDataKey = stars.length > 0 ? stars[0].id : null;
  const dragRef = useRef({ isDragging: false, startX: 0, startY: 0, offsetX: 0, offsetY: 0, moved: false });

  useEffect(() => {
    fetch("/api/guestbook")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setStars(data);
        } else {
          setStars(fallbackEntries);
        }
      })
      .catch(() => setStars(fallbackEntries));
  }, []);

  useEffect(() => {
    if (!stars.length) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = canvas.parentElement;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const w = Math.floor(rect.width);
    const h = 500;
    canvas.width = w * window.devicePixelRatio;
    canvas.height = h * window.devicePixelRatio;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    setCanvasSize({ w, h });

    const positioned = positionStars(stars, w, h);
    setStars(positioned);
  }, [starDataKey]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    let frame = 0;
    let animId: number;

    const draw = () => {
      frame++;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, canvasSize.w, canvasSize.h);

      const ox = dragRef.current.offsetX;
      const oy = dragRef.current.offsetY;

      // Draw constellation lines between same-color nearby stars
      if (stars.length > 1) {
        const sorted = [...stars].sort((a, b) => a.y - b.y);
        for (let i = 0; i < sorted.length - 1; i++) {
          for (let j = i + 1; j < sorted.length; j++) {
            if (sorted[i].color !== sorted[j].color) continue;
            const dist = Math.hypot(
              sorted[i].x - sorted[j].x,
              sorted[i].y - sorted[j].y
            );
            if (dist < 180) {
              ctx.beginPath();
              ctx.moveTo(sorted[i].x + ox, sorted[i].y + oy);
              ctx.lineTo(sorted[j].x + ox, sorted[j].y + oy);
              ctx.strokeStyle = COLOR_MAP[sorted[i].color] || COLOR_MAP.celebration;
              ctx.globalAlpha = 0.25;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
        }
        ctx.globalAlpha = 1;
      }

      stars.forEach((star, idx) => {
        const colorHex = COLOR_MAP[star.color] || COLOR_MAP.celebration;
        const twinkle = 0.5 + 0.5 * Math.sin((frame + star.twinkleDelay * 60) * 0.04);
        const glowSize = star.radius * 3;
        const sx = star.x + ox;
        const sy = star.y + oy;
        const isHighlighted = mobileStarIndex === idx;

        ctx.save();

        if (isHighlighted) {
          ctx.globalAlpha = 0.4 * twinkle;
          ctx.beginPath();
          ctx.arc(sx, sy, glowSize * 1.8, 0, Math.PI * 2);
          ctx.fillStyle = colorHex;
          ctx.fill();

          ctx.globalAlpha = 0.6 * twinkle;
          ctx.beginPath();
          ctx.arc(sx, sy, star.radius * 3, 0, Math.PI * 2);
          ctx.fillStyle = colorHex;
          ctx.fill();
        }

        ctx.globalAlpha = 0.15 * twinkle;
        ctx.beginPath();
        ctx.arc(sx, sy, glowSize, 0, Math.PI * 2);
        ctx.fillStyle = colorHex;
        ctx.fill();

        ctx.globalAlpha = 0.3 * twinkle;
        ctx.beginPath();
        ctx.arc(sx, sy, star.radius * 1.8, 0, Math.PI * 2);
        ctx.fillStyle = colorHex;
        ctx.fill();

        ctx.globalAlpha = 0.8 + 0.2 * twinkle;
        ctx.beginPath();
        ctx.arc(sx, sy, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = colorHex;
        ctx.fill();

        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(sx, sy, star.radius * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();

        ctx.restore();
      });

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, [stars, canvasSize, mobileStarIndex]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    dragRef.current.startX = e.clientX - dragRef.current.offsetX;
    dragRef.current.startY = e.clientY - dragRef.current.offsetY;
    dragRef.current.isDragging = true;
    dragRef.current.moved = false;
    canvasRef.current?.setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current.isDragging) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      dragRef.current.moved = true;
    }
    dragRef.current.offsetX = dx;
    dragRef.current.offsetY = dy;
  }, []);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    const wasDragging = dragRef.current.moved;
    dragRef.current.isDragging = false;

    if (!wasDragging) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left - dragRef.current.offsetX;
      const my = e.clientY - rect.top - dragRef.current.offsetY;

      const hit = stars.find(
        (s) => Math.hypot(s.x - mx, s.y - my) < s.radius + 16
      );
      if (hit) setSelectedStar(hit);
    }
  }, [stars]);

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (dragRef.current.moved) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left - dragRef.current.offsetX;
      const my = e.clientY - rect.top - dragRef.current.offsetY;

      const hit = stars.find(
        (s) => Math.hypot(s.x - mx, s.y - my) < s.radius + 12
      );
      if (hit) setSelectedStar(hit);
    },
    [stars]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim() || loading) return;

    setLoading(true);
    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          message: message.trim(),
          color,
        }),
      });

      if (res.ok) {
        const newEntry = await res.json();
        setStars((prev) => [
          { ...newEntry, x: 0, y: 0, radius: 0, twinkleDelay: 0 },
          ...prev,
        ]);
        setName("");
        setMessage("");
        setSubmitted(true);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div ref={sectionRef} className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <h3 className="font-display text-2xl sm:text-3xl text-cream mb-2 text-center">
          The Constellation of Wishes
        </h3>
        <p className="font-serif text-cream/50 text-sm text-center mb-8">
          Each wish becomes a star. Click a star to read its light.
        </p>

        {/* Canvas sky */}
        <div className="relative mb-10 rounded-xl overflow-hidden border border-white/10"
          style={{
            background: "linear-gradient(180deg, #0a0a1a 0%, #1a1a3e 100%)",
          }}
        >
          <canvas
            ref={canvasRef}
            className="cursor-grab active:cursor-grabbing"
            style={{ touchAction: "none" }}
            onClick={handleCanvasClick}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          />
        </div>

        {/* Mobile star cycle */}
        {stars.length > 0 && (
          <div className="flex items-center justify-center gap-3 mb-6 sm:hidden">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                const prev = mobileStarIndex !== null ? (mobileStarIndex - 1 + stars.length) % stars.length : stars.length - 1;
                setMobileStarIndex(prev);
                setSelectedStar(stars[prev]);
              }}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-cream">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </motion.button>

            <div className="flex items-center gap-2">
              {stars.map((star, i) => (
                <button
                  key={star.id}
                  onClick={() => {
                    setMobileStarIndex(i);
                    setSelectedStar(star);
                  }}
                  className="w-2 h-2 rounded-full transition-all"
                  style={{
                    backgroundColor: mobileStarIndex === i
                      ? COLOR_MAP[star.color] || COLOR_MAP.celebration
                      : "rgba(255,255,255,0.3)",
                    boxShadow: mobileStarIndex === i
                      ? `0 0 8px ${COLOR_MAP[star.color] || COLOR_MAP.celebration}`
                      : "none",
                  }}
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                const next = mobileStarIndex !== null ? (mobileStarIndex + 1) % stars.length : 0;
                setMobileStarIndex(next);
                setSelectedStar(stars[next]);
              }}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-cream">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </motion.button>
          </div>
        )}

        {/* Star popup */}
        <AnimatePresence>
          {selectedStar && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedStar(null)}
            >
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.85, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative bg-gradient-to-br from-[#1a1a3e] to-[#0a0a1a] border border-white/15 rounded-xl p-6 sm:p-8 max-w-sm w-full shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className="w-10 h-10 rounded-full mx-auto mb-4"
                  style={{
                    backgroundColor: COLOR_MAP[selectedStar.color] || COLOR_MAP.celebration,
                    boxShadow: `0 0 20px ${COLOR_MAP[selectedStar.color] || COLOR_MAP.celebration}`,
                  }}
                />
                <p className="font-display text-sunset-gold text-center text-sm mb-1">
                  {selectedStar.name}
                </p>
                <p className="font-serif text-cream/40 text-xs text-center italic mb-4">
                  {formatDate(selectedStar.createdAt)}
                </p>
                <p className="font-serif text-cream/80 text-sm leading-relaxed text-center mb-4">
                  {selectedStar.message}
                </p>
                <p className="font-serif text-center text-xs"
                  style={{ color: COLOR_MAP[selectedStar.color] || COLOR_MAP.celebration }}
                >
                  {COLOR_LABELS[selectedStar.color] || "Wish"}
                </p>
                <button
                  onClick={() => setSelectedStar(null)}
                  className="absolute top-3 right-4 text-cream/30 hover:text-cream/60 transition-colors text-lg"
                >
                  ×
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Wish form */}
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-serif text-cream/60 text-sm mb-1 block">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name..."
                autoComplete="name"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-serif text-cream placeholder:text-cream/30 focus:outline-none focus:border-sunset-gold/50 transition-colors text-base"
              />
            </div>
            <div>
              <label className="font-serif text-cream/60 text-sm mb-1 block">
                Your Wish
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your birthday wish..."
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-serif text-cream placeholder:text-cream/30 focus:outline-none focus:border-sunset-gold/50 transition-colors resize-none text-base"
              />
            </div>
            <div>
              <label className="font-serif text-cream/60 text-sm mb-2 block">
                Choose a star color
              </label>
              <div className="flex gap-3 flex-wrap">
                {Object.entries(COLOR_MAP).map(([key, hex]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setColor(key)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 border transition-all text-sm font-serif"
                    style={{
                      borderColor: color === key ? hex : "rgba(255,255,255,0.1)",
                      backgroundColor: color === key ? `${hex}20` : "rgba(255,255,255,0.03)",
                      color: color === key ? hex : "rgba(255,248,240,0.5)",
                    }}
                  >
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{
                        backgroundColor: hex,
                        boxShadow: color === key ? `0 0 8px ${hex}` : "none",
                      }}
                    />
                    {COLOR_LABELS[key]}
                  </button>
                ))}
              </div>
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full bg-gradient-to-r from-sunset-gold/80 to-sakura-pink/80 text-twilight-deep font-display text-sm tracking-widest uppercase py-3 rounded-lg hover:from-sunset-gold hover:to-sakura-pink transition-all disabled:opacity-50"
            >
              {loading ? "Sending..." : "Add Your Star"}
            </motion.button>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <p className="font-serif text-vine-green text-lg mb-2">
              Your star has joined the constellation.
            </p>
            <p className="font-serif text-cream/50 text-sm">
              Thank you for adding your light to Vestia.
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
