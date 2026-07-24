"use client";

import { motion } from "motion/react";
import ShareableCard from "./ShareableCard";
import Guestbook from "./Guestbook";

export default function GiftSection() {
  return (
    <section className="relative py-20 sm:py-32 px-5 sm:px-6">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-lake-deep via-twilight-deep to-lake-deep" />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Chapter label */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-16"
        >
          <p className="font-serif text-sakura-pink text-xs sm:text-sm tracking-[0.3em] sm:tracking-[0.4em] uppercase mb-3 sm:mb-4">
            Chapter III
          </p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-cream mb-3 sm:mb-4">
            The Gift
          </h2>
          <div className="w-16 sm:w-20 h-px bg-gradient-to-r from-transparent via-sunset-gold to-transparent mx-auto mb-4 sm:mb-6" />
          <p className="font-serif text-cream/60 text-base sm:text-lg max-w-md mx-auto">
            A keepsake to carry with you, and a place for those who love you to leave their light.
          </p>
        </motion.div>

        {/* Shareable card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 sm:mb-24"
        >
          <ShareableCard />
        </motion.div>

        {/* Divider */}
        <div className="w-px h-16 sm:h-20 bg-gradient-to-b from-transparent via-sunset-gold/30 to-transparent mx-auto mb-16 sm:mb-24" />

        {/* Guestbook */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Guestbook />
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-center mt-20 sm:mt-32"
        >
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-sakura-pink to-transparent mx-auto mb-6" />
          <p className="font-serif text-cream/40 text-sm italic mb-2">
            Made with love, code, and a little bit of Vestian magic.
          </p>
          <p className="font-serif text-cream/30 text-xs">
            smisceebday.vercel.app
          </p>
        </motion.div>
      </div>
    </section>
  );
}
