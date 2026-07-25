"use client";

import { motion } from "motion/react";
import { useRef, useCallback, useState } from "react";

function generateArtifactNumber(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "VES-";
  for (let i = 0; i < 4; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  result += "-";
  for (let i = 0; i < 4; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

function drawSeal(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) {
  const gold = "#c9a96e";
  const roseGold = "#d4a574";

  ctx.save();
  ctx.strokeStyle = gold;
  ctx.lineWidth = 1.5;
  ctx.globalAlpha = 0.7;

  // Outer octagon
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const angle = (Math.PI * 2 * i) / 8 - Math.PI / 8;
    const x = cx + Math.cos(angle) * size;
    const y = cy + Math.sin(angle) * size;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();

  // Inner octagon
  ctx.strokeStyle = roseGold;
  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const angle = (Math.PI * 2 * i) / 8;
    const x = cx + Math.cos(angle) * (size * 0.65);
    const y = cy + Math.sin(angle) * (size * 0.65);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();

  // Cross lines connecting vertices
  ctx.globalAlpha = 0.3;
  ctx.strokeStyle = gold;
  for (let i = 0; i < 8; i++) {
    const angle1 = (Math.PI * 2 * i) / 8 - Math.PI / 8;
    const angle2 = (Math.PI * 2 * ((i + 3) % 8)) / 8 - Math.PI / 8;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle1) * size, cy + Math.sin(angle1) * size);
    ctx.lineTo(cx + Math.cos(angle2) * size, cy + Math.sin(angle2) * size);
    ctx.stroke();
  }

  // Center dot
  ctx.globalAlpha = 0.8;
  ctx.fillStyle = gold;
  ctx.beginPath();
  ctx.arc(cx, cy, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawStarfield(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.save();
  const rand = seededRandom(777);
  for (let i = 0; i < 80; i++) {
    const x = rand() * w;
    const y = rand() * h;
    const r = 0.5 + rand() * 1.2;
    const alpha = 0.15 + rand() * 0.35;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // A few constellation lines
  ctx.globalAlpha = 0.08;
  ctx.strokeStyle = "#c9a96e";
  ctx.lineWidth = 0.5;
  const pts = Array.from({ length: 12 }, () => [rand() * w, rand() * h] as [number, number]);
  for (let i = 0; i < pts.length - 1; i += 2) {
    ctx.beginPath();
    ctx.moveTo(pts[i][0], pts[i][1]);
    ctx.lineTo(pts[i + 1][0], pts[i + 1][1]);
    ctx.stroke();
  }
  ctx.restore();
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export default function ShareableCard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [artifactNum] = useState(generateArtifactNumber);
  const [copied, setCopied] = useState(false);

  const generateCard = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const w = 1200;
    const h = 630;
    canvas.width = w;
    canvas.height = h;

    // Ivory paper background
    const bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, "#faf8f0");
    bg.addColorStop(0.5, "#f5f0e6");
    bg.addColorStop(1, "#faf8f0");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Paper texture — subtle noise
    ctx.save();
    ctx.globalAlpha = 0.03;
    const texRand = seededRandom(123);
    for (let i = 0; i < 3000; i++) {
      const x = texRand() * w;
      const y = texRand() * h;
      ctx.fillStyle = texRand() > 0.5 ? "#c9a96e" : "#3d2b1f";
      ctx.fillRect(x, y, 1, 1);
    }
    ctx.restore();

    // Star field background (subtle)
    drawStarfield(ctx, w, h);

    // Old gold border frame
    ctx.save();
    ctx.strokeStyle = "#c9a96e";
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.5;
    const inset = 30;
    const r = 8;
    ctx.beginPath();
    ctx.roundRect(inset, inset, w - inset * 2, h - inset * 2, r);
    ctx.stroke();

    // Inner thin line
    ctx.globalAlpha = 0.25;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.roundRect(inset + 8, inset + 8, w - (inset + 8) * 2, h - (inset + 8) * 2, r - 2);
    ctx.stroke();
    ctx.restore();

    // Corner ornaments
    const cornerSize = 16;
    ctx.save();
    ctx.strokeStyle = "#c9a96e";
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.6;
    const corners = [
      [inset + 5, inset + 5],
      [w - inset - 5, inset + 5],
      [inset + 5, h - inset - 5],
      [w - inset - 5, h - inset - 5],
    ];
    corners.forEach(([cx, cy], i) => {
      const dx = i % 2 === 0 ? 1 : -1;
      const dy = i < 2 ? 1 : -1;
      ctx.beginPath();
      ctx.moveTo(cx, cy + dy * cornerSize);
      ctx.lineTo(cx, cy);
      ctx.lineTo(cx + dx * cornerSize, cy);
      ctx.stroke();
    });
    ctx.restore();

    // Load noot.png
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      // Draw character on the left side
      const imgSize = 260;
      const imgX = 80;
      const imgY = (h - imgSize) / 2;

      // Character glow
      ctx.save();
      ctx.globalAlpha = 0.1;
      const glow = ctx.createRadialGradient(
        imgX + imgSize / 2, imgY + imgSize / 2, 0,
        imgX + imgSize / 2, imgY + imgSize / 2, imgSize * 0.6
      );
      glow.addColorStop(0, "#7cb97c");
      glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();

      ctx.drawImage(img, imgX, imgY, imgSize, imgSize);

      // Decorative line under character
      ctx.save();
      ctx.strokeStyle = "#c9a96e";
      ctx.lineWidth = 0.5;
      ctx.globalAlpha = 0.4;
      ctx.beginPath();
      ctx.moveTo(imgX + 20, imgY + imgSize + 10);
      ctx.lineTo(imgX + imgSize - 20, imgY + imgSize + 10);
      ctx.stroke();
      ctx.restore();

      drawTextContent();
    };
    img.onerror = () => {
      drawTextContent();
    };
    img.src = "/noot.png";

    function drawTextContent() {
      const textX = 420;

      // "Happy Birthday" header
      ctx.save();
      ctx.fillStyle = "#3d2b1f";
      ctx.globalAlpha = 0.5;
      ctx.font = "500 20px Georgia, serif";
      ctx.textAlign = "left";
      ctx.fillText("HAPPY BIRTHDAY", textX, 140);
      ctx.restore();

      // "Smiscee" in display font
      ctx.fillStyle = "#3d2b1f";
      ctx.font = "bold 72px Georgia, serif";
      ctx.textAlign = "left";
      ctx.fillText("Smiscee", textX, 230);

      // Gold accent line
      const lineGrad = ctx.createLinearGradient(textX, 0, textX + 180, 0);
      lineGrad.addColorStop(0, "#c9a96e");
      lineGrad.addColorStop(1, "transparent");
      ctx.strokeStyle = lineGrad;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(textX, 250);
      ctx.lineTo(textX + 180, 250);
      ctx.stroke();

      // Date
      ctx.save();
      ctx.fillStyle = "#c9a96e";
      ctx.font = "16px Georgia, serif";
      ctx.textAlign = "left";
      ctx.fillText("July 25, 2026", textX, 285);
      ctx.restore();

      // Personalized message
      ctx.save();
      ctx.fillStyle = "#3d2b1f";
      ctx.globalAlpha = 0.7;
      ctx.font = "italic 17px Georgia, serif";
      ctx.textAlign = "left";
      const msg = "From the realm of Vestia, with love —";
      ctx.fillText(msg, textX, 340);
      const msg2 = "a keepsake for the creator of worlds.";
      ctx.fillText(msg2, textX, 365);
      ctx.restore();

      // "A Vestian Artifact" label
      ctx.save();
      ctx.fillStyle = "#c9a96e";
      ctx.globalAlpha = 0.6;
      ctx.font = "12px Georgia, serif";
      ctx.textAlign = "left";
      ctx.fillText("A VESTIAN ARTIFACT", textX, 420);
      ctx.restore();

      // Artifact number
      ctx.save();
      ctx.fillStyle = "#3d2b1f";
      ctx.globalAlpha = 0.4;
      ctx.font = "13px monospace";
      ctx.textAlign = "left";
      ctx.fillText(artifactNum, textX, 445);
      ctx.restore();

      // Draw the Vestian seal
      drawSeal(ctx, textX + 280, 430, 30);

      // Footer
      ctx.save();
      ctx.fillStyle = "#3d2b1f";
      ctx.globalAlpha = 0.3;
      ctx.font = "13px Georgia, serif";
      ctx.textAlign = "center";
      ctx.fillText("smisceebday.vercel.app", w / 2, h - 45);
      ctx.restore();

      // Rose-gold decorative dots
      ctx.save();
      ctx.fillStyle = "#d4a0b9";
      ctx.globalAlpha = 0.3;
      const dotRand = seededRandom(999);
      for (let i = 0; i < 15; i++) {
        const dx = textX + dotRand() * (w - textX - 80);
        const dy = 300 + dotRand() * 200;
        ctx.beginPath();
        ctx.arc(dx, dy, 1 + dotRand() * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // Download
    const link = document.createElement("a");
    link.download = "smiscee-vestian-artifact.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, [artifactNum]);

  const shareOnTwitter = useCallback(() => {
    const text = encodeURIComponent(
      "Happy Birthday @Smiscee! A magical keepsake from the realm of Vestia. smisceebday.vercel.app"
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  }, []);

  const copyLink = useCallback(() => {
    navigator.clipboard.writeText("https://smisceebday.vercel.app");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6">
      <canvas ref={canvasRef} className="hidden" />

      {/* Preview card — artifact style */}
      <div
        className="w-full max-w-lg rounded-xl p-6 sm:p-8 border shadow-2xl relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #faf8f0 0%, #f5f0e6 50%, #faf8f0 100%)",
          borderColor: "#c9a96e40",
        }}
      >
        {/* Subtle corner ornaments */}
        <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#c9a96e]/50 rounded-tl-sm" />
        <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#c9a96e]/50 rounded-tr-sm" />
        <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#c9a96e]/50 rounded-bl-sm" />
        <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#c9a96e]/50 rounded-br-sm" />

        <div className="text-center">
          <p className="font-serif text-[#3d2b1f]/50 text-xs tracking-[0.3em] uppercase mb-2">
            A Vestian Artifact
          </p>
          <h4
            className="font-display text-3xl sm:text-4xl mb-2"
            style={{ color: "#3d2b1f" }}
          >
            Smiscee
          </h4>
          <div
            className="w-16 h-px mx-auto mb-3"
            style={{
              background: "linear-gradient(90deg, transparent, #c9a96e, transparent)",
            }}
          />
          <p className="font-serif text-xs mb-3" style={{ color: "#c9a96e" }}>
            July 25, 2026
          </p>
          <p
            className="font-serif text-xs italic"
            style={{ color: "#3d2b1f80" }}
          >
            Cherry blossoms fall for the creator of worlds
          </p>
          <p
            className="font-mono text-[10px] mt-3 tracking-wider"
            style={{ color: "#3d2b1f40" }}
          >
            {artifactNum}
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center w-full sm:w-auto">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={generateCard}
          className="flex items-center justify-center gap-2 rounded-lg px-5 sm:px-6 py-3 font-serif text-sm transition-colors w-full sm:w-auto"
          style={{
            backgroundColor: "#c9a96e20",
            border: "1px solid #c9a96e40",
            color: "#3d2b1f",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
          Download Artifact
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={shareOnTwitter}
          className="flex items-center justify-center gap-2 rounded-lg px-5 sm:px-6 py-3 font-serif text-sm transition-colors w-full sm:w-auto"
          style={{
            backgroundColor: "#1DA1F220",
            border: "1px solid #1DA1F240",
            color: "#3d2b1f",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          Share on X
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={copyLink}
          className="flex items-center justify-center gap-2 rounded-lg px-5 sm:px-6 py-3 font-serif text-sm transition-colors w-full sm:w-auto"
          style={{
            backgroundColor: "#c9a96e15",
            border: "1px solid #c9a96e30",
            color: "#3d2b1f",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          {copied ? "Copied!" : "Copy Link"}
        </motion.button>
      </div>
    </div>
  );
}
