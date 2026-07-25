"use client";

import { motion, AnimatePresence } from "motion/react";
import { useRef, useCallback, useState } from "react";

const ARTIFACT_NUMBER = "VES-852G-CR47";

function drawSeal(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
) {
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
  const pts = Array.from(
    { length: 12 },
    () => [rand() * w, rand() * h] as [number, number],
  );
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
  const [copied, setCopied] = useState(false);
  const [copiedPlatform, setCopiedPlatform] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const generateCard = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    // Explicitly load fonts for canvas rendering
    await Promise.all([
      document.fonts.load("500 20px 'Cormorant Garamond'"),
      document.fonts.load("bold 72px 'Cormorant Garamond'"),
      document.fonts.load("16px 'Cormorant Garamond'"),
      document.fonts.load("italic 17px 'Cormorant Garamond'"),
      document.fonts.load("12px 'Cormorant Garamond'"),
      document.fonts.load("13px 'Cormorant Garamond'"),
      document.fonts.load("bold 72px Georgia"),
    ]);
    await document.fonts.ready;

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
    ctx.roundRect(
      inset + 8,
      inset + 8,
      w - (inset + 8) * 2,
      h - (inset + 8) * 2,
      r - 2,
    );
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
        imgX + imgSize / 2,
        imgY + imgSize / 2,
        0,
        imgX + imgSize / 2,
        imgY + imgSize / 2,
        imgSize * 0.6,
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
      const serif = "'Cormorant Garamond', Georgia, serif";

      // "Happy Birthday" header
      ctx.save();
      ctx.fillStyle = "#3d2b1f";
      ctx.globalAlpha = 0.5;
      ctx.font = `500 20px ${serif}`;
      ctx.textAlign = "left";
      ctx.fillText("HAPPY BIRTHDAY", textX, 140);
      ctx.restore();

      // "Smiscee" in display font
      ctx.fillStyle = "#3d2b1f";
      ctx.font = `bold 72px ${serif}`;
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
      ctx.font = `16px ${serif}`;
      ctx.textAlign = "left";
      ctx.fillText("July 26, 2026", textX, 285);
      ctx.restore();

      // Personalized message
      ctx.save();
      ctx.fillStyle = "#3d2b1f";
      ctx.globalAlpha = 0.7;
      ctx.font = `italic 17px ${serif}`;
      ctx.textAlign = "left";
      const msg = "From the realm of Vestia, with love \u2014";
      ctx.fillText(msg, textX, 340);
      const msg2 = "a keepsake for the creator of worlds.";
      ctx.fillText(msg2, textX, 365);
      ctx.restore();

      // "A Vestian Artifact" label
      ctx.save();
      ctx.fillStyle = "#c9a96e";
      ctx.globalAlpha = 0.6;
      ctx.font = `12px ${serif}`;
      ctx.textAlign = "left";
      ctx.fillText("A VESTIAN ARTIFACT", textX, 420);
      ctx.restore();

      // Artifact number
      ctx.save();
      ctx.fillStyle = "#3d2b1f";
      ctx.globalAlpha = 0.4;
      ctx.font = "13px monospace";
      ctx.textAlign = "left";
      ctx.fillText(ARTIFACT_NUMBER, textX, 445);
      ctx.restore();

      // Draw the Vestian seal
      drawSeal(ctx, textX + 280, 430, 30);

      // Footer
      ctx.save();
      ctx.fillStyle = "#3d2b1f";
      ctx.globalAlpha = 0.3;
      ctx.font = `13px ${serif}`;
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
  }, []);

  const shareOnTwitter = useCallback(() => {
    const text = encodeURIComponent(
      "Happy Birthday @Smiscee! A magical keepsake from the realm of Vestia. smisceebday.vercel.app",
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  }, []);

  const shareOnTumblr = useCallback(() => {
    const url = encodeURIComponent("https://smisceebday.vercel.app");
    const name = encodeURIComponent("Happy Birthday Smiscee!");
    const desc = encodeURIComponent(
      "A magical keepsake from the realm of Vestia — cherry blossoms fall for the creator of worlds.",
    );
    window.open(
      `https://www.tumblr.com/share/link?url=${url}&name=${name}&description=${desc}`,
      "_blank",
    );
  }, []);

  const copyForPlatform = useCallback(
    async (platform: string) => {
      const text =
        "Happy Birthday Smiscee! A magical keepsake from the realm of Vestia: https://smisceebday.vercel.app";
      await navigator.clipboard.writeText(text);
      setCopiedPlatform(platform);
      setToast(`Link copied! Paste it in your ${platform} post.`);
      setTimeout(() => {
        setCopiedPlatform(null);
        setToast(null);
      }, 3000);
    },
    [],
  );

  const copyLink = useCallback(() => {
    navigator.clipboard.writeText("https://smisceebday.vercel.app");
    setCopied(true);
    setToast("Link copied to clipboard!");
    setTimeout(() => {
      setCopied(false);
      setToast(null);
    }, 3000);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6">
      <canvas ref={canvasRef} className="hidden" />

      {/* Preview card — artifact style */}
      <div
        className="w-full max-w-lg rounded-xl p-6 sm:p-8 border shadow-2xl relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #faf8f0 0%, #f5f0e6 50%, #faf8f0 100%)",
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
              background:
                "linear-gradient(90deg, transparent, #c9a96e, transparent)",
            }}
          />
          <p className="font-serif text-xs mb-3" style={{ color: "#c9a96e" }}>
            July 26, 2026
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
            {ARTIFACT_NUMBER}
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
            backgroundColor: "rgba(201,169,110,0.85)",
            border: "1px solid rgba(201,169,110,0.5)",
            color: "#1a1a2e",
            textShadow: "0 1px 2px rgba(255,255,255,0.2)",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
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
            backgroundColor: "rgba(29,161,242,0.85)",
            border: "1px solid rgba(29,161,242,0.5)",
            color: "#ffffff",
            textShadow: "0 1px 2px rgba(0,0,0,0.2)",
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
            backgroundColor: "rgba(201,169,110,0.75)",
            border: "1px solid rgba(201,169,110,0.4)",
            color: "#1a1a2e",
            textShadow: "0 1px 2px rgba(255,255,255,0.15)",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          {copied ? "Copied!" : "Copy Link"}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={shareOnTumblr}
          className="flex items-center justify-center gap-2 rounded-lg px-5 sm:px-6 py-3 font-serif text-sm transition-colors w-full sm:w-auto"
          style={{
            backgroundColor: "rgba(53,70,92,0.85)",
            border: "1px solid rgba(53,70,92,0.5)",
            color: "#ffffff",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14.563 24c-5.093 0-7.031-3.756-7.031-6.411V9.747H5.116V6.648c3.63-1.313 4.512-4.596 4.71-6.469C9.84.051 9.941 0 10.096 0h3.617v6.234h4.938v3.513h-4.952v7.45c.012 1.016.397 2.424 2.306 2.424h.121c.651-.023 1.517-.209 1.969-.431l1.162 3.314c-.467.673-2.529 1.512-4.422 1.512z" />
          </svg>
          Share on Tumblr
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => copyForPlatform("instagram")}
          className="flex items-center justify-center gap-2 rounded-lg px-5 sm:px-6 py-3 font-serif text-sm transition-colors w-full sm:w-auto"
          style={{
            backgroundColor: "rgba(193,53,132,0.85)",
            border: "1px solid rgba(193,53,132,0.5)",
            color: "#ffffff",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
          </svg>
          {copiedPlatform === "instagram" ? "Copied!" : "Share on Instagram"}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => copyForPlatform("discord")}
          className="flex items-center justify-center gap-2 rounded-lg px-5 sm:px-6 py-3 font-serif text-sm transition-colors w-full sm:w-auto"
          style={{
            backgroundColor: "rgba(88,101,242,0.85)",
            border: "1px solid rgba(88,101,242,0.5)",
            color: "#ffffff",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
          </svg>
          {copiedPlatform === "discord" ? "Copied!" : "Share on Discord"}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => copyForPlatform("youtube")}
          className="flex items-center justify-center gap-2 rounded-lg px-5 sm:px-6 py-3 font-serif text-sm transition-colors w-full sm:w-auto"
          style={{
            backgroundColor: "rgba(255,0,0,0.8)",
            border: "1px solid rgba(255,0,0,0.5)",
            color: "#ffffff",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
          {copiedPlatform === "youtube" ? "Copied!" : "Share on YouTube"}
        </motion.button>
      </div>

      {/* Toast notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-[#1a1a3e] to-[#0a0a1a] border border-sunset-gold/30 rounded-lg px-5 py-3 shadow-2xl"
          >
            <p className="font-serif text-cream text-sm">{toast}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
