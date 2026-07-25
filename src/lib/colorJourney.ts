"use client";

import { useEffect, useRef, useState } from "react";

export interface ColorPhase {
  name: string;
  bg: string;
  text: string;
  accent: string;
  glow: string;
  scrollMin: number;
  scrollMax: number;
}

export const COLOR_PHASES: ColorPhase[] = [
  {
    name: "cosmic-night",
    bg: "#0a0a1a",
    text: "#f5f0e8",
    accent: "#6b4c9a",
    glow: "rgba(107,76,154,0.3)",
    scrollMin: 0,
    scrollMax: 0.12,
  },
  {
    name: "dawn",
    bg: "#1a1520",
    text: "#f5f0e8",
    accent: "#d4a574",
    glow: "rgba(212,165,116,0.3)",
    scrollMin: 0.12,
    scrollMax: 0.25,
  },
  {
    name: "creation",
    bg: "#2a2015",
    text: "#f5f0e8",
    accent: "#c9a96e",
    glow: "rgba(201,169,110,0.3)",
    scrollMin: 0.25,
    scrollMax: 0.4,
  },
  {
    name: "life",
    bg: "#1a1a2e",
    text: "#f5f0e8",
    accent: "#c9a96e",
    glow: "rgba(201,169,110,0.3)",
    scrollMin: 0.4,
    scrollMax: 0.55,
  },
  {
    name: "heart",
    bg: "#0a0a1a",
    text: "#f5f0e8",
    accent: "#8b6ab0",
    glow: "rgba(139,106,176,0.35)",
    scrollMin: 0.55,
    scrollMax: 0.7,
  },
  {
    name: "celebration",
    bg: "#1a0a15",
    text: "#f5f0e8",
    accent: "#d4a0b9",
    glow: "rgba(212,160,185,0.3)",
    scrollMin: 0.7,
    scrollMax: 0.85,
  },
  {
    name: "stars",
    bg: "#0a0a1a",
    text: "#f5f0e8",
    accent: "#d4a574",
    glow: "rgba(212,165,116,0.25)",
    scrollMin: 0.85,
    scrollMax: 1.0,
  },
];

function lerpColor(a: string, b: string, t: number): string {
  const parse = (hex: string) => {
    const h = hex.replace("#", "");
    return [
      parseInt(h.substring(0, 2), 16),
      parseInt(h.substring(2, 4), 16),
      parseInt(h.substring(4, 6), 16),
    ];
  };
  const [r1, g1, b1] = parse(a);
  const [r2, g2, b2] = parse(b);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const bl = Math.round(b1 + (b2 - b1) * t);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${bl.toString(16).padStart(2, "0")}`;
}

function lerpGlow(a: string, b: string, t: number): string {
  const parseRgba = (s: string) => {
    const m = s.match(/[\d.]+/g);
    return m ? m.map(Number) : [0, 0, 0, 0];
  };
  const [r1, g1, b1, a1] = parseRgba(a);
  const [r2, g2, b2, a2] = parseRgba(b);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const bl = Math.round(b1 + (b2 - b1) * t);
  const al = +(a1 + (a2 - a1) * t).toFixed(3);
  return `rgba(${r},${g},${bl},${al})`;
}

function interpolatePhases(
  progress: number
): Omit<ColorPhase, "scrollMin" | "scrollMax"> {
  const clamped = Math.max(0, Math.min(1, progress));

  let from = COLOR_PHASES[0];
  let to = COLOR_PHASES[COLOR_PHASES.length - 1];

  for (let i = 0; i < COLOR_PHASES.length - 1; i++) {
    if (clamped >= COLOR_PHASES[i].scrollMin && clamped <= COLOR_PHASES[i + 1].scrollMin) {
      from = COLOR_PHASES[i];
      to = COLOR_PHASES[i + 1];
      break;
    }
  }

  const range = to.scrollMin - from.scrollMin;
  const t = range === 0 ? 0 : (clamped - from.scrollMin) / range;

  return {
    name: t < 0.5 ? from.name : to.name,
    bg: lerpColor(from.bg, to.bg, t),
    text: lerpColor(from.text, to.text, t),
    accent: lerpColor(from.accent, to.accent, t),
    glow: lerpGlow(from.glow, to.glow, t),
  };
}

export function useColorJourney() {
  const [currentPhase, setCurrentPhase] = useState<string>("cosmic-night");
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;

      const phase = interpolatePhases(progress);
      const root = document.documentElement;

      root.style.setProperty("--vj-bg", phase.bg);
      root.style.setProperty("--vj-text", phase.text);
      root.style.setProperty("--vj-accent", phase.accent);
      root.style.setProperty("--vj-glow", phase.glow);

      setCurrentPhase(phase.name);
    };

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return currentPhase;
}
