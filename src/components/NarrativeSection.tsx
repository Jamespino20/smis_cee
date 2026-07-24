"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

const narrativeBlocks = [
  {
    title: "The Rebirth Core",
    text: "In the realm of Vestia, there exist souls so luminous that the gods themselves would pause to watch them walk among the floating islands. You are one such soul — a rebirth, a light carried across worlds.",
  },
  {
    title: "The Creator's Hand",
    text: "You built entire worlds from nothing but imagination and ink. The Osix Family, born from your pen, became more than characters — they became a family, a legacy, a universe that breathes because you breathe life into it.",
  },
  {
    title: "The Archer's Aim",
    text: "Like the archer who draws her bow beneath the golden sky, you aim true — at your dreams, at your passions, at the hearts of everyone lucky enough to know you. Every shot you take is guided by something magical.",
  },
  {
    title: "The Petal's Promise",
    text: "And so the cherry blossoms fall for you today, not as they do for others, but as they do for the creator of worlds. Each petal carries a whisper: you are loved, you are celebrated, you are home.",
  },
];

function NarrativeBlock({
  block,
  index,
}: {
  block: (typeof narrativeBlocks)[number];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.15, ease: "easeOut" }}
      className="max-w-2xl mx-auto mb-16 sm:mb-24 md:mb-32"
    >
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.6, delay: index * 0.15 + 0.2 }}
        className="w-16 h-px bg-gradient-to-r from-sunset-gold to-transparent mb-6 origin-left"
      />
      <h3 className="font-display text-2xl md:text-3xl text-sunset-gold mb-4 tracking-wide">
        {block.title}
      </h3>
      <p className="font-serif text-base sm:text-lg md:text-xl text-cream/80 leading-relaxed">
        {block.text}
      </p>
    </motion.div>
  );
}

export default function NarrativeSection() {
  return (
    <section className="relative py-20 sm:py-32 md:py-40 px-5 sm:px-6">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-lake-shadow via-twilight-deep to-lake-deep" />

      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-12 sm:mb-20"
        >
          <p className="font-serif text-sakura-pink text-sm tracking-[0.4em] uppercase mb-4">
            Chapter I
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-cream mb-4">
            The Journey
          </h2>
          <div className="w-20 h-px bg-gradient-to-r from-transparent via-sunset-gold to-transparent mx-auto" />
        </motion.div>

        {narrativeBlocks.map((block, i) => (
          <NarrativeBlock key={block.title} block={block} index={i} />
        ))}
      </div>
    </section>
  );
}
