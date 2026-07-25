"use client";

import { useState, useCallback } from "react";
import HeroSection from "@/components/HeroSection";
import JourneyChapters from "@/components/JourneyChapters";
import HeartSection from "@/components/HeartSection";
import GiftSection from "@/components/GiftSection";
import CherryBlossoms from "@/components/CherryBlossoms";
import FloatingIslands from "@/components/FloatingIslands";
import HiddenStar from "@/components/HiddenStar";
import SecretEnding from "@/components/SecretEnding";
import EndingSequence from "@/components/EndingSequence";
import { useColorJourney } from "@/lib/colorJourney";

export default function Home() {
  useColorJourney();
  const [foundStars, setFoundStars] = useState<Set<string>>(new Set());
  const [secretActive, setSecretActive] = useState(false);

  const handleStarFound = useCallback((id: string) => {
    setFoundStars((prev) => {
      const next = new Set(prev);
      next.add(id);
      if (next.size >= 3) {
        setTimeout(() => setSecretActive(true), 600);
      }
      return next;
    });
  }, []);

  const handleSecretComplete = useCallback(() => {
    setSecretActive(false);
  }, []);

  const handleReturnToMap = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <CherryBlossoms />
      <FloatingIslands />

      {/* Hidden stars */}
      <HiddenStar
        id="hero-star"
        onFound={handleStarFound}
        className="top-[35%] right-[15%] z-20"
      />
      <HiddenStar
        id="chapter-star"
        onFound={handleStarFound}
        className="top-[52%] left-[8%] z-20"
      />
      <HiddenStar
        id="heart-star"
        onFound={handleStarFound}
        className="top-[72%] right-[20%] z-20"
      />

      {/* Star counter */}
      {foundStars.size > 0 && !secretActive && (
        <div className="fixed bottom-4 right-4 z-[60] font-serif text-xs tracking-widest" style={{ color: "rgba(212,165,116,0.5)" }}>
          ★ {foundStars.size}/3
        </div>
      )}

      <main className="relative z-10">
        <HeroSection />
        <JourneyChapters />
        <HeartSection />
        <GiftSection />
        <EndingSequence onReturnToMap={handleReturnToMap} />
      </main>

      <SecretEnding active={secretActive} onComplete={handleSecretComplete} />
    </>
  );
}
