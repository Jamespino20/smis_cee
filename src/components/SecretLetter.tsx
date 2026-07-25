"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function SecretLetter() {
  const [phase, setPhase] = useState<"verify" | "unlocked" | "opened">("verify");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);

  const handleVerify = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim().toLowerCase() === "jamesy") {
      setPhase("unlocked");
      setError(false);
    } else {
      setError(true);
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  }, [answer]);

  const handleOpen = useCallback(() => {
    setPhase("opened");
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12" style={{ background: "radial-gradient(ellipse at center, #1a1a3e 0%, #0a0a1a 100%)" }}>
      {/* Stars background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-px h-px rounded-full"
            style={{
              background: "#f5f0e8",
              left: `${(i * 137) % 100}%`,
              top: `${(i * 97) % 100}%`,
              opacity: 0.1 + ((i * 7) % 5) * 0.1,
              animation: `twinkle ${2 + (i % 3)}s ease-in-out ${(i * 0.3)}s infinite alternate`,
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {phase === "verify" && (
          <motion.div
            key="verify"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 w-full max-w-md"
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-sunset-gold/20 p-8 sm:p-10">
              <motion.p
                className="font-display text-sunset-gold text-lg sm:text-xl text-center mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                A Sealed Memory
              </motion.p>
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-sunset-gold to-transparent mx-auto mb-6" />
              <p className="font-serif text-cream/70 text-sm sm:text-base text-center mb-8 leading-relaxed">
                This letter is sealed with Vestian magic. Only its intended recipient may open it.
              </p>
              <form onSubmit={handleVerify} className="space-y-4">
                <div>
                  <label className="font-serif text-cream/50 text-xs tracking-wider uppercase block mb-2 text-center">
                    If you are really Smiscee, what nickname do you call me?
                  </label>
                  <input
                    type="text"
                    value={answer}
                    onChange={(e) => { setAnswer(e.target.value); setError(false); }}
                    placeholder="Type your answer..."
                    className={`w-full bg-white/5 border rounded-lg px-4 py-3 font-serif text-cream placeholder:text-cream/30 focus:outline-none transition-colors text-base text-center ${
                      error ? "border-red-400/60" : "border-white/10 focus:border-sunset-gold/50"
                    }`}
                    autoFocus
                  />
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="font-serif text-red-400/70 text-xs text-center mt-2"
                    >
                      That&apos;s not quite right. Try again, Smiscee.
                    </motion.p>
                  )}
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  animate={shaking ? { x: [0, -8, 8, -6, 6, -3, 3, 0] } : {}}
                  transition={shaking ? { duration: 0.4 } : {}}
                  className="w-full bg-gradient-to-r from-vine-green/80 to-sunset-gold/80 text-twilight-deep font-display text-sm tracking-widest uppercase py-3 rounded-lg hover:from-vine-green hover:to-sunset-gold transition-all"
                >
                  Unlock Letter
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}

        {phase === "unlocked" && (
          <motion.div
            key="envelope"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 cursor-pointer"
            onClick={handleOpen}
          >
            {/* Envelope */}
            <div className="relative w-64 h-44 sm:w-80 sm:h-56">
              {/* Envelope body */}
              <div className="absolute inset-0 rounded-b-lg" style={{
                background: "linear-gradient(135deg, #f5f0e8 0%, #ede4d4 50%, #e0d5c0 100%)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              }} />
              {/* Envelope flap (closed) */}
              <motion.div
                className="absolute top-0 left-0 right-0 origin-top"
                style={{ height: "55%" }}
                animate={{ rotateX: 0 }}
              >
                <div className="w-full h-full" style={{
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                  background: "linear-gradient(180deg, #ede4d4 0%, #e0d5c0 100%)",
                  transform: "translateY(-1px)",
                }} />
              </motion.div>
              {/* Seal */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/3 z-10">
                <svg width="48" height="48" viewBox="0 0 48 48">
                  <circle cx="24" cy="24" r="22" fill="#8b3a3a" />
                  <circle cx="24" cy="24" r="20" fill="#a04545" />
                  <path d="M24 8 L28 18 L38 18 L30 24 L33 34 L24 28 L15 34 L18 24 L10 18 L20 18 Z" fill="#c9a96e" opacity="0.8" />
                  <circle cx="24" cy="24" r="4" fill="#d4a574" />
                </svg>
              </div>
              {/* Address label */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
                <p className="font-serif text-xs tracking-wider" style={{ color: "#3d2b1f" }}>For: Smiscee</p>
                <p className="font-serif text-[10px] tracking-widest mt-1" style={{ color: "#3d2b1f60" }}>VESTIA · STARRY NIGHT</p>
              </div>
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-center mt-6 font-serif text-sm tracking-widest text-sunset-gold/50"
            >
              TAP TO OPEN
            </motion.p>
          </motion.div>
        )}

        {phase === "opened" && (
          <motion.div
            key="letter"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 w-full max-w-lg"
          >
            <motion.div
              initial={{ opacity: 0, y: 40, rotateX: -10 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              className="bg-white rounded-2xl p-8 sm:p-10 shadow-2xl"
              style={{
                background: "linear-gradient(180deg, #faf8f0 0%, #f5f0e8 100%)",
                transformStyle: "preserve-3d",
                transformOrigin: "top center",
              }}
            >
              {/* Decorative header */}
              <div className="text-center mb-6">
                <div className="w-12 h-px bg-gradient-to-r from-transparent via-sunset-gold/60 to-transparent mx-auto mb-4" />
                <p className="font-display text-lg sm:text-xl tracking-wide" style={{ color: "#3d2b1f" }}>
                  My Dearest Smiscee,
                </p>
                <div className="w-12 h-px bg-gradient-to-r from-transparent via-sunset-gold/60 to-transparent mx-auto mt-4" />
              </div>

              {/* Letter body — placeholder for user to compose */}
              <div className="font-serif text-sm sm:text-base leading-relaxed space-y-4" style={{ color: "#3d2b1f" }}>
                <p className="first-letter:text-3xl first-letter:font-display first-letter:text-sunset-gold first-letter:mr-1 first-letter:float-left">
                  [Your letter content goes here. You&apos;ll compose this, James.]
                </p>
                <p>
                  [Write from the heart — this is your personal message to Smiscee, 
                  hidden behind the artifact code on the keepsake card.]
                </p>
                <p>
                  [You can use multiple paragraphs, add &lt;em&gt;emphasis&lt;/em&gt;, or 
                  anything you&apos;d like. This is your space.]
                </p>
              </div>

              {/* Signature area */}
              <div className="mt-8 pt-6 border-t border-sunset-gold/20 text-center">
                <p className="font-serif italic text-sm" style={{ color: "#3d2b1f80" }}>
                  Forever yours,
                </p>
                <p className="font-display text-lg mt-1" style={{ color: "#3d2b1f" }}>
                  James
                </p>
                <div className="flex items-center justify-center gap-2 mt-4">
                  <div className="w-8 h-px bg-sunset-gold/30" />
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.5">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                  <div className="w-8 h-px bg-sunset-gold/30" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes twinkle {
          0% { opacity: 0.1; }
          100% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}