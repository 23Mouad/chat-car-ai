import { Hero } from "@/components/landing/Hero";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { AlgorixFooter } from "@/components/landing/AlgorixFooter";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#F5F6FC] overflow-x-hidden">
      <Hero />
      <FeatureGrid />
      <AlgorixFooter />
    </main>
  );
}
