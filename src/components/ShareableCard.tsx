"use client";

import { motion } from "motion/react";
import { useRef, useCallback } from "react";

export default function ShareableCard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateCard = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = 1200;
    const h = 630;
    canvas.width = w;
    canvas.height = h;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, "#1A0F26");
    grad.addColorStop(0.5, "#2D1B3D");
    grad.addColorStop(1, "#1A1A2E");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Radial glow
    const radial = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, 300);
    radial.addColorStop(0, "rgba(212, 165, 116, 0.1)");
    radial.addColorStop(1, "transparent");
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, w, h);

    // Decorative circles
    ctx.strokeStyle = "rgba(126, 206, 126, 0.15)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 150 + i * 60, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Title
    ctx.fillStyle = "#D4A574";
    ctx.font = "bold 48px Georgia, serif";
    ctx.textAlign = "center";
    ctx.fillText("Happy Birthday", w / 2, 180);

    // Name
    ctx.fillStyle = "#E8A0BF";
    ctx.font = "bold 72px Georgia, serif";
    ctx.fillText("Smiscee", w / 2, 280);

    // Divider
    const divGrad = ctx.createLinearGradient(w / 2 - 80, 0, w / 2 + 80, 0);
    divGrad.addColorStop(0, "transparent");
    divGrad.addColorStop(0.5, "#D4A574");
    divGrad.addColorStop(1, "transparent");
    ctx.strokeStyle = divGrad;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w / 2 - 80, 310);
    ctx.lineTo(w / 2 + 80, 310);
    ctx.stroke();

    // Subtitle
    ctx.fillStyle = "rgba(255, 248, 240, 0.7)";
    ctx.font = "italic 24px Georgia, serif";
    ctx.fillText("From the realm of Vestia, with love", w / 2, 360);

    // Footer
    ctx.fillStyle = "rgba(255, 248, 240, 0.4)";
    ctx.font = "16px Georgia, serif";
    ctx.fillText("smisceebday.vercel.app", w / 2, h - 40);

    // Download
    const link = document.createElement("a");
    link.download = "smiscee-birthday-card.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, []);

  const shareOnTwitter = useCallback(() => {
    const text = encodeURIComponent(
      "Happy Birthday @Smiscee! A magical message from the realm of Vestia awaits you. 🌸✨"
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  }, []);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Canvas (hidden, used for generation) */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Preview card */}
      <div className="w-full max-w-lg bg-gradient-to-br from-twilight via-twilight-deep to-lake-shadow rounded-xl p-5 sm:p-8 border border-white/10 shadow-2xl">
        <div className="text-center">
          <p className="font-serif text-sunset-gold text-xs sm:text-sm tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-2">
            A message from
          </p>
          <h4 className="font-display text-3xl sm:text-4xl text-sunset-gold mb-2">Vestia</h4>
          <div className="w-12 sm:w-16 h-px bg-gradient-to-r from-transparent via-sakura-pink to-transparent mx-auto mb-3 sm:mb-4" />
          <p className="font-display text-xl sm:text-2xl text-sakura-pink mb-3 sm:mb-4">Smiscee</p>
          <p className="font-serif text-cream/60 text-xs sm:text-sm italic">
            Cherry blossoms fall for the creator of worlds
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center w-full sm:w-auto">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={generateCard}
          className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg px-5 sm:px-6 py-3 font-serif text-cream text-sm transition-colors w-full sm:w-auto"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
          Download Card
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={shareOnTwitter}
          className="flex items-center justify-center gap-2 bg-[#1DA1F2]/20 hover:bg-[#1DA1F2]/30 border border-[#1DA1F2]/30 rounded-lg px-5 sm:px-6 py-3 font-serif text-cream text-sm transition-colors w-full sm:w-auto"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          Share on X
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            const url = "https://smisceebday.vercel.app";
            navigator.clipboard.writeText(url);
          }}
          className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg px-5 sm:px-6 py-3 font-serif text-cream text-sm transition-colors w-full sm:w-auto"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          Copy Link
        </motion.button>
      </div>
    </div>
  );
}
