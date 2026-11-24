import Hero from "@/components/home/Hero";
import Manifesto from "@/components/home/Manifesto";
import CollectionsSection from "@/components/home/CollectionsSection";
import TrendingSection from "@/components/home/TrendingSection";
import StyleMatchPromo from "@/components/home/StyleMatchPromo";
import SustainabilitySection from "@/components/home/SustainabilitySection";
import SignalSection from "@/components/home/SignalSection";

export default function Home() {
  return (
    <>
      <Hero />
      <Manifesto />
      <CollectionsSection />
      <TrendingSection />
      <StyleMatchPromo />
      <SustainabilitySection />
      <SignalSection />
    </>
  );
}
