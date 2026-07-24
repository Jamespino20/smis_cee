import HeroSection from "@/components/HeroSection";
import NarrativeSection from "@/components/NarrativeSection";
import HeartSection from "@/components/HeartSection";
import GiftSection from "@/components/GiftSection";
import CherryBlossoms from "@/components/CherryBlossoms";
import FloatingIslands from "@/components/FloatingIslands";

export default function Home() {
  return (
    <>
      <CherryBlossoms />
      <FloatingIslands />
      <main className="relative z-10">
        <HeroSection />
        <NarrativeSection />
        <HeartSection />
        <GiftSection />
      </main>
    </>
  );
}
