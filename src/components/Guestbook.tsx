"use client";

import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";

export default function Guestbook() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [entries, setEntries] = useState([
    {
      name: "The Rosen Family",
      message: "Thank you for giving us life. Vestia is forever because of you.",
      date: "The First Dawn",
    },
    {
      name: "Oswen",
      message: "Happy Birthday, Creator. You made us more than characters — you made us family.",
      date: "The Golden Hour",
    },
    {
      name: "A Friend from Earth",
      message: "Your worlds are magic, but you are the real magic. Happy Birthday!",
      date: "Starfall Night",
    },
  ]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setEntries((prev) => [
      ...prev,
      {
        name: name.trim(),
        message: message.trim(),
        date: "Today",
      },
    ]);
    setName("");
    setMessage("");
    setSubmitted(true);
  };

  return (
    <div ref={ref} className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <h3 className="font-display text-2xl sm:text-3xl text-cream mb-6 sm:mb-8 text-center">
          Leave a Wish
        </h3>

        {/* Existing entries */}
        <div className="space-y-4 mb-12">
          {entries.map((entry, i) => (
            <motion.div
              key={`${entry.name}-${i}`}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white/5 backdrop-blur-sm rounded-lg p-5 border border-white/10"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-display text-sunset-gold text-sm">
                  {entry.name}
                </span>
                <span className="font-serif text-cream/40 text-xs italic">
                  {entry.date}
                </span>
              </div>
              <p className="font-serif text-cream/80 text-sm leading-relaxed">
                {entry.message}
              </p>
            </motion.div>
          ))}
        </div>

        {/* New entry form */}
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
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3.5 sm:py-3 font-serif text-cream placeholder:text-cream/30 focus:outline-none focus:border-sunset-gold/50 transition-colors text-base"
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
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3.5 sm:py-3 font-serif text-cream placeholder:text-cream/30 focus:outline-none focus:border-sunset-gold/50 transition-colors resize-none text-base"
              />
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-sunset-gold/80 to-sakura-pink/80 text-twilight-deep font-display text-sm tracking-widest uppercase py-3.5 sm:py-3 rounded-lg hover:from-sunset-gold hover:to-sakura-pink transition-all"
            >
              Send Your Wish
            </motion.button>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <p className="font-serif text-vine-green text-lg mb-2">
              Your wish has been received.
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
