import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Hero } from "@/components/landing/Hero";

// Below-fold components: dynamically imported so they don't block the initial render.
// Hero is static-imported (above fold, needs to be in the critical path).
const SocialProof = dynamic(
  () => import("@/components/landing/SocialProof").then((m) => m.SocialProof),
  { ssr: false } // uses EventSource + browser APIs — client only
);
const FeatureGrid = dynamic(
  () => import("@/components/landing/FeatureGrid").then((m) => m.FeatureGrid)
);
const AlgorixFooter = dynamic(
  () => import("@/components/landing/AlgorixFooter").then((m) => m.AlgorixFooter)
);

export const metadata: Metadata = {
  title: "Talk Cars — Free AI Car Chat | مساعد السيارات الذكي | Assistant Auto IA | Araba AI",
  description:
    "Talk Cars is a free AI car expert. Ask anything about cars — compare models, get buying advice, EV reviews, maintenance tips — in English, French, Arabic or Turkish. | مساعد ذكاء اصطناعي مجاني للسيارات. | Votre expert automobile IA gratuit. | Ücretsiz yapay zeka araba uzmanı.",
  alternates: {
    canonical: "https://talkcars.ai",
    languages: {
      "en": "https://talkcars.ai",
      "fr": "https://talkcars.ai/fr",
      "ar": "https://talkcars.ai/ar",
      "tr": "https://talkcars.ai/tr",
    },
  },
};

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#F5F6FC] overflow-x-hidden">
      {/* Hero: above-fold — loaded in the critical JS bundle */}
      <Hero />
      {/* Below-fold sections: lazy-loaded, split into separate JS chunks */}
      <SocialProof />
      <FeatureGrid />
      <AlgorixFooter />
    </main>
  );
}
